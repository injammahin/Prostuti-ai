<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use BackedEnum;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\ToggleButtons;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

/**
 * Website settings the admin can change without touching code.
 *
 * @property-read Schema $form
 */
class SiteSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static string|UnitEnum|null $navigationGroup = 'Website';

    protected static ?int $navigationSort = 1;

    protected static ?string $title = 'Site settings';

    protected ?string $subheading = 'Changes go live on the website immediately.';

    protected string $view = 'filament.pages.site-settings';

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(Setting::values());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->components([
                Section::make('Announcement bar')
                    ->description('A message shown at the top of every page — for example a new circular or exam date.')
                    ->icon(Heroicon::OutlinedMegaphone)
                    ->schema([
                        Toggle::make('announcement_enabled')
                            ->label('Show the announcement bar')
                            ->live(),
                        Textarea::make('announcement_text')
                            ->label('Message')
                            ->rows(2)
                            ->maxLength(200)
                            ->required(fn (Get $get): bool => (bool) $get('announcement_enabled'))
                            ->placeholder('e.g. 47th BCS preliminary date announced — 12 December'),
                        TextInput::make('announcement_link')
                            ->label('Link (optional)')
                            ->placeholder('/app/notices or https://…')
                            ->maxLength(255),
                        ToggleButtons::make('announcement_tone')
                            ->label('Colour')
                            ->options(['info' => 'Blue', 'success' => 'Green', 'warning' => 'Orange'])
                            ->colors(['info' => 'info', 'success' => 'success', 'warning' => 'warning'])
                            ->inline(),
                    ]),
                Section::make('Practice')
                    ->icon(Heroicon::OutlinedAcademicCap)
                    ->columns(2)
                    ->schema([
                        TextInput::make('daily_goal')
                            ->label('Daily goal (questions per day)')
                            ->helperText('Shown on every student\'s Home page.')
                            ->numeric()
                            ->minValue(5)
                            ->maxValue(200)
                            ->required(),
                        TextInput::make('daily_quiz_size')
                            ->label('Daily quiz length')
                            ->helperText('Questions in the public daily quiz. Applies from the next quiz.')
                            ->numeric()
                            ->minValue(5)
                            ->maxValue(30)
                            ->required(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $values = $this->form->getState();
        $values['daily_goal'] = (int) $values['daily_goal'];
        $values['daily_quiz_size'] = (int) $values['daily_quiz_size'];

        Setting::put($values);

        Notification::make()->success()->title('Settings saved')->body('The website is updated.')->send();
    }
}
