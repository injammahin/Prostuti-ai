<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('password')->nullable()->change();
            $table->string('phone', 20)->nullable()->after('email');
            $table->string('google_id')->nullable()->unique()->after('phone');
            $table->string('avatar_url')->nullable()->after('google_id');
            $table->string('main_exam', 50)->default('bcs-general')->after('avatar_url');
            $table->boolean('is_admin')->default(false)->after('main_exam');
            $table->timestamp('last_login_at')->nullable()->after('is_admin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'google_id', 'avatar_url', 'main_exam', 'is_admin', 'last_login_at']);
            $table->string('password')->nullable(false)->change();
        });
    }
};
