<?php

use App\Models\DailyQuizAttempt;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('daily_quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('visitor_id', 36)->nullable()->index();
            $table->string('slot', 16)->index();
            $table->unsignedTinyInteger('score');
            $table->unsignedTinyInteger('total');
            $table->unsignedInteger('seconds')->nullable();
            $table->string('source', 20)->nullable()->index();
            $table->string('referrer')->nullable();
            $table->string('device', 10)->nullable();
            $table->string('browser', 30)->nullable();
            $table->string('ip', 45)->nullable();
            $table->timestamp('created_at')->useCurrent()->index();
        });

        // Bring in the quizzes already finished (they were only kept in the activity log).
        DB::table('activity_logs')
            ->where('action', 'daily_quiz.completed')
            ->orderBy('id')
            ->chunk(500, function ($logs): void {
                $rows = [];
                foreach ($logs as $log) {
                    $props = json_decode((string) $log->properties, true) ?: [];
                    if (! isset($props['score'], $props['total'])) {
                        continue;
                    }
                    $rows[] = [
                        'user_id' => $log->user_id,
                        'visitor_id' => $log->visitor_id,
                        'slot' => DailyQuizAttempt::slotFor(Carbon::parse($log->created_at, 'UTC')),
                        'score' => (int) $props['score'],
                        'total' => (int) $props['total'],
                        'seconds' => isset($props['seconds']) ? (int) $props['seconds'] : null,
                        'ip' => $log->ip,
                        'created_at' => $log->created_at,
                    ];
                }
                if ($rows) {
                    DB::table('daily_quiz_attempts')->insert($rows);
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_quiz_attempts');
    }
};
