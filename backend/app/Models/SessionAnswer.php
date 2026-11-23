<?php

namespace App\Models;

use Database\Factories\SessionAnswerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['practice_session_id', 'user_id', 'question_id', 'chosen_index', 'is_correct', 'time_ms'])]
class SessionAnswer extends Model
{
    /** @use HasFactory<SessionAnswerFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<PracticeSession, $this>
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(PracticeSession::class, 'practice_session_id');
    }

    /**
     * @return BelongsTo<Question, $this>
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
            'chosen_index' => 'integer',
        ];
    }
}
