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
                ->modalHeading('Auto-Generate Dynamic Model Test')
                ->modalDescription('Automatically select balanced questions from past exam papers and topic pools using the BPSC syllabus algorithm.')
                ->form([
                    Select::make('exam_slug')
                        ->label('Target Examination')
                        ->options([
                            'bcs-general' => 'BCS General (200 Questions / 10 Subjects)',
                            'bank' => 'Combined Bank Jobs (100 Questions)',
                            'primary' => 'Primary Assistant Teacher (80 Questions)',
                            'ntrca' => 'NTRCA Teacher Registration (100 Questions)',
                        ])
                        ->default('bcs-general')
                        ->required()
                        ->live()
                        ->afterStateUpdated(function (?string $state, callable $set) {
                            $exam = $state ?: 'bcs-general';
                            $count = ModelTest::where('exam_slug', $exam)->count() + 1;

                            $title = match ($exam) {
                                'bank' => "Combined Bank Senior Officer Model Test #{$count}",
                                'primary' => "Primary Assistant Teacher Full Model Test #{$count}",
                                'ntrca' => "NTRCA Teacher Registration Model Test #{$count}",
                                default => "BCS Preliminary Full Model Test #{$count}",
                            };
                            $titleBn = match ($exam) {
                                'bank' => "সমন্বিত ব্যাংক সিনিয়র অফিসার মডেল টেস্ট #{$count}",
                                'primary' => "প্রাথমিক সহকারী শিক্ষক পূর্ণাঙ্গ মডেল টেস্ট #{$count}",
                                'ntrca' => "এনটিআরসিএ শিক্ষক নিবন্ধন মডেল টেস্ট #{$count}",
                                default => "বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ মডেল টেস্ট #{$count}",
                            };
                            $duration = match ($exam) {
                                'bank', 'primary', 'ntrca' => 60,
                                default => 120,
                            };
                            $marks = match ($exam) {
                                'primary' => 80,
                                'bank', 'ntrca' => 100,
                                default => 200,
                            };
                            $passMarks = match ($exam) {
                                'primary', 'ntrca' => 40,
                                'bank' => 50,
                                default => 100,
                            };
                            $neg = in_array($exam, ['bank', 'primary'], true) ? 0.25 : 0.50;

                            $set('title', $title);
                            $set('title_bn', $titleBn);
                            $set('duration_minutes', $duration);
                            $set('total_marks', $marks);
                            $set('pass_marks', $passMarks);
                            $set('negative_marking', $neg);
                        }),
                    TextInput::make('title')
                        ->label('Test Title')
                        ->default("BCS Preliminary Full Model Test #{$nextNum}")
                        ->required(),
                    TextInput::make('title_bn')
                        ->label('Test Title (Bengali)')
                        ->default("বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ মডেল টেস্ট #{$nextNum}"),
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
                    TextInput::make('pass_marks')
                        ->label('Pass Marks')
                        ->numeric()
                        ->default(100)
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
                            'scheduled' => 'Scheduled for specific dates',
                            'draft' => 'Draft (Saved for review)',
                        ])
                        ->default('published')
                        ->required(),
                    DateTimePicker::make('starts_at')
                        ->label('Start Date & Time (Schedule)')
                        ->default(now())
                        ->required(),
                    DateTimePicker::make('ends_at')
                        ->label('End Date & Time / Deadline')
                        ->helperText('Optional - leave empty for ongoing open test'),
                ])
                ->action(function (array $data): void {
                    $modelTest = ModelTestGeneratorService::createAutoModelTest($data);

                    Notification::make()
                        ->title('Model Test Auto-Generated!')
                        ->body("Created '{$modelTest->title}' with {$modelTest->total_questions} dynamically balanced questions.")
                        ->success()
                        ->send();
                }),
            CreateAction::make(),
        ];
    }
}
