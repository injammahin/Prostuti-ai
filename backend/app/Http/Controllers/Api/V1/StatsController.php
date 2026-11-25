<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Mistake;
use App\Models\PracticeSession;
use App\Models\SessionAnswer;
use App\Models\Setting;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class StatsController extends Controller
{
    /** Questions a student aims to answer per day, unless the admin sets another goal. */
    private const DAILY_GOAL = 20;

    /** Answers needed before we estimate an exam score. */
    private const MIN_ANSWERS_FOR_ESTIMATE = 20;

    /**
     * Everything the Home and My results pages show, calculated from the student's real answers.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $exam = Exam::query()->firstWhere('slug', $request->query('exam', $user->main_exam)) ?? Exam::query()->orderBy('sort')->first();
        $timezone = config('app.student_timezone');
        $today = CarbonImmutable::now($timezone)->startOfDay();

        /** @var Collection<int, object{question_id: int, is_correct: bool, created_at: CarbonImmutable, subject_id: int, topic: ?string, difficulty: ?string}> $answers */
        $allAnswers = SessionAnswer::query()
            ->join('practice_sessions', 'practice_sessions.id', '=', 'session_answers.practice_session_id')
            ->join('questions', 'questions.id', '=', 'session_answers.question_id')
            ->where('session_answers.user_id', $user->id)
            ->get(['session_answers.question_id', 'session_answers.is_correct', 'session_answers.created_at', 'questions.subject_id', 'questions.topic', 'questions.difficulty', 'practice_sessions.exam_id'])
            ->map(function ($row) use ($timezone) {
                $row->day = CarbonImmutable::parse($row->created_at)->setTimezone($timezone)->toDateString();

                return $row;
            });

        // The streak and today's goal count all practice; everything else follows the chosen exam. Practice started
        // without an exam (daily quiz, mistakes …) counts for every exam that has the question's subject.
        $countsByDay = $allAnswers->countBy('day');
        $subjectIds = $exam?->subjects->pluck('id')->all() ?? [];
        $answers = $allAnswers
            ->filter(fn ($a): bool => $a->exam_id === null ? in_array($a->subject_id, $subjectIds, true) : (int) $a->exam_id === $exam?->id)
            ->values();

        $byDiff = $answers->groupBy(fn ($a) => strtolower($a->difficulty ?: 'medium'));
        $easy = $byDiff->get('easy', collect());
        $med = $byDiff->get('medium', collect());
        $hard = $byDiff->get('hard', collect());

        $easyCount = $easy->count();
        $medCount = $med->count();
        $hardCount = $hard->count();

        $easyAcc = $this->accuracy($easy) ?? 0;
        $medAcc = $this->accuracy($med) ?? 0;
        $hardAcc = $this->accuracy($hard) ?? 0;

        $difficulty = [
            'easy' => [
                'solved' => $easyCount,
                'accuracy' => $easyAcc,
            ],
            'medium' => [
                'solved' => $medCount,
                'accuracy' => $medAcc,
            ],
            'hard' => [
                'solved' => $hardCount,
                'accuracy' => $hardAcc,
            ],
        ];

        // Also get user's test scores from practice sessions where mode = 'test'
        $testSessions = PracticeSession::query()
            ->where('user_id', $user->id)
            ->where('mode', 'test')
            ->where('exam_id', $exam?->id)
            ->whereNotNull('finished_at')
            ->orderBy('finished_at', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($ts, $idx) use ($exam) {
                $score = max(0, $ts->correct - ($ts->wrong * $this->negativeMark($exam)));

                return [
                    'id' => $ts->id,
                    'test_number' => $idx + 1,
                    'score' => round($score, 1),
                    'total' => $ts->total,
                    'accuracy' => $ts->total > 0 ? round(($ts->correct / $ts->total) * 100, 1) : 0,
                    'date' => CarbonImmutable::parse($ts->finished_at)->format('d M'),
                ];
            });

        return response()->json([
            'exam' => $exam?->only(['slug', 'name', 'name_bn']),
            'today' => [
                'answered' => (int) ($countsByDay[$today->toDateString()] ?? 0),
                'goal' => (int) (Setting::get('daily_goal') ?: self::DAILY_GOAL),
            ],
            'streak' => $this->streak($countsByDay, $today),
            'totals' => $this->totals($answers, $today),
            'difficulty' => $difficulty,
            'test_scores' => $testSessions,
            'activity_days' => $countsByDay->toArray(),
            'week' => $this->week($answers->countBy('day'), $today),
            'subjects' => $this->subjects($answers, $exam),
            'weak_topics' => $this->weakTopics($answers, $exam),
            'expected_score' => $this->expectedScore($answers, $exam),
            'recent_sessions' => $this->recentSessions($user, $exam),
            'unfinished' => $this->unfinishedSessions($user, $exam),
            'mistakes_due' => Mistake::query()->due()->where('user_id', $user->id)->whereHas('question', fn ($query) => $query->forExam($exam))->count(),
            'sessions_finished' => PracticeSession::query()->where('user_id', $user->id)->where(fn ($query) => $query->whereNull('exam_id')->orWhere('exam_id', $exam?->id))->whereNotNull('finished_at')->count(),
        ]);
    }

    /**
     * Consecutive days with at least one answer. Today not practised yet does not break the streak.
     *
     * @param  Collection<string, int>  $countsByDay
     * @return array<string, mixed>
     */
    private function streak(Collection $countsByDay, CarbonImmutable $today): array
    {
        $current = 0;
        $day = $countsByDay->has($today->toDateString()) ? $today : $today->subDay();

        while ($countsByDay->has($day->toDateString())) {
            $current++;
            $day = $day->subDay();
        }

        $best = 0;
        $run = 0;
        $previous = null;

        foreach ($countsByDay->keys()->sort()->values() as $date) {
            $date = CarbonImmutable::parse($date);
            $run = $previous && $previous->addDay()->isSameDay($date) ? $run + 1 : 1;
            $best = max($best, $run);
            $previous = $date;
        }

        return [
            'current' => $current,
            'best' => max($best, $current),
            'last7' => collect(range(6, 0))->map(fn (int $daysAgo): array => [
                'date' => $today->subDays($daysAgo)->toDateString(),
                'label' => $daysAgo === 0 ? 'Today' : $today->subDays($daysAgo)->format('D'),
                'active' => $countsByDay->has($today->subDays($daysAgo)->toDateString()),
            ])->all(),
        ];
    }

    /**
     * @param  Collection<int, object>  $answers
     * @return array<string, int|null>
     */
    private function totals(Collection $answers, CarbonImmutable $today): array
    {
        $weekStart = $today->subDays(6)->toDateString();
        $previousStart = $today->subDays(13)->toDateString();

        $thisWeek = $answers->filter(fn ($a): bool => $a->day >= $weekStart);
        $lastWeek = $answers->filter(fn ($a): bool => $a->day >= $previousStart && $a->day < $weekStart);

        $accuracy = $this->accuracy($answers);
        $thisWeekAccuracy = $this->accuracy($thisWeek);
        $lastWeekAccuracy = $this->accuracy($lastWeek);

        return [
            'answered' => $answers->count(),
            'unique_questions' => $answers->unique('question_id')->count(),
            'correct' => $answers->where('is_correct', true)->count(),
            'accuracy' => $accuracy,
            'accuracy_change' => $thisWeekAccuracy !== null && $lastWeekAccuracy !== null ? $thisWeekAccuracy - $lastWeekAccuracy : null,
            'answered_this_week' => $thisWeek->count(),
            'answered_last_week' => $lastWeek->count(),
        ];
    }

    /**
     * Answers per day for the last 7 days.
     *
     * @param  Collection<string, int>  $countsByDay
     * @return list<array<string, mixed>>
     */
    private function week(Collection $countsByDay, CarbonImmutable $today): array
    {
        return collect(range(6, 0))->map(fn (int $daysAgo): array => [
            'date' => $today->subDays($daysAgo)->toDateString(),
            'label' => $daysAgo === 0 ? 'Today' : $today->subDays($daysAgo)->format('D'),
            'count' => (int) ($countsByDay[$today->subDays($daysAgo)->toDateString()] ?? 0),
        ])->all();
    }

    /**
     * Accuracy per subject of the exam's syllabus.
     *
     * @param  Collection<int, object>  $answers
     * @return list<array<string, mixed>>
     */
    private function subjects(Collection $answers, ?Exam $exam): array
    {
        if (! $exam) {
            return [];
        }

        $bySubject = $answers->groupBy('subject_id');

        return $exam->subjects->map(fn ($subject): array => [
            'slug' => $subject->slug,
            'name' => $subject->name,
            'name_bn' => $subject->name_bn,
            'image' => $subject->image,
            'marks' => $subject->pivot->marks,
            'answered' => $bySubject->get($subject->id, collect())->count(),
            'accuracy' => $this->accuracy($bySubject->get($subject->id, collect())),
        ])->values()->all();
    }

    /**
     * Topics with at least 3 answers where the student gets fewer than 60% right.
     *
     * @param  Collection<int, object>  $answers
     * @return list<array<string, mixed>>
     */
    private function weakTopics(Collection $answers, ?Exam $exam): array
    {
        $subjects = $exam?->subjects->keyBy('id') ?? collect();

        return $answers
            ->filter(fn ($a): bool => $a->topic !== null && $subjects->has($a->subject_id))
            ->groupBy(fn ($a): string => $a->subject_id.'|'.$a->topic)
            ->map(fn (Collection $group): array => [
                'subject' => $subjects[$group->first()->subject_id]->only(['slug', 'name', 'name_bn']),
                'topic' => $group->first()->topic,
                'attempts' => $group->count(),
                'accuracy' => $this->accuracy($group),
            ])
            ->filter(fn (array $topic): bool => $topic['attempts'] >= 3 && $topic['accuracy'] < 60)
            ->sortBy('accuracy')
            ->take(5)
            ->values()
            ->all();
    }

    /**
     * Estimated preliminary score: each subject's marks weighted by the student's accuracy there,
     * minus negative marking for the expected wrong answers.
     *
     * @param  Collection<int, object>  $answers
     * @return array<string, int>|null
     */
    private function expectedScore(Collection $answers, ?Exam $exam): ?array
    {
        if (! $exam || $answers->count() < self::MIN_ANSWERS_FOR_ESTIMATE) {
            return null;
        }

        $maxMarks = (int) $exam->subjects->sum('pivot.marks');

        if ($maxMarks === 0) {
            return null;
        }

        $overall = $this->accuracy($answers) / 100;
        $bySubject = $answers->groupBy('subject_id');

        $score = $exam->subjects->sum(function ($subject) use ($bySubject, $overall, $exam): float {
            $subjectAnswers = $bySubject->get($subject->id);
            $rate = $subjectAnswers && $subjectAnswers->count() >= 3 ? $this->accuracy($subjectAnswers) / 100 : $overall;

            return $subject->pivot->marks * ($rate - (1 - $rate) * $this->negativeMark($exam));
        });

        return ['score' => (int) round(max(0, min($maxMarks, $score))), 'max' => $maxMarks];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function recentSessions(User $user, ?Exam $exam): array
    {
        return PracticeSession::query()
            ->with('subject:id,name,name_bn,slug')
            ->where('user_id', $user->id)
            ->where(fn ($query) => $query->whereNull('exam_id')->orWhere('exam_id', $exam?->id))
            ->whereNotNull('finished_at')
            ->where('total', '>', 0)
            ->latest('finished_at')
            ->limit(8)
            ->get()
            ->reverse()
            ->values()
            ->map(fn (PracticeSession $session): array => [
                'id' => $session->id,
                'mode' => $session->mode,
                'subject' => $session->subject?->name,
                'subject_slug' => $session->subject?->slug,
                'subject_bn' => $session->subject?->name_bn,
                'total' => $session->total,
                'correct' => $session->correct,
                'wrong' => $session->wrong,
                'percent' => (int) round($session->correct / $session->total * 100),
                'finished_at' => $session->finished_at,
            ])
            ->all();
    }

    /**
     * Sessions started in the last 7 days and left half-way.
     *
     * @return list<array<string, mixed>>
     */
    private function unfinishedSessions(User $user, ?Exam $exam): array
    {
        return PracticeSession::query()
            ->with('subject:id,name,name_bn,slug')
            ->where('user_id', $user->id)
            ->where(fn ($query) => $query->whereNull('exam_id')->orWhere('exam_id', $exam?->id))
            ->whereNull('finished_at')
            ->where('created_at', '>=', now()->subDays(7))
            ->whereRaw('(correct + wrong) > 0')
            ->whereColumn('total', '>', 'correct')
            ->latest()
            ->limit(3)
            ->get()
            ->filter(fn (PracticeSession $session): bool => $session->correct + $session->wrong < $session->total)
            ->values()
            ->map(fn (PracticeSession $session): array => [
                'id' => $session->id,
                'mode' => $session->mode,
                'subject' => $session->subject?->name,
                'subject_slug' => $session->subject?->slug,
                'subject_bn' => $session->subject?->name_bn,
                'total' => $session->total,
                'answered' => $session->correct + $session->wrong,
                'percent' => (int) round(($session->correct + $session->wrong) / $session->total * 100),
            ])
            ->all();
    }

    /** Marks lost per wrong answer in the exam's preliminary. */
    private function negativeMark(?Exam $exam): float
    {
        return $exam?->slug === 'bcs-general' ? 0.5 : 0.25;
    }

    /**
     * @param  Collection<int, object>  $answers
     */
    private function accuracy(Collection $answers): ?int
    {
        return $answers->isEmpty() ? null : (int) round($answers->where('is_correct', true)->count() / $answers->count() * 100);
    }
}
