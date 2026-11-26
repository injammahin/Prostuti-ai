<?php

namespace Tests\Feature;

use App\Models\Exam;
use App\Models\Notice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NoticesTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_published_notices_appear_on_the_website(): void
    {
        $exam = Exam::factory()->create(['slug' => 'bcs-general']);
        Notice::factory()->for($exam)->create(['slug' => 'visible', 'apply_until' => now()->addWeek()->toDateString()]);
        Notice::factory()->create(['slug' => 'hidden', 'is_published' => false]);
        Notice::factory()->create(['slug' => 'scheduled', 'published_on' => now()->addDays(3)->toDateString()]);

        $this->getJson(route('api.v1.notices'))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'visible')
            ->assertJsonPath('data.0.exam', 'bcs-general')
            ->assertJsonPath('data.0.isNew', true)
            ->assertJsonPath('data.0.applyUntil', now()->addWeek()->toDateString());
    }

    public function test_admin_can_open_the_notice_pages(): void
    {
        $admin = User::factory()->admin()->create();
        $notice = Notice::factory()->create();

        $this->actingAs($admin)->get('/admin/notices')->assertOk();
        $this->actingAs($admin)->get('/admin/notices/create')->assertOk();
        $this->actingAs($admin)->get("/admin/notices/{$notice->id}/edit")->assertOk();
    }
}
