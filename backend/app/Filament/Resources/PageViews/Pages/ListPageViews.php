<?php

namespace App\Filament\Resources\PageViews\Pages;

use App\Filament\Resources\PageViews\PageViewResource;
use App\Filament\Resources\PageViews\Widgets\VisitorStats;
use Filament\Resources\Pages\ListRecords;

class ListPageViews extends ListRecords
{
    protected static string $resource = PageViewResource::class;

    protected ?string $subheading = 'Every page opened on the website. A "visitor" is one browser/device.';

    protected function getHeaderWidgets(): array
    {
        return [VisitorStats::class];
    }
}
