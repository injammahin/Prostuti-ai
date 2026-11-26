<?php

namespace App\Filament\Resources\Notices\Pages;

use App\Filament\Resources\Notices\NoticeResource;
use App\Models\Notice;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Icons\Heroicon;

class EditNotice extends EditRecord
{
    protected static string $resource = NoticeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            NoticeResource::previewAction(),
            Action::make('publish')
                ->label(fn (Notice $record): string => $record->is_published ? 'Unpublish' : 'Publish')
                ->icon(fn (Notice $record): Heroicon => $record->is_published ? Heroicon::OutlinedEyeSlash : Heroicon::OutlinedRocketLaunch)
                ->color(fn (Notice $record): string => $record->is_published ? 'gray' : 'success')
                ->requiresConfirmation()
                ->action(function (Notice $record): void {
                    $this->save(shouldRedirect: false, shouldSendSavedNotification: false);
                    $record->refresh()->forceFill(['is_published' => ! $record->is_published])->save();
                    $this->fillForm();
                    Notification::make()->title($record->is_published ? 'Published' : 'Moved back to drafts')->success()->send();
                }),
            NoticeResource::duplicateAction(),
            DeleteAction::make(),
        ];
    }
}
