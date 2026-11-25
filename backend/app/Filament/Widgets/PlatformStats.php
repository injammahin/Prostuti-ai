<?php

namespace App\Filament\Widgets;

use App\Filament\Widgets\Concerns\CountsPerDay;
use App\Models\ActivityLog;
use App\Models\PageView;
use App\Models\SessionAnswer;
use App\Models\User;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class PlatformStats extends StatsOverviewWidget
{
    use CountsPerDay;

    protected static ?int $sort = 1;

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
        $today = $this->startOfToday();
        $yesterday = $today->subDay();

        $visitorsSeries = $this->countPerDay(PageView::query(), 14, distinct: 'visitor_id');
        $signupSeries = $this->countPerDay(User::query()->where('is_admin', false), 14);
        $answerSeries = $this->countPerDay(SessionAnswer::query(), 14);
        $quizSeries = $this->countPerDay(ActivityLog::query()->where('action', 'daily_quiz.completed'), 14);

        $answersToday = SessionAnswer::query()->where('created_at', '>=', $today);
        $answeredToday = (clone $answersToday)->count();
        $correctToday = (clone $answersToday)->where('is_correct', true)->count();
        $students = User::query()->where('is_admin', false)->count();

        return [
            $this->stat('Visitors today', end($visitorsSeries), $this->versus(end($visitorsSeries), $this->yesterday($visitorsSeries)), $visitorsSeries, Heroicon::OutlinedGlobeAlt, 'primary'),
            $this->stat('Students', $students, '+'.User::query()->where('is_admin', false)->where('created_at', '>=', $today->subDays(6))->count().' joined this week', $signupSeries, Heroicon::OutlinedUserGroup, 'primary'),
            $this->stat('Questions answered today', $answeredToday, $answeredToday ? round($correctToday / $answeredToday * 100).'% answered correctly' : 'No answers yet today', $answerSeries, Heroicon::OutlinedCheckBadge, 'primary'),
            $this->stat('Daily quiz plays today', end($quizSeries), number_format(array_sum($quizSeries)).' in the last 14 days', $quizSeries, Heroicon::OutlinedTrophy, 'primary'),
        ];
    }

    /**
     * @param  array<string, int>  $series
     */
    private function stat(string $label, int $value, string $description, array $series, Heroicon $icon, string $color): Stat
    {
        return Stat::make($label, number_format($value))
            ->description($description)
            ->icon($icon)
            ->chart(array_values($series))
            ->color($color);
    }

    /**
     * @param  array<string, int>  $series
     */
    private function yesterday(array $series): int
    {
        $values = array_values($series);

        return $values[count($values) - 2] ?? 0;
    }

    private function versus(int $today, int $yesterday): string
    {
        if ($yesterday === 0) {
            return $today ? 'New today' : 'Nothing yet today';
        }

        $change = (int) round(($today - $yesterday) / $yesterday * 100);

        return ($change >= 0 ? '+' : '').$change.'% vs yesterday';
    }
}
