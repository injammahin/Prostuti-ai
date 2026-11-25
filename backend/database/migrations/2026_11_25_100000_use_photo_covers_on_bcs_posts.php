<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Switch the BCS articles from the old drawn covers (.svg) to the new ones (.jpg).
     * Covers uploaded in the admin panel are left alone.
     */
    public function up(): void
    {
        DB::table('posts')
            ->where('cover_image', 'like', '/covers/bcs/%.svg')
            ->update(['cover_image' => DB::raw("REPLACE(cover_image, '.svg', '.jpg')")]);

        // Featured like its neighbours, so the list runs 48th, 47th, 46th … in order.
        DB::table('posts')->where('slug', '42th-bcs-question-solution-pdf')->update(['is_featured' => true]);
    }

    public function down(): void
    {
        DB::table('posts')
            ->where('cover_image', 'like', '/covers/bcs/%.jpg')
            ->update(['cover_image' => DB::raw("REPLACE(cover_image, '.jpg', '.svg')")]);
    }
};
