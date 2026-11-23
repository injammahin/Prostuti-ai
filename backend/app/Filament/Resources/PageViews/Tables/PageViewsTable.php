<?php

namespace App\Filament\Resources\PageViews\Tables;

use App\Models\PageView;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class PageViewsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->poll('30s')
            ->modifyQueryUsing(fn ($query) => $query->with('user'))
            ->columns([
                TextColumn::make('created_at')
                    ->label('When')
                    ->dateTime('j M, g:i a', config('app.student_timezone'))
                    ->description(fn (PageView $record): string => $record->created_at->diffForHumans())
                    ->sortable(),
                TextColumn::make('path')
                    ->label('Page')
                    ->searchable()
                    ->fontFamily('mono')
                    ->size('sm'),
                TextColumn::make('user.name')
                    ->label('Who')
                    ->placeholder('Guest')
                    ->description(fn (PageView $record): string => 'Visitor '.substr($record->visitor_id, 0, 8)),
                TextColumn::make('device')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => PageView::DEVICES[$state] ?? $state)
                    ->color('gray'),
                TextColumn::make('browser')
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('referrer')
                    ->label('Came from')
                    ->placeholder('Direct')
                    ->toggleable(),
            ])
            ->filters([
                SelectFilter::make('device')->options(PageView::DEVICES),
                TernaryFilter::make('user_id')
                    ->label('Who')
                    ->nullable()
                    ->trueLabel('Signed-in students')
                    ->falseLabel('Guests'),
            ]);
    }
}
