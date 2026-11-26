<?php

namespace App\Filament\Resources\Users\Tables;

use App\Filament\Resources\Users\Schemas\UserForm;
use App\Filament\Resources\Users\UserResource;
use App\Models\User;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->weight('medium'),
                TextColumn::make('email')
                    ->label('Email address')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('phone')
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('main_exam')
                    ->label('Preparing for')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => UserForm::EXAMS[$state] ?? (string) $state),
                IconColumn::make('has_google')
                    ->label('Google')
                    ->boolean()
                    ->getStateUsing(fn (User $record): bool => $record->google_id !== null)
                    ->toggleable(),
                TextColumn::make('last_login_at')
                    ->label('Last active')
                    ->since()
                    ->sortable()
                    ->placeholder('Never'),
                TextColumn::make('created_at')
                    ->label('Joined')
                    ->date()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('main_exam')
                    ->label('Preparing for')
                    ->options(UserForm::EXAMS),
            ])
            ->recordActions([
                UserResource::loginAsAction(),
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
