<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    /**
     * BCS preliminary marks per subject (200 total).
     *
     * @var array<string, int>
     */
    private const BCS_MARKS = [
        'bangla' => 35,
        'english' => 35,
        'bd-affairs' => 30,
        'intl-affairs' => 20,
        'math' => 15,
        'mental' => 15,
        'science' => 15,
        'ict' => 15,
        'geography' => 10,
        'ethics' => 10,
    ];

    /**
     * Load exams, subjects and the starter question set from database/seeders/data.
     * Safe to run again: records are matched by slug / ref.
     */
    public function run(): void
    {
        $exams = collect($this->json('exams'))->mapWithKeys(function (array $exam, int $index): array {
            $model = Exam::query()->updateOrCreate(['slug' => $exam['slug']], [...$exam, 'sort' => $index]);

            return [$model->slug => $model];
        });

        $subjectsByName = [];

        foreach ($this->json('subjects') as $subject) {
            $examSlugs = $subject['exams'];
            unset($subject['exams']);

            $model = Subject::query()->updateOrCreate(['slug' => $subject['slug']], $subject);
            $subjectsByName[$model->name] = $model;

            $model->exams()->sync(
                collect($examSlugs)
                    ->filter(fn (string $slug): bool => $exams->has($slug))
                    ->mapWithKeys(fn (string $slug): array => [
                        $exams[$slug]->id => ['marks' => $slug === 'bcs-general' ? (self::BCS_MARKS[$model->slug] ?? null) : null],
                    ])
                    ->all()
            );
        }

        foreach ($this->json('questions') as $question) {
            $subject = $subjectsByName[$question['subject']] ?? null;

            if (! $subject) {
                continue;
            }

            Question::query()->updateOrCreate(['ref' => $question['ref']], [
                'subject_id' => $subject->id,
                'exam_id' => $exams[$question['exam']]->id ?? null,
                'topic' => $question['topic'],
                'difficulty' => $question['difficulty'],
                'source' => $question['source'],
                'lang' => $question['lang'],
                'body' => $question['body'],
                'options' => $question['options'],
                'answer_index' => $question['answer'],
                'explanation' => $question['explanation'],
                'status' => Question::STATUS_LIVE,
            ]);
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function json(string $name): array
    {
        return json_decode(file_get_contents(database_path("seeders/data/{$name}.json")), true, flags: JSON_THROW_ON_ERROR);
    }
}
