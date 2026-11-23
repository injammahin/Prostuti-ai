<?php

namespace Tests\Feature;

use App\Mail\LoginCodeMail;
use App\Mail\WelcomeMail;
use App\Models\LoginCode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class EmailCodeAuthTest extends TestCase
{
    use RefreshDatabase;

    private function requestCode(string $email, string $purpose): string
    {
        $sentCode = null;
        Mail::fake();

        $this->postJson(route('api.v1.auth.send-code'), ['email' => $email, 'purpose' => $purpose])->assertOk();

        Mail::assertSent(LoginCodeMail::class, function (LoginCodeMail $mail) use (&$sentCode, $purpose): bool {
            $sentCode = $mail->code;

            return $mail->purpose === $purpose;
        });

        return $sentCode;
    }

    /**
     * @return array<string, string>
     */
    private function registration(string $code, array $overrides = []): array
    {
        return array_merge([
            'email' => 'rahim@example.com',
            'code' => $code,
            'name' => 'Rahim Uddin',
            'password' => 'secret123',
        ], $overrides);
    }

    public function test_new_user_registers_with_a_verified_email_and_password(): void
    {
        $code = $this->requestCode('Rahim@Example.com ', LoginCode::PURPOSE_REGISTER);

        $this->postJson(route('api.v1.auth.register'), $this->registration($code))
            ->assertOk()
            ->assertJsonPath('is_new_user', true)
            ->assertJsonPath('user.email', 'rahim@example.com')
            ->assertJsonPath('user.name', 'Rahim Uddin')
            ->assertJsonPath('user.main_exam', 'bcs-general')
            ->assertJsonPath('user.is_admin', false)
            ->assertJsonStructure(['token']);

        $this->assertNotNull(User::query()->where('email', 'rahim@example.com')->value('email_verified_at'));
        Mail::assertSent(WelcomeMail::class);
    }

    public function test_registration_code_is_refused_for_an_existing_email(): void
    {
        Mail::fake();
        User::factory()->create(['email' => 'karim@example.com']);

        $this->postJson(route('api.v1.auth.send-code'), ['email' => 'karim@example.com', 'purpose' => LoginCode::PURPOSE_REGISTER])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');

        Mail::assertNothingSent();
    }

    public function test_wrong_registration_code_is_rejected(): void
    {
        $code = $this->requestCode('rahim@example.com', LoginCode::PURPOSE_REGISTER);
        $wrongCode = $code === '000000' ? '111111' : '000000';

        $this->postJson(route('api.v1.auth.register'), $this->registration($wrongCode))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('code');

        $this->assertDatabaseMissing('users', ['email' => 'rahim@example.com']);
    }

    public function test_expired_code_is_rejected(): void
    {
        $code = $this->requestCode('rahim@example.com', LoginCode::PURPOSE_REGISTER);
        $this->travel(LoginCode::LIFETIME_MINUTES + 1)->minutes();

        $this->postJson(route('api.v1.auth.register'), $this->registration($code))->assertUnprocessable();
    }

    public function test_code_locks_after_too_many_wrong_attempts(): void
    {
        $code = $this->requestCode('rahim@example.com', LoginCode::PURPOSE_REGISTER);
        $wrongCode = $code === '000000' ? '111111' : '000000';

        foreach (range(1, LoginCode::MAX_ATTEMPTS) as $attempt) {
            $this->postJson(route('api.v1.auth.register'), $this->registration($wrongCode));
        }

        $this->postJson(route('api.v1.auth.register'), $this->registration($code))->assertUnprocessable();
    }

    public function test_password_must_be_at_least_six_characters(): void
    {
        $code = $this->requestCode('rahim@example.com', LoginCode::PURPOSE_REGISTER);

        $this->postJson(route('api.v1.auth.register'), $this->registration($code, ['password' => '123']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('password');
    }

    public function test_user_signs_in_with_email_and_password_without_any_code(): void
    {
        Mail::fake();
        User::factory()->create(['email' => 'karim@example.com', 'password' => 'secret123']);

        $this->postJson(route('api.v1.auth.login'), ['email' => 'Karim@example.com', 'password' => 'secret123'])
            ->assertOk()
            ->assertJsonPath('is_new_user', false)
            ->assertJsonStructure(['token']);

        Mail::assertNothingSent();
    }

    public function test_wrong_password_is_rejected(): void
    {
        User::factory()->create(['email' => 'karim@example.com', 'password' => 'secret123']);

        $this->postJson(route('api.v1.auth.login'), ['email' => 'karim@example.com', 'password' => 'wrong-pass'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('password');
    }

    public function test_google_only_account_is_told_how_to_sign_in(): void
    {
        User::factory()->create(['email' => 'nadia@gmail.com', 'password' => null, 'google_id' => 'g-1']);

        $this->postJson(route('api.v1.auth.login'), ['email' => 'nadia@gmail.com', 'password' => 'anything'])
            ->assertUnprocessable()
            ->assertJsonPath('errors.password.0', fn (string $message): bool => str_contains($message, 'Google'));
    }

    public function test_forgotten_password_is_reset_with_an_emailed_code(): void
    {
        $user = User::factory()->create(['email' => 'karim@example.com', 'password' => 'old-pass']);
        $user->createToken('old-device');
        $code = $this->requestCode('karim@example.com', LoginCode::PURPOSE_RESET);

        $this->postJson(route('api.v1.auth.reset-password'), ['email' => 'karim@example.com', 'code' => $code, 'password' => 'new-pass'])
            ->assertOk()
            ->assertJsonStructure(['token']);

        $this->assertSame(1, $user->tokens()->count(), 'Old sessions are signed out; only the new one remains.');
        $this->postJson(route('api.v1.auth.login'), ['email' => 'karim@example.com', 'password' => 'new-pass'])->assertOk();
    }

    public function test_reset_code_is_refused_for_an_unknown_email(): void
    {
        Mail::fake();

        $this->postJson(route('api.v1.auth.send-code'), ['email' => 'nobody@example.com', 'purpose' => LoginCode::PURPOSE_RESET])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_a_registration_code_cannot_reset_a_password(): void
    {
        User::factory()->create(['email' => 'karim@example.com']);
        [, $registrationCode] = LoginCode::issueFor('karim@example.com', LoginCode::PURPOSE_REGISTER);

        $this->postJson(route('api.v1.auth.reset-password'), ['email' => 'karim@example.com', 'code' => $registrationCode, 'password' => 'new-pass'])
            ->assertUnprocessable();
    }

    public function test_signed_in_user_can_read_update_and_log_out(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('web')->plainTextToken;
        $headers = ['Authorization' => "Bearer {$token}"];

        $this->getJson(route('api.v1.me'), $headers)->assertOk()->assertJsonPath('data.email', $user->email);

        $this->patchJson(route('api.v1.me.update'), ['phone' => '01712345678', 'main_exam' => 'ntrca'], $headers)
            ->assertOk()
            ->assertJsonPath('data.phone', '01712345678')
            ->assertJsonPath('data.main_exam', 'ntrca');

        $this->postJson(route('api.v1.auth.logout'), [], $headers)->assertOk();
        $this->assertSame(0, $user->tokens()->count());
    }

    public function test_profile_update_cannot_make_someone_an_admin(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->patchJson(route('api.v1.me.update'), ['is_admin' => true])->assertOk();

        $this->assertFalse($user->fresh()->is_admin);
    }
}
