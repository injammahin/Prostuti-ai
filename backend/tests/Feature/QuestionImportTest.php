<?php

namespace Tests\Feature;

use App\Filament\Resources\Questions\Pages\ListQuestions;
use App\Models\Question;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class QuestionImportTest extends TestCase
{
    use RefreshDatabase;

    private function geminiAnswer(): string
    {
        return <<<'TXT'
```json
[
  {"question": "বাংলা ভাষার প্রথম কাব্যগ্রন্থ কোনটি?", "options": ["চর্যাপদ", "শ্রীকৃষ্ণকীর্তন", "মঙ্গলকাব্য", "বৈষ্ণব পদাবলি"], "answer": "A", "explanation": "চর্যাপদ বাংলা ভাষার প্রাচীনতম নিদর্শন।", "topic": "প্রাচীন যুগ", "difficulty": "easy"},
  {"question": "Which is a synonym of 'abundant'?", "options": ["Scarce", "Plentiful", "Rare", "Tiny"], "answer": 1, "explanation": "Abundant means plentiful."},
  {"question": "Broken item", "options": ["Only", "Three", "Options"], "answer": "A"}
]
```
TXT;
    }

    public function test_pasted_ai_questions_are_imported_as_drafts(): void
    {
        $subject = Subject::factory()->create();

        $result = Question::importFromAi($this->geminiAnswer(), $subject, null);

        $this->assertSame(2, $result['created']);
        $this->assertCount(1, $result['errors']);
        $first = Question::query()->where('body', 'বাংলা ভাষার প্রথম কাব্যগ্রন্থ কোনটি?')->sole();
        $this->assertSame(0, $first->answer_index);
        $this->assertSame('bn', $first->lang);
        $this->assertSame(Question::STATUS_DRAFT, $first->status);
        $this->assertSame('en', Question::query()->where('answer_index', 1)->sole()->lang);
    }

    public function test_the_same_questions_are_not_imported_twice(): void
    {
        $subject = Subject::factory()->create();
        Question::importFromAi($this->geminiAnswer(), $subject, null);

        $again = Question::importFromAi($this->geminiAnswer(), $subject, null);

        $this->assertSame(0, $again['created']);
        $this->assertSame(2, $again['duplicates']);
    }

    public function test_invalid_text_gives_a_clear_message(): void
    {
        $result = Question::importFromAi('Sure! Here are your questions…', Subject::factory()->create(), null);

        $this->assertSame(0, $result['created']);
        $this->assertStringContainsString('not valid JSON', $result['errors'][0]);
    }

    public function test_admin_can_import_from_the_questions_page(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $subject = Subject::factory()->create();

        Livewire::test(ListQuestions::class)
            ->callAction('importFromAi', ['subject_id' => $subject->id, 'pasted' => $this->geminiAnswer(), 'make_live' => false])
            ->assertHasNoActionErrors()
            ->assertNotified('Questions imported');

        $this->assertSame(2, Question::query()->where('subject_id', $subject->id)->count());
    }
}
