<?php

namespace App\Filament\Pages\Auth;

use App\Models\User;
use DanHarrin\LivewireRateLimiting\Exceptions\TooManyRequestsException;
use Filament\Auth\Http\Responses\Contracts\LoginResponse;
use Filament\Auth\Pages\Login as BaseLogin;
use Filament\Facades\Filament;

/**
 * The admin panel has its own login, and it only accepts ADMIN_EMAIL + ADMIN_PASSWORD from .env.
 * Website sessions (email code, Google) never open the panel.
 */
class Login extends BaseLogin
{
    public function authenticate(): ?LoginResponse
    {
        try {
            $this->rateLimit(5);
        } catch (TooManyRequestsException $exception) {
            $this->getRateLimitedNotification($exception)?->send();

            return null;
        }

        $data = $this->form->getState();
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $adminPassword = (string) config('app.admin.password');

        $credentialsMatch = User::isAdminEmail($email)
            && $adminPassword !== ''
            && hash_equals($adminPassword, (string) ($data['password'] ?? ''));

        if (! $credentialsMatch) {
            $this->throwFailureValidationException();
        }

        $user = User::query()->whereRaw('lower(email) = ?', [$email])->first()
            ?? User::query()->forceCreate([
                'name' => (string) config('app.admin.name'),
                'email' => $email,
                'password' => $adminPassword,
                'email_verified_at' => now(),
            ]);

        if (! $user->getRawOriginal('is_admin')) {
            $user->forceFill(['is_admin' => true])->save();
        }

        Filament::auth()->login($user, (bool) ($data['remember'] ?? false));
        session()->regenerate();

        return app(LoginResponse::class);
    }
}
