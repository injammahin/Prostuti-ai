<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Exam;
use App\Models\Mistake;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MistakeController extends Controller
{
    /**
     * The student's unresolved mistakes, due ones first, with the correct answers.
     */
    public function index(Request $request): JsonResponse
    {
        $exam = Exam::query()->firstWhere('slug', $request->query('exam'));

        $mistakes = Mistake::query()
            ->open()
            ->where('user_id', $request->user()->id)
            ->with('question.subject')
            ->whereHas('question', fn ($query) => $query->live()->forExam($exam))
            ->orderBy('next_review_at')
            ->get();

        return response()->json([
            'due_count' => $mistakes->filter(fn (Mistake $mistake): bool => $mistake->next_review_at->isPast())->count(),
            'resolved_count' => Mistake::query()->where('user_id', $request->user()->id)->whereNotNull('resolved_at')->count(),
            'mistakes' => $mistakes->map(fn (Mistake $mistake): array => [
                'id' => $mistake->id,
                'wrong_count' => $mistake->wrong_count,
                'next_review_at' => $mistake->next_review_at,
                'is_due' => $mistake->next_review_at->isPast(),
                'question' => (new QuestionResource($mistake->question))->revealAnswer()->resolve(),
            ]),
        ]);
    }
}
