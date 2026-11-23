<?php

namespace Database\Factories;

use App\Models\Notice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Notice>
 */
class NoticeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => fake()->unique()->slug(4),
            'title' => fake()->sentence(6),
            'org' => 'BPSC',
            'type' => 'circular',
            'summary' => fake()->paragraph(),
            'published_on' => now()->subDay()->toDateString(),
            'is_published' => true,
        ];
    }
}
