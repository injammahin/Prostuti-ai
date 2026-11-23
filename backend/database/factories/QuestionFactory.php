<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'subject_id' => Subject::factory(),
            'topic' => fake()->word(),
            'difficulty' => 'medium',
            'source' => '45th BCS',
            'lang' => 'en',
            'body' => fake()->sentence().'?',
            'options' => ['Option A', 'Option B', 'Option C', 'Option D'],
            'answer_index' => fake()->numberBetween(0, 3),
            'explanation' => fake()->sentence(),
            'status' => Question::STATUS_LIVE,
        ];
    }
}
