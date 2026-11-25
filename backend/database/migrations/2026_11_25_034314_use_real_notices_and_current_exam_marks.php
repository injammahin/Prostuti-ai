<?php

use App\Models\Exam;
use App\Models\Notice;
use Database\Seeders\CatalogSeeder;
use Database\Seeders\ModelTestSeeder;
use Database\Seeders\NoticeSeeder;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    private const SAMPLE_NOTICES = [
        '50th-bcs-written-schedule',
        '50th-bcs-written-admit',
        'bangladesh-bank-ad-2026',
        'combined-bank-senior-officer-2026',
        'ntrca-19th-registration',
        'primary-teacher-result-phase3',
        'combined-bank-officer-cash',
    ];

    /**
     * Launch data: hide the sample notices, add the real ones, and move the BCS marks and the
     * starter model tests to the current exam formats. New installs get all of this from the seeders.
     */
    public function up(): void
    {
        if (Notice::query()->doesntExist()) {
            return;
        }

        Notice::query()->whereIn('slug', self::SAMPLE_NOTICES)->update(['is_published' => false]);
        (new NoticeSeeder)->run();

        $bcs = Exam::query()->where('slug', 'bcs-general')->first();

        foreach ($bcs?->subjects ?? [] as $subject) {
            if (isset(CatalogSeeder::BCS_MARKS[$subject->slug])) {
                $bcs->subjects()->updateExistingPivot($subject->id, ['marks' => CatalogSeeder::BCS_MARKS[$subject->slug]]);
            }
        }

        ModelTestSeeder::refreshExisting();
    }

    /**
     * The replaced marks and test questions cannot be restored; only the sample notices come back.
     */
    public function down(): void
    {
        Notice::query()->whereIn('slug', self::SAMPLE_NOTICES)->update(['is_published' => true]);
    }
};
