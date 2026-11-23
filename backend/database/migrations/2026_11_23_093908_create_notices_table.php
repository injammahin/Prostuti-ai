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
        Schema::create('notices', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('title_bn')->nullable();
            $table->string('org', 100);
            $table->foreignId('exam_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type', 20)->default('circular')->index();
            $table->text('summary');
            $table->text('summary_bn')->nullable();
            $table->string('url')->nullable();
            $table->date('published_on');
            $table->date('apply_from')->nullable();
            $table->date('apply_until')->nullable();
            $table->date('exam_date')->nullable();
            $table->date('verified_on')->nullable();
            $table->json('changes')->nullable();
            $table->boolean('is_published')->default(true)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notices');
    }
};
