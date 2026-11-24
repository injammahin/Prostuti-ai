<?php

namespace App\Filament\Resources\ModelTests\Pages;

use App\Filament\Resources\ModelTests\ModelTestResource;
use App\Services\ModelTestGeneratorService;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditModelTest extends EditRecord
{
    protected static string $resource = ModelTestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('regenerate_questions')
                ->label('Regenerate Questions (Algorithm)')
                ->icon('heroicon-o-arrow-path')
                ->color('warning')
                ->requiresConfirmation()
                ->modalHeading('Regenerate Model Test Questions')
                ->modalDescription('This will replace the current question set with a freshly generated set of 200 questions using the BPSC syllabus algorithm.')
                ->action(function (): void {
                    $record = $this->getRecord();
                    $newQuestions = ModelTestGeneratorService::generateBcsQuestions();
                    $record->update([
                        'questions_data' => $newQuestions,
                        'total_questions' => count($newQuestions),
                        'syllabus' => ModelTestGeneratorService::BCS_SYLLABUS,
                    ]);

                    Notification::make()
                        ->title('Questions Regenerated!')
                        ->body("Successfully generated 200 fresh balanced questions for '{$record->title}'.")
                        ->success()
                        ->send();
                }),
            DeleteAction::make(),
        ];
    }
}
