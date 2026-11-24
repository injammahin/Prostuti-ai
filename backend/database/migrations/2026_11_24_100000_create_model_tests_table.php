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
        Schema::create('model_tests', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('title_bn')->nullable();
            $table->string('slug')->unique();
            $table->foreignId('exam_id')->nullable()->constrained('exams')->nullOnDelete();
            $table->string('exam_slug')->default('bcs-general');
            $table->string('type')->default('full'); // full, subject, speed_drill
            $table->integer('duration_minutes')->default(120);
            $table->decimal('total_marks', 6, 2)->default(200);
            $table->decimal('pass_marks', 6, 2)->default(100);
            $table->decimal('negative_marking', 4, 2)->default(0.50);
            $table->integer('total_questions')->default(200);
            $table->json('syllabus')->nullable();
            $table->json('questions_data')->nullable(); // full 200 questions payload
            $table->string('difficulty')->default('standard'); // standard, challenging, moderate
            $table->string('status')->default('published'); // published, draft, scheduled
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->unsignedInteger('attempts_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('model_tests');
    }
};
