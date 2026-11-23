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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->string('ref', 60)->nullable()->unique();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exam_id')->nullable()->constrained()->nullOnDelete();
            $table->string('topic')->nullable();
            $table->string('difficulty', 10)->default('medium');
            $table->string('source')->nullable();
            $table->string('lang', 2)->default('bn');
            $table->text('body');
            $table->json('options');
            $table->unsignedTinyInteger('answer_index');
            $table->text('explanation')->nullable();
            $table->string('status', 10)->default('draft')->index();
            $table->timestamps();

            $table->index(['status', 'subject_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
