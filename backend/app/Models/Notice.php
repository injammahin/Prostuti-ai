<?php

namespace App\Models;

use Database\Factories\NoticeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * A job circular, exam date, admit card, result or other official update shown on the website.
 * Its dates also feed the "Exam dates" calendar.
 */
#[Fillable(['slug', 'title', 'title_bn', 'org', 'exam_id', 'type', 'summary', 'summary_bn', 'url', 'published_on', 'apply_from', 'apply_until', 'exam_date', 'verified_on', 'changes', 'is_published', 'category', 'status', 'post_name', 'vacancies', 'eligibility', 'age_limit', 'fee', 'how_to_apply', 'attachment'])]
class Notice extends Model
{
    /** @use HasFactory<NoticeFactory> */
    use HasFactory;

    /**
     * @var array<string, string>
     */
    public const TYPES = [
        'circular' => 'Job circular',
        'deadline' => 'Deadline extended',
        'admit' => 'Admit card',
        'schedule' => 'Exam date',
        'seat' => 'Seat plan',
        'syllabus' => 'Syllabus change',
        'result' => 'Result',
        'viva' => 'Viva schedule',
        'other' => 'Other',
    ];

    /** Notices published within this many days are marked "New". */
    public const NEW_FOR_DAYS = 14;

    /** Sections of the notice board: [English, Bangla]. */
    public const CATEGORIES = [
        'bcs' => ['BCS', 'বিসিএস'],
        'bank' => ['Bank', 'ব্যাংক'],
        'primary' => ['Primary', 'প্রাথমিক'],
        'ntrca' => ['NTRCA', 'এনটিআরসিএ'],
        'ministry' => ['Ministry', 'মন্ত্রণালয়'],
        'others' => ['Others', 'অন্যান্য'],
    ];

    /** @var array<string, array{string, string}> */
    public const STATUSES = [
        'open' => ['Application open', 'আবেদন চলছে'],
        'closed' => ['Application closed', 'আবেদন শেষ'],
        'admit' => ['Admit card published', 'প্রবেশপত্র প্রকাশিত'],
        'result' => ['Result published', 'ফলাফল প্রকাশিত'],
    ];

    /**
     * @return BelongsTo<Exam, $this>
     */
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    /** Official websites by organisation (as written in the admin panel, in lower case). */
    private const OFFICIAL_SITES = [
        'bpsc' => 'https://bpsc.gov.bd',
        'ntrca' => 'https://ntrca.gov.bd',
        'dpe' => 'https://dpe.gov.bd',
        'bangladesh bank' => 'https://www.bb.org.bd',
        'bscs' => 'https://erecruitment.bb.org.bd',
    ];

    /**
     * @param  Builder<self>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', true)->where('published_on', '<=', now()->toDateString());
    }

    /**
     * Its section of the notice board: as chosen in the admin panel, otherwise from its exam and organisation.
     */
    public function section(): string
    {
        return $this->category ?: match (true) {
            $this->exam?->slug === 'bcs-general' => 'bcs',
            in_array($this->exam?->slug, ['combined-bank', 'bangladesh-bank'], true) => 'bank',
            $this->exam?->slug === 'primary-teacher' => 'primary',
            $this->exam?->slug === 'ntrca' => 'ntrca',
            preg_match('/ministry|division|মন্ত্রণালয়/iu', $this->org) === 1 => 'ministry',
            default => 'others',
        };
    }

    /**
     * Where it stands: as chosen in the admin panel, otherwise from its type and deadline.
     */
    public function currentStatus(): ?string
    {
        return $this->status ?: match (true) {
            $this->type === 'result' => 'result',
            $this->type === 'admit' => 'admit',
            $this->apply_until !== null => $this->apply_until->endOfDay()->isPast() ? 'closed' : 'open',
            default => null,
        };
    }

    /**
     * The circular itself, when it was uploaded.
     *
     * @return array{url: string, image: bool}|null
     */
    public function circular(): ?array
    {
        return filled($this->attachment)
            ? ['url' => Storage::disk('public')->url($this->attachment), 'image' => ! str_ends_with(Str::lower($this->attachment), '.pdf')]
            : null;
    }

    /**
     * New information about the same notice (admit card, exam date, result …): the page stays, and what changed is
     * kept for students to see.
     *
     * @param  array<string, mixed>  $data
     */
    public function applyUpdate(array $data): void
    {
        $this->fill($data);

        $labels = [
            'type' => ['Type', fn (?string $value): ?string => self::TYPES[$value] ?? $value],
            'status' => ['Status', fn (?string $value): ?string => self::STATUSES[$value][0] ?? $value],
            'apply_until' => ['Application deadline', fn (mixed $value): ?string => $value ? Carbon::parse($value)->format('j M Y') : null],
            'exam_date' => ['Exam date', fn (mixed $value): ?string => $value ? Carbon::parse($value)->format('j M Y') : null],
        ];
        // Inside the model, "$this->changes" is Eloquent's own list of changed attributes, not the column.
        $changes = $this->getAttribute('changes') ?? [];

        foreach ($labels as $field => [$label, $show]) {
            if ($this->isDirty($field)) {
                $changes[] = ['field' => $label, 'old' => $show($this->getRawOriginal($field)) ?? '—', 'new' => $show($this->getAttributes()[$field]) ?? '—', 'at' => now()->toDateString()];
            }
        }

        $this->setAttribute('changes', $changes);
        $this->verified_on = now();
        $this->save();
    }

    /**
     * A plain summary from the details, for a notice saved without one.
     */
    private function draftSummary(): string
    {
        $date = fn (?Carbon $date): ?string => $date?->format('j F Y');

        return collect([
            "{$this->org}: {$this->title}.",
            filled($this->post_name) ? "Post: {$this->post_name}." : null,
            filled($this->vacancies) ? "Vacancies: {$this->vacancies}." : null,
            $this->apply_from || $this->apply_until ? 'Application: '.collect([$date($this->apply_from), $date($this->apply_until)])->filter()->join(' to ').'.' : null,
            $this->exam_date ? "Exam: {$date($this->exam_date)}." : null,
            'See the official notice for full details.',
        ])->filter()->join(' ');
    }

    /**
     * The organisation's own website: known ones by name, otherwise the site the notice was published on.
     *
     * @return array{name: string, url: string}|null
     */
    public function officialSite(): ?array
    {
        $url = self::OFFICIAL_SITES[Str::lower(trim($this->org))] ?? null;

        if (! $url && preg_match('#^https?://[^/]+#', (string) $this->url, $matches)) {
            $url = $matches[0];
        }

        return $url ? ['name' => $this->org, 'url' => $url] : null;
    }

    /**
     * The shape the website expects (same fields as the original sample data).
     *
     * @return array<string, mixed>
     */
    public function toWebsite(): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'title_bn' => $this->title_bn,
            'org' => $this->org,
            'exam' => $this->exam?->slug,
            'type' => $this->type,
            'published' => $this->published_on?->toDateString(),
            'applyFrom' => $this->apply_from?->toDateString(),
            'applyUntil' => $this->apply_until?->toDateString(),
            'examDate' => $this->exam_date?->toDateString(),
            'verifiedAt' => $this->verified_on?->toDateString(),
            'summary' => $this->summary,
            'summary_bn' => $this->summary_bn,
            'url' => $this->url,
            'official' => $this->officialSite(),
            'updated' => $this->updated_at?->toIso8601String(),
            'category' => $this->section(),
            'status' => $this->currentStatus(),
            'post' => $this->post_name,
            'vacancies' => $this->vacancies,
            'eligibility' => $this->eligibility,
            'ageLimit' => $this->age_limit,
            'fee' => $this->fee,
            'howToApply' => collect(preg_split('/\R/u', (string) $this->how_to_apply))->map(fn (string $step): string => trim($step))->filter()->values()->all(),
            'circular' => $this->circular(),
            'changes' => $this->getAttribute('changes') ?? [],
            'isNew' => $this->published_on !== null && $this->published_on->gte(now()->subDays(self::NEW_FOR_DAYS)->startOfDay()),
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Notice $notice): void {
            if (blank($notice->summary)) {
                $notice->summary = $notice->draftSummary();
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_on' => 'date',
            'apply_from' => 'date',
            'apply_until' => 'date',
            'exam_date' => 'date',
            'verified_on' => 'date',
            'changes' => 'array',
            'is_published' => 'boolean',
        ];
    }
}
