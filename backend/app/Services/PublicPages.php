<?php

namespace App\Services;

/**
 * The pages written entirely by Laravel: React shows the same HTML, whether the visitor lands on them or moves to them.
 */
class PublicPages
{
    /**
     * The address of the page's content: a notice list keeps its section and page number, anything else is dropped.
     *
     * @param  array<string, mixed>  $query
     */
    public static function address(string $path, array $query = []): string
    {
        if ($path !== '/notices') {
            return $path;
        }

        $kept = array_filter([
            'category' => is_string($query['category'] ?? null) ? $query['category'] : null,
            'page' => is_numeric($query['page'] ?? null) && (int) $query['page'] > 1 ? (int) $query['page'] : null,
        ]);

        return $kept ? $path.'?'.http_build_query($kept) : $path;
    }

    public static function resolve(string $address): ?PublicPage
    {
        $path = (string) strtok($address, '?');
        parse_str((string) parse_url($address, PHP_URL_QUERY), $query);

        return match (true) {
            $path === '/notices' => NoticePages::list($query['category'] ?? null, (int) ($query['page'] ?? 1)),
            str_starts_with($path, '/notices/') => NoticePages::show(substr($path, strlen('/notices/'))),
            str_starts_with($path, '/questions/') => QuestionPages::resolve($path),
            $path === '/contact' => self::contact(),
            default => ExamPages::resolve($path),
        };
    }

    private static function contact(): PublicPage
    {
        return new PublicPage(
            path: '/contact',
            title: 'Contact & Report a Wrong Answer | যোগাযোগ | bd3schools',
            description: 'Contact bd3schools or report a wrong answer, question or notice. ভুল উত্তর জানান বা bd3schools-এর সঙ্গে যোগাযোগ করুন।',
            view: 'seo.contact',
            viewData: ['email' => PageShell::content()['contact']['email'] ?? null, 'facebook' => PageShell::content()['contact']['facebook'] ?? null],
            lang: 'bn',
            crumbs: ['Home' => '/', 'Contact' => '/contact'],
        );
    }
}
