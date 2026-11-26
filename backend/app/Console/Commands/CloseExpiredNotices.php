<?php

namespace App\Console\Commands;

use App\Models\Notice;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

/**
 * Notices whose application deadline has passed are marked "Application closed" on their page (with the change shown).
 * Runs every day; the page status also follows the deadline on its own, this makes it stored and visible in the admin.
 */
#[Signature('notices:close-expired')]
#[Description('Mark notices whose application deadline has passed as closed')]
class CloseExpiredNotices extends Command
{
    public function handle(): int
    {
        $expired = Notice::query()
            ->whereNotNull('apply_until')
            ->where('apply_until', '<', today()->toDateString())
            ->where(fn ($query) => $query->whereNull('status')->orWhereIn('status', ['open', 'closing']))
            ->where(fn ($query) => $query->where('type', 'circular')->orWhere('type', 'deadline'))
            ->get();

        foreach ($expired as $notice) {
            $notice->applyUpdate(['status' => 'closed']);
            $this->line("Closed: {$notice->slug} (deadline {$notice->apply_until->toDateString()})");
        }

        $this->info($expired->count().' notice(s) closed.');

        return self::SUCCESS;
    }
}
