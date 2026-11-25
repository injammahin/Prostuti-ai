<?php

namespace App\Filament\Resources\ModelTests\Tables;

use App\Models\ModelTest;
use App\Services\ModelTestGeneratorService;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ModelTestsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('title')
                    ->label('Title')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn (ModelTest $record): ?string => $record->title_bn),
                TextColumn::make('exam_slug')
                    ->label('Exam')
                    ->badge()
                    ->color('info')
                    ->sortable(),
                TextColumn::make('total_questions')
                    ->label('Questions')
                    ->sortable()
                    ->suffix(' Qs'),
                TextColumn::make('duration_minutes')
                    ->label('Time')
                    ->sortable()
                    ->suffix(' min'),
                TextColumn::make('total_marks')
                    ->label('Marks')
                    ->sortable(),
                TextColumn::make('negative_marking')
                    ->label('Negative')
                    ->prefix('-'),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'published' => 'success',
                        'scheduled' => 'warning',
                        'draft' => 'gray',
                        default => 'primary',
                    }),
                TextColumn::make('starts_at')
                    ->label('Starts At')
                    ->dateTime('d M, Y H:i')
                    ->sortable(),
                TextColumn::make('ends_at')
                    ->label('Deadline')
                    ->dateTime('d M, Y H:i')
                    ->placeholder('Open Indefinitely')
                    ->sortable(),
                TextColumn::make('attempts_count')
                    ->label('Attempts')
                    ->sortable()
                    ->numeric(),
                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('exam_slug')
                    ->label('Filter by Exam')
                    ->options([
                        'bcs-general' => 'BCS General',
                        'bank' => 'Combined Bank',
                        'primary' => 'Primary Teacher',
                        'ntrca' => 'NTRCA Registration',
                    ]),
                SelectFilter::make('status')
                    ->options([
                        'published' => 'Published',
                        'scheduled' => 'Scheduled',
                        'draft' => 'Draft',
                    ]),
            ])
            ->recordActions([
                Action::make('view_on_site')
                    ->label('Live Test')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->color('info')
                    ->url(fn (ModelTest $record): string => rtrim(config('app.frontend_url', 'http://localhost:5173'), '/')."/app/model-test/run?test={$record->slug}", shouldOpenInNewTab: true),
                Action::make('regenerate')
                    ->label('Regenerate Questions')
                    ->icon('heroicon-o-arrow-path')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalHeading('Regenerate Test Questions')
                    ->modalDescription('Are you sure you want to re-shuffle and balance questions for this test from the latest question bank?')
                    ->action(function (ModelTest $record): void {
                        $questions = ModelTestGeneratorService::generateQuestionsForExam(
                            $record->exam_slug ?? 'bcs-general',
                            $record->difficulty ?? 'standard'
                        );
                        $record->update([
                            'questions_data' => $questions,
                            'total_questions' => count($questions),
                        ]);

                        Notification::make()
                            ->title('Questions Re-Generated!')
                            ->body("Updated '{$record->title}' with fresh ".count($questions).' questions.')
                            ->success()
                            ->send();
                    }),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
