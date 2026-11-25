<?php

namespace Tests\Feature;

use App\Models\Exam;
use App\Models\Post;
use App\Models\Question;
use App\Models\Subject;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class ExamPagesTest extends TestCase
{
    use RefreshDatabase;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = storage_path('framework/testing/exam-pages-'.uniqid());
        File::ensureDirectoryExists($this->folder);
        File::put("{$this->folder}/index.html", '<!doctype html><html lang="en"><head><title>Shell</title><meta name="description" content="Shell" /><meta name="robots" content="index, follow" /></head><body><div id="root"></div></body></html>');
        File::put("{$this->folder}/seo-content.json", json_encode(['exams' => [], 'legal' => ['updated' => '2026-11-25', 'pages' => []]]));
        config(['seo.shell' => "{$this->folder}/index.html", 'seo.site' => 'https://bd3schools.com']);
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->folder);
        parent::tearDown();
    }

    /** A 41st BCS with enough questions to be shown in search results. */
    private function paper(): Subject
    {
        $subject = Subject::factory()->create(['slug' => 'bd-affairs', 'name' => 'Bangladesh Affairs', 'name_bn' => 'বাংলাদেশ বিষয়াবলি']);

        foreach (range(1, 20) as $number) {
            Question::factory()->create(['ref' => "bcs41_q{$number}", 'source' => '41st BCS', 'subject_id' => $subject->id, 'status' => 'live', 'lang' => 'bn', 'body' => "প্রশ্ন নম্বর {$number} <b>", 'options' => ['এক', 'দুই', 'তিন', 'চার'], 'answer_index' => 2, 'explanation' => "এই উত্তরটি সঠিক হওয়ার বিস্তারিত ব্যাখ্যা {$number}।"]);
        }

        return $subject;
    }

    public function test_a_paper_page_shows_every_question_with_its_answer(): void
    {
        $this->paper();

        $html = $this->get('/bcs/41st-bcs-question-solution')->assertOk()->assertHeaderMissing('Set-Cookie')->getContent();

        $this->assertStringContainsString('<html lang="bn"', $html);
        $this->assertStringContainsString('<link rel="canonical" data-server href="https://bd3schools.com/bcs/41st-bcs-question-solution" />', $html);
        $this->assertStringContainsString('index, follow', $html);
        $this->assertSame(20, substr_count($html, 'class="qa"'));
        $this->assertStringContainsString('প্রশ্ন নম্বর 1 &lt;b&gt;', $html);
        $this->assertStringContainsString('সঠিক উত্তর: গ) তিন', $html);
        $this->assertStringContainsString('বিস্তারিত ব্যাখ্যা 20।', $html);
        $this->assertStringContainsString('/bcs/subject/bangladesh-affairs', $html);

        $this->get('/bcs')->assertOk()->assertSee('/bcs/41st-bcs-question-solution', false);
        $this->get('/bcs/subject/bangladesh-affairs')->assertOk()->assertSee('প্রশ্ন নম্বর 7', false);
        $this->get('/bcs/40th-bcs-question-solution')->assertNotFound();
        $this->get('/bcs/subject/nothing')->assertNotFound();
    }

    public function test_old_addresses_lead_to_the_new_page(): void
    {
        $this->get('/blog/41th-bcs-question-solution-pdf')->assertStatus(301)->assertRedirect('/bcs/41st-bcs-question-solution');
        $this->get('/bcs/41')->assertStatus(301)->assertRedirect('/bcs/41st-bcs-question-solution');
        $this->get('/bcs/41th-bcs-question-solution')->assertStatus(301)->assertRedirect('/bcs/41st-bcs-question-solution');
        $this->get('/quiz')->assertStatus(301)->assertRedirect('/daily');
        $this->get('/blog/99th-bcs-question-solution-pdf')->assertNotFound();
    }

    public function test_an_explanation_copied_from_another_site_is_never_shown(): void
    {
        $this->paper();
        Question::query()->where('ref', 'bcs41_q3')->firstOrFail()->update(['explanation' => 'বিস্তারিত দেখুন Live MCQ অ্যাপে, সব ব্যাখ্যা সেখানে আছে।']);

        $this->get('/bcs/41st-bcs-question-solution')->assertOk()->assertDontSee('Live MCQ');
        $this->getJson('/api/v1/past-papers/41')->assertOk()->assertDontSee('Live MCQ')->assertJsonPath('questions.2.explanation', null);
    }

    public function test_pages_show_a_changed_question_at_once(): void
    {
        $this->paper();
        $this->get('/bcs/41st-bcs-question-solution')->assertOk();

        Question::query()->where('ref', 'bcs41_q5')->firstOrFail()->update(['body' => 'সংশোধিত প্রশ্ন']);

        $this->get('/bcs/41st-bcs-question-solution')->assertSee('সংশোধিত প্রশ্ন', false);
    }

    public function test_a_hub_with_few_questions_is_kept_out_of_search_and_the_sitemap(): void
    {
        Exam::factory()->create(['slug' => 'ntrca']);

        $this->get('/ntrca')->assertOk()->assertSee('noindex, follow', false);
        $this->get('/sitemap-pages.xml')->assertOk()->assertDontSee('/ntrca</loc>', false);
    }

    public function test_the_sitemap_lists_only_final_addresses_with_their_dates(): void
    {
        $this->paper();
        Post::factory()->create(['slug' => '41th-bcs-question-solution-pdf', 'is_published' => true, 'published_at' => now()->subDay()]);
        Post::factory()->create(['slug' => 'my-guide', 'is_published' => true, 'published_at' => now()->subDay()]);

        $this->get('/sitemap.xml')->assertOk()->assertHeader('Content-Type', 'application/xml; charset=utf-8')->assertSee('https://bd3schools.com/sitemap-bcs.xml', false);
        $this->get('/sitemap-blog.xml')->assertSee('/blog/my-guide</loc>', false)->assertDontSee('41th-bcs', false);
        $this->get('/sitemap-bcs.xml')->assertSee('/bcs/41st-bcs-question-solution</loc><lastmod>', false);
        $this->get('/sitemap-other.xml')->assertNotFound();
    }

    public function test_the_website_can_load_a_page_without_a_reload(): void
    {
        $this->paper();

        $this->getJson('/api/v1/pages?path=/bcs/41st-bcs-question-solution')->assertOk()
            ->assertJsonPath('path', '/bcs/41st-bcs-question-solution')
            ->assertJsonPath('json_ld.@graph.0.@type', 'Article');
        $this->getJson('/api/v1/pages?path=/bcs/40th-bcs-question-solution')->assertNotFound();
        $this->getJson('/api/v1/pages?path=https://example.com')->assertUnprocessable();
    }

    public function test_reading_an_article_does_not_change_when_it_was_updated(): void
    {
        $post = Post::factory()->create(['slug' => 'my-guide', 'is_published' => true, 'published_at' => now()->subWeek(), 'updated_at' => now()->subDay()]);

        $this->travel(1)->hours();
        $this->getJson('/api/v1/posts/my-guide')->assertOk();

        $this->assertEquals($post->updated_at->timestamp, $post->fresh()->updated_at->timestamp);
    }

    public function test_an_api_request_without_a_sign_in_gets_401(): void
    {
        $this->get('/api/v1/me')->assertUnauthorized();
    }
}
