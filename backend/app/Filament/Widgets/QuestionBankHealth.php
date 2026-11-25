<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Questions\QuestionResource;
use App\Models\Question;
use App\Models\Subject;
use Filament\Widgets\Widget;

class QuestionBankHealth extends Widget
{
    protected static ?int $sort = 6;

    protected string $view = 'filament.widgets.question-bank-health';

    /**
     * @return array<string, mixed>
     */
    protected function getViewData(): array
    {
        $counts = Question::query()
            ->selectRaw("subject_id, sum(case when status = 'live' then 1 else 0 end) as live, sum(case when status != 'live' then 1 else 0 end) as waiting")
            ->groupBy('subject_id')
            ->get()
            ->keyBy('subject_id');

        $subjects = Subject::query()->orderBy('sort')->get()->map(fn (Subject $subject): array => [
            'name' => $subject->name,
            'live' => (int) ($counts[$subject->id]->live ?? 0),
            'waiting' => (int) ($counts[$subject->id]->waiting ?? 0),
            'url' => QuestionResource::getUrl('index').'?filters[subject][value]='.$subject->id,
        ])->sortByDesc('live')->values();

        return [
            'subjects' => $subjects,
            'max' => max(1, (int) $subjects->max('live')),
            'totalLive' => $subjects->sum('live'),
            'totalWaiting' => $subjects->sum('waiting'),
            'target' => 200,
        ];
    }
}
