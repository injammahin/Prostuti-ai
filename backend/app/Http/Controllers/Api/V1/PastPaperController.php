<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use Illuminate\Http\JsonResponse;

/**
 * Previous BCS preliminary papers, newest first, with how many of each paper's questions are in the bank.
 */
class PastPaperController extends Controller
{
    private const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

    public function index(): JsonResponse
    {
        $first = (int) config('bcs_papers.first');
        $latest = (int) config('bcs_papers.latest');
        $special = config('bcs_papers.special', []);

        $counts = Question::query()
            ->live()
            ->whereNotNull('source')
            ->selectRaw('source, count(*) as total')
            ->groupBy('source')
            ->pluck('total', 'source');

        $papers = collect(range($latest, $first))->map(function (int $number) use ($counts, $special): array {
            $source = self::paperSource($number);

            return [
                'number' => $number,
                'source' => $source,
                'name' => $source,
                'name_bn' => self::banglaOrdinal($number).' বিসিএস',
                'special' => in_array($number, $special, true),
                'questions' => (int) ($counts[$source] ?? 0),
            ];
        });

        return response()->json(['papers' => $papers->values()]);
    }

    /**
     * One paper with every question, its correct answer and explanation (the "solutions" view).
     */
    public function show(int $number): JsonResponse
    {
        abort_unless($number >= (int) config('bcs_papers.first') && $number <= (int) config('bcs_papers.latest'), 404);

        $source = self::paperSource($number);

        $questions = Question::query()
            ->live()
            ->with('subject')
            ->where('source', $source)
            ->orderBy('id')
            ->get()
            ->map(fn (Question $question): array => (new QuestionResource($question))->revealAnswer()->resolve());

        return response()->json([
            'paper' => [
                'number' => $number,
                'source' => $source,
                'name' => $source,
                'name_bn' => self::banglaOrdinal($number).' বিসিএস',
                'special' => in_array($number, config('bcs_papers.special', []), true),
                'questions' => $questions->count(),
            ],
            'questions' => $questions->values(),
        ]);
    }

    /**
     * The "source" text used on questions for a BCS paper, e.g. 47 → "47th BCS".
     */
    public static function paperSource(int $number): string
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
     * 10 → "১০ম", 47 → "৪৭তম".
     */
    private static function banglaOrdinal(int $number): string
    {
        $digits = strtr((string) $number, array_combine(range(0, 9), self::BANGLA_DIGITS));

        return $digits.($number === 10 ? 'ম' : 'তম');
    }
}
