<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Details of the job, for the summary table on a notice's page. All optional; existing notices are not changed.
     */
    public function up(): void
    {
        Schema::table('notices', function (Blueprint $table) {
            $table->string('category', 20)->nullable()->after('type');
            $table->string('status', 20)->nullable()->after('category');
            $table->string('post_name', 500)->nullable();
            $table->string('vacancies', 100)->nullable();
            $table->text('eligibility')->nullable();
            $table->string('age_limit')->nullable();
            $table->string('fee')->nullable();
            $table->text('how_to_apply')->nullable();
            $table->string('attachment')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notices', function (Blueprint $table) {
            $table->dropColumn(['category', 'status', 'post_name', 'vacancies', 'eligibility', 'age_limit', 'fee', 'how_to_apply', 'attachment']);
        });
    }
};
