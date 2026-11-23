<?php

namespace App\Filament\Resources\ActivityLogs\Tables;

use App\Models\ActivityLog;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Infolists\Components\KeyValueEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ActivityLogsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->poll('15s')
            ->columns([
                TextColumn::make('created_at')
                    ->label('When')
                    ->dateTime('j M, g:i a', config('app.student_timezone'))
                    ->description(fn (ActivityLog $record): string => $record->created_at->diffForHumans())
                    ->sortable(),
                TextColumn::make('action')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => ActivityLog::labelFor($state))
                    ->color(fn (string $state): string => ActivityLog::colorFor($state)),
                TextColumn::make('description')
                    ->searchable()
                    ->wrap(),
                TextColumn::make('user.name')
                    ->label('Student')
                    ->placeholder('Guest')
                    ->description(fn (ActivityLog $record): ?string => $record->user?->email)
                    ->searchable(['name', 'email']),
                TextColumn::make('ip')
                    ->label('IP address')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('visitor_id')
                    ->label('Visitor')
                    ->formatStateUsing(fn (?string $state): string => $state ? substr($state, 0, 8) : '—')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('action')
                    ->multiple()
                    ->options(collect(ActivityLog::ACTIONS)->map(fn (array $action): string => $action[0])->all()),
                TernaryFilter::make('user_id')
                    ->label('Who')
                    ->nullable()
                    ->trueLabel('Students only')
                    ->falseLabel('Guests only'),
                Filter::make('date')
                    ->schema([
                        DatePicker::make('from'),
                        DatePicker::make('until'),
                    ])
                    ->query(fn (Builder $query, array $data): Builder => $query
                        ->when($data['from'] ?? null, fn (Builder $q, string $date) => $q->whereDate('created_at', '>=', $date))
                        ->when($data['until'] ?? null, fn (Builder $q, string $date) => $q->whereDate('created_at', '<=', $date))),
            ])
            ->recordActions([
                ViewAction::make()
                    ->schema([
                        TextEntry::make('description'),
                        TextEntry::make('created_at')->dateTime('j M Y, g:i:s a', config('app.student_timezone')),
                        TextEntry::make('user.email')->label('Student')->placeholder('Guest'),
                        TextEntry::make('ip')->label('IP address')->placeholder('—'),
                        KeyValueEntry::make('properties')->label('Details'),
                    ]),
            ]);
    }
}
