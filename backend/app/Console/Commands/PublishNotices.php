<?php

namespace App\Console\Commands;

use App\Models\Notice;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

/**
 * Publishes approved drafts, dated today.
 */
#[Signature('notices:publish {slugs* : Slugs of the drafts to publish}')]
#[Description('Publish draft notices by slug')]
class PublishNotices extends Command
{
    public function handle(): int
    {
        $failed = false;

        foreach ((array) $this->argument('slugs') as $slug) {
            $notice = Notice::query()->firstWhere('slug', $slug);

            if (! $notice) {
                $this->error("Not found: {$slug}");
                $failed = true;

                continue;
            }

            $notice->forceFill(['is_published' => true, 'published_on' => $notice->is_published ? $notice->published_on : today()])->save();
            $this->line("Published: {$notice->slug}");
        }

        return $failed ? self::FAILURE : self::SUCCESS;
    }
}
