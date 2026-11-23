<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Create (or reset) the owner's admin account.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'mahin@gmail.com'],
            [
                'name' => 'Mahin Rahman',
                'password' => '123456',
                'is_admin' => true,
                'email_verified_at' => now(),
            ],
        );
    }
}
