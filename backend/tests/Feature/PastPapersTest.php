<?php

namespace Tests\Feature;

use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PastPapersTest extends TestCase
{
    use RefreshDatabase;

    public function test_papers_are_listed_newest_first_with_their_question_counts(): void
    {
        config(['bcs_papers.first' => 41, 'bcs_papers.latest' => 43, 'bcs_papers.special' => [42]]);
        $subject = Subject::factory()->create();
        Question::factory()->count(3)->for($subject)->create(['source' => '43rd BCS']);
        Question::factory()->for($subject)->create(['source' => '41st BCS']);
        Question::factory()->for($subject)->create(['source' => '41st BCS', 'status' => Question::STATUS_DRAFT]);

        $this->getJson(route('api.v1.past-papers'))
            ->assertOk()
            ->assertJsonCount(3, 'papers')
            ->assertJsonPath('papers.0.source', '43rd BCS')
            ->assertJsonPath('papers.0.name_bn', '৪৩তম বিসিএস')
            ->assertJsonPath('papers.0.questions', 3)
            ->assertJsonPath('papers.1.source', '42nd BCS')
            ->assertJsonPath('papers.1.special', true)
            ->assertJsonPath('papers.1.questions', 0)
            ->assertJsonPath('papers.2.source', '41st BCS')
            ->assertJsonPath('papers.2.questions', 1);
    }

    public function test_opening_a_paper_gives_only_that_papers_questions_in_order(): void
    {
        Exam::factory()->create(['slug' => 'bcs-general']);
        $subject = Subject::factory()->create();
        $paperQuestions = Question::factory()->count(6)->for($subject)->create(['source' => '46th BCS']);
        Question::factory()->count(4)->for($subject)->create(['source' => '45th BCS']);

        $response = $this->postJson(route('api.v1.practice.store'), [
            'mode' => 'past', 'exam' => 'bcs-general', 'paper' => '46th BCS', 'count' => 200,
        ])->assertCreated();

        $this->assertSame($paperQuestions->pluck('id')->all(), $response->collect('questions')->pluck('id')->all());
    }

    public function test_solutions_view_shows_every_question_with_its_answer_and_explanation(): void
    {
        config(['bcs_papers.first' => 10, 'bcs_papers.latest' => 47]);
        $subject = Subject::factory()->create();
        $question = Question::factory()->for($subject)->create(['source' => '46th BCS', 'answer_index' => 2, 'explanation' => 'Because.']);
        Question::factory()->for($subject)->create(['source' => '46th BCS', 'status' => Question::STATUS_DRAFT]);
        Question::factory()->for($subject)->create(['source' => '45th BCS']);

        $this->getJson(route('api.v1.past-papers.show', 46))
            ->assertOk()
            ->assertJsonPath('paper.name_bn', '৪৬তম বিসিএস')
            ->assertJsonPath('paper.questions', 1)
            ->assertJsonCount(1, 'questions')
            ->assertJsonPath('questions.0.id', $question->id)
            ->assertJsonPath('questions.0.answer_index', 2)
            ->assertJsonPath('questions.0.explanation', 'Because.');

        $this->getJson(route('api.v1.past-papers.show', 99))->assertNotFound();
    }

    public function test_a_paper_can_be_taken_as_an_exam_without_revealing_answers_up_front(): void
    {
        $subject = Subject::factory()->create();
        Question::factory()->count(5)->for($subject)->create(['source' => '47th BCS']);

        $this->postJson(route('api.v1.practice.store'), ['mode' => 'past_exam', 'paper' => '47th BCS', 'count' => 200])
            ->assertCreated()
            ->assertJsonPath('mode', 'past_exam')
            ->assertJsonCount(5, 'questions')
            ->assertJsonMissingPath('questions.0.answer_index');
    }
}
