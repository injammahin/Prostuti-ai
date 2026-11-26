<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;

/**
 * Something a visitor or student did (signed up, finished a practice, took the daily quiz…).
 */
#[Fillable(['user_id', 'visitor_id', 'action', 'description', 'properties', 'ip', 'created_at'])]
class ActivityLog extends Model
{
    public const UPDATED_AT = null;

    /**
     * Human labels and badge colours for each action.
     *
     * @var array<string, array{0: string, 1: string}>
     */
    public const ACTIONS = [
        'auth.registered' => ['Signed up', 'success'],
        'auth.login' => ['Logged in', 'info'],
        'auth.google' => ['Google sign-in', 'info'],
        'auth.password_reset' => ['Reset password', 'warning'],
        'auth.logout' => ['Logged out', 'gray'],
        'profile.updated' => ['Updated profile', 'gray'],
        'practice.started' => ['Started practice', 'primary'],
        'practice.finished' => ['Finished practice', 'success'],
        'daily_quiz.completed' => ['Daily quiz', 'warning'],
        'admin.impersonated' => ['Admin logged in as', 'danger'],
    ];

    /**
     * Record an activity. The visitor id comes from the X-Visitor-Id header the website sends.
     *
     * @param  array<string, mixed>  $properties
     */
    public static function record(string $action, string $description, ?User $user = null, array $properties = [], ?Request $request = null): self
    {
        $request ??= request();
        $visitorId = $request->header('X-Visitor-Id');

        return static::query()->create([
            'user_id' => $user?->id,
            'visitor_id' => is_string($visitorId) && strlen($visitorId) <= 36 ? $visitorId : null,
            'action' => $action,
            'description' => $description,
            'properties' => $properties ?: null,
            'ip' => $request->ip(),
        ]);
    }

    public static function labelFor(string $action): string
    {
        return self::ACTIONS[$action][0] ?? str($action)->replace(['.', '_'], ' ')->headline()->toString();
    }

    public static function colorFor(string $action): string
    {
        return self::ACTIONS[$action][1] ?? 'gray';
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'properties' => 'array',
            'created_at' => 'datetime',
        ];
    }
}
