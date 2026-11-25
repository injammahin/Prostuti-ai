<?php

namespace App\Providers;

use App\Http\Responses\AdminLogoutResponse;
use App\Models\Exam;
use App\Models\ModelTest;
use App\Models\Notice;
use App\Models\Post;
use App\Models\Question;
use App\Models\Subject;
use App\Services\PageShell;
use App\Services\PastPapers;
use Filament\Auth\Http\Responses\Contracts\LogoutResponse;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(LogoutResponse::class, AdminLogoutResponse::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureAuthRateLimits();
        $this->refreshPublicPages();
    }

    /**
     * Public pages are cached as finished HTML: rebuild them when their content changes.
     */
    private function refreshPublicPages(): void
    {
        foreach ([Post::class, Notice::class, Exam::class, ModelTest::class, Question::class, Subject::class] as $model) {
            $model::saved(fn () => PageShell::refresh());
            $model::deleted(fn () => PageShell::refresh());
        }

        Question::saved(fn () => PastPapers::refresh());
        Question::deleted(fn () => PastPapers::refresh());
    }

    /**
     * Sign-in attempts are limited per email address (stops password guessing on one
     * account) and, more loosely, per IP — so people sharing a network don't block each other.
     */
    private function configureAuthRateLimits(): void
    {
        RateLimiter::for('auth', function (Request $request): array {
            $email = Str::lower(trim((string) $request->input('email')));

            return [
                Limit::perMinute(6)->by('auth-email:'.$email.'|'.$request->ip()),
                Limit::perMinute(40)->by('auth-ip:'.$request->ip()),
            ];
        });

        // Emailed codes: few per address, with room for many people on one mobile network.
        RateLimiter::for('send-code', function (Request $request): array {
            $email = Str::lower(trim((string) $request->input('email')));

            return [
                Limit::perMinute(4)->by('code-email:'.$email),
                Limit::perHour(12)->by('code-email-hour:'.$email),
                Limit::perMinute(30)->by('code-ip:'.$request->ip()),
            ];
        });
    }
}
