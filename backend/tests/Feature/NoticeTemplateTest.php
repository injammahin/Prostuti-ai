<?php

namespace Tests\Feature;

use App\Filament\Resources\Notices\Pages\EditNotice;
use App\Models\Exam;
use App\Models\Notice;
use App\Models\User;
use App\Services\PageShell;
use Filament\Actions\Testing\TestAction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Livewire\Livewire;
use Tests\TestCase;

class NoticeTemplateTest extends TestCase
{
    use RefreshDatabase;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = storage_path('framework/testing/template-'.uniqid());
        File::ensureDirectoryExists($this->folder);
        File::put("{$this->folder}/index.html", '<!doctype html><html lang="en"><head><title>Shell</title><meta name="description" content="Shell" /><meta name="robots" content="index, follow" /></head><body><div id="root"></div></body></html>');
        File::put("{$this->folder}/seo-content.json", json_encode(['exams' => [['slug' => 'combined-bank', 'name' => 'Combined Bank Jobs']]]));
        config(['seo.shell' => "{$this->folder}/index.html", 'seo.site' => 'https://bd3schools.com']);
        $this->travelTo(now()->setDate(2026, 11, 26)->setTime(10, 0));
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->folder);
        parent::tearDown();
    }

    private function circular(array $attributes = []): Notice
    {
        return Notice::query()->forceCreate([
            'org' => 'Bangladesh Bank',
            'org_bn' => 'বাংলাদেশ ব্যাংক',
            'title' => 'Assistant Director (General) posts',
            'type' => 'circular',
            'summary' => 'Bangladesh Bank is hiring Assistant Directors.',
            'summary_bn' => 'বাংলাদেশ ব্যাংক সহকারী পরিচালক নিয়োগ দেবে।',
            'posts' => [['name' => 'Assistant Director (General)', 'grade' => '9th', 'vacancies' => '150'], ['name' => 'Officer (Cash)', 'grade' => '10th', 'vacancies' => '50']],
            'apply_from' => '2026-11-20',
            'apply_until' => '2026-12-10',
            'url' => 'https://www.bb.org.bd/career/circular.pdf',
            'apply_url' => 'https://erecruitment.bb.org.bd',
            'published_on' => '2026-11-20',
            'is_published' => true,
            ...$attributes,
        ]);
    }

    public function test_a_circular_gets_its_permanent_slug_bilingual_title_heading_and_description(): void
    {
        $notice = $this->circular();
        $second = $this->circular(['title' => 'Another Bangladesh Bank circular']);

        $this->assertSame('bangladesh-bank-job-circular-2026', $notice->slug);
        $this->assertSame('bangladesh-bank-job-circular-2026-2', $second->slug);
        $this->assertSame('200', $notice->totalVacancies());

        $description = $notice->metaDescription();
        $this->assertLessThanOrEqual(160, mb_strlen($description));
        $this->assertGreaterThan(100, mb_strlen($description));
        $this->assertStringContainsString('Bangladesh Bank Job Circular 2026', $description);
        $this->assertStringContainsString('বাংলাদেশ ব্যাংক নিয়োগ ২০২৬', $description);

        $html = $this->get('/notices/bangladesh-bank-job-circular-2026')->assertOk()
            ->assertSee('<title>বাংলাদেশ ব্যাংক নিয়োগ বিজ্ঞপ্তি ২০২৬ | Bangladesh Bank Job Circular 2026 | bd3schools</title>', false)
            ->assertSee('বাংলাদেশ ব্যাংক নিয়োগ বিজ্ঞপ্তি ২০২৬ | Bangladesh Bank Job Circular 2026</h1>', false)
            ->assertSee('Officer (Cash)')->assertSee('10th')
            ->assertSee('Total vacancies')->assertSee('200')
            ->assertSee('Apply online')->assertSee('https://erecruitment.bb.org.bd', false)
            ->assertSee('Application open')
            ->assertSee('href="/exams/combined-bank"', false)->assertSee('href="/bank-jobs"', false)->assertSee('href="/model-tests"', false)
            ->getContent();

        preg_match('#data-page>(.*?)</script>#s', $html, $ld);
        $graph = json_decode($ld[1], true)['@graph'];
        $this->assertSame(['Article', 'BreadcrumbList'], array_column($graph, '@type'));
        $this->assertSame('2026-11-20T00:00:00+00:00', $graph[0]['datePublished']);
        $this->assertSame('https://bd3schools.com/notices/category/bank', $graph[1]['itemListElement'][2]['item']);
    }

    public function test_status_follows_the_deadline(): void
    {
        $this->assertSame('open', $this->circular()->currentStatus());
        $this->assertSame('closing', $this->circular(['apply_until' => '2026-11-28'])->currentStatus());
        $this->assertSame('closed', $this->circular(['apply_until' => '2026-11-25', 'status' => 'open'])->currentStatus());
        $this->assertSame('result', $this->circular(['apply_until' => '2026-11-25', 'status' => 'result'])->currentStatus());
    }

    public function test_an_expired_circular_leaves_the_lists_but_keeps_its_page(): void
    {
        $this->circular(['title' => 'Still open circular']);
        $expired = $this->circular(['title' => 'Expired circular', 'apply_until' => '2026-11-25']);

        $this->get('/notices')->assertOk()->assertSee('Still open circular')->assertDontSee('Expired circular');
        $this->get('/notices/category/bank')->assertOk()->assertDontSee('Expired circular');
        $this->getJson(route('api.v1.notices'))->assertOk()->assertJsonMissing(['title' => 'Expired circular']);

        $this->get("/notices/{$expired->slug}")->assertOk()->assertSee('Application closed');

        // A result on the same page brings it back to the lists.
        $expired->applyUpdate(['status' => 'result']);
        $this->get('/notices')->assertSee('Expired circular');
    }

    public function test_drafts_are_hidden_but_the_admin_can_preview_them(): void
    {
        $draft = $this->circular(['is_published' => false]);

        $this->get("/notices/{$draft->slug}")->assertNotFound();
        $this->get(route('admin.notice-preview', $draft))->assertForbidden();
        $this->actingAs(User::factory()->create())->get(route('admin.notice-preview', $draft))->assertForbidden();

        $this->actingAs(User::factory()->admin()->create())->get(route('admin.notice-preview', $draft))
            ->assertOk()->assertSee('Preview')->assertSee('noindex, follow', false)->assertHeader('X-Robots-Tag', 'noindex, nofollow');
    }

    public function test_admin_can_duplicate_and_publish(): void
    {
        $this->actingAs(User::factory()->admin()->create());
        $notice = $this->circular();

        Livewire::test(EditNotice::class, ['record' => $notice->getRouteKey()])->callAction(TestAction::make('duplicate'));

        $copy = Notice::query()->latest('id')->first();
        $this->assertNotSame($notice->id, $copy->id);
        $this->assertFalse($copy->is_published);
        $this->assertSame('বাংলাদেশ ব্যাংক', $copy->org_bn);
        $this->assertNull($copy->apply_until);
        $this->assertSame('bangladesh-bank-job-circular-2026-2', $copy->slug);

        Livewire::test(EditNotice::class, ['record' => $copy->getRouteKey()])->callAction(TestAction::make('publish'));
        $this->assertTrue($copy->fresh()->is_published);
    }

    public function test_import_creates_drafts_skips_duplicates_and_updates_the_same_page(): void
    {
        Exam::factory()->create(['slug' => 'combined-bank']);
        $existing = $this->circular();
        $file = "{$this->folder}/notices.json";
        File::put($file, json_encode([
            'create' => [
                ['org' => 'Rajuk', 'org_bn' => 'রাজউক', 'title' => 'Various posts', 'category' => 'autonomous', 'posts' => [['name' => 'Assistant Engineer', 'grade' => '9th', 'vacancies' => '12']], 'apply_until' => '2026-12-20', 'how_to_apply' => ['Open the portal', 'Pay the fee'], 'url' => 'https://rajuk.gov.bd/circular.pdf'],
                ['org' => 'Bangladesh Bank', 'title' => 'Same circular again', 'url' => 'https://www.bb.org.bd/career/circular.pdf'],
            ],
            'update' => [
                ['slug' => $existing->slug, 'status' => 'admit', 'exam_date' => '2027-01-10'],
            ],
        ]));

        $this->artisan('notices:import', ['file' => $file])->assertSuccessful();

        $draft = Notice::query()->firstWhere('slug', 'rajuk-job-circular-2026');
        $this->assertFalse($draft->is_published);
        $this->assertSame("Open the portal\nPay the fee", $draft->how_to_apply);
        $this->assertSame('12', $draft->totalVacancies());
        $this->assertSame(2, Notice::query()->count());

        $existing->refresh();
        $this->assertSame('admit', $existing->status);
        $this->assertSame(['Status', 'Exam date'], array_column($existing->changes, 'field'));

        File::put($file, json_encode([['org' => 'X']]));
        $this->artisan('notices:import', ['file' => $file])->assertFailed();
    }

    public function test_expired_notices_are_closed_and_the_cache_can_be_cleared(): void
    {
        $open = $this->circular(['apply_until' => '2026-11-25', 'status' => 'open']);
        $result = $this->circular(['apply_until' => '2026-11-25', 'status' => 'result']);

        $this->artisan('notices:close-expired')->assertSuccessful();

        $this->assertSame('closed', $open->fresh()->status);
        $this->assertSame('result', $result->fresh()->status);

        PageShell::remember('probe', fn (): string => 'old');
        $this->artisan('seo:refresh')->assertSuccessful();
        $this->assertSame('new', PageShell::remember('probe', fn (): string => 'new'));
    }
}
