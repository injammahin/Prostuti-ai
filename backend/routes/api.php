<?php

use App\Http\Controllers\AdminSsoController;
use App\Http\Controllers\Api\V1\AiTutorController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CatalogController;
use App\Http\Controllers\Api\V1\DailyQuizController;
use App\Http\Controllers\Api\V1\MistakeController;
use App\Http\Controllers\Api\V1\NoticeController;
use App\Http\Controllers\Api\V1\PastPaperController;
use App\Http\Controllers\Api\V1\PostController;
use App\Http\Controllers\Api\V1\PracticeSessionController;
use App\Http\Controllers\Api\V1\SiteSettingsController;
use App\Http\Controllers\Api\V1\StatsController;
use App\Http\Controllers\Api\V1\TrackingController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function () {
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('send-code', [AuthController::class, 'sendCode'])
            ->middleware('throttle:5,1')
            ->name('send-code');
        Route::post('register', [AuthController::class, 'register'])
            ->middleware('throttle:10,1')
            ->name('register');
        Route::post('login', [AuthController::class, 'login'])
            ->middleware('throttle:10,1')
            ->name('login');
        Route::post('reset-password', [AuthController::class, 'resetPassword'])
            ->middleware('throttle:10,1')
            ->name('reset-password');
        Route::post('google', [AuthController::class, 'google'])
            ->middleware('throttle:10,1')
            ->name('google');
    });

    // Public (guests welcome; signed-in students get their own data attached)
    Route::get('catalog', [CatalogController::class, 'index'])->name('catalog');
    Route::get('daily-quiz', [DailyQuizController::class, 'show'])->name('daily-quiz');
    Route::post('daily-quiz/complete', [TrackingController::class, 'dailyQuizCompleted'])->middleware('throttle:20,1')->name('daily-quiz.complete');
    Route::get('settings', [SiteSettingsController::class, 'show'])->name('settings');
    Route::get('notices', [NoticeController::class, 'index'])->name('notices');
    Route::get('posts', [PostController::class, 'index'])->name('posts');
    Route::get('posts/{slug}', [PostController::class, 'show'])->name('posts.show');
    Route::get('past-papers', [PastPaperController::class, 'index'])->name('past-papers');
    Route::get('past-papers/{number}', [PastPaperController::class, 'show'])->whereNumber('number')->name('past-papers.show');
    Route::post('ai/explain', [AiTutorController::class, 'ask'])->middleware('throttle:20,1')->name('ai.explain');
    Route::post('track', [TrackingController::class, 'pageView'])->middleware('throttle:120,1')->name('track');

    Route::prefix('practice/sessions')->name('practice.')->middleware('throttle:120,1')->group(function () {
        Route::post('/', [PracticeSessionController::class, 'store'])->name('store');
        Route::get('{session}', [PracticeSessionController::class, 'show'])->name('show');
        Route::post('{session}/answers', [PracticeSessionController::class, 'answer'])->name('answer');
        Route::post('{session}/finish', [PracticeSessionController::class, 'finish'])->name('finish');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me'])->name('me');
        Route::patch('me', [AuthController::class, 'updateProfile'])->name('me.update');
        Route::get('me/stats', [StatsController::class, 'show'])->name('me.stats');
        Route::get('me/mistakes', [MistakeController::class, 'index'])->name('me.mistakes');
        Route::post('auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::post('admin/sso-link', [AdminSsoController::class, 'link'])->middleware('throttle:10,1')->name('admin.sso-link');
    });
});
