<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

/**
 * A short-lived 6-digit code emailed to verify an address when registering or resetting a password.
 */
#[Fillable(['email', 'purpose', 'code_hash', 'attempts', 'expires_at', 'used_at'])]
#[Hidden(['code_hash'])]
class LoginCode extends Model
{
    public const MAX_ATTEMPTS = 5;

    public const LIFETIME_MINUTES = 10;

    public const PURPOSE_REGISTER = 'register';

    public const PURPOSE_RESET = 'reset';

    /**
     * Create a fresh code for the email and purpose, invalidating any earlier unused ones.
     *
     * @return array{0: self, 1: string} The stored record and the plain 6-digit code.
     */
    public static function issueFor(string $email, string $purpose): array
    {
        static::query()->where('email', $email)->where('purpose', $purpose)->whereNull('used_at')->delete();

        $plainCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $loginCode = static::query()->create([
            'email' => $email,
            'purpose' => $purpose,
            'code_hash' => Hash::make($plainCode),
            'expires_at' => now()->addMinutes(self::LIFETIME_MINUTES),
        ]);

        return [$loginCode, $plainCode];
    }

    /**
     * Check the newest usable code for the email and purpose, consuming it on success.
     */
    public static function check(string $email, string $purpose, string $plainCode): bool
    {
        $loginCode = static::query()
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->latest('id')
            ->first();

        return $loginCode !== null && $loginCode->attempt($plainCode);
    }

    /**
     * Check the code, counting the attempt and consuming it on success.
     */
    public function attempt(string $plainCode): bool
    {
        if ($this->attempts >= self::MAX_ATTEMPTS) {
            return false;
        }

        $this->increment('attempts');

        if (! Hash::check($plainCode, $this->code_hash)) {
            return false;
        }

        $this->update(['used_at' => now()]);

        return true;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'used_at' => 'datetime',
        ];
    }
}
