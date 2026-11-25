<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class CatalogSeeder extends Seeder
{
    /**
     * BCS preliminary marks per subject (200 total), as changed for the 50th BCS.
     *
     * @var array<string, int>
     */
    public const BCS_MARKS = [
        'bangla' => 30,
        'english' => 30,
        'bd-affairs' => 25,
        'intl-affairs' => 25,
        'math' => 20,
        'mental' => 15,
        'science' => 15,
        'ict' => 15,
        'geography' => 10,
        'ethics' => 15,
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
        $subjectsBySlug = [];

        foreach ($this->json('subjects') as $subject) {
            $examSlugs = $subject['exams'];
            unset($subject['exams']);

            $model = Subject::query()->updateOrCreate(['slug' => $subject['slug']], $subject);
            $subjectsByName[$model->name] = $model;
            $subjectsBySlug[$model->slug] = $model;

            $model->exams()->sync(
                collect($examSlugs)
                    ->filter(fn (string $slug): bool => $exams->has($slug))
                    ->mapWithKeys(fn (string $slug): array => [
                        $exams[$slug]->id => ['marks' => $slug === 'bcs-general' ? (self::BCS_MARKS[$model->slug] ?? null) : null],
                    ])
                    ->all()
            );
        }

        $questionFiles = collect(glob(database_path('seeders/data/questions*.json')))
            ->flatMap(fn (string $path): array => json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR));

        // Without model events, so seeding doesn't mark questions as curated (see Question::booted).
        Question::withoutEvents(fn () => $this->seedQuestions($questionFiles, $subjectsByName, $subjectsBySlug, $exams));
    }

    /**
     * Seed files are the source of truth, except for questions changed in the admin panel since
     * (curated): those keep the admin's version. A seed question may carry "status": "draft" —
     * e.g. text that came out of the PDF unreadable — so it waits in the admin panel instead of going live.
     *
     * @param  iterable<int, array<string, mixed>>  $questionFiles
     * @param  array<string, Subject>  $subjectsByName
     * @param  array<string, Subject>  $subjectsBySlug
     * @param  Collection<string, Exam>  $exams
     */
    private function seedQuestions(iterable $questionFiles, array $subjectsByName, array $subjectsBySlug, Collection $exams): void
    {
        foreach ($questionFiles as $question) {
            // Skip questions cancelled by BPSC (they have no correct answer).
            if (! empty($question['cancelled']) || ! is_int($question['answer'] ?? $question['answer_index'] ?? null)) {
                continue;
            }

            // "subject" is either a name string ("Bangla") or an object ({"name": ..., "slug": ...}).
            $subjectRef = $question['subject'];

            $subject = is_array($subjectRef)
                ? ($subjectsBySlug[$subjectRef['slug'] ?? ''] ?? $subjectsByName[$subjectRef['name'] ?? ''] ?? null)
                : ($subjectsByName[$subjectRef] ?? null);

            if (! $subject) {
                $label = is_array($subjectRef) ? ($subjectRef['slug'] ?? $subjectRef['name'] ?? json_encode($subjectRef)) : $subjectRef;

                throw new \RuntimeException("Question {$question['ref']} uses unknown subject \"{$label}\". Add it to subjects.json or fix the name.");
            }

            $model = Question::query()->firstOrNew(['ref' => $question['ref']]);

            if ($model->curated_at !== null) {
                continue;
            }

            $model->fill([
                'subject_id' => $subject->id,
                'exam_id' => $exams[$question['exam']]->id ?? null,
                'topic' => $question['topic'],
                'difficulty' => $question['difficulty'],
                'source' => $question['source'] ?? null,
                'lang' => $question['lang'],
                'body' => $question['body'],
                'options' => $question['options'],
                'answer_index' => $question['answer'] ?? $question['answer_index'],
                'explanation' => $question['explanation'] ?: null,
                'status' => ($question['status'] ?? null) === Question::STATUS_DRAFT ? Question::STATUS_DRAFT : Question::STATUS_LIVE,
            ])->save();
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
