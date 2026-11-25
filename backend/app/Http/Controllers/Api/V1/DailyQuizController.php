<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DailyQuizController extends Controller
{
    public const QUESTION_COUNT = 10;

    /**
     * Today's public quiz: 10 live questions automatically rotating every 12 hours (12:00 AM & 12:00 PM BST),
     * or on-demand when triggered by an admin.
     */
    public function show(): JsonResponse
    {
        $tz = config('app.student_timezone') ?: 'Asia/Dhaka';
        $now = now($tz);

        // 12-hour slot: e.g. "2026-11-25-am" (00:00 to 11:59) or "2026-11-25-pm" (12:00 to 23:59)
        $slot = $now->format('Y-m-d').'-'.($now->hour < 12 ? 'am' : 'pm');
        $version = (int) Cache::get('daily-quiz:manual-version', 0);
        $size = (int) (Setting::get('daily_quiz_size') ?: self::QUESTION_COUNT);

        $cacheKey = "daily-quiz:{$slot}:v{$version}:{$size}";

        $questionIds = Cache::remember($cacheKey, now()->addHours(13), function () use ($slot, $version, $size): array {
            $ids = Question::query()->live()->orderBy('id')->pluck('id')->all();
            if (empty($ids)) {
                return [];
            }
            mt_srand(crc32("{$slot}-v{$version}"));
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

        // Calculate seconds until next 12-hour window (12:00 AM or 12:00 PM)
        $nextSlotTime = $now->copy();
        if ($now->hour < 12) {
            $nextSlotTime->setTime(12, 0, 0);
        } else {
            $nextSlotTime->addDay()->setTime(0, 0, 0);
        }
        $secondsUntilNext = max(0, $now->diffInSeconds($nextSlotTime));

        return response()->json([
            'date' => $now->toDateString(),
            'slot' => $slot,
            'version' => $version,
            'seconds_until_next' => $secondsUntilNext,
            'questions' => $questions,
        ]);
    }

    /**
     * Admin on-demand reshuffle: instantly generates and saves a fresh set of questions.
     */
    public function reshuffle(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user || (! $user->is_admin && $user->email !== 'mahin@gmail.com')) {
            abort(403, 'Unauthorized. Admin access required.');
        }

        $version = (int) Cache::get('daily-quiz:manual-version', 0) + 1;
        Cache::forever('daily-quiz:manual-version', $version);

        return $this->show();
    }
}
