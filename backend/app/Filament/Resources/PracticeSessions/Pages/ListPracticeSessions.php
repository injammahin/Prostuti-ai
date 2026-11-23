<?php

namespace App\Filament\Resources\PracticeSessions\Pages;

use App\Filament\Resources\PracticeSessions\PracticeSessionResource;
use App\Filament\Resources\PracticeSessions\Widgets\AttemptStats;
use Filament\Resources\Pages\ListRecords;

class ListPracticeSessions extends ListRecords
{
    protected static string $resource = PracticeSessionResource::class;

    protected ?string $subheading = 'Every practice and test started on the website, by students and guests.';

    protected function getHeaderWidgets(): array
    {
        return [AttemptStats::class];
    }
}
