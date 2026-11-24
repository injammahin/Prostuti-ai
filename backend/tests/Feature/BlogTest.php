<?php

namespace Tests\Feature;

use App\Filament\Resources\Posts\PostResource;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BlogTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_blog_lists_only_published_posts_newest_first_without_the_full_text(): void
    {
        $older = Post::factory()->create(['published_at' => now()->subDays(3)]);
        $newer = Post::factory()->create(['published_at' => now()->subDay()]);
        Post::factory()->draft()->create();
        Post::factory()->scheduled()->create();

        $this->getJson(route('api.v1.posts'))
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.slug', $newer->slug)
            ->assertJsonPath('data.1.slug', $older->slug)
            ->assertJsonMissingPath('data.0.body');
    }

    public function test_an_article_shows_its_full_text_counts_a_view_and_suggests_related_posts(): void
    {
        $post = Post::factory()->create(['category' => 'bcs', 'body' => '<p>Full article.</p>']);
        $sameCategory = Post::factory()->create(['category' => 'bcs', 'published_at' => now()->subWeek()]);
        Post::factory()->create(['category' => 'bank']);

        $this->getJson(route('api.v1.posts.show', $post->slug))
            ->assertOk()
            ->assertJsonPath('data.body', '<p>Full article.</p>')
            ->assertJsonPath('data.meta_title', $post->title)
            ->assertJsonPath('related.0.slug', $sameCategory->slug)
            ->assertJsonCount(2, 'related');

        $this->assertSame(1, $post->fresh()->views);
    }

    public function test_admins_can_open_the_blog_screens_in_the_admin_panel(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $post = Post::factory()->create();

        $this->actingAs($admin)->get(PostResource::getUrl('index'))->assertOk()->assertSee($post->title);
        $this->actingAs($admin)->get(PostResource::getUrl('create'))->assertOk();
        $this->actingAs($admin)->get(PostResource::getUrl('edit', ['record' => $post]))->assertOk();
    }

    public function test_articles_are_served_as_safe_html_with_their_downloads(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('posts/files/syllabus.pdf', 'pdf-content');

        $post = Post::factory()->create([
            'body' => '<h2>Syllabus</h2><p>Read this.</p><script>alert(1)</script>',
            'attachments' => [['title' => 'BCS syllabus', 'file' => 'posts/files/syllabus.pdf']],
            'cover_image' => 'posts/covers/poster.jpg',
        ]);

        $response = $this->getJson(route('api.v1.posts.show', $post->slug))
            ->assertOk()
            ->assertJsonPath('data.attachments.0.title', 'BCS syllabus')
            ->assertJsonPath('data.attachments.0.type', 'PDF')
            ->assertJsonPath('data.attachments.0.size', 11)
            ->assertJsonPath('data.cover_image', Storage::disk('public')->url('posts/covers/poster.jpg'));

        $this->assertStringContainsString('<h2>Syllabus</h2>', $response->json('data.body'));
        $this->assertStringNotContainsString('<script', $response->json('data.body'));
    }

    public function test_featured_posts_come_first(): void
    {
        Post::factory()->create(['published_at' => now()->subHour()]);
        $featured = Post::factory()->create(['is_featured' => true, 'published_at' => now()->subMonth()]);

        $this->getJson(route('api.v1.posts'))->assertJsonPath('data.0.slug', $featured->slug);
    }

    public function test_drafts_and_scheduled_posts_cannot_be_opened(): void
    {
        $draft = Post::factory()->draft()->create();
        $scheduled = Post::factory()->scheduled()->create();

        $this->getJson(route('api.v1.posts.show', $draft->slug))->assertNotFound();
        $this->getJson(route('api.v1.posts.show', $scheduled->slug))->assertNotFound();
    }
}
