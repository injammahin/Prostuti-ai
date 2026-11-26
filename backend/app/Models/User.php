<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * There is exactly one admin: the account whose email is ADMIN_EMAIL in .env. Nobody can be made admin
 * from the panel or the API (is_admin is not fillable, and the flag only counts for that email).
 */
#[Fillable(['name', 'email', 'password', 'phone', 'google_id', 'avatar_url', 'main_exam', 'last_login_at'])]
#[Hidden(['password', 'remember_token', 'google_id'])]
class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The admin email from .env, lower-cased ("" when not set).
     */
    public static function adminEmail(): string
    {
        return strtolower(trim((string) config('app.admin.email')));
    }

    public static function isAdminEmail(?string $email): bool
    {
        $adminEmail = self::adminEmail();

        return $adminEmail !== '' && hash_equals($adminEmail, strtolower(trim((string) $email)));
    }

    /**
     * Only the .env admin account may open the Filament admin panel.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_admin;
    }

    /**
     * Admin only when the stored flag is set and the email is the .env admin email.
     *
     * @return Attribute<bool, bool>
     */
    protected function isAdmin(): Attribute
    {
        return Attribute::get(fn ($value): bool => (bool) $value && self::isAdminEmail($this->email));
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
