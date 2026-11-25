<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\ActivityLogs\ActivityLogResource;
use App\Models\ActivityLog;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestActivity extends TableWidget
{
    protected static ?int $sort = 8;

    protected int|string|array $columnSpan = ['md' => 2, 'xl' => 2];

    protected static ?string $heading = 'Live activity';

    protected ?string $pollingInterval = '10s';

    public function table(Table $table): Table
    {
        return $table
            ->query(ActivityLog::query()->with('user')->latest('created_at'))
            ->defaultPaginationPageOption(8)
            ->paginated([8])
            ->columns([
                TextColumn::make('created_at')
                    ->label('When')
                    ->since()
                    ->tooltip(fn (ActivityLog $record): string => $record->created_at->timezone(config('app.student_timezone'))->format('j M Y, g:i a')),
                TextColumn::make('action')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => ActivityLog::labelFor($state))
                    ->color(fn (string $state): string => ActivityLog::colorFor($state)),
                TextColumn::make('description')
                    ->wrap(),
                TextColumn::make('user.email')
                    ->label('Student')
                    ->placeholder('Guest')
                    ->color('gray'),
            ])
            ->headerActions([
                Action::make('all')
                    ->label('View full log')
                    ->link()
                    ->url(ActivityLogResource::getUrl()),
            ]);
    }
}
