<?php

namespace App\Filament\Resources\PageViews;

use App\Filament\Resources\PageViews\Pages\ListPageViews;
use App\Filament\Resources\PageViews\Tables\PageViewsTable;
use App\Models\PageView;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class PageViewResource extends Resource
{
    protected static ?string $model = PageView::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedGlobeAlt;

    protected static string|UnitEnum|null $navigationGroup = 'Students & activity';

    protected static ?int $navigationSort = 4;

    protected static ?string $navigationLabel = 'Visitors';

    protected static ?string $modelLabel = 'page view';

    protected static ?string $pluralModelLabel = 'Visitors';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return PageViewsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPageViews::route('/'),
        ];
    }
}
