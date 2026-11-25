<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ModelTest;
use App\Models\PracticeSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModelTestController extends Controller
{
    /** Everything except the questions themselves, which are large. */
    private const LIST_COLUMNS = [
        'id', 'title', 'title_bn', 'slug', 'exam_slug', 'type', 'duration_minutes', 'total_marks', 'pass_marks', 'negative_marking',
        'total_questions', 'syllabus', 'difficulty', 'starts_at', 'ends_at', 'attempts_count', 'created_at',
    ];

    /**
     * List all published model tests.
     */
    public function index(Request $request): JsonResponse
    {
        $exam = $request->query('exam');
        $query = ModelTest::query()->published();

        if ($exam && $exam !== 'all') {
            $query->where('exam_slug', $exam);
        }

        // The questions themselves are large and only needed when a test is opened.
        $tests = $query->orderBy('created_at', 'desc')->get(self::LIST_COLUMNS)->map(function (ModelTest $test): array {
            return [
                'id' => $test->slug ?: (string) $test->id,
                'db_id' => $test->id,
                'title' => $test->title,
                'title_bn' => $test->title_bn,
                'slug' => $test->slug,
                'exam' => $test->exam_slug,
                'type' => $test->type,
                'duration' => $test->duration_minutes >= 60
                    ? ($test->duration_minutes === 60 ? '1 hour' : ($test->duration_minutes === 120 ? '2 hours' : "{$test->duration_minutes} min"))
                    : "{$test->duration_minutes} min",
                'duration_minutes' => $test->duration_minutes,
                'duration_seconds' => $test->duration_minutes * 60,
                'marks' => (int) $test->total_marks,
                'total_marks' => (float) $test->total_marks,
                'pass_marks' => (float) $test->pass_marks,
                'negative' => (float) $test->negative_marking,
                'questions_count' => $test->total_questions,
                'syllabus' => $test->syllabus,
                'difficulty' => ucfirst($test->difficulty),
                'attempts' => number_format($test->attempts_count),
                'attempts_count' => $test->attempts_count,
                'starts_at' => $test->starts_at?->toIso8601String(),
                'ends_at' => $test->ends_at?->toIso8601String(),
            ];
        });

        return response()->json([
            'model_tests' => $tests,
        ]);
    }

    /**
     * Get one model test with all its questions.
     */
    public function show(string $id): JsonResponse
    {
        $test = ModelTest::where('slug', $id)->orWhere('id', $id)->firstOrFail();

        $questions = $test->questions_data ?? [];

        return response()->json([
            'test' => [
                'id' => $test->slug ?: (string) $test->id,
                'db_id' => $test->id,
                'title' => $test->title,
                'title_bn' => $test->title_bn,
                'slug' => $test->slug,
                'exam' => $test->exam_slug,
                'type' => $test->type,
                'duration_minutes' => $test->duration_minutes,
                'duration_seconds' => $test->duration_minutes * 60,
                'total_marks' => (float) $test->total_marks,
                'pass_marks' => (float) $test->pass_marks,
                'negative_marking' => (float) $test->negative_marking,
                'total_questions' => count($questions),
                'syllabus' => $test->syllabus,
                'difficulty' => $test->difficulty,
                'attempts_count' => $test->attempts_count,
                'starts_at' => $test->starts_at?->toIso8601String(),
                'ends_at' => $test->ends_at?->toIso8601String(),
            ],
            'questions' => $questions,
        ]);
    }

    /**
     * Submit and grade a model test attempt.
     */
    public function submit(Request $request, string $id): JsonResponse
    {
        $test = ModelTest::where('slug', $id)->orWhere('id', $id)->firstOrFail();
        ModelTest::withoutTimestamps(fn () => $test->increment('attempts_count'));

        $userAnswers = $request->input('answers', []);
        $usedSeconds = (int) $request->input('used_seconds', 0);
        $questions = $test->questions_data ?? [];

        $totalQuestions = count($questions);
        $correctCount = 0;
        $wrongCount = 0;
        $skippedCount = 0;

        $subjectBreakdown = [];
        $detailedReview = [];

        foreach ($questions as $q) {
            $qId = (string) ($q['id'] ?? $q['ref'] ?? $q['number']);
            $chosen = isset($userAnswers[$qId]) ? (int) $userAnswers[$qId] : (isset($userAnswers[$q['number']]) ? (int) $userAnswers[$q['number']] : null);

            $correctAns = (int) ($q['answer'] ?? $q['answer_index'] ?? 0);
            $subName = $q['subject']['name'] ?? $q['subject_name'] ?? 'General';

            if (! isset($subjectBreakdown[$subName])) {
                $subjectBreakdown[$subName] = [
                    'subject' => $subName,
                    'total' => 0,
                    'correct' => 0,
                    'wrong' => 0,
                    'skipped' => 0,
                    'score' => 0,
                ];
            }

            $subjectBreakdown[$subName]['total']++;

            $isCorrect = false;
            $isWrong = false;

            if ($chosen === null) {
                $skippedCount++;
                $subjectBreakdown[$subName]['skipped']++;
            } elseif ($chosen === $correctAns) {
                $correctCount++;
                $isCorrect = true;
                $subjectBreakdown[$subName]['correct']++;
                $subjectBreakdown[$subName]['score'] += 1;
            } else {
                $wrongCount++;
                $isWrong = true;
                $subjectBreakdown[$subName]['wrong']++;
                $subjectBreakdown[$subName]['score'] -= (float) $test->negative_marking;
            }

            $detailedReview[] = [
                'number' => $q['number'],
                'body' => $q['body'],
                'options' => $q['options'],
                'chosen' => $chosen,
                'correct' => $correctAns,
                'is_correct' => $isCorrect,
                'is_wrong' => $isWrong,
                'explanation' => $q['explanation'] ?? '',
                'subject' => $subName,
                'topic' => $q['topic'] ?? '',
            ];
        }

        $negativeDeduction = round($wrongCount * (float) $test->negative_marking, 2);
        $netScore = round(max(0, $correctCount - $negativeDeduction), 2);
        $maxMarks = (float) $test->total_marks ?: $totalQuestions;
        $percentage = $maxMarks > 0 ? round(($netScore / $maxMarks) * 100, 1) : 0;
        $accuracy = ($correctCount + $wrongCount) > 0
            ? round(($correctCount / ($correctCount + $wrongCount)) * 100, 1)
            : 0;

        $passed = $netScore >= (float) $test->pass_marks;

        // Cutoff prediction
        $cutoffAdvice = 'Practice more to strengthen weak subjects.';
        if ($netScore >= 135) {
            $cutoffAdvice = 'Outstanding performance! Safe margin for preliminary qualification.';
        } elseif ($netScore >= 115) {
            $cutoffAdvice = 'Competitive score! You are near or above the expected BPSC preliminary cutoff.';
        } elseif ($netScore >= 95) {
            $cutoffAdvice = 'Good effort. Focus on negative mark control and high-yield math & science topics.';
        }

        $student = $request->user('sanctum');

        if ($student) {
            $examId = Exam::where('slug', $test->catalogExamSlug())->value('id');
            PracticeSession::create([
                'user_id' => $student->id,
                'mode' => 'test',
                'question_ids' => [],
                'exam_id' => $examId,
                'total' => $totalQuestions,
                'correct' => $correctCount,
                'wrong' => $wrongCount,
                'finished_at' => now(),
            ]);
        }

        return response()->json([
            'result' => [
                'test_id' => $test->slug ?: $test->id,
                'title' => $test->title,
                'total_questions' => $totalQuestions,
                'total_marks' => $maxMarks,
                'correct_count' => $correctCount,
                'wrong_count' => $wrongCount,
                'skipped_count' => $skippedCount,
                'negative_marks' => $negativeDeduction,
                'net_score' => $netScore,
                'percentage' => $percentage,
                'accuracy' => $accuracy,
                'passed' => $passed,
                'pass_marks' => (float) $test->pass_marks,
                'used_seconds' => $usedSeconds,
                'cutoff_advice' => $cutoffAdvice,
                'subject_breakdown' => array_values($subjectBreakdown),
                'review' => $detailedReview,
            ],
        ]);
    }
}
