<?php

namespace Tests\Feature;

use App\Filament\Pages\Auth\Login;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Livewire\Livewire;
use Tests\TestCase;

class AdminPanelAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_the_panel(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->get('/admin')->assertOk();
        $this->actingAs($admin)->get('/admin/users')->assertOk();
    }

    public function test_students_cannot_open_the_panel(): void
    {
        $student = User::factory()->create(['is_admin' => false]);

        $this->actingAs($student)->get('/admin')->assertForbidden();
    }

    public function test_guests_are_sent_to_the_admin_login(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->get('/admin/login')->assertOk();
    }

    public function test_an_admin_flag_on_any_other_email_gives_no_access(): void
    {
        $other = User::factory()->create();
        $other->forceFill(['is_admin' => true])->save();

        $this->assertFalse($other->fresh()->is_admin);
        $this->actingAs($other)->get('/admin')->assertForbidden();
    }

    public function test_the_admin_flag_cannot_be_set_through_the_panel_form_or_mass_assignment(): void
    {
        $user = User::query()->create(['name' => 'Someone', 'email' => 'someone@example.com', 'is_admin' => true]);

        $this->assertFalse((bool) $user->fresh()->getRawOriginal('is_admin'));
    }

    public function test_panel_login_accepts_only_the_env_email_and_password(): void
    {
        $student = User::factory()->create(['password' => 'student-pass']);

        Livewire::test(Login::class)
            ->fillForm(['email' => $student->email, 'password' => 'student-pass'])
            ->call('authenticate')
            ->assertHasFormErrors(['email']);
        $this->assertGuest('web');

        Livewire::test(Login::class)
            ->fillForm(['email' => 'admin@bd3schools.test', 'password' => 'wrong-password'])
            ->call('authenticate')
            ->assertHasFormErrors(['email']);
        $this->assertGuest('web');

        Livewire::test(Login::class)
            ->fillForm(['email' => 'admin@bd3schools.test', 'password' => 'admin-test-password'])
            ->call('authenticate')
            ->assertHasNoFormErrors();

        $this->assertAuthenticated('web');
        $this->assertTrue(auth('web')->user()->is_admin);
    }

    public function test_admin_can_log_in_as_a_student(): void
    {
        $admin = User::factory()->admin()->create();
        $student = User::factory()->create();
        $url = URL::temporarySignedRoute('admin.login-as', now()->addHour(), ['user' => $student]);

        $redirect = $this->actingAs($admin)->get($url)->assertRedirect()->headers->get('Location');

        $this->assertStringContainsString('/impersonate#token=', $redirect);
        $token = urldecode(substr($redirect, strpos($redirect, '#token=') + 7));
        $this->app['auth']->forgetGuards();
        $this->getJson(route('api.v1.me'), ['Authorization' => "Bearer {$token}"])->assertOk()->assertJsonPath('data.email', $student->email);
        $this->assertDatabaseHas('activity_logs', ['action' => 'admin.impersonated', 'user_id' => $student->id]);
    }

    public function test_only_the_admin_can_use_log_in_as(): void
    {
        $student = User::factory()->create();
        $target = User::factory()->create();
        $url = URL::temporarySignedRoute('admin.login-as', now()->addHour(), ['user' => $target]);

        $this->get($url)->assertForbidden();
        $this->actingAs($student)->get($url)->assertForbidden();
        $this->actingAs(User::factory()->admin()->create())->get(route('admin.login-as', $target))->assertForbidden();
    }
}
