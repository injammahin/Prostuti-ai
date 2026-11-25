<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

/**
 * Puts a public page into the website's built index.html (the real one, so React still starts from it).
 */
class PageShell
{
    private const VERSION_KEY = 'seo:version';

    public static function path(): ?string
    {
        return collect([config('seo.shell'), public_path('index.html'), base_path('../frontend/dist/index.html')])
            ->first(fn (?string $path): bool => filled($path) && is_file($path));
    }

    /**
     * Texts shared with React (home page, about, exams …), exported by the frontend build.
     *
     * @return array<string, mixed>
     */
    public static function content(): array
    {
        $shell = self::path();
        $file = $shell ? dirname($shell).'/seo-content.json' : null;

        return $file && is_file($file) ? json_decode((string) file_get_contents($file), true) ?? [] : [];
    }

    /**
     * The finished HTML for a path, from the cache when nothing changed since it was built.
     *
     * @param  callable(): ?PublicPage  $build
     */
    public static function html(string $path, callable $build): ?string
    {
        $shell = self::path();

        if ($shell === null) {
            return null;
        }

        return self::remember('page:'.filemtime($shell).':'.md5($path), function () use ($build): ?string {
            $page = $build();

            return $page ? self::render($page) : null;
        });
    }

    /**
     * Keeps something built from the public content until that content changes.
     *
     * @template TValue
     *
     * @param  callable(): TValue  $build
     * @return TValue
     */
    public static function remember(string $key, callable $build): mixed
    {
        $key = 'seo2:'.(int) Cache::get(self::VERSION_KEY, 1).":{$key}";

        return Cache::remember($key, now()->addMinutes((int) config('seo.cache_minutes')), $build(...));
    }

    /**
     * Called when content changes: every cached page is rebuilt on its next visit.
     */
    public static function refresh(): void
    {
        Cache::forever(self::VERSION_KEY, (int) Cache::get(self::VERSION_KEY, 1) + 1);
    }

    public static function render(PublicPage $page): string
    {
        $html = (string) file_get_contents((string) self::path());
        $image = $page->image ?: ShareImage::forPath($page->path);
        $hasOwnImage = $image !== null;
        $image = PublicPage::absolute($image ?: '/icon-512.png');

        $html = self::replace('#<html lang="[^"]*"#', '<html lang="'.e($page->lang).'"', $html);
        $html = self::replace('#<title>.*?</title>#s', '<title>'.e($page->title).'</title>', $html);

        foreach ([
            ['name', 'description', $page->description],
            ['name', 'robots', $page->index ? 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' : 'noindex, follow'],
            ['property', 'og:type', $page->type],
            ['property', 'og:url', $page->url()],
            ['property', 'og:title', $page->title],
            ['property', 'og:description', $page->description],
            ['property', 'og:image', $image],
            ['name', 'twitter:title', $page->title],
            ['name', 'twitter:description', $page->description],
            ['name', 'twitter:image', $image],
        ] as [$attribute, $name, $value]) {
            $html = self::meta($html, $attribute, $name, $value);
        }

        if ($hasOwnImage) {
            $html = self::replace('#\s*<meta property="og:image:(width|height)"[^>]*>#', '', $html);
        }

        $head = $page->index ? '    <link rel="canonical" data-server href="'.e($page->url())."\" />\n" : '';

        if ($graph = $page->graph()) {
            $head .= '    <script type="application/ld+json" data-page>'.self::json(['@context' => 'https://schema.org', '@graph' => $graph])."</script>\n";
        }

        foreach ($page->links as $rel => $path) {
            $head .= '    <link rel="'.e($rel).'" href="'.e(PublicPage::absolute($path))."\" />\n";
        }

        $html = str_replace('</head>', $head.'  </head>', $html);

        $content = view('seo.layout', ['page' => $page])->render();
        $data = '<script type="application/json" id="server-data">'.self::json(['path' => $page->path, 'data' => (object) $page->data]).'</script>';

        return str_replace('<div id="root"></div>', '<div id="root">'.$content."</div>\n    ".$data, $html);
    }

    private static function meta(string $html, string $attribute, string $name, string $value): string
    {
        $tag = "<meta {$attribute}=\"{$name}\" content=\"".e($value).'" />';
        $pattern = '#<meta '.$attribute.'="'.preg_quote($name, '#').'"[^>]*>#';

        return preg_match($pattern, $html) ? self::replace($pattern, $tag, $html) : str_replace('</head>', "    {$tag}\n  </head>", $html);
    }

    private static function replace(string $pattern, string $replacement, string $subject): string
    {
        return (string) preg_replace_callback($pattern, fn (): string => $replacement, $subject);
    }

    private static function json(mixed $value): string
    {
        return (string) json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG);
    }
}
