<?php

namespace Database\Factories;

use App\Models\PracticeSession;
use App\Models\Question;
use App\Models\SessionAnswer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SessionAnswer>
 */
class SessionAnswerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'practice_session_id' => PracticeSession::factory(),
            'question_id' => Question::factory(),
            'chosen_index' => 0,
            'is_correct' => true,
        ];
    }
}
