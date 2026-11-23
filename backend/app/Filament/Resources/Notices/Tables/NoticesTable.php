<?php

namespace App\Filament\Resources\Notices\Tables;

use App\Models\Notice;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class NoticesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('published_on', 'desc')
            ->modifyQueryUsing(fn ($query) => $query->with('exam'))
            ->columns([
                TextColumn::make('title')
                    ->searchable(['title', 'title_bn', 'org'])
                    ->weight('medium')
                    ->wrap()
                    ->description(fn (Notice $record): string => $record->org.($record->exam ? ' · '.$record->exam->name : '')),
                TextColumn::make('type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => Notice::TYPES[$state] ?? $state)
                    ->color(fn (string $state): string => match ($state) {
                        'circular', 'schedule' => 'primary',
                        'deadline', 'syllabus' => 'warning',
                        'result' => 'success',
                        default => 'info',
                    }),
                TextColumn::make('apply_until')
                    ->label('Deadline')
                    ->date('j M Y')
                    ->placeholder('—')
                    ->color(fn (Notice $record): string => $record->apply_until && $record->apply_until->isFuture() && $record->apply_until->diffInDays() <= 3 ? 'danger' : 'gray')
                    ->sortable(),
                TextColumn::make('exam_date')
                    ->label('Exam date')
                    ->date('j M Y')
                    ->placeholder('—')
                    ->sortable(),
                TextColumn::make('published_on')
                    ->label('Published')
                    ->date('j M Y')
                    ->sortable(),
                ToggleColumn::make('is_published')
                    ->label('On website'),
            ])
            ->filters([
                SelectFilter::make('type')->options(Notice::TYPES),
                SelectFilter::make('exam')->relationship('exam', 'name')->preload(),
                TernaryFilter::make('is_published')->label('On website'),
            ])
            ->recordActions([
                Action::make('view')
                    ->label('View on site')
                    ->icon(Heroicon::OutlinedArrowTopRightOnSquare)
                    ->color('gray')
                    ->url(fn (Notice $record): string => rtrim(config('app.frontend_url'), '/').'/notices/'.$record->slug, shouldOpenInNewTab: true),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No notices yet')
            ->emptyStateDescription('Add the first job circular, exam date or result.')
            ->emptyStateIcon(Heroicon::OutlinedMegaphone);
    }
}
