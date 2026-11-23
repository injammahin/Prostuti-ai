<?php

namespace Tests\Feature;

use App\Filament\Widgets\AttemptsByExamChart;
use App\Filament\Widgets\AttemptsBySubjectChart;
use App\Filament\Widgets\LatestActivity;
use App\Filament\Widgets\NewestStudents;
use App\Filament\Widgets\PlatformStats;
use App\Filament\Widgets\QuestionBankHealth;
use App\Filament\Widgets\SystemStatus;
use App\Filament\Widgets\TopPages;
use App\Filament\Widgets\TrafficChart;
use App\Filament\Widgets\WelcomeBanner;
use App\Models\Notice;
use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AdminWidgetsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, array{class-string}>
     */
    public static function widgets(): array
    {
        return collect([
            WelcomeBanner::class, PlatformStats::class, TrafficChart::class, AttemptsBySubjectChart::class,
            AttemptsByExamChart::class, QuestionBankHealth::class, SystemStatus::class, LatestActivity::class,
            NewestStudents::class, TopPages::class,
        ])->mapWithKeys(fn (string $class): array => [class_basename($class) => [$class]])->all();
    }

    #[DataProvider('widgets')]
    public function test_dashboard_widget_renders(string $widget): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        User::factory()->create(['name' => 'Rahim Uddin']);
        Question::factory()->count(3)->create();
        Notice::factory()->create(['apply_until' => now()->addWeek()->toDateString(), 'exam_date' => now()->addMonth()->toDateString()]);

        Livewire::test($widget)->assertOk();
    }

    public function test_welcome_banner_shows_quick_actions(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true, 'name' => 'Mahin Rahman']));

        Livewire::test(WelcomeBanner::class)
            ->assertSee('Mahin')
            ->assertSee('Add a question')
            ->assertSee('Post a notice');
    }

    public function test_admin_login_page_sends_people_to_the_website_login(): void
    {
        $this->get('/admin/login')->assertRedirect(rtrim(config('app.frontend_url'), '/').'/login?next=admin');
    }
}
