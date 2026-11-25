<?php

namespace App\Services;

use App\Models\ModelTest;
use App\Models\Post;
use App\Models\Question;
use App\Models\Subject;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * The public pages made from the question bank: one per BCS paper and subject, and one per exam.
 */
class ExamPages
{
    /** Address of a subject page => the subject's slug. */
    public const SUBJECTS = [
        'bangla' => 'bangla',
        'english' => 'english',
        'bangladesh-affairs' => 'bd-affairs',
        'international-affairs' => 'intl-affairs',
        'mathematics' => 'math',
        'mental-ability' => 'mental',
        'general-science' => 'science',
        'computer-ict' => 'ict',
        'geography' => 'geography',
        'ethics-good-governance' => 'ethics',
    ];

    /** The other exams: address => its exams in the catalogue and its texts. */
    public const HUBS = [
        'ntrca' => [
            'exams' => ['ntrca'],
            'name' => 'NTRCA',
            'h1' => 'এনটিআরসিএ শিক্ষক নিবন্ধন প্রশ্ন ও প্রস্তুতি',
            'h1_en' => 'NTRCA Teacher Registration Questions & Preparation',
            'title' => 'এনটিআরসিএ প্রশ্ন সমাধান | NTRCA Question & Syllabus | bd3schools',
            'description' => 'এনটিআরসিএ শিক্ষক নিবন্ধনের প্রশ্ন, উত্তর, ব্যাখ্যা, সিলেবাস ও নোটিশ। Free NTRCA questions with answers and syllabus.',
        ],
        'primary-teacher' => [
            'exams' => ['primary-teacher'],
            'name' => 'Primary teacher',
            'h1' => 'প্রাথমিক সহকারী শিক্ষক নিয়োগ প্রশ্ন ও প্রস্তুতি',
            'h1_en' => 'Primary Assistant Teacher Questions & Preparation',
            'title' => 'প্রাথমিক শিক্ষক প্রশ্ন সমাধান | Primary Teacher Question | bd3schools',
            'description' => 'প্রাথমিক সহকারী শিক্ষক নিয়োগের প্রশ্ন, উত্তর, ব্যাখ্যা ও নোটিশ। Free Primary teacher questions with answers and syllabus.',
        ],
        'bank-jobs' => [
            'exams' => ['combined-bank', 'bangladesh-bank'],
            'name' => 'Bank jobs',
            'h1' => 'ব্যাংক নিয়োগ পরীক্ষার প্রশ্ন ও প্রস্তুতি',
            'h1_en' => 'Bank Job Exam Questions & Preparation',
            'title' => 'ব্যাংক নিয়োগ প্রশ্ন সমাধান | Bank Job Question Solution | bd3schools',
            'description' => 'সমন্বিত ব্যাংক ও বাংলাদেশ ব্যাংক পরীক্ষার প্রশ্ন, উত্তর, ব্যাখ্যা, নম্বর বণ্টন ও নোটিশ। Free bank job questions with answers and syllabus.',
        ],
    ];

    /** A page with fewer questions than this is kept out of search results. */
    private const ENOUGH_QUESTIONS = 20;

    /** Explanations shorter than this don't count as explained. */
    private const EXPLAINED_FROM = 30;

    private const SUBJECT_PAGE_QUESTIONS = 100;

    private const HUB_QUESTIONS = 60;

    public static function paperPath(int $number): string
    {
        return '/bcs/'.str(PastPapers::source($number))->lower()->replace(' ', '-').'-question-solution';
    }

    public static function subjectPath(?string $slug): ?string
    {
        $address = array_search($slug, self::SUBJECTS, true);

        return $address === false ? null : "/bcs/subject/{$address}";
    }

    /**
     * The page with an exam's questions, by its slug in the catalogue.
     */
    public static function examPath(string $exam): ?string
    {
        if ($exam === 'bcs-general') {
            return '/bcs';
        }

        $address = collect(self::HUBS)->search(fn (array $hub): bool => in_array($exam, $hub['exams'], true));

        return $address === false ? null : "/{$address}";
    }

    /**
     * Where an old or misspelled address now lives ("/blog/41th-bcs-question-solution-pdf", "/bcs/48").
     */
    public static function moved(string $path): ?string
    {
        if ($path === '/quiz') {
            return '/daily';
        }

        if (! preg_match('#^/blog/(\d+)(?:st|nd|rd|th)-bcs-question-solution-pdf$#', $path, $matches)
            && ! preg_match('#^/bcs/(\d+)(?:(?:st|nd|rd|th)(?:-bcs(?:-question-solution(?:-pdf)?)?)?)?$#', $path, $matches)) {
            return null;
        }

        $number = (int) $matches[1];
        $target = self::paperPath($number);

        return in_array($number, PastPapers::numbers(), true) && $target !== $path ? $target : null;
    }

    public static function resolve(string $path): ?PublicPage
    {
        if (preg_match('#^/bcs/subject/([a-z-]+)$#', $path, $matches)) {
            return self::subject($matches[1]);
        }

        if (preg_match('#^/bcs/(\d+)#', $path, $matches)) {
            $number = (int) $matches[1];

            return in_array($number, PastPapers::numbers(), true) && self::paperPath($number) === $path ? self::paper($number) : null;
        }

        return match ($path) {
            '/bcs' => self::bcs(),
            '/model-tests' => self::modelTests(),
            default => isset(self::HUBS[ltrim($path, '/')]) ? self::hub(ltrim($path, '/')) : null,
        };
    }

    /**
     * Every page here that search engines may show, with when its content last changed.
     *
     * @return Collection<string, Carbon> path => last change
     */
    public static function paths(): Collection
    {
        $questions = self::paperQuestions(['id', 'ref', 'source', 'subject_id', 'explanation', 'updated_at']);
        $bySubject = $questions->filter(self::isExplained(...))->groupBy('subject.slug');

        $papers = $questions->groupBy(fn (Question $question): int => (int) $question->source)
            ->filter(fn (Collection $own): bool => $own->count() >= self::ENOUGH_QUESTIONS)
            ->sortKeysDesc()
            ->mapWithKeys(fn (Collection $own, int $number): array => [self::paperPath($number) => $own->max('updated_at')]);

        $subjects = collect(self::SUBJECTS)
            ->filter(fn (string $slug): bool => isset($bySubject[$slug]) && $bySubject[$slug]->count() >= self::ENOUGH_QUESTIONS)
            ->mapWithKeys(fn (string $slug): array => [self::subjectPath($slug) => $bySubject[$slug]->max('updated_at')]);

        return collect([
            '/bcs' => $questions->max('updated_at'),
            ...collect(self::HUBS)->mapWithKeys(fn (array $hub, string $address): array => ["/{$address}" => self::examQuestions($hub['exams'])->max('updated_at')]),
            '/model-tests' => ModelTest::query()->published()->get(['updated_at'])->max('updated_at') ?? $questions->max('updated_at'),
            ...$papers,
            ...$subjects,
        ])->filter();
    }

    private static function bcs(): PublicPage
    {
        $questions = self::paperQuestions(['id', 'ref', 'source', 'subject_id', 'explanation', 'created_at', 'updated_at']);
        $byPaper = $questions->groupBy(fn (Question $question): int => (int) $question->source);
        $explained = $questions->filter(self::isExplained(...));
        $latest = (int) config('bcs_papers.latest');
        $latestBn = Bangla::ordinal($latest);
        $title = "বিসিএস প্রশ্ন ব্যাংক ও সমাধান | BCS Question Bank 10th–{$latest}th | bd3schools";
        $description = "১০ম থেকে {$latestBn} বিসিএস প্রিলিমিনারি প্রশ্ন সমাধান। Free BCS previous questions with answers, by exam and by subject, plus the syllabus.";

        return new PublicPage(
            path: '/bcs',
            title: $title,
            description: $description,
            view: 'seo.bcs',
            viewData: [
                'total' => $questions->count(),
                'updated' => $questions->max('updated_at'),
                'explained' => $explained->count(),
                'latest' => $latest,
                'papers' => collect(PastPapers::numbers())
                    ->filter(fn (int $number): bool => $byPaper->has($number))
                    ->map(fn (int $number): array => [
                        ...self::label($number),
                        'questions' => $byPaper[$number]->count(),
                        'explained' => $byPaper[$number]->filter(self::isExplained(...))->count(),
                        'special' => in_array($number, config('bcs_papers.special'), true),
                    ]),
                'subjects' => self::subjectLinks($questions),
                'exam' => self::catalogueExams(['bcs-general'])->first(),
                'notices' => self::notices(['bcs-general'])->take(5),
                'tests' => self::tests()->where('exam', 'bcs-general'),
            ],
            lang: 'bn',
            jsonLd: [self::article('/bcs', "বিসিএস প্রশ্ন ব্যাংক ও সমাধান (১০ম–{$latestBn}) | BCS Question Bank", $description, null, Carbon::parse($questions->min('created_at')), $questions->max('updated_at'))],
            crumbs: ['Home' => '/', 'BCS' => '/bcs'],
        );
    }

    private static function paper(int $number): ?PublicPage
    {
        $questions = self::paperQuestions(source: PastPapers::source($number))
            ->sortBy(fn (Question $question): int => $question->numberOnPaper() ?? PHP_INT_MAX)
            ->values();

        if ($questions->isEmpty()) {
            return null;
        }

        $path = self::paperPath($number);
        $paper = self::label($number);
        $explained = $questions->filter(self::isExplained(...))->count();
        $with = $explained * 2 >= $questions->count() ? 'ব্যাখ্যাসহ' : 'উত্তরসহ';
        $count = Bangla::digits($questions->count());
        $subjects = $questions->groupBy('subject_id')->map(fn (Collection $own): array => [
            'name' => $own->first()->subject->name,
            'name_bn' => $own->first()->subject->name_bn,
            'path' => self::subjectPath($own->first()->subject->slug),
            'questions' => $own->count(),
        ])->sortByDesc('questions')->values();
        $post = Post::query()->published()->where('slug', 'like', "{$number}%-bcs-question-solution-pdf")->first();
        $image = $post?->toWebsite()['cover_image'];
        $pdf = self::pdf($number);
        $title = "{$paper['name_bn']} প্রশ্ন সমাধান".($pdf ? ' PDF' : '')." | {$paper['name']} Question Solution | bd3schools";
        $description = "{$paper['name_bn']} প্রিলিমিনারির {$count}টি প্রশ্ন, সঠিক উত্তর ".($with === 'ব্যাখ্যাসহ' ? 'ও ব্যাখ্যা' : 'ও বিষয়ভিত্তিক তালিকা').'।'
            ." Free {$paper['name']} question solution".($paper['year'] ? " ({$paper['year']})" : '').' with answers'.($pdf ? ' and PDF.' : '.');
        $numbers = PastPapers::numbers();

        return new PublicPage(
            path: $path,
            title: $title,
            description: $description,
            view: 'seo.bcs-paper',
            viewData: [
                'paper' => [
                    ...$paper,
                    'total' => PastPapers::size($number),
                    'marks' => config('bcs_papers.marks')[$number] ?? PastPapers::size($number),
                    'special' => in_array($number, config('bcs_papers.special'), true),
                    'date' => ($date = config('bcs_papers.dates')[$number] ?? null) ? Carbon::parse($date) : null,
                ],
                'questions' => self::present($questions, $number),
                'explained' => $explained,
                'with' => $with,
                'subjects' => $subjects,
                'image' => $image,
                'pdf' => $pdf,
                'updated' => $questions->max('updated_at'),
                'newer' => in_array($number + 1, $numbers, true) ? self::label($number + 1) : null,
                'older' => in_array($number - 1, $numbers, true) ? self::label($number - 1) : null,
                'others' => collect($numbers)->reject(fn (int $other): bool => $other === $number)->map(self::label(...)),
                'notices' => self::notices(['bcs-general'])->sortByDesc(fn (array $notice): bool => str_contains($notice['title'], $paper['name']))->take(3),
            ],
            lang: 'bn',
            type: 'article',
            jsonLd: [
                self::article($path, "{$paper['name_bn']} প্রশ্ন সমাধান | {$paper['name']} Question Solution", $description, null, $questions->min('created_at'), $questions->max('updated_at')),
            ],
            crumbs: ['Home' => '/', 'BCS' => '/bcs', $paper['name'] => $path],
            index: $questions->count() >= self::ENOUGH_QUESTIONS,
        );
    }

    private static function subject(string $address): ?PublicPage
    {
        $subject = Subject::query()->firstWhere('slug', self::SUBJECTS[$address] ?? null);

        if (! $subject) {
            return null;
        }

        $all = self::paperQuestions(subject: $subject)->sortByDesc(fn (Question $question): string => sprintf('%03d-%06d', (int) $question->source, 999999 - ($question->numberOnPaper() ?? 0)));
        $questions = $all->filter(self::isExplained(...))
            ->unique(fn (Question $question): string => PastPapers::textKey($question->body))
            ->take(self::SUBJECT_PAGE_QUESTIONS)
            ->values();

        if ($questions->isEmpty()) {
            return null;
        }

        $path = "/bcs/subject/{$address}";
        $count = Bangla::digits($questions->count());
        $description = "বিসিএস {$subject->name_bn}: {$count}টি বিগত প্রশ্ন, সঠিক উত্তর ও সংক্ষিপ্ত নোট। Free BCS {$subject->name} questions with answers.";

        return new PublicPage(
            path: $path,
            title: self::subjectTitle($subject).' | bd3schools',
            description: $description,
            view: 'seo.bcs-subject',
            viewData: [
                'subject' => $subject,
                'total' => $all->count(),
                'questions' => collect(self::present($questions))->map(fn (array $question): array => [...$question, 'note' => self::note($question['explanation'])])->all(),
                'intro' => config("bcs_subjects.{$subject->slug}"),
                'byPaper' => $all->countBy(fn (Question $question): int => (int) $question->source)
                    ->sortKeysDesc()
                    ->map(fn (int $number, int $paper): array => [...self::label($paper), 'questions' => $number])
                    ->values(),
                'subjects' => self::subjectLinks(self::paperQuestions(['id', 'ref', 'source', 'subject_id'])),
                'updated' => $questions->max('updated_at'),
            ],
            lang: 'bn',
            type: 'article',
            jsonLd: [
                self::article($path, "বিসিএস {$subject->name_bn} প্রশ্ন সমাধান | BCS {$subject->name} Questions", $description, null, $questions->min('created_at'), $questions->max('updated_at')),
            ],
            crumbs: ['Home' => '/', 'BCS' => '/bcs', "BCS {$subject->name}" => $path],
            index: $questions->count() >= self::ENOUGH_QUESTIONS,
        );
    }

    private static function hub(string $address): PublicPage
    {
        $hub = self::HUBS[$address];
        $questions = self::examQuestions($hub['exams']);
        $shown = $questions->filter(self::isExplained(...))
            ->unique(fn (Question $question): string => PastPapers::textKey($question->body))
            // Questions known to be from a real exam come first.
            ->sortBy(fn (Question $question): int => filled($question->source) ? 0 : 1)
            ->take(self::HUB_QUESTIONS)
            ->values();

        return new PublicPage(
            path: "/{$address}",
            title: $hub['title'],
            description: $hub['description'],
            view: 'seo.hub',
            viewData: [
                'hub' => $hub,
                'path' => "/{$address}",
                'updated' => $questions->max('updated_at'),
                'total' => $questions->count(),
                'groups' => collect(self::present($shown))->groupBy('subject.name'),
                'exams' => self::catalogueExams($hub['exams']),
                'notices' => self::notices($hub['exams'])->take(5),
                'tests' => self::tests()->whereIn('exam', $hub['exams']),
                'hubs' => collect(self::HUBS)->except($address),
            ],
            lang: 'bn',
            jsonLd: [self::article("/{$address}", "{$hub['h1']} | {$hub['h1_en']}", $hub['description'], null, $questions->min('created_at'), $questions->max('updated_at'))],
            crumbs: ['Home' => '/', $hub['name'] => "/{$address}"],
            index: $shown->count() >= self::ENOUGH_QUESTIONS,
        );
    }

    private static function modelTests(): PublicPage
    {
        $tests = self::tests();
        $counts = PastPapers::index()->countBy('paper');

        return new PublicPage(
            path: '/model-tests',
            title: $tests->isEmpty()
                ? 'বিসিএস মডেল টেস্ট | Free Online BCS Model Test | bd3schools'
                : 'ফ্রি মডেল টেস্ট | BCS, NTRCA, Primary & Bank Model Test | bd3schools',
            description: $tests->isEmpty()
                ? 'বিসিএসের পুরো প্রশ্নপত্রে ফ্রি মডেল টেস্ট, সময় ও নেগেটিভ মার্কিংসহ। Free online BCS model tests with a timer and results.'
                : 'বিসিএস, এনটিআরসিএ, প্রাথমিক ও ব্যাংকের ফ্রি মডেল টেস্ট, নেগেটিভ মার্কিংসহ। Free online model tests with a timer and results.',
            view: 'seo.model-tests',
            viewData: [
                'tests' => $tests->groupBy('exam'),
                'exams' => self::catalogueExams($tests->pluck('exam')->unique()->all())->keyBy('slug'),
                'papers' => collect(PastPapers::numbers())
                    ->filter(fn (int $number): bool => isset($counts[$number]))
                    ->map(fn (int $number): array => self::label($number)),
            ],
            lang: 'bn',
            crumbs: ['Home' => '/', 'Model tests' => '/model-tests'],
        );
    }

    /**
     * Live questions printed on a real BCS paper.
     *
     * @param  list<string>  $columns
     * @return Collection<int, Question>
     */
    private static function paperQuestions(array $columns = ['*'], ?string $source = null, ?Subject $subject = null): Collection
    {
        return Question::query()
            ->live()
            ->with('subject')
            ->whereIn('source', $source ? [$source] : array_map(PastPapers::source(...), PastPapers::numbers()))
            ->when($subject, fn ($query) => $query->where('subject_id', $subject->id))
            ->orderBy('id')
            ->get($columns)
            ->filter(fn (Question $question): bool => $question->isOnPaper())
            ->values()
            ->toBase();
    }

    /**
     * @param  list<string>  $exams
     * @return Collection<int, Question>
     */
    private static function examQuestions(array $exams): Collection
    {
        return Question::query()
            ->live()
            ->with('subject')
            ->whereHas('exam', fn ($query) => $query->whereIn('slug', $exams))
            ->orderBy('id')
            ->get()
            ->toBase();
    }

    /**
     * The printable file of a paper, when the website build has one.
     */
    private static function pdf(int $number): ?string
    {
        $shell = PageShell::path();
        $file = "/downloads/bcs-pdfs/{$number}th-bcs-question-solution-pdf.pdf";

        return $shell && is_file(dirname($shell).$file) ? $file : null;
    }

    private static function subjectTitle(Subject $subject): string
    {
        $title = "বিসিএস {$subject->name_bn} প্রশ্ন সমাধান | BCS {$subject->name} Questions";

        foreach (["BCS {$subject->name} | বিসিএস {$subject->name_bn} প্রশ্ন", "BCS {$subject->name} | {$subject->name_bn}"] as $shorter) {
            $title = mb_strlen($title) <= 62 ? $title : $shorter;
        }

        return mb_strlen($title) <= 62 ? $title : "BCS {$subject->name} Questions & Answers";
    }

    /**
     * The first sentence of an explanation, as a one-line note.
     */
    private static function note(?string $explanation): ?string
    {
        $text = str((string) $explanation)->replaceMatches('/[•◉●▪]|^\s*[-–*]\s*/mu', ' ')->squish()->toString();
        $sentence = preg_split('/(?<=[।?!])\s|(?<=\.)\s(?=[A-Z\x{0980}-\x{09FF}])/u', $text, 2)[0] ?? '';

        return $sentence === '' ? null : PublicPage::fit($sentence, 110);
    }

    private static function isExplained(Question $question): bool
    {
        return mb_strlen(trim((string) $question->ownExplanation())) >= self::EXPLAINED_FROM;
    }

    /**
     * @param  Collection<int, Question>  $questions
     * @return list<array<string, mixed>>
     */
    public static function present(Collection $questions, ?int $paper = null): array
    {
        $repeats = PastPapers::repeats();
        $pages = QuestionPages::index();

        return $questions->map(function (Question $question, int $index) use ($paper, $repeats, $pages): array {
            $own = PastPapers::yearOfSource($question->source) ? (int) $question->source : null;
            $papers = $own ? ($repeats[PastPapers::textKey($question->body)] ?? []) : [];

            return [
                'id' => $question->id,
                'page' => $pages[$question->id]['path'] ?? null,
                'number' => $paper ? $question->numberOnPaper() ?? $index + 1 : $index + 1,
                'paper_number' => $question->numberOnPaper(),
                'lang' => $question->lang,
                'body' => $question->body,
                'options' => $question->options,
                'answer' => $question->answer_index,
                'explanation' => $question->ownExplanation(),
                'subject' => [
                    'name' => $question->subject->name,
                    'name_bn' => $question->subject->name_bn,
                    'path' => self::subjectPath($question->subject->slug),
                ],
                'from' => ! $paper && $own ? self::label($own) : null,
                'source' => $own ? null : $question->source,
                'also' => collect($papers)->reject(fn (int $other): bool => $other === $own)->map(self::label(...))->values()->all(),
            ];
        })->all();
    }

    /**
     * @param  Collection<int, Question>  $questions
     * @return Collection<int, array{name: string, name_bn: string, path: string, questions: int}>
     */
    private static function subjectLinks(Collection $questions): Collection
    {
        $bySlug = $questions->groupBy('subject.slug');

        return collect(self::SUBJECTS)
            ->filter(fn (string $slug): bool => $bySlug->has($slug))
            ->map(fn (string $slug): array => [
                'name' => $bySlug[$slug]->first()->subject->name,
                'name_bn' => $bySlug[$slug]->first()->subject->name_bn,
                'path' => self::subjectPath($slug),
                'questions' => $bySlug[$slug]->count(),
            ])
            ->values();
    }

    /**
     * @return array{number: int, name: string, name_bn: string, year: int|null, path: string}
     */
    private static function label(int $number): array
    {
        return [...PastPapers::label($number), 'path' => self::paperPath($number)];
    }

    /**
     * Published model tests, without their questions.
     *
     * @return Collection<int, array<string, mixed>>
     */
    private static function tests(): Collection
    {
        return ModelTest::query()->published()->orderBy('id')
            ->get(['id', 'title', 'title_bn', 'slug', 'exam_slug', 'duration_minutes', 'total_marks', 'negative_marking', 'total_questions', 'syllabus'])
            ->toBase()
            ->map(fn (ModelTest $test): array => [
                'title' => $test->title,
                'title_bn' => $test->title_bn,
                'exam' => $test->catalogExamSlug(),
                'minutes' => $test->duration_minutes,
                'marks' => (float) $test->total_marks,
                'negative' => (float) $test->negative_marking,
                'questions' => $test->total_questions,
                'syllabus' => collect($test->syllabus ?? [])->map(fn (array $part): string => "{$part['name']} {$part['count']}")->join(', '),
            ]);
    }

    /**
     * @param  list<string>  $slugs
     * @return Collection<int, array<string, mixed>>
     */
    private static function catalogueExams(array $slugs): Collection
    {
        return collect(PageShell::content()['exams'] ?? [])->whereIn('slug', $slugs)->values();
    }

    /**
     * @param  list<string>  $exams
     * @return Collection<int, array<string, mixed>>
     */
    private static function notices(array $exams): Collection
    {
        return NoticePages::all()->whereIn('exam', $exams)->values();
    }

    /**
     * @return array<string, mixed>
     */
    private static function article(string $path, string $headline, string $description, ?string $image, ?Carbon $published, ?Carbon $modified): array
    {
        return PublicPage::article($path, $headline, $description, $published?->toIso8601String(), $modified?->toIso8601String(), $image, 'bn');
    }
}
