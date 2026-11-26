<?php

namespace App\Services;

use App\Models\Notice;
use Illuminate\Support\Collection;

/**
 * The notice board (/notices and /notices/category/{key}) and the page of each notice.
 */
class NoticePages
{
    public const PER_PAGE = 20;

    /** A section of the board with fewer notices than this is kept out of search results. */
    private const ENOUGH_NOTICES = 3;

    /** How many of the newest notices React keeps for search, the calendar and the app. */
    public const PRELOADED = 150;

    /** The exam whose guide, past questions and model tests suit a notice of each section. */
    private const SECTION_EXAMS = [
        'bcs' => 'bcs-general',
        'bank' => 'combined-bank',
        'primary' => 'primary-teacher',
        'ntrca' => 'ntrca',
    ];

    /**
     * Published notices for the lists (board, sections, home page, calendar, app), newest first.
     *
     * A circular whose application deadline has passed leaves the lists by itself the next day. Its own page stays
     * (marked "Application closed") so links and search results keep working, and it comes back to the lists when an
     * admit card, exam date or result is added to it.
     *
     * @return Collection<int, array<string, mixed>>
     */
    public static function all(): Collection
    {
        return Notice::query()->published()->with('exam:id,slug')->orderByDesc('published_on')->orderByDesc('id')->get()
            ->toBase()
            ->map(fn (Notice $notice): array => $notice->toWebsite())
            ->reject(fn (array $notice): bool => $notice['status'] === 'closed')
            ->values();
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
            title: "{$name} Job Circular 2026 | {$nameBn} নিয়োগ বিজ্ঞপ্তি{$part} | bd3schools",
            description: $category
                ? "{$name} job circulars, exam dates, admit cards and results with official links. {$nameBn} নিয়োগ বিজ্ঞপ্তি ও ফলাফল{$part}।"
                : "BCS, NTRCA, Primary and bank job circulars, exam dates and results with official links. সরকারি চাকরির বিজ্ঞপ্তি{$part}।",
            view: 'seo.notices',
            viewData: [
                'notices' => $notices->forPage($page, self::PER_PAGE)->values(),
                'category' => $category,
                'heading' => "{$name} job circulars",
                'headingBn' => "{$nameBn} নিয়োগ বিজ্ঞপ্তি",
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

    public static function show(string $slug): ?PublicPage
    {
        $notice = Notice::query()->published()->with('exam:id,slug')->firstWhere('slug', $slug);

        return $notice ? self::page($notice) : null;
    }

    /**
     * A notice's page. A preview (of a draft, from the admin panel) is never indexed.
     */
    public static function page(Notice $notice, bool $preview = false): PublicPage
    {
        $notice->loadMissing('exam:id,slug');
        $path = "/notices/{$notice->slug}";
        $details = $notice->toWebsite();
        $related = self::all()->where('category', $details['category'])->where('slug', '!=', $notice->slug)->take(5)->values();
        $headline = $details['heading'] ?? $notice->title;
        [$section] = Notice::CATEGORIES[$details['category']] ?? ['Others'];

        return new PublicPage(
            path: $path,
            title: self::title($notice),
            description: $notice->metaDescription(),
            view: 'seo.notice',
            viewData: [
                'notice' => $details,
                'related' => $related,
                'typeLabel' => Notice::TYPES[$notice->type] ?? 'Notice',
                'study' => self::studyLinks($details['exam'] ?? null, $details['category']),
                'preview' => $preview,
            ],
            type: 'article',
            image: ShareImage::forNotice($notice),
            jsonLd: [PublicPage::article($path, $headline, $notice->metaDescription(), $notice->published_on?->toIso8601String(), $notice->updated_at?->toIso8601String(), ShareImage::forNotice($notice), 'bn')],
            index: ! $preview,
            crumbs: ['Home' => '/', 'Notices' => '/notices', $section => PublicPages::address('/notices', ['category' => $details['category']]), $notice->title => $path],
            data: ['notices' => [$details]],
        );
    }

    /**
     * The exam guide, past questions and model tests that go with a notice.
     *
     * @return list<array{label: string, label_bn: string, path: string}>
     */
    public static function studyLinks(?string $exam, string $category): array
    {
        $exam ??= self::SECTION_EXAMS[$category] ?? null;
        $name = $exam ? collect(PageShell::content()['exams'] ?? [])->firstWhere('slug', $exam)['name'] ?? null : null;

        return array_values(array_filter([
            $exam ? ['label' => ($name ?: 'Exam').' syllabus & marks', 'label_bn' => 'সিলেবাস ও নম্বর বণ্টন', 'path' => "/exams/{$exam}"] : ['label' => 'Govt job exam guides', 'label_bn' => 'সরকারি চাকরির পরীক্ষা', 'path' => '/exams'],
            ['label' => 'Previous questions with answers', 'label_bn' => 'বিগত প্রশ্ন ও সমাধান', 'path' => ($exam ? ExamPages::examPath($exam) : null) ?? '/bcs'],
            ['label' => 'Free model tests', 'label_bn' => 'ফ্রি মডেল টেস্ট', 'path' => '/model-tests'],
        ]));
    }

    /**
     * A circular: "<Org BN> নিয়োগ বিজ্ঞপ্তি ২০২৬ | <Org> Job Circular 2026 | bd3schools".
     * Other notices: both languages when they fit in a search result, otherwise the English title.
     */
    private static function title(Notice $notice): string
    {
        if ($notice->isCircular()) {
            return $notice->circularHeading().' | bd3schools';
        }

        $both = $notice->title_bn ? "{$notice->title} | {$notice->title_bn}" : $notice->title;

        return (mb_strlen($both) <= 60 ? $both : PublicPage::fit($notice->title, 60)).' | bd3schools';
    }
}
