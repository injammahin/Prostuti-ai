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

    // BCS papers whose explanations may be someone else's text: their questions get no page of their own until that is
    // checked. An empty value releases all of them.
    'questions_on_hold' => array_map(intval(...), array_filter(explode(',', (string) env('SEO_QUESTIONS_ON_HOLD', '43,44,45,46,47')))),

    // Pages are rebuilt at once when content changes in the admin panel; this is only the upper limit.
    'cache_minutes' => (int) env('SEO_CACHE_MINUTES', 60),

];
