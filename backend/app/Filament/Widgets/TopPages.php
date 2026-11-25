<?php

namespace App\Filament\Widgets;

use App\Models\PageView;
use Filament\Widgets\Widget;
use Illuminate\Support\Facades\DB;

class TopPages extends Widget
{
    protected static ?int $sort = 10;

    protected int|string|array $columnSpan = 'full';

    protected string $view = 'filament.widgets.top-pages';

    /**
     * @return array<string, mixed>
     */
    protected function getViewData(): array
    {
        $since = now()->subDays(7);

        $pages = PageView::query()
            ->where('created_at', '>=', $since)
            ->select('path', DB::raw('count(*) as views'), DB::raw('count(distinct visitor_id) as visitors'))
            ->groupBy('path')
            ->orderByDesc('views')
            ->limit(8)
            ->get();

        $sources = PageView::query()
            ->where('created_at', '>=', $since)
            ->whereNotNull('referrer')
            ->select('referrer', DB::raw('count(distinct visitor_id) as visitors'))
            ->groupBy('referrer')
            ->orderByDesc('visitors')
            ->limit(5)
            ->get();

        $devices = PageView::query()
            ->where('created_at', '>=', $since)
            ->select('device', DB::raw('count(distinct visitor_id) as visitors'))
            ->groupBy('device')
            ->pluck('visitors', 'device');

        return [
            'pages' => $pages,
            'maxViews' => max(1, (int) $pages->max('views')),
            'sources' => $sources,
            'devices' => $devices,
            'deviceTotal' => max(1, (int) $devices->sum()),
        ];
    }
}
