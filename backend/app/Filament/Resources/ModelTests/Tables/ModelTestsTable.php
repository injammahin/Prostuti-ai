<?php

namespace App\Filament\Resources\ModelTests\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ModelTestsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Title')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
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
            ->filters([])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
