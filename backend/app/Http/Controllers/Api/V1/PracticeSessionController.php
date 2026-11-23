<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnswerQuestionRequest;
use App\Http\Requests\StartPracticeRequest;
use App\Http\Resources\QuestionResource;
use App\Models\ActivityLog;
use App\Models\Exam;
use App\Models\PracticeSession;
use App\Models\Question;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PracticeSessionController extends Controller
{
    /**
     * Start a practice session. Works for guests too (their answers are not linked to an account).
     */
    public function store(StartPracticeRequest $request): JsonResponse
    {
        $user = $request->user('sanctum');

        if ($request->validated('mode') === 'mistakes' && ! $user) {
            abort(401, 'Sign in to review your mistakes.');
        }

        $session = PracticeSession::start(
            $user,
            $request->validated('mode'),
            Exam::query()->firstWhere('slug', $request->validated('exam')),
            Subject::query()->firstWhere('slug', $request->validated('subject')),
            (int) ($request->validated('count') ?? 20),
        );

        $what = collect([$session->subject?->name, $session->exam?->name])->filter()->join(' · ') ?: 'mixed subjects';
        ActivityLog::record(
            'practice.started',
            ($user?->name ?? 'A guest')." started {$session->mode} practice: {$what} ({$session->total} questions)",
            $user,
            ['session' => $session->id, 'mode' => $session->mode, 'exam' => $session->exam?->slug, 'subject' => $session->subject?->slug],
            $request,
        );

        return $this->sessionPayload($session, 201);
    }

    /**
     * Resume a session: its questions plus any answers already given.
     */
    public function show(Request $request, PracticeSession $session): JsonResponse
    {
        $this->authorizeSession($request, $session);

        return $this->sessionPayload($session);
    }

    /**
     * Check one answer and return the correct option with its explanation.
     */
    public function answer(AnswerQuestionRequest $request, PracticeSession $session): JsonResponse
    {
        $this->authorizeSession($request, $session);

        $questionId = (int) $request->validated('question_id');

        if (! in_array($questionId, $session->question_ids, true)) {
            abort(422, 'This question is not part of the session.');
        }

        $question = Question::query()->findOrFail($questionId);
        $answer = $session->recordAnswer($question, (int) $request->validated('chosen_index'), $request->validated('time_ms'));

        return response()->json([
            'is_correct' => $answer->is_correct,
            'chosen_index' => $answer->chosen_index,
            'answer_index' => $question->answer_index,
            'explanation' => $question->explanation,
        ]);
    }

    /**
     * Mark the session as finished and return the summary.
     */
    public function finish(Request $request, PracticeSession $session): JsonResponse
    {
        $this->authorizeSession($request, $session);

        if (! $session->isFinished()) {
            $session->update(['finished_at' => now()]);

            $user = $request->user('sanctum');
            ActivityLog::record(
                'practice.finished',
                ($user?->name ?? 'A guest')." finished practice: {$session->correct}/{$session->total} correct",
                $user,
                ['session' => $session->id, 'correct' => $session->correct, 'wrong' => $session->wrong, 'total' => $session->total],
                $request,
            );
        }

        return response()->json([
            'total' => $session->total,
            'correct' => $session->correct,
            'wrong' => $session->wrong,
            'skipped' => max(0, $session->total - $session->correct - $session->wrong),
        ]);
    }

    /**
     * Sessions owned by an account may only be used by that account.
     */
    private function authorizeSession(Request $request, PracticeSession $session): void
    {
        if ($session->user_id !== null && $session->user_id !== $request->user('sanctum')?->id) {
            abort(403);
        }
    }

    private function sessionPayload(PracticeSession $session, int $status = 200): JsonResponse
    {
        $questions = Question::query()
            ->with('subject')
            ->whereIn('id', $session->question_ids)
            ->get()
            ->sortBy(fn (Question $question): int => array_search($question->id, $session->question_ids, true))
            ->values();

        $answers = $session->answers()->get()->keyBy('question_id');

        return response()->json([
            'id' => $session->id,
            'mode' => $session->mode,
            'exam' => $session->exam?->only(['slug', 'name', 'name_bn']),
            'subject' => $session->subject?->only(['slug', 'name', 'name_bn']),
            'total' => $session->total,
            'finished' => $session->isFinished(),
            'questions' => $questions->map(function (Question $question) use ($answers): array {
                $answer = $answers->get($question->id);

                return [
                    ...(new QuestionResource($question))->revealAnswer($answer !== null)->resolve(),
                    'chosen_index' => $answer?->chosen_index,
                ];
            }),
        ], $status);
    }
}
