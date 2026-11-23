<?php

namespace Tests\Feature;

use App\Mail\WelcomeMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class GoogleAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.google.client_id' => 'test-client-id']);
        Mail::fake();
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function fakeGoogle(array $overrides = []): void
    {
        Http::fake([
            'oauth2.googleapis.com/*' => Http::response(array_merge([
                'aud' => 'test-client-id',
                'sub' => 'google-123',
                'email' => 'Nadia@Gmail.com',
                'email_verified' => 'true',
                'name' => 'Nadia Islam',
                'picture' => 'https://example.com/nadia.jpg',
            ], $overrides)),
        ]);
    }

    public function test_new_google_user_gets_an_account(): void
    {
        $this->fakeGoogle();

        $this->postJson(route('api.v1.auth.google'), ['credential' => 'id-token'])
            ->assertOk()
            ->assertJsonPath('is_new_user', true)
            ->assertJsonPath('user.email', 'nadia@gmail.com')
            ->assertJsonPath('user.has_google', true);

        Mail::assertSent(WelcomeMail::class);
    }

    public function test_google_links_to_an_existing_email_account(): void
    {
        $this->fakeGoogle();
        $user = User::factory()->create(['email' => 'nadia@gmail.com']);

        $this->postJson(route('api.v1.auth.google'), ['credential' => 'id-token'])
            ->assertOk()
            ->assertJsonPath('is_new_user', false);

        $this->assertSame('google-123', $user->fresh()->google_id);
        $this->assertSame(1, User::query()->count());
    }

    public function test_token_for_another_app_is_rejected(): void
    {
        $this->fakeGoogle(['aud' => 'someone-elses-app']);

        $this->postJson(route('api.v1.auth.google'), ['credential' => 'id-token'])->assertUnprocessable();
        $this->assertSame(0, User::query()->count());
    }

    public function test_google_is_unavailable_until_configured(): void
    {
        config(['services.google.client_id' => null]);

        $this->postJson(route('api.v1.auth.google'), ['credential' => 'id-token'])->assertServiceUnavailable();
    }
}
