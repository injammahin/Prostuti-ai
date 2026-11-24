<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * When a question was last changed after it was created (admin edit, publish, ...).
     * The catalog seeder leaves such questions alone so re-seeding never undoes a fix.
     */
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->timestamp('curated_at')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('curated_at');
        });
    }
};
