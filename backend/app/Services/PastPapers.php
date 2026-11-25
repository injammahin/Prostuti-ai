<?php

namespace App\Services;

use App\Models\Question;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

/**
 * Previous BCS papers: how big the real papers were, which questions repeat between them, and which questions
 * from other papers fill a shorter paper up to a full 200-question set.
 */
class PastPapers
{
    /** Every paper is shown as a set of this many questions. */
    public const FULL_SET = 200;

    private const INDEX_KEY = 'past-papers:index';

    private const INDEX_MINUTES = 10;

    /**
     * The "source" text used on questions for a BCS paper, e.g. 47 → "47th BCS".
     */
    public static function source(int $number): string
    {
        $suffix = in_array($number % 100, [11, 12, 13], true)
            ? 'th'
            : match ($number % 10) {
                1 => 'st',
                2 => 'nd',
                3 => 'rd',
                default => 'th',
            };

        return "{$number}{$suffix} BCS";
    }

    /**
     * How many questions the real paper had: 200 from the 35th BCS on, 100 before that, with the exceptions in config.
     */
    public static function size(int $number): int
    {
        return config('bcs_papers.sizes')[$number] ?? ($number >= (int) config('bcs_papers.two_hundred_from') ? 200 : 100);
    }

    /**
     * The year the paper was held, e.g. 47 → 2025.
     */
    public static function year(int $number): ?int
    {
        $date = config('bcs_papers.dates')[$number] ?? null;

        return $date ? (int) substr($date, 0, 4) : null;
    }

    /**
     * The year for a question's source ("41st BCS" → 2021); null when it isn't from a BCS paper.
     */
    public static function yearOfSource(?string $source): ?int
    {
        return preg_match('/^(\d+)(st|nd|rd|th) BCS$/', (string) $source, $matches) ? self::year((int) $matches[1]) : null;
    }

    /**
     * @return array{number: int, name: string, name_bn: string, year: int|null}
     */
    public static function label(int $number): array
    {
        return [
            'number' => $number,
            'name' => self::source($number),
            'name_bn' => Bangla::ordinal($number).' বিসিএস',
            'year' => self::year($number),
        ];
    }

    /**
     * @return list<int> newest first
     */
    public static function numbers(): array
    {
        return range((int) config('bcs_papers.latest'), (int) config('bcs_papers.first'));
    }

    /**
     * Every live question that belongs to a paper.
     *
     * @return Collection<int, array{id: int, paper: int, text: string}>
     */
    public static function index(): Collection
    {
        $rows = Cache::remember(self::INDEX_KEY, now()->addMinutes(self::INDEX_MINUTES), fn (): array => self::buildIndex());

        return collect($rows);
    }

    /**
     * Called when questions change.
     */
    public static function refresh(): void
    {
        Cache::forget(self::INDEX_KEY);
    }

    /**
     * Questions from other papers that complete this one to a full set: a fixed, varied pick without repeats.
     *
     * @return Collection<int, int> question ids
     */
    public static function fillers(int $number): Collection
    {
        $used = [];
        $ready = 0;
        $others = [];

        foreach (self::index() as $row) {
            if ($row['paper'] === $number) {
                $used[$row['text']] = true;
                $ready++;
            } else {
                $others[md5("{$number}:{$row['id']}")] = $row;
            }
        }

        ksort($others);
        $ids = [];

        foreach ($others as $row) {
            if ($ready + count($ids) >= self::FULL_SET) {
                break;
            }

            if (! isset($used[$row['text']])) {
                $used[$row['text']] = true;
                $ids[] = $row['id'];
            }
        }

        return collect($ids);
    }

    /**
     * The papers each question text appeared in, oldest first, for questions asked more than once.
     *
     * @return Collection<string, list<int>> text key => paper numbers
     */
    public static function repeats(): Collection
    {
        return self::index()
            ->groupBy('text')
            ->map(fn (Collection $rows): array => $rows->pluck('paper')->unique()->sort()->values()->all())
            ->filter(fn (array $papers): bool => count($papers) > 1);
    }

    /**
     * Same wording (ignoring spaces and punctuation) = same question.
     */
    public static function textKey(string $body): string
    {
        return md5(mb_strtolower((string) preg_replace('/[^\p{L}\p{M}\p{N}]+/u', '', $body)));
    }

    /**
     * @return list<array{id: int, paper: int, text: string}>
     */
    private static function buildIndex(): array
    {
        return Question::query()
            ->live()
            ->whereIn('source', array_map(self::source(...), self::numbers()))
            ->orderBy('id')
            ->get(['id', 'source', 'ref', 'body'])
            ->filter(fn (Question $question): bool => $question->isOnPaper())
            ->map(fn (Question $question): array => [
                'id' => $question->id,
                'paper' => (int) $question->source,
                'text' => self::textKey($question->body),
            ])
            ->values()
            ->all();
    }
}
