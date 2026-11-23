<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\PageView;
use App\Models\PracticeSession;
use App\Models\Question;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_every_admin_page_loads_with_data(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $student = User::factory()->create();
        Question::factory()->count(5)->create();
        $session = PracticeSession::start($student, 'drill', null, null, 5);
        $session->recordAnswer(Question::query()->find($session->question_ids[0]), 0, 1200);
        PageView::query()->create(['visitor_id' => 'visitor-1', 'path' => '/daily', 'device' => 'mobile']);
        ActivityLog::query()->create(['action' => 'auth.registered', 'description' => 'Someone signed up']);

        foreach (['/admin', '/admin/activity-logs', '/admin/practice-sessions', '/admin/page-views', '/admin/site-settings', '/admin/users', '/admin/questions'] as $url) {
            $this->actingAs($admin)->get($url)->assertOk();
        }
    }

    public function test_page_views_are_recorded(): void
    {
        $this->postJson(route('api.v1.track'), ['visitor_id' => 'abc-123', 'path' => '/daily', 'referrer' => 'https://www.facebook.com/groups/x'], ['User-Agent' => 'Mozilla/5.0 (Linux; Android 14) Mobile Chrome/120.0'])
            ->assertNoContent();

        $view = PageView::query()->sole();
        $this->assertSame('/daily', $view->path);
        $this->assertSame('mobile', $view->device);
        $this->assertSame('www.facebook.com', $view->referrer);
    }

    public function test_actions_are_logged(): void
    {
        $user = User::factory()->create(['password' => 'secret123']);

        $this->postJson(route('api.v1.auth.login'), ['email' => $user->email, 'password' => 'secret123'], ['X-Visitor-Id' => 'visitor-9'])->assertOk();
        $this->postJson(route('api.v1.daily-quiz.complete'), ['score' => 7, 'total' => 10])->assertOk();

        $this->assertDatabaseHas('activity_logs', ['action' => 'auth.login', 'user_id' => $user->id, 'visitor_id' => 'visitor-9']);
        $this->assertDatabaseHas('activity_logs', ['action' => 'daily_quiz.completed', 'user_id' => null]);
    }

    public function test_admin_can_jump_from_the_website_into_the_panel_once(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $url = $this->actingAs($admin, 'sanctum')->postJson(route('api.v1.admin.sso-link'))->assertOk()->json('url');

        $this->app['auth']->forgetGuards();
        $this->get($url)->assertRedirect('/admin');
        $this->assertAuthenticatedAs($admin, 'web');

        $this->app['auth']->forgetGuards();
        $this->get($url)->assertForbidden();
    }

    public function test_students_cannot_get_an_admin_link(): void
    {
        $this->actingAs(User::factory()->create(), 'sanctum')->postJson(route('api.v1.admin.sso-link'))->assertForbidden();
    }

    public function test_settings_are_public_and_drive_the_daily_goal(): void
    {
        Setting::put(['announcement_enabled' => true, 'announcement_text' => '47th BCS date announced', 'daily_goal' => 30]);

        $this->getJson(route('api.v1.settings'))
            ->assertOk()
            ->assertJsonPath('announcement.text', '47th BCS date announced')
            ->assertJsonPath('daily_goal', 30);

        $this->actingAs(User::factory()->create())->getJson(route('api.v1.me.stats'))->assertJsonPath('today.goal', 30);
    }
}
