<?php

namespace App\Models;

use Database\Factories\NoticeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A job circular, exam date, admit card, result or other official update shown on the website.
 * Its dates also feed the "Exam dates" calendar.
 */
#[Fillable(['slug', 'title', 'title_bn', 'org', 'exam_id', 'type', 'summary', 'summary_bn', 'url', 'published_on', 'apply_from', 'apply_until', 'exam_date', 'verified_on', 'changes', 'is_published'])]
class Notice extends Model
{
    /** @use HasFactory<NoticeFactory> */
    use HasFactory;

    /**
     * @var array<string, string>
     */
    public const TYPES = [
        'circular' => 'Job circular',
        'deadline' => 'Deadline extended',
        'admit' => 'Admit card',
        'schedule' => 'Exam date',
        'seat' => 'Seat plan',
        'syllabus' => 'Syllabus change',
        'result' => 'Result',
        'viva' => 'Viva schedule',
        'other' => 'Other',
    ];

    /** Notices published within this many days are marked "New". */
    public const NEW_FOR_DAYS = 14;

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
    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', true)->where('published_on', '<=', now()->toDateString());
    }

    /**
     * The shape the website expects (same fields as the original sample data).
     *
     * @return array<string, mixed>
     */
    public function toWebsite(): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'title_bn' => $this->title_bn,
            'org' => $this->org,
            'exam' => $this->exam?->slug,
            'type' => $this->type,
            'published' => $this->published_on?->toDateString(),
            'applyFrom' => $this->apply_from?->toDateString(),
            'applyUntil' => $this->apply_until?->toDateString(),
            'examDate' => $this->exam_date?->toDateString(),
            'verifiedAt' => $this->verified_on?->toDateString(),
            'summary' => $this->summary,
            'summary_bn' => $this->summary_bn,
            'url' => $this->url,
            'changes' => $this->changes ?? [],
            'isNew' => $this->published_on !== null && $this->published_on->gte(now()->subDays(self::NEW_FOR_DAYS)->startOfDay()),
        ];
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_on' => 'date',
            'apply_from' => 'date',
            'apply_until' => 'date',
            'exam_date' => 'date',
            'verified_on' => 'date',
            'changes' => 'array',
            'is_published' => 'boolean',
        ];
    }
}
