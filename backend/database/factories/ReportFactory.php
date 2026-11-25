<?php

namespace Database\Factories;

use App\Models\Report;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'target' => 'notice',
            'target_ref' => fake()->slug(3),
            'target_title' => fake()->sentence(),
            'reason' => 'Wrong date',
            'note' => null,
        ];
    }
}
