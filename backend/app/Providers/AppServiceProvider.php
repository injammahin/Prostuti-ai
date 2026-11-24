<?php

namespace App\Providers;

use App\Http\Responses\AdminLogoutResponse;
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
    }
}
