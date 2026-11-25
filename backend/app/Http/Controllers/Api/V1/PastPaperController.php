<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use App\Services\PastPapers;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

/**
 * Previous BCS preliminary papers, newest first.
 */
class PastPaperController extends Controller
{
    public function index(): JsonResponse
    {
        $ready = PastPapers::index()->countBy('paper');
        $all = $ready->sum();

        return response()->json([
            'papers' => collect(PastPapers::numbers())
                ->map(fn (int $number): array => self::paper($number, $own = $ready[$number] ?? 0, max(0, min(PastPapers::FULL_SET - $own, $all - $own))))
                ->values(),
        ]);
    }

    /**
     * One paper with every question, its correct answer and explanation (the "solutions" view), plus the questions
     * from other papers that complete it to a full set.
     */
    public function show(int $number): JsonResponse
    {
        abort_unless($number >= (int) config('bcs_papers.first') && $number <= (int) config('bcs_papers.latest'), 404);

        $questions = Question::query()
            ->live()
            ->with('subject')
            ->onPaper(PastPapers::source($number))
            ->orderBy('id')
            ->get()
            ->sortBy(fn (Question $question): int => $question->numberOnPaper() ?? PHP_INT_MAX)
            ->values();

        $fillers = Question::query()->live()->with('subject')->whereIn('id', PastPapers::fillers($number))->orderBy('id')->get();
        $repeats = PastPapers::repeats();

        return response()->json([
            'paper' => self::paper($number, $questions->count(), $fillers->count()),
            'questions' => $questions->map(fn (Question $question): array => self::question($question, $number, $repeats)),
            'extra_questions' => $fillers->map(fn (Question $question): array => self::question($question, $number, $repeats)),
        ]);
    }

    /**
     * `questions` is how many of the paper's own questions are ready; `total` is how many the real paper had;
     * `shown` also counts the questions added from other papers.
     *
     * @return array<string, mixed>
     */
    private static function paper(int $number, int $ready, int $added): array
    {
        return [
            'number' => $number,
            'source' => PastPapers::source($number),
            'name' => PastPapers::source($number),
            'name_bn' => PastPapers::label($number)['name_bn'],
            'special' => in_array($number, config('bcs_papers.special', []), true),
            'questions' => $ready,
            'added' => $added,
            'shown' => $ready + $added,
            'total' => PastPapers::size($number),
            'full_marks' => config('bcs_papers.marks')[$number] ?? PastPapers::size($number),
            'exam_date' => config('bcs_papers.dates')[$number] ?? null,
        ];
    }

    /**
     * @param  Collection<string, list<int>>  $repeats
     * @return array<string, mixed>
     */
    private static function question(Question $question, int $number, Collection $repeats): array
    {
        $ownPaper = (int) $question->source;
        $papers = $repeats[PastPapers::textKey($question->body)] ?? [];

        return [
            ...(new QuestionResource($question))->revealAnswer()->resolve(),
            'number' => $ownPaper === $number ? $question->numberOnPaper() : null,
            'from' => $ownPaper === $number ? null : PastPapers::label($ownPaper),
            'also_in' => collect($papers)
                ->reject(fn (int $paper): bool => $paper === $ownPaper)
                ->map(fn (int $paper): array => PastPapers::label($paper))
                ->values(),
        ];
    }
}
