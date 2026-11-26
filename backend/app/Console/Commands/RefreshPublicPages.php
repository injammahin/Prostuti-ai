<?php

namespace App\Console\Commands;

use App\Services\PageShell;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

/**
 * Empties the cache of finished public pages (they are rebuilt on their next visit). Also runs with "php artisan optimize".
 */
#[Signature('seo:refresh')]
#[Description('Clear the rendered-HTML cache of the public pages')]
class RefreshPublicPages extends Command
{
    public function handle(): int
    {
        PageShell::refresh();
        $this->info('Public page cache cleared.');

        return self::SUCCESS;
    }
}
