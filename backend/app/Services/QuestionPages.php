<?php

namespace App\Services;

use App\Models\Question;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * A page for a single question, only where its explanation is long enough to be worth one.
 */
class QuestionPages
{
    public const ENOUGH_WORDS = 40;

    private const RELATED = 5;

    /**
     * The questions that have a page.
     *
     * @return array<int, array{path: string, title: string, subject: int, updated: string|null}> by question id
     */
    public static function index(): array
    {
        return PageShell::remember('question-pages', function (): array {
            $titles = [];

            return Question::query()->live()
                ->whereIn('source', array_map(PastPapers::source(...), PastPapers::numbers()))
                ->orderByDesc('id')
                ->get(['id', 'ref', 'source', 'subject_id', 'body', 'explanation', 'updated_at'])
                ->filter(fn (Question $question): bool => $question->isOnPaper()
                    && ! in_array((int) $question->source, config('seo.questions_on_hold'), true)
                    && self::words($question->ownExplanation()) >= self::ENOUGH_WORDS)
                ->unique(fn (Question $question): string => PastPapers::textKey($question->body))
                ->mapWithKeys(function (Question $question) use (&$titles): array {
                    $title = PublicPage::fit($question->body, 56);

                    if (isset($titles[$title])) {
                        $title = PublicPage::fit($question->body, 44)." ({$question->source})";
                    }

                    if (isset($titles[$title])) {
                        return [];
                    }

                    $titles[$title] = true;

                    return [$question->id => ['path' => self::path($question), 'title' => $title, 'subject' => $question->subject_id, 'updated' => $question->updated_at?->toIso8601String()]];
                })
                ->all();
        });
    }

    /**
     * @return Collection<string, Carbon|null> path => last change
     */
    public static function paths(): Collection
    {
        return collect(self::index())->mapWithKeys(fn (array $page): array => [$page['path'] => $page['updated'] ? Carbon::parse($page['updated']) : null]);
    }

    /**
     * The right address when a question's is written with another text.
     */
    public static function moved(string $path): ?string
    {
        if (! preg_match('#^/questions/(\d+)(?:-[^/]*)?$#', $path, $matches)) {
            return null;
        }

        $page = self::index()[(int) $matches[1]] ?? null;

        return $page && $page['path'] !== $path ? $page['path'] : null;
    }

    public static function resolve(string $path): ?PublicPage
    {
        preg_match('#^/questions/(\d+)-#', $path, $matches);
        $id = (int) ($matches[1] ?? 0);
        $index = self::index();

        if (($index[$id]['path'] ?? null) !== $path) {
            return null;
        }

        $question = Question::query()->live()->with('subject')->find($id);

        if (! $question) {
            return null;
        }

        $paper = [...PastPapers::label((int) $question->source), 'path' => ExamPages::paperPath((int) $question->source)];
        $presented = ExamPages::present(collect([$question]), (int) $question->source)[0];
        $answer = preg_replace('/[\s.।]+$/u', '', (string) ($question->options[$question->answer_index] ?? ''));

        return new PublicPage(
            path: $path,
            title: "{$index[$id]['title']} | bd3schools",
            description: "{$paper['name_bn']}: সঠিক উত্তর {$answer}। ".$question->ownExplanation(),
            view: 'seo.question',
            viewData: [
                'question' => $presented,
                'paper' => $paper,
                'updated' => $question->updated_at,
                'related' => collect($index)->where('subject', $question->subject_id)->except($id)
                    ->sortBy(fn (array $page): string => md5($id.$page['path']))->take(self::RELATED)->values(),
            ],
            lang: $question->lang === 'en' ? 'en' : 'bn',
            type: 'article',
            jsonLd: [PublicPage::article($path, $question->body, "সঠিক উত্তর: {$answer}", $question->created_at?->toIso8601String(), $question->updated_at?->toIso8601String(), null, $question->lang === 'en' ? 'en' : 'bn')],
            crumbs: ['Home' => '/', 'BCS' => '/bcs', $paper['name'] => $paper['path'], "Question {$presented['number']}" => $path],
        );
    }

    private static function path(Question $question): string
    {
        return "/questions/{$question->id}-".(Str::slug(Str::words($question->body, 9, '')) ?: 'question');
    }

    private static function words(?string $text): int
    {
        return count(preg_split('/\s+/u', trim((string) $text), -1, PREG_SPLIT_NO_EMPTY) ?: []);
    }
}
