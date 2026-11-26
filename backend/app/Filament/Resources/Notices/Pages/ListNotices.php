<?php

namespace App\Filament\Resources\Notices\Pages;

use App\Filament\Resources\Notices\NoticeResource;
use App\Services\PageShell;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;

class ListNotices extends ListRecords
{
    protected static string $resource = NoticeResource::class;

    protected ?string $subheading = 'One circular = one page forever: put admit cards, exam dates and results on the same notice with "Update". New notices start as drafts.';

    protected function getHeaderActions(): array
    {
        return [
            Action::make('clearCache')
                ->label('Clear website cache')
                ->icon(Heroicon::OutlinedArrowPath)
                ->color('gray')
                ->tooltip('Saving a notice already does this. Use it if a page still looks old.')
                ->action(function (): void {
                    PageShell::refresh();
                    Notification::make()->title('Website pages will be rebuilt on their next visit')->success()->send();
                }),
            CreateAction::make()->label('Add notice'),
        ];
    }
}
