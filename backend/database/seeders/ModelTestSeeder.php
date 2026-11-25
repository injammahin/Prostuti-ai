<?php

namespace Database\Seeders;

use App\Models\ModelTest;
use App\Services\ModelTestGeneratorService;
use Illuminate\Database\Seeder;

class ModelTestSeeder extends Seeder
{
    /**
     * Add the starter model tests. Tests that already exist are left alone.
     */
    public function run(): void
    {
        foreach (self::starterTests() as $slug => $starterTest) {
            if (ModelTest::query()->where('slug', $slug)->exists()) {
                continue;
            }

            ModelTest::query()->create([
                ...self::contentFor($starterTest),
                'slug' => $slug,
                'status' => 'published',
                'starts_at' => now(),
                'attempts_count' => 0,
            ]);
        }
    }

    /**
     * Rebuild the starter tests that already exist, so they follow the current exam format.
     */
    public static function refreshExisting(): void
    {
        foreach (self::starterTests() as $slug => $starterTest) {
            ModelTest::query()->where('slug', $slug)->first()?->update([
                ...self::contentFor($starterTest),
                'attempts_count' => 0,
            ]);
        }
    }

    /**
     * @return array<string, array{title: string, title_bn: string, exam: string, type: string, minutes: int, pass: int, difficulty: string, syllabus: list<array<string, mixed>>}>
     */
    private static function starterTests(): array
    {
        $subject = fn (string $slug, string $name, string $nameBn, int $count): array => [
            'slug' => $slug, 'name' => $name, 'name_bn' => $nameBn, 'count' => $count, 'file' => "questions-{$slug}.json",
        ];

        $tests = [];

        for ($number = 1; $number <= 5; $number++) {
            $tests["bcs-prelim-model-test-{$number}"] = [
                'title' => "BCS Preliminary Full Model Test #{$number}",
                'title_bn' => "বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ মডেল টেস্ট #{$number}",
                'exam' => 'bcs-general', 'type' => 'full', 'minutes' => 120, 'pass' => 100,
                'difficulty' => $number % 2 === 0 ? 'challenging' : 'standard',
                'syllabus' => ModelTestGeneratorService::BCS_SYLLABUS,
            ];
        }

        return $tests + [
            'primary-full-model-test-1' => [
                'title' => 'Primary Assistant Teacher Full Model Test',
                'title_bn' => 'প্রাথমিক সহকারী শিক্ষক পূর্ণাঙ্গ মডেল টেস্ট',
                'exam' => 'primary', 'type' => 'full', 'minutes' => 90, 'pass' => 45, 'difficulty' => 'standard',
                'syllabus' => ModelTestGeneratorService::PRIMARY_SYLLABUS,
            ],
            'combined-bank-so-1' => [
                'title' => 'Combined Bank Senior Officer Model Test',
                'title_bn' => 'সমন্বিত ব্যাংক সিনিয়র অফিসার মডেল টেস্ট',
                'exam' => 'bank', 'type' => 'full', 'minutes' => 60, 'pass' => 50, 'difficulty' => 'challenging',
                'syllabus' => ModelTestGeneratorService::BANK_SYLLABUS,
            ],
            'bb-ad-general-1' => [
                'title' => 'Bangladesh Bank Assistant Director Model Test',
                'title_bn' => 'বাংলাদেশ ব্যাংক সহকারী পরিচালক মডেল টেস্ট',
                'exam' => 'bank', 'type' => 'full', 'minutes' => 60, 'pass' => 50, 'difficulty' => 'challenging',
                'syllabus' => ModelTestGeneratorService::BANK_SYLLABUS,
            ],
            'bank-math-speed-drill' => [
                'title' => 'Combined Bank: Quantitative Math Speed Drill',
                'title_bn' => 'সমন্বিত ব্যাংক: গাণিতিক স্পিড ড্রিল',
                'exam' => 'bank', 'type' => 'speed_drill', 'minutes' => 25, 'pass' => 15, 'difficulty' => 'standard',
                'syllabus' => [$subject('math', 'Mathematics', 'গণিত', 30)],
            ],
            'primary-bangla-math-quick' => [
                'title' => 'Primary Teacher: Bangla & Math Quick Test',
                'title_bn' => 'প্রাথমিক শিক্ষক: বাংলা ও গণিত কুইক টেস্ট',
                'exam' => 'primary', 'type' => 'subject', 'minutes' => 30, 'pass' => 20, 'difficulty' => 'standard',
                'syllabus' => [$subject('bangla', 'Bangla', 'বাংলা', 20), $subject('math', 'Mathematics', 'গণিত', 20)],
            ],
            'ntrca-gk-math-drill' => [
                'title' => 'NTRCA: General Knowledge & Math Drill',
                'title_bn' => 'এনটিআরসিএ: সাধারণ জ্ঞান ও গণিত ড্রিল',
                'exam' => 'ntrca', 'type' => 'subject', 'minutes' => 35, 'pass' => 20, 'difficulty' => 'standard',
                'syllabus' => [$subject('bd-affairs', 'General Knowledge', 'সাধারণ জ্ঞান', 25), $subject('math', 'General Mathematics', 'সাধারণ গণিত', 25)],
            ],
        ];
    }

    /**
     * @param  array{title: string, title_bn: string, exam: string, type: string, minutes: int, pass: int, difficulty: string, syllabus: list<array<string, mixed>>}  $starterTest
     * @return array<string, mixed>
     */
    private static function contentFor(array $starterTest): array
    {
        $questions = ModelTestGeneratorService::generateForSyllabus($starterTest['syllabus'], $starterTest['exam'], $starterTest['difficulty']);

        return [
            'title' => $starterTest['title'],
            'title_bn' => $starterTest['title_bn'],
            'exam_slug' => $starterTest['exam'],
            'type' => $starterTest['type'],
            'duration_minutes' => $starterTest['minutes'],
            'total_marks' => count($questions),
            'pass_marks' => $starterTest['pass'],
            'negative_marking' => ModelTestGeneratorService::negativeMark($starterTest['exam']),
            'total_questions' => count($questions),
            'syllabus' => $starterTest['syllabus'],
            'questions_data' => $questions,
            'difficulty' => $starterTest['difficulty'],
        ];
    }
}
