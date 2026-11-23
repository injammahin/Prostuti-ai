<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
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
                Section::make('Access')
                    ->columns(2)
                    ->schema([
                        Toggle::make('is_admin')
                            ->label('Admin (can open this panel)'),
                        TextInput::make('password')
                            ->password()
                            ->revealable()
                            ->helperText('Only needed for admins. Students sign in with an email code or Google.')
                            ->dehydrated(fn (?string $state): bool => filled($state)),
                    ]),
            ]);
    }
}
