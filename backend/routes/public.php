<?php

use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\SitemapController;
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
    Route::get('bcs', 'examPage')->name('bcs');
    Route::get('bcs/{page}', 'examPage')->where('page', '.*')->name('bcs.page');
    Route::get('ntrca', 'examPage')->name('ntrca');
    Route::get('primary-teacher', 'examPage')->name('primary-teacher');
    Route::get('bank-jobs', 'examPage')->name('bank-jobs');
    Route::get('model-tests', 'examPage')->name('model-tests');
    Route::get('quiz', 'examPage')->name('quiz');
    Route::get('about', 'legal')->name('about');
    Route::get('privacy', 'legal')->name('privacy');
    Route::get('terms', 'legal')->name('terms');

    Route::fallback('fallback');
});

Route::controller(SitemapController::class)->name('sitemap.')->group(function () {
    Route::get('sitemap.xml', 'index')->name('index');
    Route::get('sitemap-{section}.xml', 'section')->whereIn('section', SitemapController::SECTIONS)->name('section');
});
