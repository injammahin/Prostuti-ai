<?php

namespace App\Filament\Resources\PracticeSessions\Widgets;

use App\Models\PracticeSession;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AttemptStats extends StatsOverviewWidget
{
    protected ?string $pollingInterval = '30s';

    /**
     * @return array<Stat>
     */
    protected function getStats(): array
    {
        $today = now(config('app.student_timezone'))->startOfDay()->utc();
        $week = PracticeSession::query()->where('created_at', '>=', now()->subDays(7));
        $finishedWeek = (clone $week)->whereNotNull('finished_at')->where('total', '>', 0);

        $started = (clone $week)->count();
        $finished = (clone $finishedWeek)->count();
        $averageScore = (clone $finishedWeek)->selectRaw('avg(correct * 100.0 / total) as score')->value('score');

        return [
            Stat::make('Attempts today', number_format(PracticeSession::query()->where('created_at', '>=', $today)->count()))
                ->description(number_format($started).' in the last 7 days')
                ->icon(Heroicon::OutlinedPlayCircle)
                ->color('primary'),
            Stat::make('Finished (7 days)', $started ? round($finished / $started * 100).'%' : '—')
                ->description(number_format($finished).' of '.number_format($started).' attempts completed')
                ->icon(Heroicon::OutlinedFlag)
                ->color('success'),
            Stat::make('Average score (7 days)', $averageScore !== null ? round((float) $averageScore).'%' : '—')
                ->description('Correct answers in finished attempts')
                ->icon(Heroicon::OutlinedChartBar)
                ->color('warning'),
        ];
    }
}
