<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Only the ADMIN_EMAIL account from .env stays an admin; every other admin flag is removed.
     */
    public function up(): void
    {
        $adminEmail = strtolower(trim((string) config('app.admin.email')));

        DB::table('users')
            ->when($adminEmail !== '', fn ($query) => $query->whereRaw('lower(email) <> ?', [$adminEmail]))
            ->where('is_admin', true)
            ->update(['is_admin' => false]);

        if ($adminEmail !== '') {
            DB::table('users')->whereRaw('lower(email) = ?', [$adminEmail])->update(['is_admin' => true]);
        }
    }

    /**
     * Removed admin flags are not restored.
     */
    public function down(): void
    {
        //
    }
};
