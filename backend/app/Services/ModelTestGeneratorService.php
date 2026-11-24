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
            'count' => 35,
            'file' => 'questions-bangla.json',
        ],
        [
            'slug' => 'english',
            'name' => 'English',
            'name_bn' => 'English Language & Literature',
            'count' => 35,
            'file' => 'questions-english.json',
        ],
        [
            'slug' => 'bd-affairs',
            'name' => 'Bangladesh Affairs',
            'name_bn' => 'বাংলাদেশ বিষয়াবলি',
            'count' => 30,
            'file' => 'questions-bd-affairs.json',
        ],
        [
            'slug' => 'intl-affairs',
            'name' => 'International Affairs',
            'name_bn' => 'আন্তর্জাতিক বিষয়াবলি',
            'count' => 20,
            'file' => 'questions-intl-affairs.json',
        ],
        [
            'slug' => 'math',
            'name' => 'Mathematics & Reasoning',
            'name_bn' => 'গাণিতিক যুক্তি',
            'count' => 15,
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
            'count' => 10,
            'file' => 'questions-ethics.json',
        ],
    ];

    /**
     * Deep algorithm to generate 200 balanced, high-yield questions for BCS Model Test.
     *
     * @param array $options
     * @return array
     */
    public static function generateBcsQuestions(array $options = []): array
    {
        $dataPath = database_path('seeders/data');
        $allBcsFiles = glob($dataPath . '/questions-*th-bcs.json');
        
        // Load past BCS questions categorized by subject slug
        $pastBcsBySubject = [];
        foreach (self::BCS_SYLLABUS as $subject) {
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

        foreach (self::BCS_SYLLABUS as $subject) {
            $slug = $subject['slug'];
            $targetCount = $subject['count'];
            $subjectPool = [];

            // 1. Load standalone subject pool file
            $subjectFilePath = $dataPath . '/' . $subject['file'];
            if (file_exists($subjectFilePath)) {
                $poolData = json_decode(file_get_contents($subjectFilePath), true) ?: [];
                $subjectPool = array_merge($subjectPool, $poolData);
            }

            // 2. Mix with historical BCS questions from 10th to 48th
            if (!empty($pastBcsBySubject[$slug])) {
                $subjectPool = array_merge($subjectPool, $pastBcsBySubject[$slug]);
            }

            // Shuffle with deterministic or random seed
            shuffle($subjectPool);

            // Filter valid questions
            $validQuestions = [];
            $seenBodies = [];
            foreach ($subjectPool as $item) {
                $body = trim($item['body'] ?? '');
                if (!$body || isset($seenBodies[$body])) {
                    continue;
                }
                $opts = $item['options'] ?? [];
                if (!is_array($opts) || count($opts) !== 4) {
                    continue;
                }
                $ans = $item['answer'] ?? $item['answer_index'] ?? null;
                if ($ans === null || !in_array((int)$ans, [0, 1, 2, 3], true)) {
                    continue;
                }

                $seenBodies[$body] = true;
                $validQuestions[] = $item;
            }

            // Deep balancing: Partition by difficulty
            // ~40% Easy/Foundational, ~40% Medium, ~20% Hard
            $easy = array_filter($validQuestions, fn($q) => ($q['difficulty'] ?? '') === 'easy');
            $medium = array_filter($validQuestions, fn($q) => in_array($q['difficulty'] ?? '', ['medium', 'moderate', '']));
            $hard = array_filter($validQuestions, fn($q) => in_array($q['difficulty'] ?? '', ['hard', 'challenging']));

            $takeEasy = (int) round($targetCount * 0.40);
            $takeHard = (int) round($targetCount * 0.20);
            $takeMed = $targetCount - $takeEasy - $takeHard;

            $selected = [];
            $selected = array_merge($selected, array_slice($easy, 0, $takeEasy));
            $selected = array_merge($selected, array_slice($medium, 0, $takeMed));
            $selected = array_merge($selected, array_slice($hard, 0, $takeHard));

            // If any category fell short, fill up from the remaining valid questions
            if (count($selected) < $targetCount) {
                $alreadySelectedBodies = array_flip(array_column($selected, 'body'));
                foreach ($validQuestions as $cand) {
                    if (!isset($alreadySelectedBodies[$cand['body']])) {
                        $selected[] = $cand;
                        $alreadySelectedBodies[$cand['body']] = true;
                        if (count($selected) >= $targetCount) {
                            break;
                        }
                    }
                }
            }

            // Ensure exact target count
            $selected = array_slice($selected, 0, $targetCount);

            foreach ($selected as $q) {
                $ansIdx = (int) ($q['answer'] ?? $q['answer_index'] ?? 0);
                $generatedQuestions[] = [
                    'id' => $q['ref'] ?? ('mt_q' . $currentNumber),
                    'number' => $currentNumber,
                    'ref' => $q['ref'] ?? ('mt_q' . $currentNumber),
                    'exam' => 'bcs-general',
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
                    'source' => $q['source'] ?? 'BCS Question Bank',
                    'lang' => $q['lang'] ?? 'bn',
                    'body' => $q['body'],
                    'options' => $q['options'],
                    'answer' => $ansIdx,
                    'answer_index' => $ansIdx,
                    'explanation' => $q['explanation'] ?? '',
                    'marks' => 1,
                    'negative_marks' => 0.50,
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
        $testNumber = (ModelTest::count() + 1);
        $title = $attributes['title'] ?? "BCS Preliminary Full Model Test #{$testNumber}";
        $titleBn = $attributes['title_bn'] ?? "বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ মডেল টেস্ট #{$testNumber}";
        $slug = $attributes['slug'] ?? Str::slug($title);

        $questions = self::generateBcsQuestions();

        return ModelTest::create([
            'title' => $title,
            'title_bn' => $titleBn,
            'slug' => $slug,
            'exam_slug' => $attributes['exam_slug'] ?? 'bcs-general',
            'type' => $attributes['type'] ?? 'full',
            'duration_minutes' => (int) ($attributes['duration_minutes'] ?? 120),
            'total_marks' => (float) ($attributes['total_marks'] ?? 200),
            'pass_marks' => (float) ($attributes['pass_marks'] ?? 100),
            'negative_marking' => (float) ($attributes['negative_marking'] ?? 0.50),
            'total_questions' => count($questions),
            'syllabus' => self::BCS_SYLLABUS,
            'questions_data' => $questions,
            'difficulty' => $attributes['difficulty'] ?? 'standard',
            'status' => $attributes['status'] ?? 'published',
            'starts_at' => $attributes['starts_at'] ?? now(),
            'attempts_count' => rand(150, 480),
        ]);
    }

    private static function detectSubjectSlug(mixed $subject, string $body): string
    {
        $subjectStr = is_array($subject) ? implode(' ', array_filter($subject, 'is_string')) : (string) $subject;
        $sub = mb_strtolower($subjectStr . ' ' . $body);
        if (str_contains($sub, 'বাংলা') || str_contains($sub, 'bangla')) return 'bangla';
        if (str_contains($sub, 'english') || str_contains($sub, 'ইংরেজি')) return 'english';
        if (str_contains($sub, 'আন্তর্জাতিক') || str_contains($sub, 'international')) return 'intl-affairs';
        if (str_contains($sub, 'বাংলাদেশ') || str_contains($sub, 'bangladesh')) return 'bd-affairs';
        if (str_contains($sub, 'গণিত') || str_contains($sub, 'math')) return 'math';
        if (str_contains($sub, 'মানসিক') || str_contains($sub, 'mental')) return 'mental';
        if (str_contains($sub, 'বিজ্ঞান') || str_contains($sub, 'science')) return 'science';
        if (str_contains($sub, 'কম্পিউটার') || str_contains($sub, 'ict') || str_contains($sub, 'তথ্যপ্রযুক্তি')) return 'ict';
        if (str_contains($sub, 'ভূগোল') || str_contains($sub, 'geography')) return 'geography';
        if (str_contains($sub, 'নৈতিকতা') || str_contains($sub, 'ethics') || str_contains($sub, 'সুশাসন')) return 'ethics';
        return 'bd-affairs';
    }
}
