<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use Illuminate\Http\JsonResponse;

/**
 * Previous BCS preliminary papers, newest first, with 200 questions for each paper.
 */
class PastPaperController extends Controller
{
    private const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

    public function index(): JsonResponse
    {
        $first = (int) config('bcs_papers.first', 10);
        $latest = (int) config('bcs_papers.latest', 48);
        $special = config('bcs_papers.special', [32, 39, 42, 48]);

        $papers = collect(range($latest, $first))->map(function (int $number) use ($special): array {
            $source = self::paperSource($number);

            return [
                'number' => $number,
                'source' => $source,
                'name' => $source,
                'name_bn' => self::banglaOrdinal($number).' বিসিএস',
                'special' => in_array($number, $special, true),
                'questions' => 200,
                'total' => 200,
                'full_marks' => 200,
                'exam_date' => config('bcs_papers.dates')[$number] ?? null,
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
            ->onPaper($source)
            ->orderBy('id')
            ->get()
            ->map(fn (Question $question): array => [
                ...(new QuestionResource($question))->revealAnswer()->resolve(),
                'number' => self::numberOnPaper($question),
            ])
            ->sortBy(fn (array $question): int => $question['number'] ?? PHP_INT_MAX);

        // If database has fewer than 200 questions, load the complete 200 verified questions from seeder file
        if ($questions->count() < 200) {
            $jsonFile = database_path("seeders/data/questions-{$number}th-bcs.json");
            if (!file_exists($jsonFile)) {
                $matches = glob(database_path("seeders/data/questions-*{$number}*-bcs.json"));
                if (!empty($matches)) {
                    $jsonFile = $matches[0];
                }
            }

            if (file_exists($jsonFile)) {
                $raw = json_decode(file_get_contents($jsonFile), true);
                if (is_array($raw) && count($raw) === 200) {
                    $questions = collect($raw)->map(function (array $q, int $idx) use ($number, $source): array {
                        $num = $idx + 1;
                        $ans = $q['answer'] ?? $q['answer_index'] ?? 0;
                        return [
                            'id' => $q['ref'] ?? "bcs{$number}_q{$num}",
                            'number' => $num,
                            'ref' => $q['ref'] ?? "bcs{$number}_q{$num}",
                            'exam' => $q['exam'] ?? 'bcs-general',
                            'subject' => [
                                'name' => $q['subject'] ?? 'General',
                                'name_bn' => 'সাধারণ',
                                'slug' => 'general',
                            ],
                            'topic' => $q['topic'] ?? '',
                            'difficulty' => $q['difficulty'] ?? 'medium',
                            'source' => $source,
                            'type' => 'mcq',
                            'lang' => $q['lang'] ?? 'bn',
                            'body' => $q['body'] ?? '',
                            'options' => $q['options'] ?? [],
                            'answer' => $ans,
                            'answer_index' => $ans,
                            'explanation' => $q['explanation'] ?? '',
                            'marks' => 1,
                            'negative_marks' => 0.5,
                            'cancelled' => false,
                        ];
                    });
                }
            }
        }

        return response()->json([
            'paper' => [
                'number' => $number,
                'source' => $source,
                'name' => $source,
                'name_bn' => self::banglaOrdinal($number).' বিসিএস',
                'special' => in_array($number, config('bcs_papers.special', []), true),
                'questions' => 200,
                'total' => 200,
                'full_marks' => 200,
                'exam_date' => config('bcs_papers.dates')[$number] ?? null,
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
     * How many questions (= marks) the paper has: 200 for all papers.
     */
    public static function paperSize(int $number): int
    {
        return 200;
    }

    /**
     * The question's number on the printed paper, read from its ref ("bcs35_q17" → 17).
     */
    private static function numberOnPaper(Question $question): ?int
    {
        return preg_match('/_q(\d+)$/', (string) $question->ref, $matches) ? (int) $matches[1] : null;
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
