<?php

use App\Http\Controllers\AdminSsoController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/admin');
});

Route::get('/sitemap.xml', function () {
    $path = public_path('sitemap.xml');
    if (file_exists($path)) {
        return response(file_get_contents($path), 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    // Dynamic generation fallback
    $site = config('app.frontend_url', 'https://bd3schools.com');
    $posts = \App\Models\Post::published()->get(['slug', 'updated_at']);
    $today = now()->toDateString();

    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    $xml .= "<url><loc>{$site}/</loc><lastmod>{$today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>";
    $xml .= "<url><loc>{$site}/blog</loc><lastmod>{$today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>";
    $xml .= "<url><loc>{$site}/notices</loc><lastmod>{$today}</lastmod><changefreq>daily</changefreq><priority>0.85</priority></url>";
    $xml .= "<url><loc>{$site}/app/bcs-papers</loc><lastmod>{$today}</lastmod><changefreq>weekly</changefreq><priority>0.95</priority></url>";
    $xml .= "<url><loc>{$site}/app/test</loc><lastmod>{$today}</lastmod><changefreq>weekly</changefreq><priority>0.90</priority></url>";

    foreach ($posts as $post) {
        $lastmod = $post->updated_at?->toDateString() ?: $today;
        $xml .= "<url><loc>{$site}/blog/{$post->slug}</loc><lastmod>{$lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.90</priority></url>";
    }
    $xml .= '</urlset>';

    return response($xml, 200, [
        'Content-Type' => 'application/xml; charset=utf-8',
        'Cache-Control' => 'public, max-age=3600',
    ]);
});

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
    ->middleware(['signed', 'throttle:10,1'])
    ->name('admin.sso');
