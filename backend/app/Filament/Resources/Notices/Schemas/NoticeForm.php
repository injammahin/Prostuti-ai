<?php

namespace App\Filament\Resources\Notices\Schemas;

use App\Models\Notice;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Str;

class NoticeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Group::make()->columnSpan(2)->schema([
                    Section::make('Notice')
                        ->icon(Heroicon::OutlinedMegaphone)
                        ->description('What students see on the Job notices page and the notice detail page.')
                        ->schema([
                            TextInput::make('title')
                                ->label('Title (English)')
                                ->required()
                                ->maxLength(255)
                                ->live(onBlur: true)
                                ->afterStateUpdated(function (?string $state, Set $set, string $operation): void {
                                    if ($operation === 'create' && $state) {
                                        $set('slug', Str::slug($state));
                                    }
                                }),
                            TextInput::make('title_bn')
                                ->label('Title (বাংলা)')
                                ->maxLength(255),
                            Textarea::make('summary')
                                ->label('Summary (English)')
                                ->required()
                                ->rows(4)
                                ->helperText('Plain words: who can apply, what changed, what students should do.'),
                            Textarea::make('summary_bn')
                                ->label('Summary (বাংলা)')
                                ->rows(4),
                        ]),
                    Section::make('Important dates')
                        ->icon(Heroicon::OutlinedCalendarDays)
                        ->description('These dates also appear on the Exam dates calendar and the Home page.')
                        ->columns(2)
                        ->schema([
                            DatePicker::make('apply_from')->label('Application opens')->native(false),
                            DatePicker::make('apply_until')->label('Application deadline')->native(false)->afterOrEqual('apply_from'),
                            DatePicker::make('exam_date')->label('Exam date')->native(false),
                            DatePicker::make('verified_on')->label('Verified with official source on')->native(false)->maxDate(now()),
                        ]),
                    Section::make('Change history')
                        ->icon(Heroicon::OutlinedArrowPath)
                        ->description('If a date or detail changes, record it here so students can see what changed.')
                        ->collapsed()
                        ->schema([
                            Repeater::make('changes')
                                ->hiddenLabel()
                                ->columns(4)
                                ->defaultItems(0)
                                ->addActionLabel('Add a change')
                                ->schema([
                                    TextInput::make('field')->placeholder('e.g. Exam date')->required(),
                                    TextInput::make('old')->label('Before')->required(),
                                    TextInput::make('new')->label('After')->required(),
                                    DatePicker::make('at')->label('Changed on')->native(false)->required(),
                                ]),
                        ]),
                ]),
                Group::make()->schema([
                    Section::make('Publishing')
                        ->icon(Heroicon::OutlinedGlobeAlt)
                        ->schema([
                            Toggle::make('is_published')
                                ->label('Show on the website')
                                ->default(true),
                            DatePicker::make('published_on')
                                ->label('Publish date')
                                ->default(now())
                                ->native(false)
                                ->required()
                                ->helperText('Future dates stay hidden until that day.'),
                        ]),
                    Section::make('Details')
                        ->icon(Heroicon::OutlinedTag)
                        ->schema([
                            Select::make('type')
                                ->options(Notice::TYPES)
                                ->default('circular')
                                ->required()
                                ->native(false),
                            Select::make('exam_id')
                                ->label('Exam')
                                ->relationship('exam', 'name')
                                ->preload()
                                ->native(false),
                            TextInput::make('org')
                                ->label('Organisation')
                                ->placeholder('e.g. BPSC, NTRCA, Bangladesh Bank')
                                ->required()
                                ->maxLength(100),
                            TextInput::make('url')
                                ->label('Official link')
                                ->url()
                                ->placeholder('https://bpsc.gov.bd/...'),
                            TextInput::make('slug')
                                ->label('Web address')
                                ->prefix('/notices/')
                                ->required()
                                ->unique(ignoreRecord: true)
                                ->maxLength(255),
                        ]),
                ]),
            ]);
    }
}
