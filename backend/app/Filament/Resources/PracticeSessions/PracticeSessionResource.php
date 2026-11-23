<?php

namespace App\Filament\Resources\PracticeSessions;

use App\Filament\Resources\PracticeSessions\Pages\ListPracticeSessions;
use App\Filament\Resources\PracticeSessions\Tables\PracticeSessionsTable;
use App\Models\PracticeSession;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class PracticeSessionResource extends Resource
{
    protected static ?string $model = PracticeSession::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentCheck;

    protected static string|UnitEnum|null $navigationGroup = 'Students & activity';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Exam attempts';

    protected static ?string $modelLabel = 'attempt';

    protected static ?string $pluralModelLabel = 'Exam attempts';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return PracticeSessionsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPracticeSessions::route('/'),
        ];
    }
}
