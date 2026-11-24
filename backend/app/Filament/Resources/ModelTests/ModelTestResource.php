<?php

namespace App\Filament\Resources\ModelTests;

use App\Filament\Resources\ModelTests\Pages\CreateModelTest;
use App\Filament\Resources\ModelTests\Pages\EditModelTest;
use App\Filament\Resources\ModelTests\Pages\ListModelTests;
use App\Filament\Resources\ModelTests\Schemas\ModelTestForm;
use App\Filament\Resources\ModelTests\Tables\ModelTestsTable;
use App\Models\ModelTest;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ModelTestResource extends Resource
{
    protected static ?string $model = ModelTest::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentCheck;

    protected static string|UnitEnum|null $navigationGroup = 'Question bank';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return ModelTestForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ModelTestsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListModelTests::route('/'),
            'create' => CreateModelTest::route('/create'),
            'edit' => EditModelTest::route('/{record}/edit'),
        ];
    }
}
