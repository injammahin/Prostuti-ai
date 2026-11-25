<?php

namespace App\Models;

use App\Services\PastPapers;
use Database\Factories\QuestionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A multiple-choice question. Only questions with status "live" are ever shown to students.
 */
#[Fillable(['ref', 'subject_id', 'exam_id', 'topic', 'difficulty', 'source', 'lang', 'body', 'options', 'answer_index', 'explanation', 'status'])]
class Question extends Model
{
    /** @use HasFactory<QuestionFactory> */
    use HasFactory;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_VERIFIED = 'verified';

    public const STATUS_LIVE = 'live';

    /**
     * @var array<string, string>
     */
    public const STATUSES = [
        self::STATUS_DRAFT => 'Draft',
        self::STATUS_VERIFIED => 'Verified',
        self::STATUS_LIVE => 'Live',
    ];

    /** Other exam websites: an explanation that mentions one was copied from it. */
    private const OTHER_SITES = '/live\s*-?\s*mcq|লাইভ\s*এমসিকিউ|biddabari|বিদ্যাবাড়ি|uttoron|satt\s*academy|chakribangla|bcsourgoal|testmitro|w3classroom/iu';

    /**
     * @var array<string, string>
     */
    public const DIFFICULTIES = [
        'easy' => 'Easy',
        'medium' => 'Medium',
        'hard' => 'Hard',
    ];

    /**
     * Import questions pasted from an AI (Gemini/ChatGPT) answer.
     * Accepts a JSON array or {"questions": [...]}, optionally wrapped in ```json fences.
     * Each item: question, options[4], answer ("A"-"D" or 0-3), explanation, topic?, difficulty?, source?, lang?
     *
     * @return array{created: int, duplicates: int, errors: list<string>}
     */
    public static function importFromAi(string $pasted, Subject $subject, ?Exam $exam, string $status = self::STATUS_DRAFT): array
    {
        $json = trim(preg_replace('/^```(?:json)?|```$/m', '', trim($pasted)));
        $decoded = json_decode($json, true);

        if (! is_array($decoded)) {
            return ['created' => 0, 'duplicates' => 0, 'errors' => ['This is not valid JSON. Copy the whole answer from Gemini, from [ to ].']];
        }

        $items = array_is_list($decoded) ? $decoded : ($decoded['questions'] ?? []);
        $created = 0;
        $duplicates = 0;
        $errors = [];

        foreach ($items as $number => $item) {
            $label = 'Question '.($number + 1);
            $body = trim((string) ($item['question'] ?? $item['body'] ?? ''));
            $options = array_values(array_map(fn ($option): string => trim((string) $option), (array) ($item['options'] ?? [])));
            $answer = $item['answer'] ?? $item['answer_index'] ?? null;
            $answerIndex = is_string($answer) && preg_match('/^[A-Da-d]$/', trim($answer))
                ? ord(strtoupper(trim($answer))) - 65
                : (is_numeric($answer) ? (int) $answer : null);

            if ($body === '' || count($options) !== 4 || in_array('', $options, true)) {
                $errors[] = "{$label}: needs the question text and exactly 4 options.";

                continue;
            }

            if ($answerIndex === null || $answerIndex < 0 || $answerIndex > 3) {
                $errors[] = "{$label}: the answer must be A, B, C or D.";

                continue;
            }

            if (static::query()->where('subject_id', $subject->id)->where('body', $body)->exists()) {
                $duplicates++;

                continue;
            }

            $difficulty = strtolower((string) ($item['difficulty'] ?? 'medium'));

            static::query()->create([
                'subject_id' => $subject->id,
                'exam_id' => $exam?->id,
                'topic' => isset($item['topic']) ? (string) str((string) $item['topic'])->limit(250, '') : null,
                'difficulty' => array_key_exists($difficulty, self::DIFFICULTIES) ? $difficulty : 'medium',
                'source' => filled($item['source'] ?? null) ? (string) str((string) $item['source'])->limit(250, '') : null,
                'lang' => ($item['lang'] ?? null) === 'en' || ! preg_match('/[\x{0980}-\x{09FF}]/u', $body) ? 'en' : 'bn',
                'body' => $body,
                'options' => $options,
                'answer_index' => $answerIndex,
                'explanation' => filled($item['explanation'] ?? null) ? trim((string) $item['explanation']) : null,
                'status' => $status,
            ]);
            $created++;
        }

        if ($items === []) {
            $errors[] = 'No questions found in the pasted text.';
        }

        return ['created' => $created, 'duplicates' => $duplicates, 'errors' => $errors];
    }

    /**
     * The explanation, unless it was copied from another exam website (it names the site it came from).
     */
    public function ownExplanation(): ?string
    {
        return preg_match(self::OTHER_SITES, (string) $this->explanation) ? null : $this->explanation;
    }

    /**
     * @return BelongsTo<Subject, $this>
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * @return BelongsTo<Exam, $this>
     */
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeLive(Builder $query): void
    {
        $query->where('status', self::STATUS_LIVE);
    }

    /**
     * The questions of one previous paper, e.g. "44th BCS": its own seeded questions (ref "bcs44_q…")
     * and any added in the admin panel (no ref). Bank questions merely tagged with the paper are left out,
     * as they repeat the paper's own.
     *
     * @param  Builder<self>  $query
     */
    public function scopeOnPaper(Builder $query, string $source): void
    {
        $query->where('source', $source)->where(function (Builder $query) use ($source): void {
            $prefix = 'bcs'.(int) $source.'_q';

            $query->whereNull('ref')->orWhere(fn (Builder $query) => $query
                ->where('ref', 'like', "{$prefix}%")
                ->whereRaw('cast(substr(ref, ?) as unsigned) <= ?', [strlen($prefix) + 1, PastPapers::size((int) $source)]));
        });
    }

    /**
     * The same rule as scopeOnPaper(), for a question already loaded.
     */
    public function isOnPaper(): bool
    {
        if ($this->ref === null) {
            return true;
        }

        $number = $this->numberOnPaper();

        return str_starts_with($this->ref, 'bcs'.(int) $this->source.'_q') && $number !== null && $number <= PastPapers::size((int) $this->source);
    }

    /**
     * The question's number on the printed paper, read from its ref ("bcs35_q17" → 17).
     */
    public function numberOnPaper(): ?int
    {
        return preg_match('/_q(\d+)$/', (string) $this->ref, $matches) ? (int) $matches[1] : null;
    }

    /**
     * Questions that belong to the given exam's syllabus (its subjects).
     *
     * @param  Builder<self>  $query
     */
    public function scopeForExam(Builder $query, ?Exam $exam): void
    {
        if ($exam) {
            $query->whereIn('subject_id', $exam->subjects()->pluck('subjects.id'));
        }
    }

    /**
     * Any change after creation (an admin fixing or publishing a question) marks it as curated,
     * so the catalog seeder never overwrites it. The seeder itself runs without model events.
     */
    protected static function booted(): void
    {
        static::updating(function (Question $question): void {
            $question->curated_at = now();
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'options' => 'array',
            'answer_index' => 'integer',
            'curated_at' => 'datetime',
        ];
    }
}
