<?php

namespace App\Models;

use Database\Factories\ReportFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A mistake a student reported in a question or a notice.
 */
#[Fillable(['user_id', 'target', 'target_ref', 'target_title', 'reason', 'note', 'resolved_at'])]
class Report extends Model
{
    /** @use HasFactory<ReportFactory> */
    use HasFactory;

    /** What can be reported, with the label shown in the admin panel. */
    public const TARGETS = ['question' => 'Question', 'notice' => 'Notice'];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The reported question or notice, if it still exists.
     */
    public static function findTarget(string $target, string $ref): Question|Notice|null
    {
        return match ($target) {
            'question' => Question::query()->find($ref),
            'notice' => Notice::query()->firstWhere('slug', $ref),
            default => null,
        };
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['resolved_at' => 'datetime'];
    }
}
