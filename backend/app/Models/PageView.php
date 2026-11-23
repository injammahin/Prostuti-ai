<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One page opened on the website by a visitor (guest or signed in).
 */
#[Fillable(['visitor_id', 'user_id', 'path', 'referrer', 'device', 'browser', 'created_at'])]
class PageView extends Model
{
    public const UPDATED_AT = null;

    /**
     * @var array<string, string>
     */
    public const DEVICES = ['mobile' => 'Mobile', 'tablet' => 'Tablet', 'desktop' => 'Desktop'];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Rough device type from the browser's user-agent string.
     */
    public static function deviceFrom(?string $userAgent): string
    {
        $userAgent = strtolower((string) $userAgent);

        return match (true) {
            str_contains($userAgent, 'ipad'), str_contains($userAgent, 'tablet') => 'tablet',
            str_contains($userAgent, 'mobi'), str_contains($userAgent, 'android') => 'mobile',
            default => 'desktop',
        };
    }

    /**
     * Browser name from the user-agent string.
     */
    public static function browserFrom(?string $userAgent): ?string
    {
        $userAgent = (string) $userAgent;

        return match (true) {
            str_contains($userAgent, 'Edg/') => 'Edge',
            str_contains($userAgent, 'OPR/'), str_contains($userAgent, 'Opera') => 'Opera',
            str_contains($userAgent, 'SamsungBrowser') => 'Samsung Internet',
            str_contains($userAgent, 'Chrome/') => 'Chrome',
            str_contains($userAgent, 'Firefox/') => 'Firefox',
            str_contains($userAgent, 'Safari/') => 'Safari',
            default => null,
        };
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['created_at' => 'datetime'];
    }
}
