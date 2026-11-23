<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Support\Icons\Heroicon;
use Illuminate\Contracts\Support\Htmlable;

class Dashboard extends BaseDashboard
{
    protected static string|\BackedEnum|null $navigationIcon = Heroicon::OutlinedSquares2x2;

    protected static ?string $navigationLabel = 'Overview';

    public function getTitle(): string|Htmlable
    {
        return 'Overview';
    }

    /**
     * @return int|array<string, int|null>
     */
    public function getColumns(): int|array
    {
        return ['md' => 2, 'xl' => 2];
    }
}
