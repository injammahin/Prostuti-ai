<?php

namespace App\Filament\Resources\Reports\Tables;

use App\Filament\Resources\Notices\NoticeResource;
use App\Filament\Resources\Questions\QuestionResource;
use App\Models\Question;
use App\Models\Report;
use Filament\Actions\Action;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ReportsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('created_at')
                    ->label('When')
                    ->dateTime('j M, g:i a', config('app.student_timezone'))
                    ->sortable(),
                TextColumn::make('target')
                    ->label('About')
                    ->badge()
                    ->color('gray')
                    ->formatStateUsing(fn (string $state): string => Report::TARGETS[$state] ?? $state),
                TextColumn::make('target_title')
                    ->label('Question / notice')
                    ->limit(80)
                    ->wrap()
                    ->searchable(),
                TextColumn::make('reason')
                    ->description(fn (Report $record): ?string => $record->note)
                    ->wrap(),
                TextColumn::make('user.name')
                    ->label('Reported by')
                    ->placeholder('Guest'),
                TextColumn::make('resolved_at')
                    ->label('Status')
                    ->badge()
                    ->state(fn (Report $record): string => $record->resolved_at ? 'Done' : 'To check')
                    ->color(fn (string $state): string => $state === 'Done' ? 'success' : 'warning'),
            ])
            ->filters([
                TernaryFilter::make('resolved_at')
                    ->label('Status')
                    ->nullable()
                    ->trueLabel('Done')
                    ->falseLabel('To check')
                    ->default(false),
            ])
            ->recordActions([
                Action::make('open')
                    ->label('Open')
                    ->icon(Heroicon::OutlinedPencilSquare)
                    ->url(fn (Report $record): ?string => self::editUrl($record))
                    ->visible(fn (Report $record): bool => self::editUrl($record) !== null),
                Action::make('resolve')
                    ->label('Mark as done')
                    ->icon(Heroicon::OutlinedCheck)
                    ->visible(fn (Report $record): bool => $record->resolved_at === null)
                    ->action(fn (Report $record) => $record->update(['resolved_at' => now()])),
                Action::make('reopen')
                    ->label('Reopen')
                    ->color('gray')
                    ->visible(fn (Report $record): bool => $record->resolved_at !== null)
                    ->action(fn (Report $record) => $record->update(['resolved_at' => null])),
            ]);
    }

    private static function editUrl(Report $report): ?string
    {
        $target = Report::findTarget($report->target, $report->target_ref);

        if ($target === null) {
            return null;
        }

        return $target instanceof Question
            ? QuestionResource::getUrl('edit', ['record' => $target])
            : NoticeResource::getUrl('edit', ['record' => $target]);
    }
}
