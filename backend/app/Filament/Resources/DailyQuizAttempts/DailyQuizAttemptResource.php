<?php

namespace App\Filament\Resources\DailyQuizAttempts;

use App\Filament\Resources\DailyQuizAttempts\Pages\ListDailyQuizAttempts;
use App\Filament\Resources\DailyQuizAttempts\Tables\DailyQuizAttemptsTable;
use App\Models\DailyQuizAttempt;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class DailyQuizAttemptResource extends Resource
{
    protected static ?string $model = DailyQuizAttempt::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTrophy;

    protected static string|UnitEnum|null $navigationGroup = 'Students & activity';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Daily quiz attendance';

    protected static ?string $modelLabel = 'quiz attendance';

    protected static ?string $pluralModelLabel = 'Daily quiz attendance';

    protected static ?string $slug = 'daily-quiz-attendance';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getNavigationBadge(): ?string
    {
        $count = DailyQuizAttempt::query()->where('slot', DailyQuizAttempt::slotFor())->count();

        return $count ? (string) $count : null;
    }

    public static function getNavigationBadgeTooltip(): ?string
    {
        return 'Attended the current quiz round';
    }

    public static function table(Table $table): Table
    {
        return DailyQuizAttemptsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListDailyQuizAttempts::route('/'),
        ];
    }
}
