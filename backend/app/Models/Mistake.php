<?php

namespace App\Models;

use Database\Factories\MistakeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A question the student got wrong. It comes back for review until they answer it correctly.
 */
#[Fillable(['user_id', 'question_id', 'wrong_count', 'next_review_at', 'resolved_at'])]
class Mistake extends Model
{
    /** @use HasFactory<MistakeFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Question, $this>
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeOpen(Builder $query): void
    {
        $query->whereNull('resolved_at');
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeDue(Builder $query): void
    {
        $query->whereNull('resolved_at')->where('next_review_at', '<=', now());
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'next_review_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }
}
