<?php

namespace App\Filament\Resources\Reports;

use App\Filament\Resources\Reports\Pages\ListReports;
use App\Filament\Resources\Reports\Tables\ReportsTable;
use App\Models\Report;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ReportResource extends Resource
{
    protected static ?string $model = Report::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedFlag;

    protected static string|UnitEnum|null $navigationGroup = 'Students & activity';

    protected static ?int $navigationSort = 5;

    protected static ?string $navigationLabel = 'Reported mistakes';

    protected static ?string $modelLabel = 'report';

    protected static ?string $pluralModelLabel = 'Reported mistakes';

    public static function getNavigationBadge(): ?string
    {
        $open = Report::query()->whereNull('resolved_at')->count();

        return $open ? (string) $open : null;
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return ReportsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListReports::route('/'),
        ];
    }
}
