<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class DailyQuizController extends Controller
{
    public const QUESTION_COUNT = 10;

    /**
     * Today's public quiz: the same 10 live questions for everyone, changing at midnight Bangladesh time.
     */
    public function show(): JsonResponse
    {
        $today = now(config('app.student_timezone'))->toDateString();
        $size = (int) (Setting::get('daily_quiz_size') ?: self::QUESTION_COUNT);

        $questionIds = Cache::remember("daily-quiz:{$today}:{$size}", now()->addDay(), function () use ($today, $size): array {
            $ids = Question::query()->live()->orderBy('id')->pluck('id')->all();
            mt_srand(crc32($today));
            shuffle($ids);
            mt_srand();

            return array_slice($ids, 0, $size);
        });

        $questions = Question::query()
            ->with('subject')
            ->whereIn('id', $questionIds)
            ->get()
            ->sortBy(fn (Question $question): int => array_search($question->id, $questionIds, true))
            ->values()
            ->map(fn (Question $question): array => (new QuestionResource($question))->revealAnswer()->resolve());

        return response()->json([
            'date' => $today,
            'questions' => $questions,
        ]);
    }
}
