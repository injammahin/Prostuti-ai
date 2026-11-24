<?php

namespace App\Filament\Resources\ModelTests\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ModelTestForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Title (English)')
                    ->required(),
                TextInput::make('title_bn')
                    ->label('Title (Bengali)'),
                TextInput::make('slug')
                    ->label('Slug')
                    ->required(),
                Select::make('exam_slug')
                    ->label('Target Examination')
                    ->options([
                        'bcs-general' => 'BCS General',
                        'bank' => 'Combined Bank Jobs',
                        'primary' => 'Primary Assistant Teacher',
                        'ntrca' => 'NTRCA Teacher Registration',
                    ])
                    ->default('bcs-general')
                    ->required(),
                Select::make('type')
                    ->label('Test Type')
                    ->options([
                        'full' => 'Full Model Test',
                        'subject' => 'Subject Test',
                        'speed_drill' => 'Speed Drill',
                    ])
                    ->default('full')
                    ->required(),
                TextInput::make('duration_minutes')
                    ->label('Duration (Minutes)')
                    ->numeric()
                    ->default(120)
                    ->required(),
                TextInput::make('total_marks')
                    ->label('Total Marks')
                    ->numeric()
                    ->default(200)
                    ->required(),
                TextInput::make('pass_marks')
                    ->label('Pass Marks')
                    ->numeric()
                    ->default(100)
                    ->required(),
                TextInput::make('negative_marking')
                    ->label('Negative Marking')
                    ->numeric()
                    ->step(0.05)
                    ->default(0.50)
                    ->required(),
                TextInput::make('total_questions')
                    ->label('Total Questions')
                    ->numeric()
                    ->default(200)
                    ->disabled(),
                Select::make('status')
                    ->label('Status')
                    ->options([
                        'published' => 'Published',
                        'draft' => 'Draft',
                        'scheduled' => 'Scheduled',
                    ])
                    ->default('published')
                    ->required(),
                DateTimePicker::make('starts_at')
                    ->label('Scheduled Start Date & Time'),
                DateTimePicker::make('ends_at')
                    ->label('Scheduled End Date & Time'),
            ]);
    }
}
