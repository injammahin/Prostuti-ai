<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthRateLimitTest extends TestCase
{
    use RefreshDatabase;

    public function test_wrong_passwords_on_one_account_do_not_block_other_people_on_the_same_network(): void
    {
        $user = User::factory()->create(['email' => 'rahim@example.com', 'password' => 'secret123']);

        for ($i = 0; $i < 6; $i++) {
            $this->postJson(route('api.v1.auth.login'), ['email' => 'someone@example.com', 'password' => 'wrong-pass'])->assertUnprocessable();
        }

        $this->postJson(route('api.v1.auth.login'), ['email' => 'someone@example.com', 'password' => 'wrong-pass'])->assertTooManyRequests();
        $this->postJson(route('api.v1.auth.login'), ['email' => $user->email, 'password' => 'secret123'])->assertOk();
    }

    public function test_visitors_behind_the_hosts_proxy_are_limited_by_their_own_ip(): void
    {
        $user = User::factory()->create(['password' => 'secret123']);

        for ($i = 0; $i < 6; $i++) {
            $this->postJson(route('api.v1.auth.login'), ['email' => $user->email, 'password' => 'wrong-pass'], ['X-Forwarded-For' => '203.0.113.5']);
        }

        $this->postJson(route('api.v1.auth.login'), ['email' => $user->email, 'password' => 'secret123'], ['X-Forwarded-For' => '203.0.113.5'])->assertTooManyRequests();
        $this->postJson(route('api.v1.auth.login'), ['email' => $user->email, 'password' => 'secret123'], ['X-Forwarded-For' => '198.51.100.7'])->assertOk();
    }

    public function test_the_admin_seeder_uses_env_settings_and_never_resets_an_existing_password(): void
    {
        config(['app.admin.email' => 'Owner@Example.com', 'app.admin.password' => 'first-password', 'app.admin.name' => 'Owner']);

        $this->seed(AdminUserSeeder::class);

        $admin = User::query()->where('email', 'owner@example.com')->firstOrFail();
        $this->assertTrue($admin->is_admin);
        $this->assertTrue(Hash::check('first-password', $admin->password));

        $admin->update(['password' => 'changed-later']);
        config(['app.admin.password' => 'first-password']);
        $this->seed(AdminUserSeeder::class);

        $this->assertTrue(Hash::check('changed-later', $admin->fresh()->password));
    }
}
