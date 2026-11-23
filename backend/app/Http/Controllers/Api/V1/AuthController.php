<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\GoogleLoginRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\SendLoginCodeRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Mail\LoginCodeMail;
use App\Mail\WelcomeMail;
use App\Models\ActivityLog;
use App\Models\LoginCode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private const WRONG_CODE = 'That code is wrong or has expired. Please check your email or ask for a new code.';

    /**
     * Email a 6-digit code to verify the address — for creating an account or resetting a password.
     */
    public function sendCode(SendLoginCodeRequest $request): JsonResponse
    {
        $email = $request->validated('email');
        $purpose = $request->validated('purpose');
        $user = User::query()->where('email', $email)->first();

        if ($purpose === LoginCode::PURPOSE_REGISTER && $user) {
            throw ValidationException::withMessages(['email' => 'You already have an account with this email. Please sign in instead.']);
        }

        if ($purpose === LoginCode::PURPOSE_RESET && ! $user) {
            throw ValidationException::withMessages(['email' => "We couldn't find an account with this email. Please create one."]);
        }

        [, $plainCode] = LoginCode::issueFor($email, $purpose);

        Mail::to($email)->send(new LoginCodeMail($plainCode, $purpose, $user?->name));

        return response()->json(['expires_in_minutes' => LoginCode::LIFETIME_MINUTES]);
    }

    /**
     * Create an account after the emailed code confirms the address.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $email = $request->validated('email');

        if (User::query()->where('email', $email)->exists()) {
            throw ValidationException::withMessages(['email' => 'You already have an account with this email. Please sign in instead.']);
        }

        if (! LoginCode::check($email, LoginCode::PURPOSE_REGISTER, $request->validated('code'))) {
            throw ValidationException::withMessages(['code' => self::WRONG_CODE]);
        }

        $user = User::query()->create([
            'name' => $request->validated('name'),
            'email' => $email,
            'password' => $request->validated('password'),
        ]);
        $user->forceFill(['email_verified_at' => now()])->save();

        Mail::to($user)->send(new WelcomeMail($user));
        ActivityLog::record('auth.registered', "{$user->name} created an account", $user, ['method' => 'email'], $request);

        return $this->signedIn($user, isNewUser: true);
    }

    /**
     * Sign in with email and password.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->validated('email'))->first();

        if ($user && $user->password === null) {
            throw ValidationException::withMessages([
                'password' => 'This account uses Google sign-in. Tap "Continue with Google", or use "Forgot password?" to set a password.',
            ]);
        }

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            throw ValidationException::withMessages(['password' => 'Wrong email or password. Please try again.']);
        }

        ActivityLog::record('auth.login', "{$user->name} logged in", $user, [], $request);

        return $this->signedIn($user, isNewUser: false);
    }

    /**
     * Set a new password after the emailed code confirms the address, then sign in.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $email = $request->validated('email');
        $user = User::query()->where('email', $email)->first();

        if (! $user || ! LoginCode::check($email, LoginCode::PURPOSE_RESET, $request->validated('code'))) {
            throw ValidationException::withMessages(['code' => self::WRONG_CODE]);
        }

        $user->update(['password' => $request->validated('password')]);
        $user->tokens()->delete();
        ActivityLog::record('auth.password_reset', "{$user->name} reset their password", $user, [], $request);

        return $this->signedIn($user, isNewUser: false);
    }

    /**
     * Sign in with a Google ID token from Google Identity Services.
     */
    public function google(GoogleLoginRequest $request): JsonResponse
    {
        $clientId = config('services.google.client_id');

        if (! $clientId) {
            abort(503, 'Google sign-in is not configured yet.');
        }

        $response = Http::timeout(10)->get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $request->validated('credential'),
        ]);

        $payload = $response->json();

        if (! $response->ok() || ($payload['aud'] ?? null) !== $clientId || ($payload['email_verified'] ?? 'false') !== 'true') {
            throw ValidationException::withMessages(['credential' => 'Google sign-in failed. Please try again.']);
        }

        $email = mb_strtolower($payload['email']);
        $user = User::query()->where('google_id', $payload['sub'])->orWhere('email', $email)->first();
        $isNewUser = $user === null;

        if ($isNewUser) {
            $user = User::query()->create([
                'name' => $payload['name'] ?? str($email)->before('@')->headline()->toString(),
                'email' => $email,
            ]);
            Mail::to($user)->send(new WelcomeMail($user));
        }

        $user->forceFill([
            'google_id' => $payload['sub'],
            'avatar_url' => $user->avatar_url ?? ($payload['picture'] ?? null),
            'email_verified_at' => $user->email_verified_at ?? now(),
        ])->save();

        ActivityLog::record(
            $isNewUser ? 'auth.registered' : 'auth.google',
            $isNewUser ? "{$user->name} created an account with Google" : "{$user->name} signed in with Google",
            $user,
            ['method' => 'google'],
            $request,
        );

        return $this->signedIn($user, $isNewUser);
    }

    /**
     * The signed-in user's profile.
     */
    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /**
     * Update name, optional phone or main exam.
     */
    public function updateProfile(UpdateProfileRequest $request): UserResource
    {
        $request->user()->update($request->validated());
        ActivityLog::record('profile.updated', "{$request->user()->name} updated their profile", $request->user(), array_keys($request->validated()), $request);

        return new UserResource($request->user()->fresh());
    }

    /**
     * Revoke the current API token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        ActivityLog::record('auth.logout', "{$request->user()->name} logged out", $request->user(), [], $request);

        return response()->json(['message' => 'Logged out.']);
    }

    /**
     * Issue an API token and return the user.
     */
    private function signedIn(User $user, bool $isNewUser): JsonResponse
    {
        $user->forceFill(['last_login_at' => now()])->save();
        $user->refresh();

        return response()->json([
            'token' => $user->createToken('web')->plainTextToken,
            'is_new_user' => $isNewUser,
            'user' => new UserResource($user),
        ]);
    }
}
