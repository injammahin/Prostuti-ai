<?php

namespace App\Filament\Widgets\Concerns;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Daily counts for charts, bucketed by Bangladesh calendar days.
 */
trait CountsPerDay
{
    /**
     * @param  Builder<Model>  $query
     * @return array<string, int> date => count, oldest first, every day present
     */
    protected function countPerDay(Builder $query, int $days, string $column = 'created_at', ?string $distinct = null): array
    {
        $timezone = config('app.student_timezone');
        $start = CarbonImmutable::now($timezone)->subDays($days - 1)->startOfDay();
        $offsetHours = (int) round(CarbonImmutable::now($timezone)->getOffset() / 3600);

        $table = $query->getModel()->getTable();
        $dayExpression = DB::connection()->getDriverName() === 'sqlite'
            ? "date({$table}.{$column}, '{$offsetHours} hours')"
            : "DATE(DATE_ADD({$table}.{$column}, INTERVAL {$offsetHours} HOUR))";
        $countExpression = $distinct ? "COUNT(DISTINCT {$table}.{$distinct})" : 'COUNT(*)';

        $counts = (clone $query)
            ->where("{$table}.{$column}", '>=', $start->utc())
            ->selectRaw("{$dayExpression} as day, {$countExpression} as total")
            ->groupBy('day')
            ->pluck('total', 'day');

        $series = [];

        for ($day = $start; $day->lte(CarbonImmutable::now($timezone)); $day = $day->addDay()) {
            $series[$day->toDateString()] = (int) ($counts[$day->toDateString()] ?? 0);
        }

        return $series;
    }

    /**
     * Start of "today" in Bangladesh, as a UTC timestamp for queries.
     */
    protected function startOfToday(): CarbonImmutable
    {
        return CarbonImmutable::now(config('app.student_timezone'))->startOfDay()->utc();
    }
}
