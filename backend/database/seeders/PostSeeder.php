<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Add the starter blog articles. Posts that already exist are left alone,
     * so edits made in the admin panel survive running the seeder again.
     */
    public function run(): void
    {
        $posts = json_decode(file_get_contents(database_path('seeders/data/posts.json')), true, flags: JSON_THROW_ON_ERROR);

        foreach ($posts as $index => $post) {
            Post::query()->firstOrCreate(['slug' => $post['slug']], [
                ...$post,
                'published_at' => now()->subDays(count($posts) - $index)->startOfDay()->addHours(9),
                'is_published' => true,
            ]);
        }
    }
}
