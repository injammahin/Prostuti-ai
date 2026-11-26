<?php

namespace App\Filament\Resources\Notices\Schemas;

use App\Models\Notice;
use Filament\Actions\Action;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class NoticeForm
{
    /** What usually stays the same between two notices of one organisation. */
    private const COPIED = ['org_bn', 'exam_id', 'category', 'eligibility', 'age_limit', 'fee', 'how_to_apply'];

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Group::make()->columnSpan(2)->schema([
                    Section::make('Notice')
                        ->icon(Heroicon::OutlinedMegaphone)
                        ->description('Only the organisation and the English title are required. New notices are saved as drafts: preview them, then publish.')
                        ->columns(2)
                        ->schema([
                            TextInput::make('org')
                                ->label('Organisation')
                                ->placeholder('e.g. BPSC, NTRCA, Bangladesh Bank')
                                ->datalist(fn (): array => Notice::query()->distinct()->orderBy('org')->pluck('org')->all())
                                ->autofocus(fn (string $operation): bool => $operation === 'create')
                                ->required()
                                ->trim()
                                ->maxLength(100)
                                ->suffixAction(
                                    Action::make('copyPrevious')
                                        ->label('Copy from previous notice of this organisation')
                                        ->tooltip('Copy from previous notice of this organisation')
                                        ->icon(Heroicon::OutlinedDocumentDuplicate)
                                        ->action(fn (Get $get, Set $set, ?Notice $record) => self::copyPrevious($get, $set, $record)),
                                ),
                            TextInput::make('org_bn')
                                ->label('Organisation (বাংলা)')
                                ->placeholder('যেমন: বাংলাদেশ ব্যাংক')
                                ->datalist(fn (): array => Notice::query()->whereNotNull('org_bn')->distinct()->orderBy('org_bn')->pluck('org_bn')->all())
                                ->trim()
                                ->maxLength(150)
                                ->helperText('Used in the page title: "<this> নিয়োগ বিজ্ঞপ্তি ২০২৬".'),
                            Select::make('type')
                                ->options(Notice::TYPES)
                                ->default('circular')
                                ->required()
                                ->native(false),
                            TextInput::make('title')
                                ->label('Title (English)')
                                ->placeholder('e.g. Assistant Director and Officer posts')
                                ->required()
                                ->maxLength(255)
                                ->columnSpanFull(),
                            TextInput::make('title_bn')
                                ->label('Title (বাংলা)')
                                ->columnSpanFull()
                                ->maxLength(255),
                            TextInput::make('url')
                                ->label('Official source URL (the circular)')
                                ->url()
                                ->maxLength(255)
                                ->placeholder('https://bpsc.gov.bd/...'),
                            TextInput::make('apply_url')
                                ->label('Apply link')
                                ->url()
                                ->maxLength(255)
                                ->placeholder('https://xxx.teletalk.com.bd'),
                        ]),
                    Section::make('Job details')
                        ->icon(Heroicon::OutlinedBriefcase)
                        ->description('Shown as a table on the notice page. Leave empty what the circular does not say.')
                        ->columns(2)
                        ->schema([
                            Repeater::make('posts')
                                ->label('Posts')
                                ->columnSpanFull()
                                ->columns(6)
                                ->defaultItems(0)
                                ->addActionLabel('Add a post')
                                ->reorderable()
                                ->compact()
                                ->schema([
                                    TextInput::make('name')->label('Post name')->required()->columnSpan(3),
                                    TextInput::make('grade')->placeholder('e.g. 9th')->columnSpan(1),
                                    TextInput::make('vacancies')->placeholder('e.g. 25')->columnSpan(2),
                                ]),
                            TextInput::make('vacancies')->label('Total vacancies')->placeholder('Left empty: the sum of the posts')->maxLength(100),
                            TextInput::make('post_name')->label('Posts in one line (if not listed above)')->maxLength(500),
                            TextInput::make('age_limit')->placeholder('e.g. 21–32 years on 1 December 2026')->maxLength(255),
                            TextInput::make('fee')->label('Application fee')->placeholder('e.g. ৳200')->maxLength(255),
                            Textarea::make('eligibility')->rows(2)->columnSpanFull(),
                            Textarea::make('how_to_apply')->label('How to apply')->rows(4)->columnSpanFull()->helperText('One step per line.'),
                        ]),
                    Section::make('Dates')
                        ->icon(Heroicon::OutlinedCalendarDays)
                        ->description('These dates also appear on the Exam dates calendar and the Home page.')
                        ->columns(2)
                        ->schema([
                            DatePicker::make('apply_from')->label('Application opens')->native(false),
                            DatePicker::make('apply_until')->label('Application deadline')->native(false)->afterOrEqual('apply_from'),
                            DatePicker::make('exam_date')->label('Exam date')->native(false),
                            DatePicker::make('verified_on')->label('Verified with official source on')->native(false)->maxDate(now())->default(now()),
                        ]),
                    Section::make('Summary and circular')
                        ->icon(Heroicon::OutlinedDocumentText)
                        ->schema([
                            Textarea::make('summary')
                                ->label('Summary (English)')
                                ->rows(3)
                                ->helperText('In your own words. Left empty, a short one is written from the details above.'),
                            Textarea::make('summary_bn')
                                ->label('Summary (বাংলা)')
                                ->rows(3),
                            FileUpload::make('attachment')
                                ->label('Circular (image or PDF)')
                                ->disk('public')
                                ->directory('notices')
                                ->visibility('public')
                                ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
                                ->maxSize(8192),
                        ]),
                    Section::make('Change history')
                        ->icon(Heroicon::OutlinedArrowPath)
                        ->description('If a date or detail changes, record it here so students can see what changed. "Update" in the notice list does this for you.')
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
                                ->label('Published (shown on the website)')
                                ->helperText('Off = draft. Use "Preview" to check the page first.')
                                ->default(false),
                            DatePicker::make('published_on')
                                ->label('Publish date')
                                ->default(now())
                                ->native(false)
                                ->required()
                                ->helperText('Future dates stay hidden until that day.'),
                            TextInput::make('slug')
                                ->label('Web address')
                                ->prefix('/notices/')
                                ->placeholder('made automatically')
                                ->unique(ignoreRecord: true)
                                ->alphaDash()
                                ->maxLength(255)
                                // One circular = one page forever: the address never changes after it is created.
                                ->disabled(fn (string $operation): bool => $operation === 'edit')
                                ->dehydrated(fn (string $operation): bool => $operation === 'create')
                                ->helperText(fn (string $operation): string => $operation === 'edit'
                                    ? 'Permanent. Put admit cards, exam dates and results on this same page with "Update".'
                                    : 'Left empty: {organisation}-job-circular-'.now()->year.' for a circular, otherwise made from the title.'),
                        ]),
                    Section::make('Where it appears')
                        ->icon(Heroicon::OutlinedTag)
                        ->schema([
                            Select::make('category')
                                ->label('Section')
                                ->options(array_map(fn (array $names): string => $names[0], Notice::CATEGORIES))
                                ->placeholder('From the exam')
                                ->native(false),
                            Select::make('exam_id')
                                ->label('Exam')
                                ->relationship('exam', 'name')
                                ->preload()
                                ->native(false),
                            Select::make('status')
                                ->options(array_map(fn (array $names): string => $names[0], Notice::STATUSES))
                                ->placeholder('From the type and dates')
                                ->native(false),
                        ]),
                ]),
            ]);
    }

    private static function copyPrevious(Get $get, Set $set, ?Notice $record): void
    {
        $previous = Notice::query()
            ->where('org', trim((string) $get('org')))
            ->when($record, fn ($query) => $query->whereKeyNot($record->getKey()))
            ->latest('published_on')->latest('id')
            ->first();

        if (! $previous) {
            Notification::make()->title('No earlier notice of this organisation')->warning()->send();

            return;
        }

        foreach (self::COPIED as $field) {
            if (blank($get($field))) {
                $set($field, $previous->{$field});
            }
        }

        Notification::make()->title("Copied from: {$previous->title}")->success()->send();
    }
}
