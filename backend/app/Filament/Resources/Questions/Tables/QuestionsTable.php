<?php

namespace App\Filament\Resources\Questions\Tables;

use App\Models\Question;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;

class QuestionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('updated_at', 'desc')
            ->columns([
                TextColumn::make('body')
                    ->label('Question')
                    ->searchable()
                    ->limit(90)
                    ->wrap(),
                TextColumn::make('correct_answer')
                    ->label('Answer')
                    ->getStateUsing(fn (Question $record): string => chr(65 + $record->answer_index).'. '.($record->options[$record->answer_index] ?? '?'))
                    ->limit(40)
                    ->color('success'),
                TextColumn::make('subject.name')
                    ->badge()
                    ->color('gray')
                    ->sortable(),
                TextColumn::make('source')
                    ->placeholder('Practice')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('difficulty')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => Question::DIFFICULTIES[$state] ?? $state)
                    ->toggleable(),
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => Question::STATUSES[$state] ?? $state)
                    ->color(fn (string $state): string => match ($state) {
                        Question::STATUS_LIVE => 'success',
                        Question::STATUS_VERIFIED => 'warning',
                        default => 'gray',
                    }),
                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->since()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')->options(Question::STATUSES),
                SelectFilter::make('subject')->relationship('subject', 'name')->preload(),
                SelectFilter::make('exam')->relationship('exam', 'name')->preload(),
                SelectFilter::make('difficulty')->options(Question::DIFFICULTIES),
            ])
            ->recordActions([
                Action::make('goLive')
                    ->label('Make live')
                    ->icon(Heroicon::OutlinedCheckCircle)
                    ->color('success')
                    ->visible(fn (Question $record): bool => $record->status !== Question::STATUS_LIVE)
                    ->requiresConfirmation()
                    ->modalDescription('Students will see this question. Have you checked the correct answer?')
                    ->action(fn (Question $record) => $record->update(['status' => Question::STATUS_LIVE])),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    BulkAction::make('markVerified')
                        ->label('Mark as verified')
                        ->icon(Heroicon::OutlinedShieldCheck)
                        ->action(fn (Collection $records) => $records->each->update(['status' => Question::STATUS_VERIFIED]))
                        ->deselectRecordsAfterCompletion(),
                    BulkAction::make('goLive')
                        ->label('Make live')
                        ->icon(Heroicon::OutlinedCheckCircle)
                        ->color('success')
                        ->requiresConfirmation()
                        ->modalDescription('Students will see these questions. Have all answers been checked?')
                        ->action(fn (Collection $records) => $records->each->update(['status' => Question::STATUS_LIVE]))
                        ->deselectRecordsAfterCompletion(),
                    BulkAction::make('backToDraft')
                        ->label('Back to draft')
                        ->icon(Heroicon::OutlinedPencilSquare)
                        ->action(fn (Collection $records) => $records->each->update(['status' => Question::STATUS_DRAFT]))
                        ->deselectRecordsAfterCompletion(),
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
