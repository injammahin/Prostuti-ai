<?php

namespace Tests\Feature;

use App\Filament\Resources\Notices\Pages\CreateNotice;
use App\Filament\Resources\Notices\Pages\ListNotices;
use App\Models\Exam;
use App\Models\Notice;
use App\Models\Report;
use App\Models\User;
use App\Services\ShareImage;
use Filament\Actions\Testing\TestAction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

class NoticeBoardTest extends TestCase
{
    use RefreshDatabase;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = storage_path('framework/testing/notices-'.uniqid());
        File::ensureDirectoryExists($this->folder);
        File::put("{$this->folder}/index.html", '<!doctype html><html lang="en"><head><title>Shell</title><meta name="description" content="Shell" /><meta name="robots" content="index, follow" /></head><body><div id="root"></div></body></html>');
        File::put("{$this->folder}/seo-content.json", json_encode(['contact' => ['email' => 'help@example.com', 'facebook' => null]]));
        config(['seo.shell' => "{$this->folder}/index.html", 'seo.site' => 'https://bd3schools.com']);
        Storage::fake('public');
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->folder);
        parent::tearDown();
    }

    public function test_the_board_has_pages_newest_first(): void
    {
        foreach (range(1, 25) as $day) {
            Notice::factory()->create(['title' => "Notice number {$day}.", 'published_on' => now()->subDays(30 - $day)]);
        }

        $this->get('/notices')->assertOk()->assertSee('Notice number 25.')->assertSee('Notice number 6.')->assertDontSee('Notice number 5.')
            ->assertSee('<link rel="next" href="https://bd3schools.com/notices?page=2" />', false)
            ->assertSee('<link rel="canonical" data-server href="https://bd3schools.com/notices" />', false);
        $this->get('/notices?page=2')->assertOk()->assertSee('Notice number 5.')
            ->assertSee('<link rel="prev" href="https://bd3schools.com/notices" />', false)
            ->assertSee('<link rel="canonical" data-server href="https://bd3schools.com/notices?page=2" />', false);
        $this->get('/notices?page=1')->assertRedirect('/notices')->assertStatus(301);
        $this->get('/notices?page=3')->assertNotFound();
        $this->get('/notices/category/nope')->assertNotFound();
    }

    public function test_a_section_lists_its_own_notices(): void
    {
        $exam = Exam::factory()->create(['slug' => 'combined-bank']);
        Notice::factory()->create(['title' => 'Bank circular', 'exam_id' => $exam->id]);
        Notice::factory()->create(['title' => 'Health job', 'org' => 'Ministry of Health']);

        $this->get('/notices/category/bank')->assertOk()->assertSee('Bank circular')->assertDontSee('Health job')->assertSee('noindex, follow', false);
        $this->get('/notices/category/govt')->assertOk()->assertSee('Health job');
        $this->get('/notices?category=bank')->assertRedirect('/notices/category/bank')->assertStatus(301);
        $this->get('/notices?category=bank&page=1')->assertRedirect('/notices/category/bank')->assertStatus(301);
        $this->get('/notices/category/bank?page=1')->assertRedirect('/notices/category/bank')->assertStatus(301);

        foreach (array_keys(Notice::CATEGORIES) as $category) {
            $this->get("/notices/category/{$category}")->assertOk();
        }
    }

    public function test_a_notice_shows_its_details_and_dates(): void
    {
        $notice = Notice::factory()->create(['slug' => 'officer', 'post_name' => 'Assistant Officer', 'vacancies' => '25', 'fee' => '৳200', 'how_to_apply' => "Open the portal\nPay the fee", 'apply_until' => now()->addDays(10), 'attachment' => 'notices/a.pdf']);

        $html = $this->get('/notices/officer')->assertOk()
            ->assertSee('Assistant Officer')->assertSee('<li>Pay the fee</li>', false)->assertSee('Application open')->assertSee('Published / প্রকাশ')
            ->assertSee('/storage/notices/a.pdf', false)->getContent();

        preg_match('#data-page>(.*?)</script>#s', $html, $ld);
        $article = json_decode($ld[1], true)['@graph'][0];
        $this->assertSame($notice->updated_at->toIso8601String(), $article['dateModified']);
        $this->assertSame(['@id' => 'https://bd3schools.com/#organization'], $article['author']);
    }

    public function test_an_update_keeps_the_page_and_records_what_changed(): void
    {
        $this->actingAs(User::factory()->admin()->create());
        $notice = Notice::factory()->create(['slug' => 'exam', 'exam_date' => '2026-12-01']);

        Livewire::test(ListNotices::class)
            ->callAction(TestAction::make('update')->table($notice), ['type' => 'admit', 'exam_date' => '2026-12-15', 'summary' => 'Admit cards are out.'])
            ->assertHasNoFormErrors();

        $notice->refresh();
        $this->assertSame(1, Notice::query()->count());
        $this->assertSame('exam', $notice->slug);
        $this->assertSame(['Type', 'Exam date'], array_column($notice->changes, 'field'));
        $this->assertSame('15 Dec 2026', $notice->changes[1]['new']);
    }

    public function test_a_notice_needs_only_its_organisation_and_title(): void
    {
        $this->actingAs(User::factory()->admin()->create());
        Notice::factory()->create(['org' => 'NTRCA', 'eligibility' => 'Graduates', 'slug' => 'new-circular']);

        Livewire::test(CreateNotice::class)
            ->fillForm(['org' => 'NTRCA', 'title' => 'New circular'])
            ->callFormComponentAction('org', 'copyPrevious')
            ->call('create')
            ->assertHasNoFormErrors();

        $notice = Notice::query()->latest('id')->first();
        $this->assertSame('ntrca-job-circular-'.now()->year, $notice->slug);
        $this->assertFalse($notice->is_published);
        $this->assertSame('Graduates', $notice->eligibility);
        $this->assertStringContainsString('New circular', $notice->summary);
    }

    public function test_only_an_admin_can_save_a_share_picture(): void
    {
        $notice = Notice::factory()->create();
        $picture = fn (): UploadedFile => UploadedFile::fake()->image('share.png', 1200, 630);

        $this->postJson(route('share-images.store', $notice), ['image' => $picture()])->assertUnauthorized();
        $this->actingAs(User::factory()->create())->postJson(route('share-images.store', $notice), ['image' => $picture()])->assertForbidden();
        $this->getJson(route('share-images.index'))->assertForbidden();

        $this->actingAs(User::factory()->admin()->create());
        $this->getJson(route('share-images.index'))->assertOk()->assertJsonPath('data.0.id', $notice->id);
        $this->postJson(route('share-images.store', $notice), ['image' => UploadedFile::fake()->image('share.png', 300, 300)])->assertUnprocessable();
        $this->postJson(route('share-images.store', $notice), ['image' => $picture()])->assertNoContent();

        $this->getJson(route('share-images.index'))->assertJsonCount(0, 'data');
        $this->get("/notices/{$notice->slug}")->assertSee(ShareImage::noticeFile($notice), false);
    }

    public function test_a_message_from_the_contact_page_reaches_the_admin(): void
    {
        $this->get('/contact')->assertOk()->assertSee('help@example.com');

        $this->postJson('/api/v1/reports', ['target' => 'page', 'target_ref' => 'contact', 'reason' => 'Other', 'note' => 'Hello'])->assertCreated();

        $this->assertSame('Message from the contact page', Report::query()->sole()->target_title);
    }
}
