<?php

namespace App\Filament\Resources\Users;

use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Filament\Resources\Users\Pages\ViewUser;
use App\Filament\Resources\Users\Schemas\UserForm;
use App\Filament\Resources\Users\Schemas\UserInfolist;
use App\Filament\Resources\Users\Tables\UsersTable;
use App\Models\User;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\URL;
use UnitEnum;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static string|UnitEnum|null $navigationGroup = 'Students & activity';

    protected static ?int $navigationSort = 1;

    protected static ?string $navigationLabel = 'Students';

    protected static ?string $recordTitleAttribute = 'name';

    /**
     * The .env admin account is not listed, so it can't be edited, deleted or logged into from here.
     *
     * @return Builder<User>
     */
    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $adminEmail = User::adminEmail();

        return $adminEmail === '' ? $query : $query->whereRaw('lower(email) <> ?', [$adminEmail]);
    }

    /**
     * Opens the website in a new tab, signed in as this student.
     */
    public static function loginAsAction(): Action
    {
        return Action::make('loginAs')
            ->label('Log in as')
            ->icon(Heroicon::OutlinedArrowRightEndOnRectangle)
            ->color('warning')
            ->url(fn (User $record): string => URL::temporarySignedRoute('admin.login-as', now()->addHours(12), ['user' => $record]), shouldOpenInNewTab: true);
    }

    /**
     * @return array<int, string>
     */
    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'email', 'phone'];
    }

    public static function form(Schema $schema): Schema
    {
        return UserForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return UserInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UsersTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'view' => ViewUser::route('/{record}'),
            'edit' => EditUser::route('/{record}/edit'),
        ];
    }
}
