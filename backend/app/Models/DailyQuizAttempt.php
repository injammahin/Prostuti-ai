<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One finished daily quiz, by a signed-in student or a guest (user_id null, known only by visitor_id).
 */
#[Fillable(['user_id', 'visitor_id', 'slot', 'score', 'total', 'seconds', 'source', 'referrer', 'device', 'browser', 'ip', 'created_at'])]
class DailyQuizAttempt extends Model
{
    public const UPDATED_AT = null;

    /**
     * Where a visitor came from, with a badge colour.
     *
     * @var array<string, array{0: string, 1: string}>
     */
    public const SOURCES = [
        'facebook' => ['Facebook', 'info'],
        'messenger' => ['Messenger', 'info'],
        'whatsapp' => ['WhatsApp', 'success'],
        'telegram' => ['Telegram', 'info'],
        'instagram' => ['Instagram', 'danger'],
        'youtube' => ['YouTube', 'danger'],
        'linkedin' => ['LinkedIn', 'info'],
        'twitter' => ['X / Twitter', 'gray'],
        'tiktok' => ['TikTok', 'gray'],
        'google' => ['Google search', 'warning'],
        'website' => ['Our website', 'primary'],
        'other' => ['Other website', 'gray'],
        'direct' => ['Direct / unknown', 'gray'],
    ];

    /**
     * The 12-hour quiz round a moment belongs to, e.g. "2026-11-25-am" (00:00–11:59) or "2026-11-25-pm".
     */
    public static function slotFor(?CarbonInterface $moment = null): string
    {
        $local = ($moment ?? now())->copy()->setTimezone(config('app.student_timezone') ?: 'Asia/Dhaka');

        return $local->format('Y-m-d').'-'.($local->hour < 12 ? 'am' : 'pm');
    }

    /**
     * "25 Nov · Morning" for "2026-11-25-am".
     */
    public static function slotLabel(?string $slot): string
    {
        if (! $slot || ! preg_match('/^(\d{4}-\d{2}-\d{2})-(am|pm)$/', $slot, $m)) {
            return $slot ?: '—';
        }

        return date('j M', strtotime($m[1])).' · '.($m[2] === 'am' ? 'Morning' : 'Evening');
    }

    /**
     * Name the platform a visitor came from, using the tag in the link, the referring site, or the in-app browser.
     */
    public static function sourceFrom(?string $tag, ?string $referrer, ?string $userAgent): string
    {
        $tag = strtolower(trim((string) $tag));
        $aliases = ['fb' => 'facebook', 'wa' => 'whatsapp', 'tg' => 'telegram', 'ig' => 'instagram', 'yt' => 'youtube', 'x' => 'twitter'];
        $tag = $aliases[$tag] ?? $tag;
        if ($tag !== '' && isset(self::SOURCES[$tag])) {
            return $tag;
        }

        $host = strtolower((string) (parse_url((string) $referrer, PHP_URL_HOST) ?: $referrer));
        if ($host !== '') {
            $byHost = [
                'messenger' => ['messenger.com', 'm.me'],
                'facebook' => ['facebook.com', 'fb.com', 'fb.me', 'fb.watch'],
                'whatsapp' => ['whatsapp.com', 'wa.me'],
                'telegram' => ['t.me', 'telegram.org', 'telegram.me'],
                'instagram' => ['instagram.com'],
                'youtube' => ['youtube.com', 'youtu.be'],
                'linkedin' => ['linkedin.com', 'lnkd.in'],
                'twitter' => ['twitter.com', 'x.com', 't.co'],
                'tiktok' => ['tiktok.com'],
                'google' => ['google.'],
            ];
            foreach ($byHost as $source => $needles) {
                foreach ($needles as $needle) {
                    if ($host === $needle || str_ends_with($host, '.'.$needle) || ($needle === 'google.' && str_contains($host, 'google.'))) {
                        return $source;
                    }
                }
            }

            $ownHost = parse_url((string) config('app.frontend_url'), PHP_URL_HOST);

            return $ownHost && ($host === $ownHost || str_ends_with($host, '.'.$ownHost)) ? 'website' : 'other';
        }

        // Social apps open links in their own browser and often send no referrer, but name themselves.
        $userAgent = (string) $userAgent;

        return match (true) {
            str_contains($userAgent, 'MESSENGER') || str_contains($userAgent, 'Messenger') => 'messenger',
            str_contains($userAgent, 'FBAN') || str_contains($userAgent, 'FBAV') || str_contains($userAgent, 'FB_IAB') => 'facebook',
            str_contains($userAgent, 'Instagram') => 'instagram',
            str_contains($userAgent, 'WhatsApp') => 'whatsapp',
            str_contains($userAgent, 'Telegram') => 'telegram',
            str_contains($userAgent, 'musical_ly') || str_contains($userAgent, 'TikTok') => 'tiktok',
            str_contains($userAgent, 'LinkedInApp') => 'linkedin',
            default => 'direct',
        };
    }

    public static function sourceLabel(?string $source): string
    {
        return self::SOURCES[$source ?? 'direct'][0] ?? str((string) $source)->headline()->toString();
    }

    public static function sourceColor(?string $source): string
    {
        return self::SOURCES[$source ?? 'direct'][1] ?? 'gray';
    }

    public function percent(): int
    {
        return $this->total > 0 ? (int) round($this->score / $this->total * 100) : 0;
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
            'score' => 'integer',
            'total' => 'integer',
            'seconds' => 'integer',
            'created_at' => 'datetime',
        ];
    }
}
