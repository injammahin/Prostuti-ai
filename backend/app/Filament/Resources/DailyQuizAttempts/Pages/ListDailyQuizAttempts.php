<?php

namespace App\Filament\Resources\DailyQuizAttempts\Pages;

use App\Filament\Resources\DailyQuizAttempts\DailyQuizAttemptResource;
use App\Filament\Resources\DailyQuizAttempts\Widgets\DailyQuizStats;
use Filament\Resources\Pages\ListRecords;

class ListDailyQuizAttempts extends ListRecords
{
    protected static string $resource = DailyQuizAttemptResource::class;

    protected ?string $subheading = 'Everyone who finished the daily quiz (guests from Facebook, WhatsApp and other shares included), with their score. Updates every 15 seconds.';

    protected function getHeaderWidgets(): array
    {
        return [DailyQuizStats::class];
    }
}
