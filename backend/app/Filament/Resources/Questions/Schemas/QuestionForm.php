<?php

namespace App\Filament\Resources\Questions\Schemas;

use App\Models\Question;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class QuestionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Question')
                    ->columnSpanFull()
                    ->schema([
                        Textarea::make('body')
                            ->label('Question text')
                            ->required()
                            ->rows(3),
                        Grid::make(2)->schema(
                            collect(['A', 'B', 'C', 'D'])->map(fn (string $letter, int $index) => TextInput::make("options.{$index}")
                                ->label("Option {$letter}")
                                ->required())->all()
                        ),
                        Radio::make('answer_index')
                            ->label('Correct answer')
                            ->options([0 => 'A', 1 => 'B', 2 => 'C', 3 => 'D'])
                            ->inline()
                            ->required(),
                        Textarea::make('explanation')
                            ->helperText('Shown after the student answers. Write it yourself — do not copy from guide books.')
                            ->rows(3),
                    ]),
                Section::make('Details')
                    ->columns(3)
                    ->columnSpanFull()
                    ->schema([
                        Select::make('subject_id')
                            ->relationship('subject', 'name')
                            ->required()
                            ->preload()
                            ->searchable(),
                        Select::make('exam_id')
                            ->label('Exam')
                            ->relationship('exam', 'name')
                            ->preload(),
                        TextInput::make('source')
                            ->placeholder('e.g. 45th BCS')
                            ->helperText('Leave empty for practice questions that are not from a past paper.'),
                        TextInput::make('topic'),
                        Select::make('difficulty')
                            ->options(Question::DIFFICULTIES)
                            ->default('medium')
                            ->required(),
                        Select::make('lang')
                            ->label('Language')
                            ->options(['bn' => 'Bangla', 'en' => 'English'])
                            ->default('bn')
                            ->required(),
                    ]),
                Section::make('Review')
                    ->columnSpanFull()
                    ->schema([
                        ToggleButtons::make('status')
                            ->options(Question::STATUSES)
                            ->colors([
                                Question::STATUS_DRAFT => 'gray',
                                Question::STATUS_VERIFIED => 'warning',
                                Question::STATUS_LIVE => 'success',
                            ])
                            ->default(Question::STATUS_DRAFT)
                            ->inline()
                            ->required()
                            ->helperText('Students only see Live questions. Check the answer against a trusted source before going Live.'),
                    ]),
            ]);
    }
}
