<?php

namespace Tests\Feature;

use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiTutorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.anthropic.key' => null, 'services.gemini.key' => null]);
    }

    private function question(): Question
    {
        return Question::factory()->create([
            'body' => 'তথ্য অধিকার আইন কত সালে প্রণীত হয়?',
            'options' => ['২০০৬', '২০০৮', '২০০৯', '২০১১'],
            'answer_index' => 2,
            'explanation' => 'তথ্য অধিকার আইন ২০০৯ সালে প্রণীত হয়।',
            'lang' => 'bn',
        ]);
    }

    public function test_built_in_reply_explains_the_verified_answer_in_bangla(): void
    {
        $this->postJson(route('api.v1.ai.explain'), ['question_id' => $this->question()->id, 'intent' => 'why_others', 'lang' => 'bn'])
            ->assertOk()
            ->assertJsonPath('source', 'built_in')
            ->assertJsonPath('reply', fn (string $reply): bool => str_contains($reply, 'সঠিক উত্তর: **C. ২০০৯**') && str_contains($reply, 'A. ২০০৬'));
    }

    public function test_built_in_reply_works_in_english(): void
    {
        $this->postJson(route('api.v1.ai.explain'), ['question_id' => $this->question()->id, 'intent' => 'simple', 'lang' => 'en'])
            ->assertOk()
            ->assertJsonPath('reply', fn (string $reply): bool => str_starts_with($reply, '✅ Correct answer: **C. ২০০৯**'));
    }

    public function test_gemini_answers_when_configured(): void
    {
        config(['services.gemini.key' => 'test-key']);
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response(['candidates' => [['content' => ['parts' => [['text' => 'সঠিক উত্তর **২০০৯**।']]]]]]),
        ]);

        $this->postJson(route('api.v1.ai.explain'), ['question_id' => $this->question()->id, 'intent' => 'free', 'message' => 'কেন ২০০৯?', 'lang' => 'bn'])
            ->assertOk()
            ->assertJsonPath('source', 'ai')
            ->assertJsonPath('reply', 'সঠিক উত্তর **২০০৯**।');

        Http::assertSent(function ($request): bool {
            $body = $request->data();

            return $request->hasHeader('x-goog-api-key', 'test-key')
                && str_contains($body['contents'][0]['parts'][0]['text'], 'Verified correct answer: C. ২০০৯')
                && str_contains($body['contents'][0]['parts'][0]['text'], 'কেন ২০০৯?')
                && str_contains($body['systemInstruction']['parts'][0]['text'], 'Never say a different option is right');
        });
    }

    public function test_falls_back_to_built_in_when_gemini_fails(): void
    {
        config(['services.gemini.key' => 'bad-key']);
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response(['error' => ['message' => 'API key not valid']], 401)]);

        $this->postJson(route('api.v1.ai.explain'), ['question_id' => $this->question()->id, 'intent' => 'trick', 'lang' => 'bn'])
            ->assertOk()
            ->assertJsonPath('source', 'built_in');
    }

    public function test_draft_questions_cannot_be_asked_about(): void
    {
        $draft = Question::factory()->create(['status' => Question::STATUS_DRAFT]);

        $this->postJson(route('api.v1.ai.explain'), ['question_id' => $draft->id, 'intent' => 'simple', 'lang' => 'bn'])
            ->assertUnprocessable();
    }
}
