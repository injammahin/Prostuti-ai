<?php

namespace Tests\Feature;

use App\Models\Exam;
use App\Models\Mistake;
use App\Models\PracticeSession;
use App\Models\Question;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PracticeFlowTest extends TestCase
{
    use RefreshDatabase;

    private Exam $exam;

    private Subject $subject;

    protected function setUp(): void
    {
        parent::setUp();

        $this->exam = Exam::factory()->create(['slug' => 'bcs-general']);
        $this->subject = Subject::factory()->create(['slug' => 'bangla']);
        $this->exam->subjects()->attach($this->subject, ['marks' => 35]);
        Question::factory()->count(12)->for($this->subject)->create();
    }

    public function test_student_practises_a_subject_and_answers_are_checked_on_the_server(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson(route('api.v1.practice.store'), [
            'mode' => 'drill', 'exam' => 'bcs-general', 'subject' => 'bangla', 'count' => 5,
        ])->assertCreated();

        $response->assertJsonCount(5, 'questions')
            ->assertJsonMissingPath('questions.0.answer_index');

        $sessionId = $response->json('id');
        $question = Question::query()->find($response->json('questions.0.id'));

        $this->postJson(route('api.v1.practice.answer', $sessionId), [
            'question_id' => $question->id,
            'chosen_index' => $question->answer_index,
        ])->assertOk()->assertJsonPath('is_correct', true)->assertJsonPath('answer_index', $question->answer_index);

        $this->postJson(route('api.v1.practice.finish', $sessionId))
            ->assertOk()
            ->assertJsonPath('correct', 1)
            ->assertJsonPath('skipped', 4);
    }

    public function test_wrong_answers_go_to_mistakes_and_a_later_correct_answer_clears_them(): void
    {
        $user = User::factory()->create();
        $question = Question::query()->first();
        $wrongIndex = ($question->answer_index + 1) % 4;

        $session = PracticeSession::start($user, 'drill', null, null, 12);
        $session->recordAnswer($question, $wrongIndex, null);

        $this->assertDatabaseHas('mistakes', ['user_id' => $user->id, 'question_id' => $question->id, 'resolved_at' => null]);

        $this->actingAs($user)->getJson(route('api.v1.me.mistakes'))
            ->assertOk()
            ->assertJsonCount(1, 'mistakes')
            ->assertJsonPath('mistakes.0.question.answer_index', $question->answer_index);

        $this->travel(2)->days();
        $review = PracticeSession::start($user, 'mistakes', null, null, 10);
        $this->assertSame([$question->id], $review->question_ids);

        $review->recordAnswer($question, $question->answer_index, null);
        $this->assertNotNull(Mistake::query()->first()->resolved_at);
    }

    public function test_answering_the_same_question_twice_keeps_the_first_answer(): void
    {
        $user = User::factory()->create();
        $session = PracticeSession::start($user, 'drill', null, null, 5);
        $question = Question::query()->find($session->question_ids[0]);

        $session->recordAnswer($question, $question->answer_index, null);
        $session->recordAnswer($question, ($question->answer_index + 1) % 4, null);

        $this->assertSame(1, $session->fresh()->correct);
        $this->assertSame(0, $session->fresh()->wrong);
    }

    public function test_guests_can_practise_without_an_account(): void
    {
        $response = $this->postJson(route('api.v1.practice.store'), ['mode' => 'drill', 'count' => 5])->assertCreated();

        $this->postJson(route('api.v1.practice.answer', $response->json('id')), [
            'question_id' => $response->json('questions.0.id'),
            'chosen_index' => 0,
        ])->assertOk();

        $this->assertSame(0, Mistake::query()->count());
    }

    public function test_someone_else_cannot_use_a_students_session(): void
    {
        $session = PracticeSession::start(User::factory()->create(), 'drill', null, null, 5);

        $this->actingAs(User::factory()->create())
            ->postJson(route('api.v1.practice.answer', $session->id), ['question_id' => $session->question_ids[0], 'chosen_index' => 0])
            ->assertForbidden();
    }

    public function test_only_live_questions_are_used(): void
    {
        Question::query()->update(['status' => Question::STATUS_DRAFT]);
        $live = Question::factory()->for($this->subject)->create();

        $session = PracticeSession::start(null, 'drill', null, null, 10);

        $this->assertSame([$live->id], $session->question_ids);
    }

    public function test_new_questions_are_preferred_over_already_answered_ones(): void
    {
        $user = User::factory()->create();
        $first = PracticeSession::start($user, 'drill', null, null, 6);

        foreach ($first->question_ids as $id) {
            $first->recordAnswer(Question::query()->find($id), 0, null);
        }

        $second = PracticeSession::start($user, 'drill', null, null, 6);

        $this->assertEmpty(array_intersect($first->question_ids, $second->question_ids));
    }

    public function test_daily_quiz_is_the_same_for_everyone_on_the_same_day(): void
    {
        $first = $this->getJson(route('api.v1.daily-quiz'))->assertOk()->assertJsonCount(10, 'questions');
        $second = $this->getJson(route('api.v1.daily-quiz'));

        $this->assertSame($first->json('questions.*.id'), $second->json('questions.*.id'));
        $first->assertJsonStructure(['questions' => [['answer_index', 'explanation']]]);
    }

    public function test_catalog_lists_subjects_with_the_students_progress(): void
    {
        $user = User::factory()->create();
        $session = PracticeSession::start($user, 'drill', null, $this->subject, 2);

        foreach ($session->question_ids as $id) {
            $question = Question::query()->find($id);
            $session->recordAnswer($question, $question->answer_index, null);
        }

        $this->actingAs($user)->getJson(route('api.v1.catalog'))
            ->assertOk()
            ->assertJsonPath('subjects.0.slug', 'bangla')
            ->assertJsonPath('subjects.0.total', 12)
            ->assertJsonPath('subjects.0.answered', 2)
            ->assertJsonPath('subjects.0.accuracy', 100)
            ->assertJsonPath('exams.0.subjects.0.marks', 35);
    }
}
