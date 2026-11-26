<?php

namespace App\Filament\Resources\Notices;

use App\Filament\Resources\Notices\Pages\CreateNotice;
use App\Filament\Resources\Notices\Pages\EditNotice;
use App\Filament\Resources\Notices\Pages\ListNotices;
use App\Filament\Resources\Notices\Schemas\NoticeForm;
use App\Filament\Resources\Notices\Tables\NoticesTable;
use App\Models\Notice;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class NoticeResource extends Resource
{
    protected static ?string $model = Notice::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMegaphone;

    protected static string|\UnitEnum|null $navigationGroup = 'Website';

    protected static ?int $navigationSort = 0;

    protected static ?string $navigationLabel = 'Job notices & dates';

    protected static ?string $recordTitleAttribute = 'title';

    public static function getNavigationBadge(): ?string
    {
        $upcoming = static::getModel()::query()->published()->where('apply_until', '>=', now()->toDateString())->count();

        return $upcoming > 0 ? (string) $upcoming : null;
    }

    public static function getNavigationBadgeTooltip(): ?string
    {
        return 'Applications still open';
    }

    /**
     * The page exactly as visitors will see it, drafts included (opens in a new tab).
     */
    public static function previewAction(): Action
    {
        return Action::make('preview')
            ->label('Preview')
            ->icon(Heroicon::OutlinedEye)
            ->color('gray')
            ->url(fn (Notice $record): string => route('admin.notice-preview', $record), shouldOpenInNewTab: true);
    }

    /**
     * A new draft from an existing notice (same organisation and details), opened for editing.
     */
    public static function duplicateAction(): Action
    {
        return Action::make('duplicate')
            ->label('Duplicate')
            ->icon(Heroicon::OutlinedDocumentDuplicate)
            ->color('gray')
            ->requiresConfirmation()
            ->modalDescription('A new draft is made with the same organisation and details. Dates, status and the circular file are left empty.')
            ->action(fn (Notice $record) => redirect(static::getUrl('edit', ['record' => $record->duplicate()])));
    }

    public static function form(Schema $schema): Schema
    {
        return NoticeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return NoticesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListNotices::route('/'),
            'create' => CreateNotice::route('/create'),
            'edit' => EditNotice::route('/{record}/edit'),
        ];
    }
}
