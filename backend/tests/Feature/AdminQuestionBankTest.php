<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminQuestionBankTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_question_bank_pages_load(): void
    {
        $admin = User::factory()->admin()->create();
        $question = Question::factory()->create();

        $this->actingAs($admin)->get('/admin/questions')->assertOk();
        $this->actingAs($admin)->get('/admin/questions/create')->assertOk();
        $this->actingAs($admin)->get("/admin/questions/{$question->id}/edit")->assertOk();
        $this->actingAs($admin)->get('/admin/subjects')->assertOk();
        $this->actingAs($admin)->get('/admin/exams')->assertOk();
    }
}
