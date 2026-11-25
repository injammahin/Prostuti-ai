<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Public pages with their content in the HTML
    |--------------------------------------------------------------------------
    |
    | Laravel puts each public page's title, meta tags and text into the website's
    | built index.html, so search engines and visitors get them before JavaScript
    | runs. `shell` is that index.html; when empty, the usual places are tried.
    | `seo-content.json` (made by the frontend build) is read from the same folder.
    |
    */

    'site' => rtrim((string) env('SITE_URL', 'https://bd3schools.com'), '/'),

    'shell' => env('SPA_SHELL_PATH'),

    // Pages are rebuilt at once when content changes in the admin panel; this is only the upper limit.
    'cache_minutes' => (int) env('SEO_CACHE_MINUTES', 60),

];
