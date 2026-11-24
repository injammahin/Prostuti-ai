<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The site is now called DreamPrep: new posts default to "DreamPrep Team" and existing ones are renamed.
     */
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('author', 100)->default('DreamPrep Team')->change();
        });

        DB::table('posts')->where('author', 'Prostuti Team')->update(['author' => 'DreamPrep Team']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('author', 100)->default('Prostuti Team')->change();
        });

        DB::table('posts')->where('author', 'DreamPrep Team')->update(['author' => 'Prostuti Team']);
    }
};
