<?php

namespace App\Console\Commands;

use App\Models\Question;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * Lists questions whose explanation seems to contradict the marked answer, for a person to review. Changes nothing.
 */
#[Signature('questions:check-answers {file=storage/app/answer-check.csv : Where to write the list}')]
#[Description('List questions whose explanation seems to contradict the marked answer')]
class CheckAnswers extends Command
{
    private const BANGLA_DIGITS = ['০' => '0', '১' => '1', '২' => '2', '৩' => '3', '৪' => '4', '৫' => '5', '৬' => '6', '৭' => '7', '৮' => '8', '৯' => '9'];

    /** Letters of the options, as explanations name them. */
    private const LETTERS = ['ক' => 0, 'খ' => 1, 'গ' => 2, 'ঘ' => 3, 'a' => 0, 'b' => 1, 'c' => 2, 'd' => 3];

    public function handle(): int
    {
        $found = [];

        foreach (Question::query()->live()->with('subject')->whereNotNull('explanation')->orderBy('id')->lazyById(500) as $question) {
            if (mb_strlen(trim((string) $question->explanation)) < 15) {
                continue;
            }

            foreach ($this->check($question) as [$level, $reason]) {
                $found[] = [$level, $reason, $question->id, $question->source ?: '-', $question->numberOnPaper() ?? '', $question->subject?->name, Str::squish($question->body), implode(' | ', $question->options), $question->options[$question->answer_index] ?? '', Str::squish((string) $question->explanation), url("/admin/questions/{$question->id}/edit")];

                break;
            }
        }

        usort($found, fn (array $a, array $b): int => [$a[0], $a[1], $a[2]] <=> [$b[0], $b[1], $b[2]]);

        $handle = fopen(str_starts_with($this->argument('file'), '/') || str_contains($this->argument('file'), ':') ? $this->argument('file') : base_path($this->argument('file')), 'w');
        fwrite($handle, "\xEF\xBB\xBF");
        fputcsv($handle, ['level', 'why', 'id', 'exam', 'number', 'subject', 'question', 'options', 'marked answer', 'explanation', 'edit']);

        foreach ($found as $row) {
            fputcsv($handle, $row);
        }

        fclose($handle);

        foreach (collect($found)->countBy(fn (array $row): string => "{$row[0]}: {$row[1]}")->sortKeys() as $reason => $count) {
            $this->line("{$count}  {$reason}");
        }

        $this->info(count($found).' questions to review: '.$this->argument('file'));

        return self::SUCCESS;
    }

    /**
     * @return list<array{string, string}> level and reason, most serious first
     */
    private function check(Question $question): array
    {
        $answer = (string) ($question->options[$question->answer_index] ?? '');
        $explanation = $this->plain((string) $question->explanation);
        $plainAnswer = $this->plain($answer);
        $others = collect($question->options)->except($question->answer_index)->map($this->plain(...))->filter(fn (string $option): bool => mb_strlen($option) > 1);
        $found = [];

        // "সঠিক উত্তর: খ" / "correct answer is (b)" naming another option.
        if (preg_match('/(?:সঠিক\s*উত্তর|correct\s+answer)\s*(?:হলো|হচ্ছে|হবে|is)?\s*[:：ঃ\-–]?\s*[(\[]?\s*(ক|খ|গ|ঘ|[abcd])\s*[)\].]/iu', (string) $question->explanation, $matches)
            && self::LETTERS[mb_strtolower($matches[1])] !== $question->answer_index) {
            $found[] = ['1 high', "explanation names option {$matches[1]}, another one is marked"];
        }

        $negative = preg_match('/নয়|নেই|না\b|নহে|ব্যতীত|ছাড়া|\bnot\b|except|incorrect|অশুদ্ধ|ভুল/iu', $question->body) === 1;
        $inText = $this->contains($explanation, $plainAnswer);
        $otherInText = $others->filter(fn (string $option): bool => $this->contains($explanation, $option));

        // A number or year that only differs from the explanation's.
        if (preg_match('/^\D{0,12}(\d[\d,.]*)\D{0,20}$/u', $plainAnswer, $matches) && ! $negative && ! in_array($question->subject?->slug, ['math', 'mental'], true)) {
            preg_match_all('/\d[\d,.]*/u', $explanation, $numbers);
            $numbers = collect($numbers[0])->map($this->number(...))->unique();

            if ($numbers->isNotEmpty() && ! $numbers->contains($this->number($matches[1]))) {
                $found[] = [$otherInText->isNotEmpty() ? '1 high' : '2 medium', 'number in the marked answer is not in the explanation'.($otherInText->isNotEmpty() ? ', another option is' : '')];
            }
        }

        // "বর্তমান …" was right when the exam was held; the explanation gives today's figure.
        if (preg_match('/(?:বর্তমান|current|present)\D{0,25}(\d[\d,.]*)/iu', $explanation, $now) && preg_match('/\d[\d,.]*/u', $plainAnswer, $marked)
            && preg_match('/বর্তমান|current|present/iu', $question->body) === 1 && $this->number($now[1]) !== $this->number($marked[0])) {
            $found[] = ['1 high', "marked {$marked[0]}, but the explanation says {$now[1]} now"];
        }

        if (! $inText && ! $negative && $otherInText->count() === 1 && mb_strlen($plainAnswer) > 2) {
            $found[] = ['2 medium', 'explanation mentions only another option'];
        }

        if (! $inText && ! $negative && $otherInText->isEmpty() && mb_strlen($plainAnswer) > 2 && ! in_array($question->subject?->slug, ['math', 'mental', 'english'], true)) {
            $found[] = ['3 low', 'marked answer does not appear in the explanation'];
        }

        usort($found, fn (array $a, array $b): int => $a[0] <=> $b[0]);

        return $found;
    }

    private function plain(string $text): string
    {
        return trim((string) preg_replace('/[^\p{L}\p{M}\p{N}.,]+/u', ' ', mb_strtolower(strtr($text, self::BANGLA_DIGITS))), ' ');
    }

    private function contains(string $text, string $part): bool
    {
        $part = preg_replace('/[.,]+$/u', '', $part);

        if ($part === '' || $part === null) {
            return false;
        }

        // Bangla words take endings (বাংলাদেশ → বাংলাদেশের), so only the start has to match.
        return preg_match('/(?<![\p{L}\p{M}\p{N}])'.preg_quote($part, '/').'/u', $text) === 1
            || str_contains(preg_replace('/\s+/u', '', $text), preg_replace('/\s+/u', '', $part));
    }

    private function number(string $number): string
    {
        return rtrim(str_replace(',', '', $number), '.');
    }
}
