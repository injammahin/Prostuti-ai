<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\Subject;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuestionSeedDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_every_seed_question_names_a_subject_that_exists(): void
    {
        $subjects = json_decode(file_get_contents(database_path('seeders/data/subjects.json')), true, flags: JSON_THROW_ON_ERROR);
        $names = array_column($subjects, 'name');
        $slugs = array_column($subjects, 'slug');
        $unknown = [];

        foreach (glob(database_path('seeders/data/questions*.json')) as $path) {
            foreach (json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR) as $question) {
                $subject = $question['subject'];
                $known = is_array($subject)
                    ? in_array($subject['slug'] ?? null, $slugs, true) || in_array($subject['name'] ?? null, $names, true)
                    : in_array($subject, $names, true);

                if (! $known) {
                    $unknown[] = basename($path).': '.$question['ref'];
                }
            }
        }

        $this->assertSame([], array_slice($unknown, 0, 10), 'These questions name a subject missing from subjects.json, which stops db:seed.');
    }

    public function test_a_question_changed_after_creation_is_marked_curated_so_seeding_keeps_it(): void
    {
        $question = Question::factory()->for(Subject::factory())->create(['status' => Question::STATUS_DRAFT]);
        $this->assertNull($question->curated_at);

        $question->update(['body' => 'Fixed text', 'status' => Question::STATUS_LIVE]);

        $this->assertNotNull($question->fresh()->curated_at);
    }
}
