<?php

namespace App\Filament\Resources\Questions\Pages;

use App\Filament\Resources\Questions\QuestionResource;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;

class ListQuestions extends ListRecords
{
    protected static string $resource = QuestionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('importFromAi')
                ->label('Import from AI')
                ->icon(Heroicon::OutlinedSparkles)
                ->color('gray')
                ->modalHeading('Import questions from Gemini')
                ->modalDescription('Paste the whole answer Gemini gave you (the JSON list). Questions are saved as Draft so you can check them before they go live.')
                ->modalSubmitActionLabel('Import questions')
                ->modalWidth('3xl')
                ->schema([
                    Select::make('subject_id')
                        ->label('Subject')
                        ->options(Subject::query()->orderBy('sort')->pluck('name', 'id'))
                        ->required()
                        ->native(false),
                    Select::make('exam_id')
                        ->label('Exam')
                        ->options(Exam::query()->orderBy('sort')->pluck('name', 'id'))
                        ->default(fn () => Exam::query()->where('slug', 'bcs-general')->value('id'))
                        ->native(false),
                    Textarea::make('pasted')
                        ->label('Gemini answer')
                        ->placeholder('[ { "question": "...", "options": ["...", "...", "...", "..."], "answer": "B", "explanation": "...", "topic": "...", "difficulty": "medium" } ]')
                        ->rows(14)
                        ->required(),
                    Toggle::make('make_live')
                        ->label('Make them live immediately (skip review)')
                        ->helperText('Leave off unless you have already checked every answer.'),
                ])
                ->action(function (array $data): void {
                    $result = Question::importFromAi(
                        $data['pasted'],
                        Subject::query()->findOrFail($data['subject_id']),
                        Exam::query()->find($data['exam_id'] ?? null),
                        ($data['make_live'] ?? false) ? Question::STATUS_LIVE : Question::STATUS_DRAFT,
                    );

                    $summary = "{$result['created']} added";
                    if ($result['duplicates']) {
                        $summary .= ", {$result['duplicates']} skipped (already in the bank)";
                    }

                    $notification = Notification::make()
                        ->title($result['created'] ? 'Questions imported' : 'Nothing was imported')
                        ->body($summary.($result['errors'] ? '. Problems: '.implode(' ', array_slice($result['errors'], 0, 4)) : '.'))
                        ->persistent();

                    ($result['created'] ? $notification->success() : $notification->warning())->send();
                }),
            CreateAction::make(),
        ];
    }
}
