<?php

use App\Http\Controllers\AdminSsoController;
use App\Http\Controllers\NoticeShareImageController;
use Illuminate\Support\Facades\Route;

Route::get('/robots.txt', function () {
    $path = public_path('robots.txt');
    if (file_exists($path)) {
        return response(file_get_contents($path), 200, [
            'Content-Type' => 'text/plain; charset=utf-8',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    $site = config('app.frontend_url', 'https://bd3schools.com');
    $txt = "User-agent: *\nAllow: /\nAllow: /blog\nAllow: /blog/*\nAllow: /notices\nAllow: /notices/*\nAllow: /downloads/*\nAllow: /covers/*\nDisallow: /admin\nDisallow: /api/\n\nSitemap: {$site}/sitemap.xml\n";

    return response($txt, 200, [
        'Content-Type' => 'text/plain; charset=utf-8',
        'Cache-Control' => 'public, max-age=86400',
    ]);
});

Route::get('/admin-sso/{user}', [AdminSsoController::class, 'enter'])
    ->middleware(['signed', 'throttle:10,1,admin-sso'])
    ->name('admin.sso');

Route::middleware('auth')->controller(NoticeShareImageController::class)->group(function () {
    Route::get('/admin/share-images', 'index')->name('share-images.index');
    Route::post('/admin/share-images/{notice}', 'store')->name('share-images.store');
});
