<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Make sure the owner's admin account exists, using ADMIN_EMAIL / ADMIN_PASSWORD
     * from .env. An existing account keeps its password, so running the seeder again
     * never resets it. Without ADMIN_PASSWORD a random one is created and printed once.
     */
    public function run(): void
    {
        $email = Str::lower((string) config('app.admin.email'));

        if ($email === '') {
            $this->command?->warn('ADMIN_EMAIL is not set in .env — no admin account created.');

            return;
        }

        $user = User::query()->where('email', $email)->first();

        if ($user) {
            $updates = [];
            if (! $user->is_admin) {
                $updates['is_admin'] = true;
            }
            $password = (string) config('app.admin.password');
            if ($password !== '') {
                $updates['password'] = $password;
            }
            if ($updates !== []) {
                $user->forceFill($updates)->save();
            }

            return;
        }

        $password = (string) config('app.admin.password');
        $generated = $password === '';

        if ($generated) {
            $password = Str::password(16, symbols: false);
        }

        User::query()->create([
            'name' => (string) config('app.admin.name'),
            'email' => $email,
            'password' => $password,
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        $this->command?->info("Admin account created: {$email}");

        if ($generated) {
            $this->command?->warn("Generated admin password (shown once, change it after signing in): {$password}");
        }
    }
}
