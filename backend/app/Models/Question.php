<?php

namespace App\Models;

use Database\Factories\QuestionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A multiple-choice question. Only questions with status "live" are ever shown to students.
 */
#[Fillable(['ref', 'subject_id', 'exam_id', 'topic', 'difficulty', 'source', 'lang', 'body', 'options', 'answer_index', 'explanation', 'status'])]
class Question extends Model
{
    /** @use HasFactory<QuestionFactory> */
    use HasFactory;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_VERIFIED = 'verified';

    public const STATUS_LIVE = 'live';

    /**
     * @var array<string, string>
     */
    public const STATUSES = [
        self::STATUS_DRAFT => 'Draft',
        self::STATUS_VERIFIED => 'Verified',
        self::STATUS_LIVE => 'Live',
    ];

    /**
     * @var array<string, string>
     */
    public const DIFFICULTIES = [
        'easy' => 'Easy',
        'medium' => 'Medium',
        'hard' => 'Hard',
    ];

    /**
     * @return BelongsTo<Subject, $this>
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * @return BelongsTo<Exam, $this>
     */
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeLive(Builder $query): void
    {
        $query->where('status', self::STATUS_LIVE);
    }

    /**
     * Questions that belong to the given exam's syllabus (its subjects).
     *
     * @param  Builder<self>  $query
     */
    public function scopeForExam(Builder $query, ?Exam $exam): void
    {
        if ($exam) {
            $query->whereIn('subject_id', $exam->subjects()->pluck('subjects.id'));
        }
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'options' => 'array',
            'answer_index' => 'integer',
        ];
    }
}
