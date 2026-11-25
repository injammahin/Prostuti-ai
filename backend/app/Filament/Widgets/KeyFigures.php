<?php

namespace App\Filament\Widgets;

use App\Filament\Widgets\Concerns\CountsPerDay;
use App\Models\PageView;
use App\Models\PracticeSession;
use App\Models\Question;
use App\Models\SessionAnswer;
use Filament\Widgets\Widget;

class KeyFigures extends Widget
{
    use CountsPerDay;

    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    protected string $view = 'filament.widgets.key-figures';

    /**
     * @return array<string, mixed>
     */
    protected function getViewData(): array
    {
        $today = $this->startOfToday();
        $lastMonth = now()->subDays(30);

        $answers = SessionAnswer::query()->where('created_at', '>=', $lastMonth);
        $answered = (clone $answers)->count();
        $correct = (clone $answers)->where('is_correct', true)->count();

        return [
            'figures' => [
                'Page views today' => number_format(PageView::query()->where('created_at', '>=', $today)->count()),
                'Active students today' => number_format(SessionAnswer::query()->whereNotNull('user_id')->where('created_at', '>=', $today)->distinct()->count('user_id')),
                'Sessions, 30 days' => number_format(PracticeSession::query()->where('created_at', '>=', $lastMonth)->count()),
                'Answers, 30 days' => number_format($answered),
                'Correct, 30 days' => ($answered ? round($correct / $answered * 100) : 0).'%',
                'Live questions' => number_format(Question::query()->live()->count()),
            ],
        ];
    }
}
