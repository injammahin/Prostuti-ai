<?php

namespace App\Filament\Resources\Notices\Pages;

use App\Filament\Resources\Notices\NoticeResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\CreateRecord;

/**
 * New notices are saved as drafts; "Publish now" saves and shows it on the website at once.
 */
class CreateNotice extends CreateRecord
{
    protected static string $resource = NoticeResource::class;

    protected function getCreateFormAction(): Action
    {
        return parent::getCreateFormAction()->label('Save draft');
    }

    protected function getFormActions(): array
    {
        return [
            $this->getCreateFormAction(),
            Action::make('publishNow')
                ->label('Publish now')
                ->color('success')
                ->action(function (): void {
                    $this->data['is_published'] = true;
                    $this->create();
                }),
            $this->getCancelFormAction(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('edit', ['record' => $this->getRecord()]);
    }
}
