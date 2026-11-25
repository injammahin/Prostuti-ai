<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\Exam;
use App\Models\ModelTest;
use App\Models\Notice;
use App\Models\PracticeSession;
use App\Models\Question;
use App\Models\Report;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LaunchFixesTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_model_test_is_saved_to_the_students_account(): void
    {
        $bank = Exam::factory()->create(['slug' => 'combined-bank']);
        ModelTest::query()->create([
            'title' => 'Bank test', 'slug' => 'combined-bank-so-1', 'exam_slug' => 'bank', 'status' => 'published',
            'total_questions' => 2, 'total_marks' => 2, 'negative_marking' => 0.25,
            'questions_data' => [
                ['id' => 'a', 'number' => 1, 'body' => 'One', 'options' => ['1', '2', '3', '4'], 'answer' => 0],
                ['id' => 'b', 'number' => 2, 'body' => 'Two', 'options' => ['1', '2', '3', '4'], 'answer' => 1],
            ],
        ]);
        $user = User::factory()->create();

        $this->withToken($user->createToken('web')->plainTextToken)
            ->postJson(route('api.v1.model-tests.submit', 'combined-bank-so-1'), ['answers' => ['a' => 0, 'b' => 3]])
            ->assertOk();

        $this->assertDatabaseHas('practice_sessions', ['user_id' => $user->id, 'mode' => 'test', 'exam_id' => $bank->id, 'correct' => 1, 'wrong' => 1]);

        $this->getJson(route('api.v1.me.stats', ['exam' => 'combined-bank']))->assertJsonPath('test_scores.0.score', 0.8);
    }

    public function test_guests_can_take_a_model_test_without_saving_it(): void
    {
        ModelTest::query()->create(['title' => 'T', 'slug' => 't', 'exam_slug' => 'ntrca', 'status' => 'published', 'questions_data' => []]);

        $this->postJson(route('api.v1.model-tests.submit', 't'), ['answers' => []])->assertOk();

        $this->assertSame(0, PracticeSession::query()->count());
    }

    public function test_deleting_the_account_removes_everything_that_belongs_to_it(): void
    {
        $user = User::factory()->create();
        Question::factory()->count(2)->for(Subject::factory())->create();
        $session = PracticeSession::start($user, 'drill', null, null, 2);
        $question = Question::query()->find($session->question_ids[0]);
        $session->recordAnswer($question, ($question->answer_index + 1) % 4, null);
        ActivityLog::record('auth.login', 'Logged in', $user);
        $token = $user->createToken('web')->plainTextToken;

        $this->withToken($token)->deleteJson(route('api.v1.me.destroy'), ['confirm' => 'yes'])->assertUnprocessable();
        $this->withToken($token)->deleteJson(route('api.v1.me.destroy'), ['confirm' => 'DELETE'])->assertOk();

        $this->assertModelMissing($user);

        foreach (['practice_sessions', 'session_answers', 'mistakes', 'activity_logs', 'personal_access_tokens'] as $table) {
            $this->assertDatabaseEmpty($table);
        }
    }

    public function test_admins_cannot_delete_their_account_from_the_website(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin, 'sanctum')->deleteJson(route('api.v1.me.destroy'), ['confirm' => 'DELETE'])->assertForbidden();

        $this->assertModelExists($admin);
    }

    public function test_reports_reach_the_admin_panel(): void
    {
        $notice = Notice::factory()->create();
        $question = Question::factory()->for(Subject::factory())->create();
        $user = User::factory()->create();

        $this->postJson(route('api.v1.reports.store'), ['target' => 'notice', 'target_ref' => $notice->slug, 'reason' => 'Wrong date'])->assertCreated();
        $this->withToken($user->createToken('web')->plainTextToken)
            ->postJson(route('api.v1.reports.store'), ['target' => 'question', 'target_ref' => (string) $question->id, 'reason' => 'Wrong answer key', 'note' => 'B is right'])
            ->assertCreated();
        $this->postJson(route('api.v1.reports.store'), ['target' => 'notice', 'target_ref' => 'missing', 'reason' => 'Other'])->assertNotFound();
        $this->postJson(route('api.v1.reports.store'), ['target' => 'user', 'target_ref' => '1', 'reason' => 'Other'])->assertUnprocessable();

        $this->assertSame(2, Report::query()->count());
        $this->assertDatabaseHas('reports', ['target' => 'question', 'user_id' => $user->id, 'note' => 'B is right']);

        $this->actingAs(User::factory()->create(['is_admin' => true]))->get('/admin/reports')->assertOk()->assertSee($notice->title);
    }

    public function test_practice_questions_added_to_fill_an_old_paper_are_not_part_of_it(): void
    {
        $subject = Subject::factory()->create();
        $own = Question::factory()->for($subject)->create(['source' => '26th BCS', 'ref' => 'bcs26_q100']);
        Question::factory()->for($subject)->create(['source' => '26th BCS', 'ref' => 'bcs26_q101']);

        $this->getJson(route('api.v1.past-papers.show', 26))
            ->assertJsonPath('paper.total', 100)
            ->assertJsonPath('paper.questions', 1)
            ->assertJsonPath('questions.0.id', $own->id);
    }

    public function test_every_paper_is_completed_to_200_questions_from_other_papers_with_their_bcs_and_year(): void
    {
        $subject = Subject::factory()->create();
        $bodies = fn (int $paper, int $count): array => array_map(fn (int $n): string => "Paper {$paper} question {$n}", range(1, $count));

        foreach ([20 => 100, 41 => 200] as $paper => $count) {
            foreach ($bodies($paper, $count) as $i => $body) {
                Question::factory()->for($subject)->create(['source' => $paper === 20 ? '20th BCS' : '41st BCS', 'ref' => "bcs{$paper}_q".($i + 1), 'body' => $body]);
            }
        }

        // The same question asked again in the 41st BCS, with a different space and mark.
        Question::query()->where('ref', 'bcs41_q7')->first()->update(['body' => 'Paper 20  question 1?']);

        $response = $this->getJson(route('api.v1.past-papers.show', 20))
            ->assertJsonPath('paper.total', 100)
            ->assertJsonPath('paper.questions', 100)
            ->assertJsonPath('paper.shown', 200)
            ->assertJsonCount(100, 'questions')
            ->assertJsonCount(100, 'extra_questions')
            ->assertJsonPath('questions.0.also_in.0.name', '41st BCS')
            ->assertJsonPath('questions.0.also_in.0.year', 2021)
            ->assertJsonPath('extra_questions.0.from.name', '41st BCS')
            ->assertJsonPath('extra_questions.0.from.year', 2021);

        $extra = $response->collect('extra_questions');
        $this->assertCount(100, $extra->pluck('body')->unique());
        $this->assertNotContains('Paper 20  question 1?', $extra->pluck('body'));

        $this->postJson(route('api.v1.practice.store'), ['mode' => 'past_exam', 'paper' => '20th BCS', 'count' => 200])
            ->assertCreated()
            ->assertJsonCount(200, 'questions');
    }
}
