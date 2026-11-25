<?php

use App\Http\Controllers\PublicPageController;
use Illuminate\Support\Facades\Route;

/*
 * The website's public pages. They have no session or cookies, so they are the same for every visitor and cheap to serve.
 */
Route::controller(PublicPageController::class)->name('public.')->group(function () {
    Route::get('/', 'home')->name('home');
    Route::get('blog', 'blog')->name('blog');
    Route::get('blog/{slug}', 'post')->name('post');
    Route::get('notices', 'noticeList')->name('notices');
    Route::get('notices/{slug}', 'notice')->name('notice');
    Route::get('calendar', 'calendar')->name('calendar');
    Route::get('exams', 'exams')->name('exams');
    Route::get('exams/{slug}', 'exam')->name('exam');
    Route::get('daily', 'daily')->name('daily');
    Route::get('about', 'legal')->name('about');
    Route::get('privacy', 'legal')->name('privacy');
    Route::get('terms', 'legal')->name('terms');

    Route::fallback('fallback');
});
