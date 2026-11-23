<?php

namespace App\Filament\Resources\PageViews\Widgets;

use App\Models\PageView;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class VisitorStats extends StatsOverviewWidget
{
    protected ?string $pollingInterval = '30s';

    protected function getColumns(): int
    {
        return 4;
    }

    /**
     * @return array<Stat>
     */
    protected function getStats(): array
    {
        $today = now(config('app.student_timezone'))->startOfDay()->utc();
        $uniqueSince = fn ($since) => PageView::query()->where('created_at', '>=', $since)->distinct()->count('visitor_id');

        $month = PageView::query()->where('created_at', '>=', now()->subDays(30));
        $monthViews = (clone $month)->count();
        $monthVisitors = (clone $month)->distinct()->count('visitor_id');
        $monthSignedIn = (clone $month)->whereNotNull('user_id')->distinct()->count('visitor_id');
        $monthMobile = (clone $month)->where('device', 'mobile')->distinct()->count('visitor_id');

        return [
            Stat::make('Visitors today', number_format($uniqueSince($today)))
                ->description(number_format($uniqueSince(now()->subDays(7))).' in the last 7 days')
                ->icon(Heroicon::OutlinedUsers)
                ->color('primary'),
            Stat::make('Visitors (30 days)', number_format($monthVisitors))
                ->description(number_format($monthViews).' page views')
                ->icon(Heroicon::OutlinedGlobeAlt)
                ->color('info'),
            Stat::make('Pages per visitor', $monthVisitors ? number_format($monthViews / $monthVisitors, 1) : '—')
                ->description('Average over the last 30 days')
                ->icon(Heroicon::OutlinedDocumentDuplicate)
                ->color('success'),
            Stat::make('On mobile', $monthVisitors ? round($monthMobile / $monthVisitors * 100).'%' : '—')
                ->description(($monthVisitors ? round($monthSignedIn / $monthVisitors * 100) : 0).'% were signed in')
                ->icon(Heroicon::OutlinedDevicePhoneMobile)
                ->color('warning'),
        ];
    }
}
