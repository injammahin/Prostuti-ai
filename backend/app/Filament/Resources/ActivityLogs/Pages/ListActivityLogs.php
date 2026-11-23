<?php

namespace App\Filament\Resources\ActivityLogs\Pages;

use App\Filament\Resources\ActivityLogs\ActivityLogResource;
use Filament\Resources\Pages\ListRecords;

class ListActivityLogs extends ListRecords
{
    protected static string $resource = ActivityLogResource::class;

    protected ?string $subheading = 'Everything students and visitors do — sign-ups, logins, practices, daily quizzes. Updates every 15 seconds.';
}
