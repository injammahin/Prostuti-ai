<?php

namespace App\Filament\Resources\Posts\Schemas;

use App\Models\Post;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Str;

class PostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Group::make()->columnSpan(2)->schema([
                    Section::make('Article')
                        ->icon(Heroicon::OutlinedNewspaper)
                        ->schema([
                            TextInput::make('title')
                                ->required()
                                ->maxLength(255)
                                ->live(onBlur: true)
                                ->afterStateUpdated(function (?string $state, Set $set, string $operation): void {
                                    if ($operation === 'create' && $state) {
                                        $set('slug', Str::slug($state) ?: Str::lower(Str::random(8)));
                                    }
                                }),
                            Textarea::make('excerpt')
                                ->label('Short summary')
                                ->required()
                                ->rows(3)
                                ->maxLength(500)
                                ->helperText('Shown on the blog list and in Google results. 1–2 sentences.'),
                            RichEditor::make('body')
                                ->label('Article')
                                ->required()
                                ->extraInputAttributes(['style' => 'min-height: 28rem;'])
                                ->toolbarButtons([
                                    ['bold', 'italic', 'underline', 'strike', 'highlight', 'link'],
                                    ['h2', 'h3', 'blockquote', 'horizontalRule'],
                                    ['alignStart', 'alignCenter', 'alignEnd'],
                                    ['bulletList', 'orderedList', 'table', 'codeBlock'],
                                    ['attachFiles'],
                                    ['clearFormatting', 'undo', 'redo'],
                                ])
                                ->fileAttachmentsDisk('public')
                                ->fileAttachmentsDirectory('posts/content')
                                ->fileAttachmentsVisibility('public')
                                ->fileAttachmentsAcceptedFileTypes(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
                                ->fileAttachmentsMaxSize(4096)
                                ->helperText('Use the image button to put pictures inside the article. Use H2 for main sections — it helps Google.'),
                        ]),
                    Section::make('Downloads (PDF)')
                        ->icon(Heroicon::OutlinedDocumentArrowDown)
                        ->description('Question papers, syllabus, circulars or notes readers can download from the article.')
                        ->collapsible()
                        ->schema([
                            Repeater::make('attachments')
                                ->hiddenLabel()
                                ->columns(2)
                                ->defaultItems(0)
                                ->reorderable()
                                ->addActionLabel('Add a file')
                                ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                                ->schema([
                                    TextInput::make('title')
                                        ->label('Name shown to readers')
                                        ->placeholder('e.g. 47th BCS question paper (PDF)')
                                        ->required()
                                        ->maxLength(150),
                                    FileUpload::make('file')
                                        ->label('File')
                                        ->disk('public')
                                        ->directory('posts/files')
                                        ->visibility('public')
                                        ->acceptedFileTypes([
                                            'application/pdf',
                                            'application/msword',
                                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                            'image/png',
                                            'image/jpeg',
                                        ])
                                        ->maxSize(20480)
                                        ->preserveFilenames()
                                        ->downloadable()
                                        ->openable()
                                        ->required()
                                        ->helperText('PDF, Word or image, up to 20 MB.'),
                                ]),
                        ]),
                    Section::make('Search engines (SEO)')
                        ->icon(Heroicon::OutlinedMagnifyingGlass)
                        ->description('Leave empty to use the title and short summary.')
                        ->collapsed()
                        ->schema([
                            TextInput::make('meta_title')
                                ->label('Google title')
                                ->maxLength(70)
                                ->helperText('Best under 60 characters.'),
                            Textarea::make('meta_description')
                                ->label('Google description')
                                ->rows(2)
                                ->maxLength(300)
                                ->helperText('Best between 120 and 160 characters.'),
                        ]),
                ]),
                Group::make()->schema([
                    Section::make('Publishing')
                        ->icon(Heroicon::OutlinedGlobeAlt)
                        ->schema([
                            Toggle::make('is_published')
                                ->label('Show on the website')
                                ->default(true),
                            Toggle::make('is_featured')
                                ->label('Featured')
                                ->helperText('Pinned to the top of the blog.'),
                            DateTimePicker::make('published_at')
                                ->label('Publish date')
                                ->default(now())
                                ->native(false)
                                ->required()
                                ->helperText('Future dates stay hidden until then.'),
                        ]),
                    Section::make('Details')
                        ->icon(Heroicon::OutlinedTag)
                        ->schema([
                            Select::make('category')
                                ->options(Post::CATEGORIES)
                                ->default('guide')
                                ->required()
                                ->native(false),
                            Select::make('lang')
                                ->label('Language')
                                ->options(['bn' => 'বাংলা', 'en' => 'English'])
                                ->default('bn')
                                ->required()
                                ->native(false),
                            TagsInput::make('tags')
                                ->placeholder('e.g. BCS, preliminary'),
                            FileUpload::make('cover_image')
                                ->label('Poster / cover image')
                                ->image()
                                ->disk('public')
                                ->directory('posts/covers')
                                ->visibility('public')
                                ->imageEditor()
                                ->imageEditorAspectRatioOptions(['1.91:1', '16:9', '1:1'])
                                ->maxSize(4096)
                                ->helperText('Shown on the blog and when the link is shared on Facebook. Best size 1200 × 630.'),
                            TextInput::make('author')
                                ->default('DreamPrep Team')
                                ->required()
                                ->maxLength(100),
                            TextInput::make('slug')
                                ->label('Web address')
                                ->prefix('/blog/')
                                ->required()
                                ->alphaDash()
                                ->unique(ignoreRecord: true)
                                ->maxLength(255),
                        ]),
                ]),
            ]);
    }
}
