<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Users\UserResource;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class NewestStudents extends TableWidget
{
    protected static ?int $sort = 8;

    protected static ?string $heading = 'Newest students';

    public function table(Table $table): Table
    {
        return $table
            ->query(User::query()->where('is_admin', false)->latest())
            ->paginated(false)
            ->modifyQueryUsing(fn ($query) => $query->limit(6))
            ->columns([
                TextColumn::make('name')
                    ->weight('medium')
                    ->description(fn (User $record): string => $record->email),
                TextColumn::make('created_at')
                    ->label('Joined')
                    ->since()
                    ->color('gray'),
            ])
            ->headerActions([
                Action::make('all')->label('All students')->link()->url(UserResource::getUrl()),
            ]);
    }
}
