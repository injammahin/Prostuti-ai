<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Question;
use App\Models\SessionAnswer;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    /**
     * Exams and subjects with live question counts, plus the signed-in student's progress per subject.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user('sanctum');

        $liveCounts = Question::query()->live()->selectRaw('subject_id, count(*) as total')->groupBy('subject_id')->pluck('total', 'subject_id');

        $stats = $user
            ? SessionAnswer::query()
                ->join('questions', 'questions.id', '=', 'session_answers.question_id')
                ->where('session_answers.user_id', $user->id)
                ->selectRaw('questions.subject_id, count(distinct session_answers.question_id) as answered, count(*) as attempts, sum(case when session_answers.is_correct then 1 else 0 end) as correct')
                ->groupBy('questions.subject_id')
                ->get()
                ->keyBy('subject_id')
            : collect();

        $exams = Exam::query()->with('subjects:id,slug')->orderBy('sort')->get();

        return response()->json([
            'exams' => $exams->map(fn (Exam $exam): array => [
                'slug' => $exam->slug,
                'name' => $exam->name,
                'name_bn' => $exam->name_bn,
                'summary' => $exam->summary,
                'coming_soon' => $exam->coming_soon,
                'subjects' => $exam->subjects->map(fn (Subject $subject): array => [
                    'slug' => $subject->slug,
                    'marks' => $subject->pivot->marks,
                ]),
            ]),
            'subjects' => Subject::query()->with('exams:id,slug')->orderBy('sort')->get()->map(function (Subject $subject) use ($liveCounts, $stats): array {
                $row = $stats->get($subject->id);

                return [
                    'slug' => $subject->slug,
                    'name' => $subject->name,
                    'name_bn' => $subject->name_bn,
                    'icon' => $subject->icon,
                    'image' => $subject->image,
                    'exams' => $subject->exams->pluck('slug'),
                    'total' => (int) ($liveCounts[$subject->id] ?? 0),
                    'answered' => (int) ($row->answered ?? 0),
                    'accuracy' => $row && $row->attempts > 0 ? (int) round($row->correct / $row->attempts * 100) : null,
                ];
            }),
        ]);
    }
}
