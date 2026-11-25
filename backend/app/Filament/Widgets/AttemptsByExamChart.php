<?php

namespace App\Filament\Widgets;

use App\Models\PracticeSession;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class AttemptsByExamChart extends ChartWidget
{
    protected static ?int $sort = 4;

    protected ?string $heading = 'Practice sessions by exam';

    protected ?string $description = 'How many practices students started for each exam';

    protected ?string $maxHeight = '320px';

    public ?string $filter = '30';

    /**
     * @return array<string, string>
     */
    protected function getFilters(): ?array
    {
        return ['1' => 'Today', '7' => 'Last 7 days', '30' => 'Last 30 days', '365' => 'Last year'];
    }

    /**
     * @return array<string, mixed>
     */
    protected function getData(): array
    {
        $rows = PracticeSession::query()
            ->leftJoin('exams', 'exams.id', '=', 'practice_sessions.exam_id')
            ->where('practice_sessions.created_at', '>=', now()->subDays((int) $this->filter))
            ->select(DB::raw("coalesce(exams.name, 'Mixed / no exam') as exam"), DB::raw('count(*) as total'))
            ->groupBy('exam')
            ->orderByDesc('total')
            ->get();

        return [
            'datasets' => [[
                'data' => $rows->pluck('total')->map(fn ($v) => (int) $v)->all(),
                'backgroundColor' => ['#0f2a55', '#1b63a8', '#4a90d9', '#93bfe8', '#64748b', '#94a3b8', '#cbd5e1'],
                'borderWidth' => 0,
            ]],
            'labels' => $rows->pluck('exam')->all(),
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }

    /**
     * @return array<string, mixed>
     */
    protected function getOptions(): array
    {
        return [
            'cutout' => '68%',
            'plugins' => ['legend' => ['position' => 'bottom', 'labels' => ['usePointStyle' => true, 'boxWidth' => 8]]],
            'scales' => ['x' => ['display' => false], 'y' => ['display' => false]],
        ];
    }
}
