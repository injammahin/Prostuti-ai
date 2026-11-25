<?php

namespace Tests\Feature;

use App\Models\Exam;
use App\Models\Notice;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    use RefreshDatabase;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = storage_path('framework/testing/seo-'.uniqid());
        File::ensureDirectoryExists($this->folder);
        File::put("{$this->folder}/index.html", '<!doctype html><html lang="en"><head><title>Shell</title><meta name="description" content="Shell" /><meta name="robots" content="index, follow" /><meta property="og:title" content="Shell" /></head><body><div id="root"></div><script type="module" src="/assets/app.js"></script></body></html>');
        File::put("{$this->folder}/seo-content.json", json_encode([
            'faqs' => [['What is bd3schools?', 'A free website.']], 'features' => [], 'steps' => [],
            'exams' => [['slug' => 'ntrca', 'name' => 'NTRCA', 'nameBn' => 'এনটিআরসিএ', 'orgShort' => 'NTRCA', 'org' => 'NTRCA', 'summary' => 'Teacher exam.', 'syllabusVersion' => '2025', 'stages' => [['type' => 'MCQ', 'marks' => 100, 'duration' => '1 hour', 'negative' => '0.25', 'pass' => '40%', 'subjects' => [['Bangla', 'বাংলা', 25]]]]]],
            'legal' => ['updated' => '2026-11-25', 'pages' => ['about' => ['title' => ['About bd3schools', 'সম্পর্কে'], 'seo' => 'About Us | সম্পর্কে | bd3schools', 'description' => 'About us.', 'sections' => [['Who', 'কে', [['We are independent.', 'স্বাধীন']]]]]]],
        ]));
        config(['seo.shell' => "{$this->folder}/index.html", 'seo.site' => 'https://bd3schools.com']);
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->folder);
        parent::tearDown();
    }

    public function test_an_article_is_complete_in_the_html(): void
    {
        $post = Post::factory()->create(['slug' => 'my-guide', 'title' => 'My <b>guide</b>', 'meta_title' => 'My guide title', 'body' => '<p>The full article text.</p>', 'lang' => 'bn', 'is_published' => true, 'published_at' => now()->subDay()]);

        $html = $this->get('/blog/my-guide')->assertOk()->assertHeaderMissing('Set-Cookie')->getContent();

        $this->assertStringContainsString('<html lang="bn"', $html);
        $this->assertStringContainsString('<title>My guide title | bd3schools</title>', $html);
        $this->assertStringContainsString('<link rel="canonical" data-server href="https://bd3schools.com/blog/my-guide" />', $html);
        $this->assertStringContainsString('The full article text.', $html);
        $this->assertStringContainsString('My &lt;b&gt;guide&lt;/b&gt;</h1>', $html);
        $this->assertStringContainsString('src="/assets/app.js"', $html);
        $this->assertStringNotContainsString('>Shell<', $html);

        preg_match('#<script type="application/ld\+json" data-page>(.*?)</script>#s', $html, $ld);
        $this->assertSame(['Article', 'BreadcrumbList'], array_column(json_decode($ld[1], true)['@graph'], '@type'));
        preg_match('#id="server-data">(.*?)</script>#s', $html, $data);
        $this->assertSame($post->slug, json_decode($data[1], true)['data']['blog-my-guide']['data']['slug']);
    }

    public function test_pages_show_changes_made_in_the_admin_panel_at_once(): void
    {
        $post = Post::factory()->create(['slug' => 'a', 'body' => '<p>Old text</p>', 'is_published' => true, 'published_at' => now()->subDay()]);

        $this->get('/blog/a')->assertSee('Old text');
        $post->update(['body' => '<p>New text</p>']);
        $this->get('/blog/a')->assertSee('New text')->assertDontSee('Old text');
        $post->update(['is_published' => false]);
        $this->get('/blog/a')->assertNotFound();
    }

    public function test_a_notice_has_both_languages_and_its_official_link(): void
    {
        Exam::factory()->create(['slug' => 'ntrca']);
        $notice = Notice::factory()->create(['title' => 'Exam on 11 December', 'title_bn' => 'পরীক্ষা ১১ ডিসেম্বর', 'summary_bn' => 'বাংলা সারাংশ', 'url' => 'https://bpsc.gov.bd/x']);

        $this->get("/notices/{$notice->slug}")->assertOk()
            ->assertSee('<title>Exam on 11 December | পরীক্ষা ১১ ডিসেম্বর | bd3schools</title>', false)
            ->assertSee('বাংলা সারাংশ')
            ->assertSee('https://bpsc.gov.bd/x');
        $this->get('/notices')->assertOk()->assertSee('Exam on 11 December');
    }

    public function test_every_public_page_has_its_own_title_h1_and_canonical(): void
    {
        $titles = [];

        foreach (['/', '/blog', '/notices', '/calendar', '/exams', '/exams/ntrca', '/daily', '/about', '/contact'] as $path) {
            $html = $this->get($path)->assertOk()->getContent();
            preg_match('#<title>(.*?)</title>#', $html, $title);
            $titles[] = $title[1];
            $this->assertSame(1, substr_count($html, '<h1'), $path);
            $this->assertStringContainsString('<link rel="canonical" data-server href="https://bd3schools.com'.$path.'" />', $html);
        }

        $this->assertSame($titles, array_unique($titles));
    }

    public function test_unknown_pages_are_a_real_404_without_indexing(): void
    {
        foreach (['/nope', '/blog/nope', '/notices/nope', '/exams/nope', '/terms-old'] as $path) {
            $this->get($path)->assertNotFound()->assertSee('noindex', false)->assertDontSee('rel="canonical"', false);
        }
    }

    public function test_the_api_admin_and_app_are_left_alone(): void
    {
        $this->getJson('/api/v1/notices')->assertOk()->assertJsonStructure(['data']);
        $this->getJson('/api/v1/nope')->assertNotFound()->assertHeader('Content-Type', 'application/json');
        $this->get('/admin')->assertRedirect();
        $this->get('/admin/nope')->assertNotFound()->assertDontSee('id="root"', false);
        $this->get('/up')->assertOk();
        $this->get('/app/progress')->assertOk()->assertHeader('X-Robots-Tag', 'noindex')->assertSee('<div id="root"></div>', false);
        $this->get('/login')->assertOk()->assertSee('<div id="root"></div>', false);
    }
}
