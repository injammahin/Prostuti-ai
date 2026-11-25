<?php

namespace Tests\Feature;

use App\Models\Exam;
use App\Models\PracticeSession;
use App\Models\Question;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentStatsTest extends TestCase
{
    use RefreshDatabase;

    private Subject $subject;

    protected function setUp(): void
    {
        parent::setUp();

        $exam = Exam::factory()->create(['slug' => 'bcs-general']);
        $this->subject = Subject::factory()->create();
        $exam->subjects()->attach($this->subject, ['marks' => 200]);
        Question::factory()->count(40)->for($this->subject)->create(['topic' => 'Grammar']);
    }

    /**
     * Answer $count questions in one session, $correct of them right.
     */
    private function practise(User $user, int $count, int $correct, ?Exam $exam = null): void
    {
        $session = PracticeSession::start($user, 'drill', $exam, null, $count);

        foreach ($session->question_ids as $i => $id) {
            $question = Question::query()->find($id);
            $session->recordAnswer($question, $i < $correct ? $question->answer_index : ($question->answer_index + 1) % 4, null);
        }

        $session->update(['finished_at' => now()]);
    }

    public function test_new_student_starts_at_zero(): void
    {
        $this->actingAs(User::factory()->create())->getJson(route('api.v1.me.stats'))
            ->assertOk()
            ->assertJsonPath('totals.answered', 0)
            ->assertJsonPath('totals.accuracy', null)
            ->assertJsonPath('streak.current', 0)
            ->assertJsonPath('expected_score', null);
    }

    public function test_stats_reflect_real_answers(): void
    {
        $user = User::factory()->create();
        $this->practise($user, 10, 7);

        $this->actingAs($user)->getJson(route('api.v1.me.stats'))
            ->assertOk()
            ->assertJsonPath('totals.answered', 10)
            ->assertJsonPath('totals.accuracy', 70)
            ->assertJsonPath('today.answered', 10)
            ->assertJsonPath('week.6.count', 10)
            ->assertJsonPath('subjects.0.accuracy', 70)
            ->assertJsonPath('weak_topics', [])
            ->assertJsonPath('mistakes_due', 0)
            ->assertJsonPath('sessions_finished', 1)
            ->assertJsonPath('recent_sessions.0.percent', 70);
    }

    public function test_streak_counts_consecutive_days(): void
    {
        $user = User::factory()->create();

        $this->travelTo(now()->subDays(3));
        $this->practise($user, 2, 2);
        $this->travelBack();
        $this->travelTo(now()->subDays(1));
        $this->practise($user, 2, 2);
        $this->travelBack();
        $this->practise($user, 2, 2);

        $this->actingAs($user)->getJson(route('api.v1.me.stats'))
            ->assertJsonPath('streak.current', 2)
            ->assertJsonPath('streak.best', 2);
    }

    public function test_expected_score_uses_negative_marking(): void
    {
        $user = User::factory()->create();
        $this->practise($user, 20, 15);

        // 75% right, 25% wrong: 200 × (0.75 − 0.25 × 0.5) = 125
        $this->actingAs($user)->getJson(route('api.v1.me.stats'))
            ->assertJsonPath('expected_score.score', 125)
            ->assertJsonPath('expected_score.max', 200);
    }

    public function test_stats_follow_the_chosen_exam(): void
    {
        $user = User::factory()->create();
        $bcs = Exam::query()->firstWhere('slug', 'bcs-general');
        $ntrca = Exam::factory()->create(['slug' => 'ntrca']);
        $ntrca->subjects()->attach($this->subject);

        $this->practise($user, 4, 4, $bcs);
        $this->practise($user, 6, 3, $ntrca);

        $this->actingAs($user)->getJson(route('api.v1.me.stats', ['exam' => 'bcs-general']))
            ->assertJsonPath('totals.answered', 4)
            ->assertJsonPath('totals.accuracy', 100)
            ->assertJsonPath('today.answered', 10);

        $this->actingAs($user)->getJson(route('api.v1.me.stats', ['exam' => 'ntrca']))
            ->assertJsonPath('totals.answered', 6)
            ->assertJsonPath('totals.accuracy', 50)
            ->assertJsonPath('sessions_finished', 1);
    }

    public function test_weak_topics_are_listed(): void
    {
        $user = User::factory()->create();
        $this->practise($user, 5, 1);

        $this->actingAs($user)->getJson(route('api.v1.me.stats'))
            ->assertJsonPath('weak_topics.0.topic', 'Grammar')
            ->assertJsonPath('weak_topics.0.accuracy', 20);
    }

    public function test_guests_cannot_read_stats(): void
    {
        $this->getJson(route('api.v1.me.stats'))->assertUnauthorized();
    }
}
