<?php

namespace App\Filament\Widgets;

use App\Models\SessionAnswer;
use Filament\Widgets\ChartWidget;

class AttemptsBySubjectChart extends ChartWidget
{
    protected static ?int $sort = 5;

    protected ?string $heading = 'Answers by subject';

    protected ?string $description = 'Blue = answered correctly, grey = wrong';

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
        $rows = SessionAnswer::query()
            ->join('questions', 'questions.id', '=', 'session_answers.question_id')
            ->join('subjects', 'subjects.id', '=', 'questions.subject_id')
            ->where('session_answers.created_at', '>=', now()->subDays((int) $this->filter))
            ->selectRaw('subjects.name as subject, sum(case when session_answers.is_correct then 1 else 0 end) as correct, sum(case when session_answers.is_correct then 0 else 1 end) as wrong')
            ->groupBy('subjects.name')
            ->orderByRaw('count(*) desc')
            ->get();

        return [
            'datasets' => [
                ['label' => 'Correct', 'data' => $rows->pluck('correct')->map(fn ($v) => (int) $v)->all(), 'backgroundColor' => '#1b63a8', 'borderRadius' => 6],
                ['label' => 'Wrong', 'data' => $rows->pluck('wrong')->map(fn ($v) => (int) $v)->all(), 'backgroundColor' => '#d5dde8', 'borderRadius' => 6],
            ],
            'labels' => $rows->pluck('subject')->all(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    /**
     * @return array<string, mixed>
     */
    protected function getOptions(): array
    {
        return [
            'indexAxis' => 'y',
            'plugins' => ['legend' => ['position' => 'bottom', 'labels' => ['usePointStyle' => true, 'boxWidth' => 8]]],
            'scales' => [
                'x' => ['stacked' => true, 'beginAtZero' => true, 'ticks' => ['precision' => 0], 'grid' => ['color' => 'rgba(148,163,184,0.15)']],
                'y' => ['stacked' => true, 'grid' => ['display' => false]],
            ],
        ];
    }
}
