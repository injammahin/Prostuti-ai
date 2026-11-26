<?php

namespace App\Console\Commands;

use App\Models\Exam;
use App\Models\Notice;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

/**
 * Notices from a JSON file: new circulars become drafts, and updates (admit card, exam date, result …) go onto the
 * existing page of the same circular.
 *
 * File: {"create": [{...notice}], "update": [{"slug": "...", ...changed fields}]} (a plain list means "create").
 * Fields: org, org_bn, title, title_bn, type, category, status, exam (exam slug), posts [{name, grade, vacancies}],
 * vacancies, eligibility, age_limit, fee, apply_from, apply_until, exam_date, how_to_apply (text or list of steps),
 * url (official source), apply_url, summary, summary_bn, published_on, slug (optional).
 */
#[Signature('notices:import {file : Path to the JSON file} {--publish : Publish new notices at once instead of saving drafts} {--dry-run : Only check the file}')]
#[Description('Create draft notices (and update existing ones) from a JSON file')]
class ImportNotices extends Command
{
    public function handle(): int
    {
        $path = (string) $this->argument('file');

        if (! is_file($path)) {
            $this->error("File not found: {$path}");

            return self::FAILURE;
        }

        $data = json_decode((string) file_get_contents($path), true);

        if (! is_array($data)) {
            $this->error('The file is not valid JSON: '.json_last_error_msg());

            return self::FAILURE;
        }

        $create = array_is_list($data) ? $data : ($data['create'] ?? []);
        $update = array_is_list($data) ? [] : ($data['update'] ?? []);
        $rows = [];
        $failed = false;

        DB::beginTransaction();

        try {
            foreach ($create as $index => $item) {
                $rows[] = $this->create((array) $item, "create #{$index}", $failed);
            }

            foreach ($update as $index => $item) {
                $rows[] = $this->update((array) $item, "update #{$index}", $failed);
            }
        } catch (\Throwable $exception) {
            DB::rollBack();

            throw $exception;
        }

        // Any error saves nothing, so the file can be fixed and run again.
        $failed || $this->option('dry-run') ? DB::rollBack() : DB::commit();

        $this->table(['Result', 'Slug', 'Title'], $rows);
        $this->info(match (true) {
            $failed => 'Errors found: nothing was saved. Fix the file and run again.',
            (bool) $this->option('dry-run') => 'Dry run: nothing was saved.',
            default => 'Done.',
        });

        return $failed ? self::FAILURE : self::SUCCESS;
    }

    /**
     * @param  array<string, mixed>  $item
     * @return array{string, string, string}
     */
    private function create(array $item, string $label, bool &$failed): array
    {
        if ($errors = $this->errors($item, creating: true)) {
            $failed = true;

            return ["ERROR {$label}", $item['slug'] ?? '', implode(' ', $errors)];
        }

        // The same circular: same slug, or the same circular file (a portal address can hold several circulars).
        $circularUrl = filled($item['url'] ?? null) && ($item['url'] ?? null) !== ($item['apply_url'] ?? null) ? $item['url'] : null;
        $existing = Notice::query()
            ->where(fn ($query) => $query
                ->when(filled($item['slug'] ?? null), fn ($query) => $query->orWhere('slug', $item['slug']))
                ->when($circularUrl, fn ($query) => $query->orWhere('url', $circularUrl)))
            ->when(blank($item['slug'] ?? null) && ! $circularUrl, fn ($query) => $query->whereRaw('1 = 0'))
            ->first();

        if ($existing) {
            return ['SKIPPED (already exists: send an update)', $existing->slug, $existing->title];
        }

        $notice = new Notice($this->attributes($item));
        $notice->forceFill([
            'is_published' => (bool) $this->option('publish'),
            'published_on' => $item['published_on'] ?? today()->toDateString(),
            'verified_on' => $item['verified_on'] ?? today()->toDateString(),
        ])->save();

        return [$this->option('publish') ? 'PUBLISHED' : 'DRAFT', $notice->slug, $notice->title];
    }

    /**
     * @param  array<string, mixed>  $item
     * @return array{string, string, string}
     */
    private function update(array $item, string $label, bool &$failed): array
    {
        $notice = Notice::query()->firstWhere('slug', $item['slug'] ?? '');

        if (! $notice) {
            $failed = true;

            return ["ERROR {$label}", (string) ($item['slug'] ?? ''), 'No notice with this slug.'];
        }

        if ($errors = $this->errors($item, creating: false)) {
            $failed = true;

            return ["ERROR {$label}", $notice->slug, implode(' ', $errors)];
        }

        $notice->applyUpdate(Arr::except($this->attributes($item), ['slug']));

        return ['UPDATED', $notice->slug, $notice->title];
    }

    /**
     * @param  array<string, mixed>  $item
     * @return list<string>
     */
    private function errors(array $item, bool $creating): array
    {
        $required = $creating ? 'required' : 'sometimes';

        return Validator::make($item, [
            'org' => [$required, 'string', 'max:100'],
            'org_bn' => ['nullable', 'string', 'max:150'],
            'title' => [$required, 'string', 'max:255'],
            'title_bn' => ['nullable', 'string', 'max:255'],
            'slug' => ['nullable', 'alpha_dash', 'max:255'],
            'type' => ['nullable', Rule::in(array_keys(Notice::TYPES))],
            'category' => ['nullable', Rule::in(array_keys(Notice::CATEGORIES))],
            'status' => ['nullable', Rule::in(array_keys(Notice::STATUSES))],
            'exam' => ['nullable', Rule::exists('exams', 'slug')],
            'posts' => ['nullable', 'array'],
            'posts.*.name' => ['required', 'string', 'max:255'],
            'url' => ['nullable', 'url', 'max:255'],
            'apply_url' => ['nullable', 'url', 'max:255'],
            'published_on' => ['nullable', 'date'],
            'apply_from' => ['nullable', 'date'],
            'apply_until' => ['nullable', 'date'],
            'exam_date' => ['nullable', 'date'],
        ])->errors()->all();
    }

    /**
     * @param  array<string, mixed>  $item
     * @return array<string, mixed>
     */
    private function attributes(array $item): array
    {
        if (array_key_exists('exam', $item)) {
            $item['exam_id'] = $item['exam'] ? Exam::query()->where('slug', $item['exam'])->value('id') : null;
        }

        if (is_array($item['how_to_apply'] ?? null)) {
            $item['how_to_apply'] = implode("\n", $item['how_to_apply']);
        }

        foreach (['vacancies', 'age_limit', 'fee'] as $field) {
            if (isset($item[$field]) && ! is_string($item[$field])) {
                $item[$field] = (string) $item[$field];
            }
        }

        return Arr::only($item, ['slug', 'org', 'org_bn', 'title', 'title_bn', 'type', 'category', 'status', 'exam_id', 'posts', 'post_name', 'vacancies', 'eligibility', 'age_limit', 'fee', 'apply_from', 'apply_until', 'exam_date', 'how_to_apply', 'url', 'apply_url', 'summary', 'summary_bn']);
    }
}
