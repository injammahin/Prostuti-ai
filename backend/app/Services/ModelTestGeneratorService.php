<?php

namespace App\Services;

use App\Models\ModelTest;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ModelTestGeneratorService
{
    /**
     * BPSC Standard Preliminary Syllabus (200 marks / 200 questions).
     */
    public const BCS_SYLLABUS = [
        [
            'slug' => 'bangla',
            'name' => 'Bangla',
            'name_bn' => 'বাংলা ভাষা ও সাহিত্য',
            'count' => 30,
            'file' => 'questions-bangla.json',
        ],
        [
            'slug' => 'english',
            'name' => 'English',
            'name_bn' => 'English Language & Literature',
            'count' => 30,
            'file' => 'questions-english.json',
        ],
        [
            'slug' => 'bd-affairs',
            'name' => 'Bangladesh Affairs',
            'name_bn' => 'বাংলাদেশ বিষয়াবলি',
            'count' => 25,
            'file' => 'questions-bd-affairs.json',
        ],
        [
            'slug' => 'intl-affairs',
            'name' => 'International Affairs',
            'name_bn' => 'আন্তর্জাতিক বিষয়াবলি',
            'count' => 25,
            'file' => 'questions-intl-affairs.json',
        ],
        [
            'slug' => 'math',
            'name' => 'Mathematics & Reasoning',
            'name_bn' => 'গাণিতিক যুক্তি',
            'count' => 20,
            'file' => 'questions-math.json',
        ],
        [
            'slug' => 'mental',
            'name' => 'Mental & Analytical Ability',
            'name_bn' => 'মানসিক দক্ষতা',
            'count' => 15,
            'file' => 'questions-mental.json',
        ],
        [
            'slug' => 'science',
            'name' => 'General Science',
            'name_bn' => 'সাধারণ বিজ্ঞান',
            'count' => 15,
            'file' => 'questions-science.json',
        ],
        [
            'slug' => 'ict',
            'name' => 'Computer & ICT',
            'name_bn' => 'কম্পিউটার ও তথ্যপ্রযুক্তি',
            'count' => 15,
            'file' => 'questions-ict.json',
        ],
        [
            'slug' => 'geography',
            'name' => 'Geography',
            'name_bn' => 'ভূগোল, পরিবেশ ও দুর্যোগ',
            'count' => 10,
            'file' => 'questions-geography.json',
        ],
        [
            'slug' => 'ethics',
            'name' => 'Ethics, Values & Governance',
            'name_bn' => 'নৈতিকতা ও সুশাসন',
            'count' => 15,
            'file' => 'questions-ethics.json',
        ],
    ];

    public const BANK_SYLLABUS = [
        ['slug' => 'bangla', 'name' => 'Bangla', 'name_bn' => 'বাংলা ভাষা ও ব্যাকরণ', 'count' => 20, 'file' => 'questions-bangla.json'],
        ['slug' => 'english', 'name' => 'English', 'name_bn' => 'English Grammar & Language', 'count' => 20, 'file' => 'questions-english.json'],
        ['slug' => 'math', 'name' => 'General Mathematics', 'name_bn' => 'সাধারণ গণিত', 'count' => 20, 'file' => 'questions-math.json'],
        ['slug' => 'mental', 'name' => 'Analytical Skill', 'name_bn' => 'অ্যানালিটিক্যাল স্কিল', 'count' => 20, 'file' => 'questions-mental.json'],
        ['slug' => 'ict', 'name' => 'Basic ICT', 'name_bn' => 'বেসিক আইসিটি', 'count' => 10, 'file' => 'questions-ict.json'],
        ['slug' => 'bd-affairs', 'name' => 'General Knowledge', 'name_bn' => 'সাধারণ জ্ঞান', 'count' => 10, 'file' => 'questions-bd-affairs.json'],
    ];

    /** 2025 recruitment rules: 90 marks written, 90 minutes. */
    public const PRIMARY_SYLLABUS = [
        ['slug' => 'bangla', 'name' => 'Bangla', 'name_bn' => 'বাংলা', 'count' => 25, 'file' => 'questions-bangla.json'],
        ['slug' => 'english', 'name' => 'English', 'name_bn' => 'ইংরেজি', 'count' => 25, 'file' => 'questions-english.json'],
        ['slug' => 'math', 'name' => 'Mathematics', 'name_bn' => 'গণিত', 'count' => 10, 'file' => 'questions-math.json'],
        ['slug' => 'science', 'name' => 'Everyday Science', 'name_bn' => 'দৈনন্দিন বিজ্ঞান', 'count' => 10, 'file' => 'questions-science.json'],
        ['slug' => 'bd-affairs', 'name' => 'Bangladesh Affairs', 'name_bn' => 'বাংলাদেশ বিষয়াবলি', 'count' => 10, 'file' => 'questions-bd-affairs.json'],
        ['slug' => 'intl-affairs', 'name' => 'International Affairs', 'name_bn' => 'আন্তর্জাতিক বিষয়াবলি', 'count' => 10, 'file' => 'questions-intl-affairs.json'],
    ];

    public const NTRCA_SYLLABUS = [
        ['slug' => 'bangla', 'name' => 'Bangla', 'name_bn' => 'বাংলা', 'count' => 25, 'file' => 'questions-bangla.json'],
        ['slug' => 'english', 'name' => 'English', 'name_bn' => 'English', 'count' => 25, 'file' => 'questions-english.json'],
        ['slug' => 'math', 'name' => 'Mathematics', 'name_bn' => 'গণিত', 'count' => 25, 'file' => 'questions-math.json'],
        ['slug' => 'bd-affairs', 'name' => 'General Knowledge', 'name_bn' => 'সাধারণ জ্ঞান', 'count' => 25, 'file' => 'questions-bd-affairs.json'],
    ];

    /**
     * Deep algorithm to generate balanced questions for any target examination.
     */
    public static function generateQuestionsForExam(string $examSlug = 'bcs-general', string $difficulty = 'standard'): array
    {
        $syllabus = match ($examSlug) {
            'bank' => self::BANK_SYLLABUS,
            'primary' => self::PRIMARY_SYLLABUS,
            'ntrca' => self::NTRCA_SYLLABUS,
            default => self::BCS_SYLLABUS,
        };

        return self::generateForSyllabus($syllabus, $examSlug, $difficulty);
    }

    /** Marks lost for a wrong answer in the real exam. */
    public static function negativeMark(string $examSlug): float
    {
        return in_array($examSlug, ['bank', 'primary', 'ntrca'], true) ? 0.25 : 0.50;
    }

    /**
     * Pick questions for each subject of a syllabus.
     *
     * @param  list<array{slug: string, name: string, name_bn: string, count: int, file: string}>  $syllabus
     * @return list<array<string, mixed>>
     */
    public static function generateForSyllabus(array $syllabus, string $examSlug = 'bcs-general', string $difficulty = 'standard'): array
    {
        $dataPath = database_path('seeders/data');
        $allBcsFiles = glob($dataPath.'/questions-*th-bcs.json') ?: [];

        $pastBcsBySubject = [];
        foreach ($syllabus as $subject) {
            $pastBcsBySubject[$subject['slug']] = [];
        }

        foreach ($allBcsFiles as $bcsFile) {
            if (file_exists($bcsFile)) {
                $raw = json_decode(file_get_contents($bcsFile), true) ?: [];
                foreach ($raw as $q) {
                    if (empty($q['body']) || empty($q['options']) || count($q['options']) !== 4) {
                        continue;
                    }
                    $subSlug = self::detectSubjectSlug($q['subject'] ?? '', $q['body'] ?? '');
                    if (isset($pastBcsBySubject[$subSlug])) {
                        $pastBcsBySubject[$subSlug][] = $q;
                    }
                }
            }
        }

        $generatedQuestions = [];
        $currentNumber = 1;

        foreach ($syllabus as $subject) {
            $slug = $subject['slug'];
            $targetCount = $subject['count'];
            $subjectPool = [];

            // 1. Load standalone subject pool file
            $subjectFilePath = $dataPath.'/'.$subject['file'];
            if (file_exists($subjectFilePath)) {
                $poolData = json_decode(file_get_contents($subjectFilePath), true) ?: [];
                $subjectPool = array_merge($subjectPool, $poolData);
            }

            // 2. Mix with historical BCS questions
            if (! empty($pastBcsBySubject[$slug])) {
                $subjectPool = array_merge($subjectPool, $pastBcsBySubject[$slug]);
            }

            // Shuffle
            shuffle($subjectPool);

            // Filter valid questions
            $validQuestions = [];
            $seenBodies = [];
            foreach ($subjectPool as $item) {
                $body = trim($item['body'] ?? '');
                if (! $body || isset($seenBodies[$body])) {
                    continue;
                }
                $opts = $item['options'] ?? [];
                if (! is_array($opts) || count($opts) !== 4) {
                    continue;
                }
                $ans = $item['answer'] ?? $item['answer_index'] ?? null;
                if ($ans === null || ! in_array((int) $ans, [0, 1, 2, 3], true)) {
                    continue;
                }

                $seenBodies[$body] = true;
                $validQuestions[] = $item;
            }

            // Balancing based on requested difficulty
            $easyRatio = match ($difficulty) {
                'moderate' => 0.60,
                'challenging' => 0.20,
                default => 0.40,
            };
            $hardRatio = match ($difficulty) {
                'moderate' => 0.10,
                'challenging' => 0.40,
                default => 0.20,
            };

            $easy = array_filter($validQuestions, fn ($q) => ($q['difficulty'] ?? '') === 'easy');
            $medium = array_filter($validQuestions, fn ($q) => in_array($q['difficulty'] ?? '', ['medium', 'moderate', '']));
            $hard = array_filter($validQuestions, fn ($q) => in_array($q['difficulty'] ?? '', ['hard', 'challenging']));

            $takeEasy = (int) round($targetCount * $easyRatio);
            $takeHard = (int) round($targetCount * $hardRatio);
            $takeMed = max(0, $targetCount - $takeEasy - $takeHard);

            $selected = [];
            $selected = array_merge($selected, array_slice($easy, 0, $takeEasy));
            $selected = array_merge($selected, array_slice($medium, 0, $takeMed));
            $selected = array_merge($selected, array_slice($hard, 0, $takeHard));

            if (count($selected) < $targetCount) {
                $alreadySelectedBodies = array_flip(array_column($selected, 'body'));
                foreach ($validQuestions as $cand) {
                    if (! isset($alreadySelectedBodies[$cand['body']])) {
                        $selected[] = $cand;
                        $alreadySelectedBodies[$cand['body']] = true;
                        if (count($selected) >= $targetCount) {
                            break;
                        }
                    }
                }
            }

            $selected = array_slice($selected, 0, $targetCount);

            foreach ($selected as $q) {
                $ansIdx = (int) ($q['answer'] ?? $q['answer_index'] ?? 0);
                $generatedQuestions[] = [
                    'id' => $q['ref'] ?? ('mt_q'.$currentNumber),
                    'number' => $currentNumber,
                    'ref' => $q['ref'] ?? ('mt_q'.$currentNumber),
                    'exam' => $examSlug,
                    'subject' => [
                        'name' => $subject['name'],
                        'name_bn' => $subject['name_bn'],
                        'slug' => $subject['slug'],
                    ],
                    'subject_name' => $subject['name'],
                    'subject_name_bn' => $subject['name_bn'],
                    'subject_slug' => $subject['slug'],
                    'topic' => $q['topic'] ?? $subject['name_bn'],
                    'difficulty' => $q['difficulty'] ?? 'medium',
                    'source' => $q['source'] ?? 'Question Bank',
                    'lang' => $q['lang'] ?? 'bn',
                    'body' => $q['body'],
                    'options' => $q['options'],
                    'answer' => $ansIdx,
                    'answer_index' => $ansIdx,
                    'explanation' => $q['explanation'] ?? '',
                    'marks' => 1,
                    'negative_marks' => self::negativeMark($examSlug),
                    'cancelled' => false,
                ];
                $currentNumber++;
            }
        }

        return $generatedQuestions;
    }

    /**
     * Create or auto-generate a full ModelTest record.
     */
    public static function createAutoModelTest(array $attributes = []): ModelTest
    {
        $examSlug = $attributes['exam_slug'] ?? 'bcs-general';
        $difficulty = $attributes['difficulty'] ?? 'standard';

        $testCount = ModelTest::where('exam_slug', $examSlug)->count() + 1;

        $defaultTitle = match ($examSlug) {
            'bank' => "Combined Bank Senior Officer Model Test #{$testCount}",
            'primary' => "Primary Assistant Teacher Full Model Test #{$testCount}",
            'ntrca' => "NTRCA Teacher Registration Model Test #{$testCount}",
            default => "BCS Preliminary Full Model Test #{$testCount}",
        };
        $defaultTitleBn = match ($examSlug) {
            'bank' => "সমন্বিত ব্যাংক সিনিয়র অফিসার মডেল টেস্ট #{$testCount}",
            'primary' => "প্রাথমিক সহকারী শিক্ষক পূর্ণাঙ্গ মডেল টেস্ট #{$testCount}",
            'ntrca' => "এনটিআরসিএ শিক্ষক নিবন্ধন মডেল টেস্ট #{$testCount}",
            default => "বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ মডেল টেস্ট #{$testCount}",
        };

        $title = $attributes['title'] ?? $defaultTitle;
        $titleBn = $attributes['title_bn'] ?? $defaultTitleBn;

        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;
        while (ModelTest::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $questions = self::generateQuestionsForExam($examSlug, $difficulty);

        $syllabus = match ($examSlug) {
            'bank' => self::BANK_SYLLABUS,
            'primary' => self::PRIMARY_SYLLABUS,
            'ntrca' => self::NTRCA_SYLLABUS,
            default => self::BCS_SYLLABUS,
        };

        $defaultDuration = match ($examSlug) {
            'primary' => 90,
            'bank', 'ntrca' => 60,
            default => 120,
        };

        $defaultMarks = count($questions);
        $defaultPassMarks = match ($examSlug) {
            'primary' => 45,
            'ntrca' => 40,
            'bank' => 50,
            default => 100,
        };

        $defaultNegative = self::negativeMark($examSlug);

        return ModelTest::create([
            'title' => $title,
            'title_bn' => $titleBn,
            'slug' => $slug,
            'exam_slug' => $examSlug,
            'type' => $attributes['type'] ?? 'full',
            'duration_minutes' => (int) ($attributes['duration_minutes'] ?? $defaultDuration),
            'total_marks' => (float) ($attributes['total_marks'] ?? $defaultMarks),
            'pass_marks' => (float) ($attributes['pass_marks'] ?? $defaultPassMarks),
            'negative_marking' => (float) ($attributes['negative_marking'] ?? $defaultNegative),
            'total_questions' => count($questions),
            'syllabus' => $syllabus,
            'questions_data' => $questions,
            'difficulty' => $difficulty,
            'status' => $attributes['status'] ?? 'published',
            'starts_at' => $attributes['starts_at'] ?? now(),
            'ends_at' => $attributes['ends_at'] ?? null,
            'attempts_count' => (int) ($attributes['attempts_count'] ?? 0),
        ]);
    }

    private static function detectSubjectSlug(mixed $subject, string $body): string
    {
        $subjectStr = is_array($subject) ? implode(' ', array_filter($subject, 'is_string')) : (string) $subject;
        $sub = mb_strtolower(trim($subjectStr) !== '' ? $subjectStr : $body);
        if (str_contains($sub, 'বাংলাদেশ') || str_contains($sub, 'bangladesh')) {
            return 'bd-affairs';
        }
        if (str_contains($sub, 'বাংলা') || str_contains($sub, 'bangla')) {
            return 'bangla';
        }
        if (str_contains($sub, 'english') || str_contains($sub, 'ইংরেজি')) {
            return 'english';
        }
        if (str_contains($sub, 'আন্তর্জাতিক') || str_contains($sub, 'international')) {
            return 'intl-affairs';
        }
        if (str_contains($sub, 'গণিত') || str_contains($sub, 'math')) {
            return 'math';
        }
        if (str_contains($sub, 'মানসিক') || str_contains($sub, 'mental')) {
            return 'mental';
        }
        if (str_contains($sub, 'বিজ্ঞান') || str_contains($sub, 'science')) {
            return 'science';
        }
        if (str_contains($sub, 'কম্পিউটার') || str_contains($sub, 'ict') || str_contains($sub, 'তথ্যপ্রযুক্তি')) {
            return 'ict';
        }
        if (str_contains($sub, 'ভূগোল') || str_contains($sub, 'geography')) {
            return 'geography';
        }
        if (str_contains($sub, 'নৈতিকতা') || str_contains($sub, 'ethics') || str_contains($sub, 'সুশাসন')) {
            return 'ethics';
        }

        return 'bd-affairs';
    }
}
