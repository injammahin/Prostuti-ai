<?php

namespace App\Services;

/**
 * Everything one public page needs in its HTML: search tags, structured data, visible content, and the API data React
 * starts with (so it shows the same content without loading it again).
 */
class PublicPage
{
    /**
     * @param  array<string, mixed>  $viewData
     * @param  list<array<string, mixed>>  $jsonLd
     * @param  array<string, mixed>  $data
     * @param  array<string, string>  $crumbs  name => path, from the home page to this one: shown and marked up the same
     * @param  array<string, string>  $links  "prev" / "next" => path
     */
    public function __construct(
        public string $path,
        public string $title,
        public string $description,
        public string $view,
        public array $viewData = [],
        public string $lang = 'en',
        public string $type = 'website',
        public ?string $image = null,
        public array $jsonLd = [],
        public array $data = [],
        public bool $index = true,
        public array $crumbs = [],
        public array $links = [],
    ) {
        $this->description = self::fit($description, 150);
    }

    /**
     * Shortened at a word, so nothing is cut off in search results.
     */
    public static function fit(string $text, int $length): string
    {
        $text = str($text)->squish()->toString();

        if (mb_strlen($text) <= $length) {
            return $text;
        }

        return preg_replace(['/\s+\S*$/u', '/[\s,;:–—|-]+$/u'], '', mb_substr($text, 0, $length - 1)).'…';
    }

    /**
     * Structured data of this page.
     *
     * @return list<array<string, mixed>>
     */
    public function graph(): array
    {
        return $this->crumbs ? [...$this->jsonLd, self::breadcrumbs($this->crumbs)] : $this->jsonLd;
    }

    /**
     * Its visible content.
     */
    public function content(): string
    {
        return view($this->view, [...$this->viewData, 'crumbs' => $this->crumbs])->render();
    }

    public function url(): string
    {
        return self::absolute($this->path);
    }

    public static function absolute(string $path): string
    {
        if (preg_match('#^https?://#', $path)) {
            return $path;
        }

        return config('seo.site').($path === '/' ? '/' : '/'.trim($path, '/'));
    }

    /**
     * @param  array<string, string>  $items  name => path, from the home page to this one
     * @return array<string, mixed>
     */
    public static function breadcrumbs(array $items): array
    {
        $position = 0;

        return [
            '@type' => 'BreadcrumbList',
            'itemListElement' => collect($items)->map(function (string $path, string $name) use (&$position): array {
                return ['@type' => 'ListItem', 'position' => ++$position, 'name' => $name, 'item' => self::absolute($path)];
            })->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function article(string $path, string $headline, string $description, ?string $published, ?string $modified, ?string $image, string $lang): array
    {
        $organization = ['@id' => config('seo.site').'/#organization'];

        return [
            '@type' => 'Article',
            '@id' => self::absolute($path).'#article',
            'mainEntityOfPage' => self::absolute($path),
            'headline' => str($headline)->limit(107)->toString(),
            'description' => $description,
            'image' => self::absolute($image ?: ShareImage::forPath($path) ?: '/icon-512.png'),
            'datePublished' => $published,
            'dateModified' => $modified ?: $published,
            'inLanguage' => $lang,
            'author' => $organization,
            'publisher' => $organization,
        ];
    }
}
