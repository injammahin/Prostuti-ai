<?php

use App\Services\PageShell;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /** The 20 guides of blog batch 2 (26 Nov 2026), stored in seeders/data/posts.json. */
    private const SLUGS = [
        'bcs-preparation-during-honours',
        'bcs-bangla-literature-preparation',
        'bangla-grammar-for-job-exams',
        'bcs-english-grammar-preparation',
        'english-literature-authors-works',
        'bcs-bangladesh-affairs-preparation',
        'bcs-international-affairs-preparation',
        'bcs-general-science-preparation',
        'bcs-geography-disaster-management',
        'bcs-ethics-good-governance',
        'bcs-written-exam-preparation',
        'bcs-written-english-tips',
        'bank-job-english-preparation',
        'bank-written-focus-writing',
        'banking-terms-for-bank-exams',
        'bank-job-viva-questions',
        'primary-teacher-recruitment-preparation',
        'ntrca-preparation-guide',
        'how-to-apply-govt-jobs-teletalk',
        'how-to-download-admit-card',
    ];

    /**
     * Add the new posts. Every post already on the site (and any of these already added) is left exactly as it is.
     */
    public function up(): void
    {
        // Content, not structure: test databases start empty.
        if (app()->runningUnitTests()) {
            return;
        }

        $posts = collect(json_decode((string) file_get_contents(database_path('seeders/data/posts.json')), true, flags: JSON_THROW_ON_ERROR))
            ->whereIn('slug', self::SLUGS);
        $existing = DB::table('posts')->whereIn('slug', self::SLUGS)->pluck('slug')->all();
        $now = now();

        foreach ($posts as $post) {
            if (in_array($post['slug'], $existing, true)) {
                continue;
            }

            DB::table('posts')->insert([
                'slug' => $post['slug'],
                'title' => $post['title'],
                'category' => $post['category'],
                'lang' => $post['lang'],
                'excerpt' => $post['excerpt'],
                'body' => $post['body'],
                'cover_image' => $post['cover_image'],
                'author' => $post['author'],
                'tags' => json_encode($post['tags'], JSON_UNESCAPED_UNICODE),
                'meta_title' => $post['meta_title'],
                'meta_description' => $post['meta_description'],
                'is_featured' => false,
                'is_published' => true,
                'published_at' => $post['published_at'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        PageShell::refresh();
    }

    /**
     * Remove only these 20 posts.
     */
    public function down(): void
    {
        DB::table('posts')->whereIn('slug', self::SLUGS)->delete();
    }
};
