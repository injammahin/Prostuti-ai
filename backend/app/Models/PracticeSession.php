<?php

namespace App\Models;

use App\Services\PastPapers;
use Database\Factories\PracticeSessionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * One practice run (subject drill, past paper, mistakes review, diagnostic or daily quiz).
 * Guests get sessions too (user_id null); the unguessable UUID is what lets them answer.
 */
#[Fillable(['user_id', 'mode', 'exam_id', 'subject_id', 'question_ids', 'total', 'correct', 'wrong', 'finished_at'])]
class PracticeSession extends Model
{
    /** @use HasFactory<PracticeSessionFactory> */
    use HasFactory, HasUuids;

    /**
     * @var list<string>
     */
    public const MODES = ['drill', 'past', 'past_exam', 'mistakes', 'diagnostic', 'daily'];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Exam, $this>
     */
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    /**
     * @return BelongsTo<Subject, $this>
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * @return HasMany<SessionAnswer, $this>
     */
    public function answers(): HasMany
    {
        return $this->hasMany(SessionAnswer::class);
    }

    public function isFinished(): bool
    {
        return $this->finished_at !== null;
    }

    /**
     * Pick questions and open a new session.
     */
    public static function start(?User $user, string $mode, ?Exam $exam, ?Subject $subject, int $count, ?string $paper = null): self
    {
        $questionIds = match (true) {
            in_array($mode, ['past', 'past_exam'], true) && filled($paper) => self::pickPaper($paper, $count, fullSet: $mode === 'past_exam'),
            $mode === 'mistakes' => self::pickMistakes($user, $count),
            $mode === 'diagnostic' => self::pickAcrossSubjects($exam, $count),
            default => self::pickFresh($user, $exam, $subject, $count, pastPapersOnly: in_array($mode, ['past', 'past_exam'], true)),
        };

        return static::query()->create([
            'user_id' => $user?->id,
            'mode' => $mode,
            'exam_id' => $exam?->id,
            'subject_id' => $subject?->id,
            'question_ids' => $questionIds,
            'total' => count($questionIds),
        ]);
    }

    /**
     * All live questions of one previous paper (e.g. "47th BCS"), in the order they were added. The timed exam is
     * completed to a full set with questions from other papers, the same ones the solutions page shows.
     *
     * @return list<int>
     */
    private static function pickPaper(string $paper, int $count, bool $fullSet): array
    {
        $own = Question::query()
            ->live()
            ->onPaper($paper)
            ->orderBy('id')
            ->limit($count)
            ->pluck('id');

        $fillers = $fullSet ? PastPapers::fillers((int) $paper) : collect();

        return $own->concat($fillers)->take($count)->values()->all();
    }

    /**
     * Save one answer, update the session score and the student's mistakes list.
     * Answering the same question twice returns the first result unchanged.
     */
    public function recordAnswer(Question $question, int $chosenIndex, ?int $timeMs): SessionAnswer
    {
        $existing = $this->answers()->where('question_id', $question->id)->first();

        if ($existing) {
            return $existing;
        }

        $isCorrect = $chosenIndex === $question->answer_index;

        $answer = $this->answers()->create([
            'user_id' => $this->user_id,
            'question_id' => $question->id,
            'chosen_index' => $chosenIndex,
            'is_correct' => $isCorrect,
            'time_ms' => $timeMs,
        ]);

        $this->increment($isCorrect ? 'correct' : 'wrong');

        if ($this->user_id) {
            self::updateMistake($this->user_id, $question->id, $isCorrect);
        }

        return $answer;
    }

    /**
     * Wrong answers go on the mistakes list (back for review tomorrow); a later correct answer clears them.
     */
    private static function updateMistake(int $userId, int $questionId, bool $isCorrect): void
    {
        $mistake = Mistake::query()->firstWhere(['user_id' => $userId, 'question_id' => $questionId]);

        if ($isCorrect) {
            if ($mistake && $mistake->resolved_at === null) {
                $mistake->update(['resolved_at' => now()]);
            }

            return;
        }

        if ($mistake) {
            $mistake->update([
                'wrong_count' => $mistake->wrong_count + 1,
                'next_review_at' => now()->addDay(),
                'resolved_at' => null,
            ]);

            return;
        }

        Mistake::query()->create([
            'user_id' => $userId,
            'question_id' => $questionId,
            'next_review_at' => now()->addDay(),
        ]);
    }

    /**
     * Live questions for the exam/subject, ones the student has not answered yet first.
     *
     * @return list<int>
     */
    private static function pickFresh(?User $user, ?Exam $exam, ?Subject $subject, int $count, bool $pastPapersOnly): array
    {
        $query = Question::query()
            ->live()
            ->forExam($exam)
            ->when($subject, fn ($q) => $q->where('subject_id', $subject->id))
            ->when($pastPapersOnly, fn ($q) => $q->whereNotNull('source'));

        if ($user) {
            $answered = SessionAnswer::query()->where('user_id', $user->id)->select('question_id');
            $fresh = (clone $query)->whereNotIn('id', $answered)->inRandomOrder()->limit($count)->pluck('id');

            if ($fresh->count() >= $count) {
                return $fresh->all();
            }

            $rest = (clone $query)->whereNotIn('id', $fresh)->inRandomOrder()->limit($count - $fresh->count())->pluck('id');

            return $fresh->merge($rest)->all();
        }

        return $query->inRandomOrder()->limit($count)->pluck('id')->all();
    }

    /**
     * An even spread over every subject of the exam (for the starting-level test).
     *
     * @return list<int>
     */
    private static function pickAcrossSubjects(?Exam $exam, int $count): array
    {
        $subjectIds = $exam ? $exam->subjects()->pluck('subjects.id') : Subject::query()->pluck('id');
        $perSubject = max(1, (int) ceil($count / max(1, $subjectIds->count())));

        return $subjectIds
            ->flatMap(fn (int $subjectId) => Question::query()->live()->where('subject_id', $subjectId)->inRandomOrder()->limit($perSubject)->pluck('id'))
            ->shuffle()
            ->take($count)
            ->values()
            ->all();
    }

    /**
     * Due mistakes first, then other unresolved ones.
     *
     * @return list<int>
     */
    private static function pickMistakes(?User $user, int $count): array
    {
        if (! $user) {
            return [];
        }

        return Mistake::query()
            ->open()
            ->where('user_id', $user->id)
            ->whereHas('question', fn ($q) => $q->live())
            ->orderByRaw('next_review_at <= ? desc', [now()])
            ->orderBy('next_review_at')
            ->limit($count)
            ->pluck('question_id')
            ->all();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'question_ids' => 'array',
            'finished_at' => 'datetime',
        ];
    }
}
