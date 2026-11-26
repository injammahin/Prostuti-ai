<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\DailyQuizAttempt;
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
        $admin = User::factory()->admin()->create();
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

    public function test_guest_daily_quiz_attendance_is_recorded_with_the_platform(): void
    {
        $this->postJson(
            route('api.v1.daily-quiz.complete'),
            ['score' => 8, 'total' => 10, 'seconds' => 95, 'slot' => '2026-11-26-am', 'referrer' => 'https://m.facebook.com/'],
            ['X-Visitor-Id' => 'guest-visitor-1', 'User-Agent' => 'Mozilla/5.0 (Linux; Android 14) Mobile Chrome/120.0'],
        )->assertOk();

        $this->postJson(
            route('api.v1.daily-quiz.complete'),
            ['score' => 4, 'total' => 10, 'source' => 'wa'],
            ['X-Visitor-Id' => 'guest-visitor-2'],
        )->assertOk();

        $first = DailyQuizAttempt::query()->where('visitor_id', 'guest-visitor-1')->sole();
        $this->assertNull($first->user_id);
        $this->assertSame(8, $first->score);
        $this->assertSame('facebook', $first->source);
        $this->assertSame('mobile', $first->device);
        $this->assertSame('2026-11-26-am', $first->slot);

        $this->assertSame('whatsapp', DailyQuizAttempt::query()->where('visitor_id', 'guest-visitor-2')->value('source'));
    }

    public function test_quiz_platform_is_read_from_social_app_browsers(): void
    {
        $this->assertSame('facebook', DailyQuizAttempt::sourceFrom(null, null, 'Mozilla/5.0 [FBAN/FB4A;FBAV/450.0]'));
        $this->assertSame('messenger', DailyQuizAttempt::sourceFrom(null, null, 'Mozilla/5.0 [FB_IAB/MESSENGER;FBAV/450.0]'));
        $this->assertSame('telegram', DailyQuizAttempt::sourceFrom(null, 't.me', null));
        $this->assertSame('direct', DailyQuizAttempt::sourceFrom(null, null, 'Mozilla/5.0 Chrome/120.0'));
    }

    public function test_admin_sees_daily_quiz_attendance(): void
    {
        DailyQuizAttempt::query()->create(['visitor_id' => 'abcdef1234567890', 'slot' => DailyQuizAttempt::slotFor(), 'score' => 9, 'total' => 10, 'seconds' => 70, 'source' => 'facebook']);

        $this->actingAs(User::factory()->admin()->create())
            ->get('/admin/daily-quiz-attendance')
            ->assertOk()
            ->assertSee('Daily quiz attendance')
            ->assertSee('9/10')
            ->assertSee('Visitor abcdef12')
            ->assertSee('Facebook');
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
