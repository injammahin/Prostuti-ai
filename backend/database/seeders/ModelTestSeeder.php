<?php

namespace Database\Seeders;

use App\Models\ModelTest;
use App\Services\ModelTestGeneratorService;
use Illuminate\Database\Seeder;

class ModelTestSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Generate 5 Standard Full BCS Model Tests using the deep algorithm
        for ($i = 1; $i <= 5; $i++) {
            $slug = "bcs-prelim-model-test-{$i}";
            if (ModelTest::where('slug', $slug)->exists()) {
                continue;
            }

            $questions = ModelTestGeneratorService::generateBcsQuestions();

            ModelTest::create([
                'title' => "BCS Preliminary Full Model Test #{$i}",
                'title_bn' => "বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ মডেল টেস্ট #{$i}",
                'slug' => $slug,
                'exam_slug' => 'bcs-general',
                'type' => 'full',
                'duration_minutes' => 120,
                'total_marks' => 200,
                'pass_marks' => 100,
                'negative_marking' => 0.50,
                'total_questions' => 200,
                'syllabus' => ModelTestGeneratorService::BCS_SYLLABUS,
                'questions_data' => $questions,
                'difficulty' => $i % 2 === 0 ? 'challenging' : 'standard',
                'status' => 'published',
                'starts_at' => now()->subDays(10 - $i),
                'attempts_count' => rand(1200, 4500),
            ]);
        }

        // 2. Primary Assistant Teacher Full Model Test (80 Qs, 60 min, 80 marks)
        if (!ModelTest::where('slug', 'primary-full-model-test-1')->exists()) {
            $allQs = ModelTestGeneratorService::generateBcsQuestions();
            $pQs = array_slice($allQs, 0, 80);
            foreach ($pQs as $idx => &$q) {
                $q['number'] = $idx + 1;
                $q['marks'] = 1;
                $q['negative_marks'] = 0.25;
            }
            ModelTest::create([
                'title' => "Primary Assistant Teacher Full Model Test",
                'title_bn' => "প্রাথমিক সহকারী শিক্ষক পূর্ণাঙ্গ মডেল টেস্ট",
                'slug' => "primary-full-model-test-1",
                'exam_slug' => 'primary',
                'type' => 'full',
                'duration_minutes' => 60,
                'total_marks' => 80,
                'pass_marks' => 45,
                'negative_marking' => 0.25,
                'total_questions' => 80,
                'syllabus' => [
                    ['name' => 'Bangla', 'name_bn' => 'বাংলা', 'marks' => 20],
                    ['name' => 'English', 'name_bn' => 'ইংরেজি', 'marks' => 20],
                    ['name' => 'Mathematics', 'name_bn' => 'গণিত', 'marks' => 20],
                    ['name' => 'General Knowledge & Science', 'name_bn' => 'সাধারণ জ্ঞান ও বিজ্ঞান', 'marks' => 20],
                ],
                'questions_data' => $pQs,
                'difficulty' => 'standard',
                'status' => 'published',
                'starts_at' => now()->subDays(5),
                'attempts_count' => 3890,
            ]);
        }

        // 3. Combined 9 Banks Senior Officer Model Test (100 Qs, 60 min, 100 marks)
        if (!ModelTest::where('slug', 'combined-bank-so-1')->exists()) {
            $allQs = ModelTestGeneratorService::generateBcsQuestions();
            $bQs = array_slice($allQs, 0, 100);
            foreach ($bQs as $idx => &$q) {
                $q['number'] = $idx + 1;
                $q['marks'] = 1;
                $q['negative_marks'] = 0.25;
            }
            ModelTest::create([
                'title' => "Combined 9 Banks Senior Officer Model Test",
                'title_bn' => "সমন্বিত ৯ ব্যাংক সিনিয়র অফিসার মডেল টেস্ট",
                'slug' => "combined-bank-so-1",
                'exam_slug' => 'bank',
                'type' => 'full',
                'duration_minutes' => 60,
                'total_marks' => 100,
                'pass_marks' => 55,
                'negative_marking' => 0.25,
                'total_questions' => 100,
                'syllabus' => [
                    ['name' => 'Bangla', 'name_bn' => 'বাংলা', 'marks' => 20],
                    ['name' => 'English', 'name_bn' => 'ইংরেজি', 'marks' => 20],
                    ['name' => 'Mathematics & Analytical', 'name_bn' => 'গণিত ও এনালিটিক্যাল', 'marks' => 30],
                    ['name' => 'General Knowledge & ICT', 'name_bn' => 'সাধারণ জ্ঞান ও আইসিটি', 'marks' => 30],
                ],
                'questions_data' => $bQs,
                'difficulty' => 'challenging',
                'status' => 'published',
                'starts_at' => now()->subDays(7),
                'attempts_count' => 2750,
            ]);
        }

        // 4. Bangladesh Bank AD (General) Model Test (100 Qs, 60 min, 100 marks)
        if (!ModelTest::where('slug', 'bb-ad-general-1')->exists()) {
            $allQs = ModelTestGeneratorService::generateBcsQuestions();
            $adQs = array_slice($allQs, 15, 100);
            foreach ($adQs as $idx => &$q) {
                $q['number'] = $idx + 1;
                $q['marks'] = 1;
                $q['negative_marks'] = 0.25;
            }
            ModelTest::create([
                'title' => "Bangladesh Bank AD (General) Model Test",
                'title_bn' => "বাংলাদেশ ব্যাংক সহকারী পরিচালক (সাধারণ) মডেল টেস্ট",
                'slug' => "bb-ad-general-1",
                'exam_slug' => 'bank',
                'type' => 'full',
                'duration_minutes' => 60,
                'total_marks' => 100,
                'pass_marks' => 60,
                'negative_marking' => 0.25,
                'total_questions' => 100,
                'syllabus' => [
                    ['name' => 'English Proficiency', 'name_bn' => 'ইংরেজি দক্ষতা', 'marks' => 30],
                    ['name' => 'Quantitative Reasoning', 'name_bn' => 'গাণিতিক যুক্তি', 'marks' => 30],
                    ['name' => 'Bangla', 'name_bn' => 'বাংলা', 'marks' => 20],
                    ['name' => 'General Knowledge & Banking', 'name_bn' => 'সাধারণ জ্ঞান ও ব্যাংকিং', 'marks' => 20],
                ],
                'questions_data' => $adQs,
                'difficulty' => 'challenging',
                'status' => 'published',
                'starts_at' => now()->subDays(3),
                'attempts_count' => 3120,
            ]);
        }

        // 5. Combined Bank: Quantitative Math Speed Drill (30 Qs, 25 min, 30 marks)
        if (!ModelTest::where('slug', 'bank-math-speed-drill')->exists()) {
            $allQs = ModelTestGeneratorService::generateBcsQuestions();
            $mQs = array_slice(array_filter($allQs, fn($q) => ($q['subject']['slug'] ?? '') === 'math'), 0, 30);
            if (count($mQs) < 30) {
                $mQs = array_slice($allQs, 0, 30);
            }
            foreach ($mQs as $idx => &$q) {
                $q['number'] = $idx + 1;
                $q['marks'] = 1;
                $q['negative_marks'] = 0.25;
            }
            ModelTest::create([
                'title' => "Combined Bank: Quantitative Math Speed Drill",
                'title_bn' => "ব্যাংক নিয়োগ: দ্রুত গণিত সমাধান ড্রিল",
                'slug' => "bank-math-speed-drill",
                'exam_slug' => 'bank',
                'type' => 'speed_drill',
                'duration_minutes' => 25,
                'total_marks' => 30,
                'pass_marks' => 18,
                'negative_marking' => 0.25,
                'total_questions' => count($mQs),
                'syllabus' => [
                    ['name' => 'Arithmetic & Algebra', 'name_bn' => 'পাটিগণিত ও বীজগণিত', 'marks' => 15],
                    ['name' => 'Geometry & Data Analysis', 'name_bn' => 'জ্যামিতি ও উপাত্ত বিশ্লেষণ', 'marks' => 15],
                ],
                'questions_data' => $mQs,
                'difficulty' => 'moderate',
                'status' => 'published',
                'starts_at' => now()->subDays(2),
                'attempts_count' => 1890,
            ]);
        }

        // 6. Primary Teacher: Bangla & Math Quick Test (40 Qs, 30 min, 40 marks)
        if (!ModelTest::where('slug', 'primary-bangla-math-quick')->exists()) {
            $allQs = ModelTestGeneratorService::generateBcsQuestions();
            $bmQs = array_slice($allQs, 0, 40);
            foreach ($bmQs as $idx => &$q) {
                $q['number'] = $idx + 1;
                $q['marks'] = 1;
                $q['negative_marks'] = 0.25;
            }
            ModelTest::create([
                'title' => "Primary Teacher: Bangla & Math Quick Test",
                'title_bn' => "প্রাথমিক শিক্ষক: বাংলা ও গণিত কুইক টেস্ট",
                'slug' => "primary-bangla-math-quick",
                'exam_slug' => 'primary',
                'type' => 'subject',
                'duration_minutes' => 30,
                'total_marks' => 40,
                'pass_marks' => 24,
                'negative_marking' => 0.25,
                'total_questions' => 40,
                'syllabus' => [
                    ['name' => 'Bangla Grammar & Lit', 'name_bn' => 'বাংলা ব্যাকরণ ও সাহিত্য', 'marks' => 20],
                    ['name' => 'Elementary Math', 'name_bn' => 'প্রাথমিক গণিত', 'marks' => 20],
                ],
                'questions_data' => $bmQs,
                'difficulty' => 'standard',
                'status' => 'published',
                'starts_at' => now()->subDay(),
                'attempts_count' => 2410,
            ]);
        }

        // 7. NTRCA: General Knowledge & Math Drill (50 Qs, 35 min, 50 marks)
        if (!ModelTest::where('slug', 'ntrca-gk-math-drill')->exists()) {
            $allQs = ModelTestGeneratorService::generateBcsQuestions();
            $ntQs = array_slice($allQs, 0, 50);
            foreach ($ntQs as $idx => &$q) {
                $q['number'] = $idx + 1;
                $q['marks'] = 1;
                $q['negative_marks'] = 0.50;
            }
            ModelTest::create([
                'title' => "NTRCA: General Knowledge & Math Drill",
                'title_bn' => "এনটিআরসিএ: সাধারণ জ্ঞান ও গণিত ড্রিল",
                'slug' => "ntrca-gk-math-drill",
                'exam_slug' => 'ntrca',
                'type' => 'subject',
                'duration_minutes' => 35,
                'total_marks' => 50,
                'pass_marks' => 25,
                'negative_marking' => 0.50,
                'total_questions' => 50,
                'syllabus' => [
                    ['name' => 'General Knowledge', 'name_bn' => 'সাধারণ জ্ঞান', 'marks' => 25],
                    ['name' => 'General Mathematics', 'name_bn' => 'সাধারণ গণিত', 'marks' => 25],
                ],
                'questions_data' => $ntQs,
                'difficulty' => 'standard',
                'status' => 'published',
                'starts_at' => now()->subHours(12),
                'attempts_count' => 1540,
            ]);
        }
    }
}
