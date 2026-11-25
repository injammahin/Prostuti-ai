<?php

namespace App\Filament\Widgets;

use App\Filament\Widgets\Concerns\CountsPerDay;
use App\Models\PageView;
use App\Models\SessionAnswer;
use App\Models\User;
use Carbon\CarbonImmutable;
use Filament\Widgets\ChartWidget;

class TrafficChart extends ChartWidget
{
    use CountsPerDay;

    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = ['md' => 2, 'xl' => 2];

    protected ?string $heading = 'Visitors, sign-ups & practice';

    protected ?string $description = 'Unique visitors, new students and questions answered per day';

    protected ?string $maxHeight = '300px';

    public ?string $filter = '30';

    /**
     * @return array<string, string>
     */
    protected function getFilters(): ?array
    {
        return ['7' => 'Last 7 days', '30' => 'Last 30 days', '90' => 'Last 90 days'];
    }

    /**
     * @return array<string, mixed>
     */
    protected function getData(): array
    {
        $days = (int) $this->filter;
        $visitors = $this->countPerDay(PageView::query(), $days, distinct: 'visitor_id');
        $signups = $this->countPerDay(User::query()->where('is_admin', false), $days);
        $answers = $this->countPerDay(SessionAnswer::query(), $days);

        return [
            'datasets' => [
                $this->dataset('Visitors', $visitors, '#0f2a55'),
                $this->dataset('Sign-ups', $signups, '#94a3b8'),
                $this->dataset('Questions answered', $answers, '#4a90d9'),
            ],
            'labels' => array_map(fn (string $date): string => CarbonImmutable::parse($date)->format('j M'), array_keys($visitors)),
        ];
    }

    /**
     * @param  array<string, int>  $series
     * @return array<string, mixed>
     */
    private function dataset(string $label, array $series, string $color): array
    {
        return [
            'label' => $label,
            'data' => array_values($series),
            'borderColor' => $color,
            'backgroundColor' => $color.'0d',
            'fill' => true,
            'tension' => 0.35,
            'pointRadius' => 0,
            'pointHoverRadius' => 4,
            'borderWidth' => 2,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    /**
     * @return array<string, mixed>
     */
    protected function getOptions(): array
    {
        return [
            'interaction' => ['mode' => 'index', 'intersect' => false],
            'plugins' => ['legend' => ['position' => 'bottom', 'labels' => ['usePointStyle' => true, 'boxWidth' => 8]]],
            'scales' => [
                'y' => ['beginAtZero' => true, 'ticks' => ['precision' => 0], 'grid' => ['color' => 'rgba(148,163,184,0.15)']],
                'x' => ['grid' => ['display' => false], 'ticks' => ['maxTicksLimit' => 10]],
            ],
        ];
    }
}
