<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModelTest extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'syllabus' => 'array',
        'questions_data' => 'array',
        'total_marks' => 'decimal:2',
        'pass_marks' => 'decimal:2',
        'negative_marking' => 'decimal:2',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class, 'exam_id');
    }

    /** The exam's slug in the catalogue; tests group exams as "bank" and "primary". */
    public function catalogExamSlug(): string
    {
        return match ($this->exam_slug) {
            'bank' => str_starts_with((string) $this->slug, 'bb-') ? 'bangladesh-bank' : 'combined-bank',
            'primary' => 'primary-teacher',
            default => $this->exam_slug,
        };
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
