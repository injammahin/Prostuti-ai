<?php

namespace App\Services;

use App\Models\Notice;
use Illuminate\Support\Collection;

/**
 * The notice board and the page of each notice.
 */
class NoticePages
{
    public const PER_PAGE = 10;

    /** A section of the board with fewer notices than this is kept out of search results. */
    private const ENOUGH_NOTICES = 3;

    /**
     * Published notices, newest first.
     *
     * @return Collection<int, array<string, mixed>>
     */
    public static function all(): Collection
    {
        return Notice::query()->published()->with('exam:id,slug')->orderByDesc('published_on')->orderByDesc('id')->get()
            ->toBase()
            ->map(fn (Notice $notice): array => $notice->toWebsite());
    }

    public static function list(?string $category = null, int $page = 1): ?PublicPage
    {
        $all = self::all();
        $notices = $category ? $all->where('category', $category)->values() : $all;
        $pages = max(1, (int) ceil($notices->count() / self::PER_PAGE));

        if (($category !== null && ! isset(Notice::CATEGORIES[$category])) || $page < 1 || $page > $pages) {
            return null;
        }

        [$name, $nameBn] = $category ? Notice::CATEGORIES[$category] : ['Govt Job', 'সরকারি চাকরির'];
        $part = $page > 1 ? " – Page {$page}" : '';
        $address = fn (int $number): string => PublicPages::address('/notices', ['category' => $category, 'page' => $number]);

        return new PublicPage(
            path: $address($page),
            title: "{$name} Circular & Notice | {$nameBn} বিজ্ঞপ্তি{$part} | bd3schools",
            description: $category
                ? "{$name} job circulars, exam dates, admit cards and results with official links. {$nameBn} বিজ্ঞপ্তি ও ফলাফল{$part}।"
                : "BCS, NTRCA, Primary and bank job circulars, exam dates and results with official links. সরকারি চাকরির বিজ্ঞপ্তি{$part}।",
            view: 'seo.notices',
            viewData: [
                'notices' => $notices->forPage($page, self::PER_PAGE)->values(),
                'category' => $category,
                'heading' => "{$name} notices",
                'headingBn' => "{$nameBn} বিজ্ঞপ্তি",
                'counts' => $all->countBy('category'),
                'total' => $all->count(),
                'page' => $page,
                'pages' => $pages,
                'address' => $address,
            ],
            crumbs: ['Home' => '/', 'Notices' => '/notices', ...($category ? [$name => $address(1)] : [])],
            links: array_filter(['prev' => $page > 1 ? $address($page - 1) : null, 'next' => $page < $pages ? $address($page + 1) : null]),
            index: $category === null || $notices->count() >= self::ENOUGH_NOTICES,
        );
    }

    /** How many of the newest notices React keeps for search, the calendar and the app. */
    public const PRELOADED = 150;

    public static function show(string $slug): ?PublicPage
    {
        $notice = Notice::query()->published()->with('exam:id,slug')->firstWhere('slug', $slug);

        if (! $notice) {
            return null;
        }

        $path = "/notices/{$slug}";
        $details = $notice->toWebsite();
        $related = self::all()->where('category', $details['category'])->where('slug', '!=', $slug)->take(5)->values();

        return new PublicPage(
            path: $path,
            title: self::title($notice).' | bd3schools',
            description: $notice->summary_bn ?: $notice->summary,
            view: 'seo.notice',
            viewData: [
                'notice' => $details,
                'related' => $related,
                'typeLabel' => Notice::TYPES[$notice->type] ?? 'Notice',
            ],
            type: 'article',
            image: ShareImage::forNotice($notice),
            jsonLd: [PublicPage::article($path, $notice->title, $notice->summary, $notice->published_on?->toIso8601String(), $notice->updated_at?->toIso8601String(), ShareImage::forNotice($notice), 'en')],
            crumbs: ['Home' => '/', 'Notices' => '/notices', $notice->title => $path],
            data: ['notices' => [$details]],
        );
    }

    /**
     * Both languages when they fit in a search result, otherwise the English title.
     */
    private static function title(Notice $notice): string
    {
        $both = $notice->title_bn ? "{$notice->title} | {$notice->title_bn}" : $notice->title;

        return mb_strlen($both) <= 60 ? $both : PublicPage::fit($notice->title, 60);
    }
}
