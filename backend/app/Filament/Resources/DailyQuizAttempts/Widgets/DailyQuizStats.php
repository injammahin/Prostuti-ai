<?php

namespace App\Filament\Resources\DailyQuizAttempts\Widgets;

use App\Models\DailyQuizAttempt;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DailyQuizStats extends StatsOverviewWidget
{
    protected ?string $pollingInterval = '30s';

    /**
     * @return array<Stat>
     */
    protected function getStats(): array
    {
        $today = now(config('app.student_timezone'))->startOfDay()->utc();
        $todayQuery = DailyQuizAttempt::query()->where('created_at', '>=', $today);

        $todayTotal = (clone $todayQuery)->count();
        $todayGuests = (clone $todayQuery)->whereNull('user_id')->count();
        $averageToday = (clone $todayQuery)->where('total', '>', 0)->selectRaw('avg(score * 100.0 / total) as pct')->value('pct');
        $perfectToday = (clone $todayQuery)->whereColumn('score', 'total')->count();

        $round = DailyQuizAttempt::query()->where('slot', DailyQuizAttempt::slotFor());
        $roundTotal = (clone $round)->count();
        $roundPeople = (clone $round)->distinct()->count('visitor_id');

        $topSource = DailyQuizAttempt::query()
            ->where('created_at', '>=', now()->subDays(7))
            ->whereNotNull('source')
            ->selectRaw('source, count(*) as attempts')
            ->groupBy('source')
            ->orderByDesc('attempts')
            ->first();

        return [
            Stat::make('Attended today', number_format($todayTotal))
                ->description(number_format($todayGuests).' guests · '.number_format($todayTotal - $todayGuests).' students')
                ->icon(Heroicon::OutlinedUserGroup)
                ->color('primary'),
            Stat::make('This round', number_format($roundTotal))
                ->description(DailyQuizAttempt::slotLabel(DailyQuizAttempt::slotFor()).' · '.number_format($roundPeople).' different people')
                ->icon(Heroicon::OutlinedClock)
                ->color('info'),
            Stat::make('Average score today', $averageToday !== null ? round((float) $averageToday).'%' : '—')
                ->description(number_format($perfectToday).' perfect scores')
                ->icon(Heroicon::OutlinedChartBar)
                ->color('warning'),
            Stat::make('Top platform (7 days)', $topSource ? DailyQuizAttempt::sourceLabel($topSource->source) : '—')
                ->description($topSource ? number_format((int) $topSource->attempts).' quizzes came from here' : 'No quizzes yet')
                ->icon(Heroicon::OutlinedShare)
                ->color('success'),
        ];
    }
}
