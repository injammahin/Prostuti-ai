<?php

namespace App\Http\Controllers\Api\V1;

use Anthropic\Client;
use Anthropic\Core\Exceptions\APIConnectionException;
use Anthropic\Core\Exceptions\APIStatusException;
use Anthropic\Core\Exceptions\RateLimitException;
use App\Http\Controllers\Controller;
use App\Http\Requests\AskTutorRequest;
use App\Models\Question;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * "Ask AI why": explains a question's verified answer in clear Bangla or English.
 * Uses Claude when ANTHROPIC_API_KEY is set, Google Gemini when GEMINI_API_KEY is set,
 * and a built-in explanation if neither is configured or both are unavailable.
 */
class AiTutorController extends Controller
{
    private const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

    /**
     * Fixed instructions for the tutor. Kept constant so it can be cached by the API.
     */
    private const SYSTEM_PROMPT = <<<'PROMPT'
You are DreamPrep's study tutor for Bangladeshi government job exams (BCS, Bank, NTRCA, Primary). Most students are not technical and many study on a phone, so write like a kind, clear teacher.

Ground truth:
- Each request includes the exam question, its options, the VERIFIED correct answer and the verified explanation. Treat the verified answer as correct. Never say a different option is right, even if the student insists.
- Use well-established facts only. If you are not sure about an extra detail (a date, a number, a name), leave it out rather than guess.
- If the student says the answer is wrong, explain the verified answer politely and suggest they tap the flag icon to report it so the team can check.

Language:
- Reply in the language the request asks for. "Bangla" means standard Bangla in Bengali script (use Bangla digits for numbers inside Bangla sentences, keep names of acts, organisations and English terms in English where students would see them that way, e.g. "Right to Information Act, 2009"). "English" means simple English.
- If the student writes in Banglish (Bangla in English letters), reply in Bangla script.

Format:
- Start with the answer in one short sentence, then explain. Keep the whole reply under about 150 words unless the student asks for more.
- Use short paragraphs or a few "- " bullet points. You may use **bold** for the key fact. No headings, no tables, no emojis except at most one ✅ or ❌ at the start of a bullet.
- When asked why other options are wrong, give one short bullet per wrong option.
- When asked for a memory trick, give one short, catchy way to remember the answer (a link, a story, a word trick). Do not invent false facts for the trick.
PROMPT;

    /**
     * @var array<string, array{bn: string, en: string}>
     */
    private const INTENTS = [
        'why_others' => ['bn' => 'অন্য অপশনগুলো কেন ভুল, সংক্ষেপে বুঝিয়ে দাও।', 'en' => 'Why are the other options wrong? Explain briefly.'],
        'trick' => ['bn' => 'উত্তরটা মনে রাখার একটা সহজ কৌশল দাও।', 'en' => 'Give me an easy trick to remember this answer.'],
        'simple' => ['bn' => 'খুব সহজ ভাষায় ব্যাখ্যাটা বুঝিয়ে দাও।', 'en' => 'Explain this in very simple words.'],
    ];

    public function ask(AskTutorRequest $request): JsonResponse
    {
        $question = Question::query()->with('subject')->findOrFail($request->validated('question_id'));
        $lang = $request->validated('lang');
        $intent = $request->validated('intent');
        $studentMessage = trim((string) $request->validated('message'));
        $history = $request->validated('history') ?? [];

        // The three quick buttons give the same answer every time — cache them to keep replies instant and cheap.
        $cacheKey = $intent !== 'free' && empty($history)
            ? "tutor:{$question->id}:{$question->updated_at?->timestamp}:{$intent}:{$lang}"
            : null;

        if ($cacheKey && ($cached = Cache::get($cacheKey))) {
            return response()->json(['reply' => $cached, 'source' => 'ai']);
        }

        $reply = $this->askClaude($question, $lang, $intent, $studentMessage, $history)
            ?? $this->askGemini($question, $lang, $intent, $studentMessage, $history);

        if ($reply === null) {
            return response()->json(['reply' => $this->builtInReply($question, $lang, $intent), 'source' => 'built_in']);
        }

        if ($cacheKey) {
            Cache::put($cacheKey, $reply, now()->addDays(30));
        }

        return response()->json(['reply' => $reply, 'source' => 'ai']);
    }

    /**
     * @param  list<array{role: string, text: string}>  $history
     */
    private function askClaude(Question $question, string $lang, string $intent, string $studentMessage, array $history): ?string
    {
        $apiKey = config('services.anthropic.key');

        if (! $apiKey) {
            return null;
        }

        $messages = [['role' => 'user', 'content' => $this->questionContext($question, $lang)]];

        foreach ($history as $turn) {
            $messages[] = ['role' => $turn['role'], 'content' => $turn['text']];
        }

        $messages[] = ['role' => 'user', 'content' => $intent === 'free' ? $studentMessage : self::INTENTS[$intent][$lang]];

        try {
            $client = new Client(apiKey: $apiKey, requestOptions: ['timeout' => 45.0, 'maxRetries' => 2]);

            $response = $client->beta->messages->create(
                model: config('services.anthropic.model'),
                maxTokens: 16000,
                system: self::SYSTEM_PROMPT,
                messages: $this->mergeConsecutiveRoles($messages),
                outputConfig: ['effort' => 'low'],
                betas: ['server-side-fallback-2026-07-01'],
                fallbacks: 'default',
            );
        } catch (RateLimitException $exception) {
            Log::warning('Tutor rate limited', ['message' => $exception->getMessage()]);

            return null;
        } catch (APIStatusException|APIConnectionException $exception) {
            Log::error('Tutor request failed', ['message' => $exception->getMessage()]);

            return null;
        }

        if ($response->stopReason === 'refusal') {
            return null;
        }

        $text = collect($response->content)
            ->filter(fn ($block): bool => $block->type === 'text')
            ->map(fn ($block): string => $block->text)
            ->implode("\n");

        return trim($text) !== '' ? trim($text) : null;
    }

    /**
     * Google Gemini, used when GEMINI_API_KEY is set (and Claude is not configured or unavailable).
     *
     * @param  list<array{role: string, text: string}>  $history
     */
    private function askGemini(Question $question, string $lang, string $intent, string $studentMessage, array $history): ?string
    {
        $apiKey = config('services.gemini.key');

        if (! $apiKey) {
            return null;
        }

        $turns = [['role' => 'user', 'content' => $this->questionContext($question, $lang)]];

        foreach ($history as $turn) {
            $turns[] = ['role' => $turn['role'], 'content' => $turn['text']];
        }

        $turns[] = ['role' => 'user', 'content' => $intent === 'free' ? $studentMessage : self::INTENTS[$intent][$lang]];

        $contents = array_map(fn (array $turn): array => [
            'role' => $turn['role'] === 'assistant' ? 'model' : 'user',
            'parts' => [['text' => $turn['content']]],
        ], $this->mergeConsecutiveRoles($turns));

        // Try the main model first, then the fallbacks: a busy (503) or retired (404) model is skipped quickly.
        $models = collect([config('services.gemini.model')])
            ->merge(explode(',', (string) config('services.gemini.fallback_models')))
            ->map(fn (?string $model): string => trim((string) $model))
            ->filter()
            ->unique()
            ->values();

        foreach ($models as $model) {
            $text = $this->callGemini($apiKey, $model, $contents);

            if ($text !== null) {
                return $text;
            }
        }

        return null;
    }

    /**
     * One generateContent call to a single Gemini model; null when it fails or returns no text.
     *
     * @param  list<array{role: string, parts: list<array{text: string}>}>  $contents
     */
    private function callGemini(string $apiKey, string $model, array $contents): ?string
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders(['x-goog-api-key' => $apiKey])
                ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent", [
                    'systemInstruction' => ['parts' => [['text' => self::SYSTEM_PROMPT]]],
                    'contents' => $contents,
                    'generationConfig' => ['maxOutputTokens' => 2048, 'temperature' => 0.4],
                ]);
        } catch (ConnectionException $exception) {
            Log::warning('Gemini tutor request timed out', ['model' => $model, 'message' => $exception->getMessage()]);

            return null;
        }

        if (! $response->successful()) {
            Log::warning('Gemini tutor request failed', ['model' => $model, 'status' => $response->status(), 'body' => str($response->body())->limit(300)->toString()]);

            return null;
        }

        $text = collect($response->json('candidates.0.content.parts', []))
            ->reject(fn (array $part): bool => (bool) ($part['thought'] ?? false))
            ->pluck('text')
            ->filter()
            ->implode('');

        return trim($text) !== '' ? trim($text) : null;
    }

    /**
     * The question, options and verified answer, sent as the first message of every conversation.
     */
    private function questionContext(Question $question, string $lang): string
    {
        $options = collect($question->options)
            ->map(fn (string $option, int $index): string => self::LETTERS[$index].'. '.$option)
            ->implode("\n");

        $correct = self::LETTERS[$question->answer_index].'. '.$question->options[$question->answer_index];
        $language = $lang === 'bn' ? 'Bangla' : 'English';

        return <<<CONTEXT
<exam_question>
Subject: {$question->subject->name}
Topic: {$question->topic}
Question: {$question->body}
Options:
{$options}
Verified correct answer: {$correct}
Verified explanation: {$question->explanation}
</exam_question>

Reply language: {$language}. I have already answered this question and seen the correct answer. Please help me understand it.
CONTEXT;
    }

    /**
     * The API combines consecutive same-role turns, but keeping them tidy avoids surprises.
     *
     * @param  list<array{role: string, content: string}>  $messages
     * @return list<array{role: string, content: string}>
     */
    private function mergeConsecutiveRoles(array $messages): array
    {
        $merged = [];

        foreach ($messages as $message) {
            $last = array_key_last($merged);

            if ($last !== null && $merged[$last]['role'] === $message['role']) {
                $merged[$last]['content'] .= "\n\n".$message['content'];
            } else {
                $merged[] = $message;
            }
        }

        return $merged;
    }

    /**
     * A clear answer built from the verified data, used when Claude is not configured or unavailable.
     */
    private function builtInReply(Question $question, string $lang, string $intent): string
    {
        $bn = $lang === 'bn';
        $correctIndex = $question->answer_index;
        $correct = $question->options[$correctIndex];
        $letter = self::LETTERS[$correctIndex];
        $explanation = trim((string) $question->explanation);

        $lines = [$bn ? "✅ সঠিক উত্তর: **{$letter}. {$correct}**" : "✅ Correct answer: **{$letter}. {$correct}**"];

        if ($intent === 'why_others') {
            $lines[] = collect($question->options)
                ->reject(fn (string $option, int $index): bool => $index === $correctIndex)
                ->map(fn (string $option, int $index): string => $bn
                    ? '- ❌ '.self::LETTERS[$index].". {$option} — এটি প্রশ্নের সঠিক উত্তর নয়।"
                    : '- ❌ '.self::LETTERS[$index].". {$option} — this does not match the question.")
                ->implode("\n");
        }

        if ($explanation !== '') {
            $lines[] = ($bn ? 'কারণ: ' : 'Why: ').$explanation;
        }

        if ($intent === 'trick') {
            $lines[] = $bn
                ? "মনে রাখার কৌশল: প্রশ্নের মূল শব্দটির সাথে \"{$correct}\" জুড়ে একটি ছোট বাক্য বানিয়ে ২–৩ বার জোরে বলুন। কাল আবার এই প্রশ্নটি দেখুন — একদিন পর আবার পড়লে মনে থাকে বেশি।"
                : "Memory trick: make a short sentence joining the question's key word with \"{$correct}\" and say it out loud 2–3 times. Look at this question again tomorrow — reviewing after a day helps it stick.";
        }

        return implode("\n\n", $lines);
    }
}
