<?php

namespace App\Filament\Resources\PracticeSessions\Tables;

use App\Models\PracticeSession;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class PracticeSessionsTable
{
    /**
     * @var array<string, string>
     */
    private const MODES = [
        'drill' => 'Subject practice',
        'past' => 'Old exam questions',
        'mistakes' => 'Fixing mistakes',
        'diagnostic' => 'Starting-level test',
        'daily' => 'Daily quiz',
    ];

    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->modifyQueryUsing(fn ($query) => $query->with(['user', 'exam', 'subject']))
            ->columns([
                TextColumn::make('created_at')
                    ->label('Started')
                    ->dateTime('j M, g:i a', config('app.student_timezone'))
                    ->description(fn (PracticeSession $record): string => $record->created_at->diffForHumans())
                    ->sortable(),
                TextColumn::make('user.name')
                    ->label('Student')
                    ->placeholder('Guest')
                    ->description(fn (PracticeSession $record): ?string => $record->user?->email)
                    ->searchable(['name', 'email']),
                TextColumn::make('mode')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => self::MODES[$state] ?? $state)
                    ->color('gray'),
                TextColumn::make('exam.name')
                    ->label('Exam')
                    ->placeholder('Mixed'),
                TextColumn::make('subject.name')
                    ->label('Subject')
                    ->placeholder('All subjects'),
                TextColumn::make('score')
                    ->label('Score')
                    ->getStateUsing(fn (PracticeSession $record): string => "{$record->correct}/{$record->total}")
                    ->description(fn (PracticeSession $record): string => $record->total ? round($record->correct / $record->total * 100).'% correct' : '—'),
                TextColumn::make('finished_at')
                    ->label('Status')
                    ->badge()
                    ->getStateUsing(fn (PracticeSession $record): string => $record->isFinished() ? 'Finished' : (($record->correct + $record->wrong) > 0 ? 'In progress' : 'Not started'))
                    ->color(fn (string $state): string => match ($state) {
                        'Finished' => 'success',
                        'In progress' => 'warning',
                        default => 'gray',
                    }),
            ])
            ->filters([
                SelectFilter::make('mode')->options(self::MODES),
                SelectFilter::make('exam')->relationship('exam', 'name')->preload(),
                SelectFilter::make('subject')->relationship('subject', 'name')->preload(),
                TernaryFilter::make('finished_at')
                    ->label('Finished')
                    ->nullable(),
                TernaryFilter::make('user_id')
                    ->label('Who')
                    ->nullable()
                    ->trueLabel('Students only')
                    ->falseLabel('Guests only'),
            ]);
    }
}
