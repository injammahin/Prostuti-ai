<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Notice;
use Illuminate\Database\Seeder;

class NoticeSeeder extends Seeder
{
    /**
     * Add the launch notices, each taken from the official source it links to. Notices that already
     * exist are left alone, so edits made in the admin panel survive running the seeder again.
     */
    public function run(): void
    {
        $examIds = Exam::query()->pluck('id', 'slug');
        $notices = json_decode(file_get_contents(database_path('seeders/data/notices.json')), true, flags: JSON_THROW_ON_ERROR);

        foreach ($notices as $notice) {
            Notice::query()->firstOrCreate(['slug' => $notice['slug']], [
                'title' => $notice['title'],
                'title_bn' => $notice['title_bn'],
                'org' => $notice['org'],
                'exam_id' => $examIds[$notice['exam']] ?? null,
                'type' => $notice['type'],
                'summary' => $notice['summary'],
                'summary_bn' => $notice['summary_bn'],
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
