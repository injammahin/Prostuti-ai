<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Notice;
use Illuminate\Database\Seeder;

class NoticeSeeder extends Seeder
{
    /**
     * Load the starter notices (the website's original sample notices). Safe to run again.
     */
    public function run(): void
    {
        $examIds = Exam::query()->pluck('id', 'slug');
        $notices = json_decode(file_get_contents(database_path('seeders/data/notices.json')), true, flags: JSON_THROW_ON_ERROR);

        foreach ($notices as $notice) {
            Notice::query()->updateOrCreate(['slug' => $notice['slug']], [
                'title' => $notice['title'],
                'org' => $notice['org'],
                'exam_id' => $examIds[$notice['exam']] ?? null,
                'type' => $notice['type'],
                'summary' => $notice['summary'],
                'url' => $notice['url'],
                'published_on' => $notice['published'],
                'apply_from' => $notice['applyFrom'],
                'apply_until' => $notice['applyUntil'],
                'exam_date' => $notice['examDate'],
                'verified_on' => $notice['verifiedAt'],
                'changes' => $notice['changes'],
                'is_published' => true,
            ]);
        }
    }
}
