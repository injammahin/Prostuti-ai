<?php

namespace App\Filament\Resources\ModelTests\Pages;

use App\Filament\Resources\ModelTests\ModelTestResource;
use App\Models\ModelTest;
use App\Services\ModelTestGeneratorService;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;

class ListModelTests extends ListRecords
{
    protected static string $resource = ModelTestResource::class;

    protected function getHeaderActions(): array
    {
        $nextNum = ModelTest::where('exam_slug', 'bcs-general')->count() + 1;

        return [
            Action::make('auto_generate')
                ->label('Auto-Generate Model Test')
                ->icon('heroicon-o-sparkles')
                ->color('primary')
                ->form([
                    TextInput::make('title')
                        ->label('Test Title')
                        ->default("BCS Preliminary Full Model Test #{$nextNum}")
                        ->required(),
                    TextInput::make('title_bn')
                        ->label('Test Title (Bengali)')
                        ->default("বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ মডেল টেস্ট #{$nextNum}"),
                    Select::make('exam_slug')
                        ->label('Target Examination')
                        ->options([
                            'bcs-general' => 'BCS General (200 Questions / 10 Subjects)',
                            'bank' => 'Combined Bank Jobs (100 Questions)',
                            'primary' => 'Primary Assistant Teacher (80 Questions)',
                            'ntrca' => 'NTRCA Teacher Registration (50 Questions)',
                        ])
                        ->default('bcs-general')
                        ->required(),
                    TextInput::make('duration_minutes')
                        ->label('Duration (Minutes)')
                        ->numeric()
                        ->default(120)
                        ->required(),
                    TextInput::make('total_marks')
                        ->label('Total Marks')
                        ->numeric()
                        ->default(200)
                        ->required(),
                    TextInput::make('negative_marking')
                        ->label('Negative Marking per Wrong Answer')
                        ->numeric()
                        ->step(0.05)
                        ->default(0.50)
                        ->required(),
                    Select::make('difficulty')
                        ->label('Difficulty Level')
                        ->options([
                            'standard' => 'Standard (40% Easy, 40% Med, 20% Hard)',
                            'challenging' => 'Challenging (Deep BPSC Differentiators)',
                            'moderate' => 'Moderate (Foundational Speed Drill)',
                        ])
                        ->default('standard')
                        ->required(),
                    Select::make('status')
                        ->label('Publish Status')
                        ->options([
                            'published' => 'Published (Live Immediately for Users)',
                            'draft' => 'Draft (Saved for review)',
                            'scheduled' => 'Scheduled for specific time',
                        ])
                        ->default('published')
                        ->required(),
                    DateTimePicker::make('starts_at')
                        ->label('Schedule Start Time')
                        ->default(now()),
                ])
                ->action(function (array $data): void {
                    $modelTest = ModelTestGeneratorService::createAutoModelTest($data);

                    Notification::make()
                        ->title('Model Test Auto-Generated!')
                        ->body("Created '{$modelTest->title}' with {$modelTest->total_questions} dynamically balanced questions from the BCS Question Bank.")
                        ->success()
                        ->send();
                }),
            CreateAction::make(),
        ];
    }
}
