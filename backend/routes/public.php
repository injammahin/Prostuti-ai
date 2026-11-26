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
    Route::get('notices', 'serverPage')->name('notices');
    Route::get('notices/category/{category}', 'serverPage')->name('notices.category');
    Route::get('notices/{slug}', 'serverPage')->name('notice');
    Route::get('contact', 'serverPage')->name('contact');
    Route::get('questions/{page}', 'serverPage')->name('question');
    Route::get('calendar', 'calendar')->name('calendar');
    Route::get('exams', 'exams')->name('exams');
    Route::get('exams/{slug}', 'exam')->name('exam');
    Route::get('daily', 'daily')->name('daily');
    Route::get('bcs', 'serverPage')->name('bcs');
    Route::get('bcs/{page}', 'serverPage')->where('page', '.*')->name('bcs.page');
    Route::get('ntrca', 'serverPage')->name('ntrca');
    Route::get('primary-teacher', 'serverPage')->name('primary-teacher');
    Route::get('bank-jobs', 'serverPage')->name('bank-jobs');
    Route::get('model-tests', 'serverPage')->name('model-tests');
    Route::get('quiz', 'serverPage')->name('quiz');
    Route::get('about', 'legal')->name('about');
    Route::get('privacy', 'legal')->name('privacy');
    Route::get('terms', 'legal')->name('terms');

    Route::fallback('fallback');
});

Route::controller(SitemapController::class)->name('sitemap.')->group(function () {
    Route::get('sitemap.xml', 'index')->name('index');
    Route::get('sitemap-{section}.xml', 'section')->whereIn('section', SitemapController::SECTIONS)->name('section');
});
