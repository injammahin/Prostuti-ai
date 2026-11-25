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
    ) {}

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
            'image' => self::absolute($image ?: '/icon-512.png'),
            'datePublished' => $published,
            'dateModified' => $modified ?: $published,
            'inLanguage' => $lang,
            'author' => $organization,
            'publisher' => $organization,
        ];
    }
}
