<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The job circular template: the organisation's Bangla name, one row per post, and the online application link
     * (kept apart from the official source). The "ministry" section becomes "govt".
     */
    public function up(): void
    {
        Schema::table('notices', function (Blueprint $table) {
            $table->string('org_bn', 150)->nullable()->after('org');
            $table->json('posts')->nullable()->after('post_name');
            $table->string('apply_url')->nullable()->after('url');
        });

        DB::table('notices')->where('category', 'ministry')->update(['category' => 'govt']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('notices')->where('category', 'govt')->update(['category' => 'ministry']);

        Schema::table('notices', function (Blueprint $table) {
            $table->dropColumn(['org_bn', 'posts', 'apply_url']);
        });
    }
};
