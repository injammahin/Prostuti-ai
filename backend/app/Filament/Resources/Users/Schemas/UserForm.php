<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserForm
{
    /**
     * @var array<string, string>
     */
    public const EXAMS = [
        'bcs-general' => 'BCS General',
        'ntrca' => 'NTRCA Teacher Registration',
        'primary-teacher' => 'Primary Assistant Teacher',
        'combined-bank' => 'Combined Bank Jobs',
        'bangladesh-bank' => 'Bangladesh Bank',
    ];

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Profile')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(80),
                        TextInput::make('email')
                            ->label('Email address')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true),
                        TextInput::make('phone')
                            ->tel()
                            ->placeholder('01XXXXXXXXX'),
                        Select::make('main_exam')
                            ->label('Preparing for')
                            ->options(self::EXAMS)
                            ->default('bcs-general')
                            ->required(),
                    ]),
                Section::make('Password')
                    ->description('Passwords are stored one-way encrypted, so the current one can never be shown. Set a new one here, or leave it empty to keep the current password.')
                    ->schema([
                        TextInput::make('password')
                            ->label('New password')
                            ->password()
                            ->revealable()
                            ->minLength(8)
                            ->dehydrated(fn (?string $state): bool => filled($state)),
                    ]),
            ]);
    }
}
