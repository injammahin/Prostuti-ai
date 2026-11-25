<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Notices\NoticeResource;
use App\Filament\Resources\Questions\QuestionResource;
use App\Filament\Resources\Users\UserResource;
use App\Models\Notice;
use App\Models\Question;
use App\Models\User;
use Filament\Widgets\Widget;

class WelcomeBanner extends Widget
{
    protected static ?int $sort = 0;

    protected int|string|array $columnSpan = 'full';

    protected string $view = 'filament.widgets.welcome-banner';

    /**
     * @return array<string, mixed>
     */
    protected function getViewData(): array
    {
        $timezone = config('app.student_timezone');
        $now = now($timezone);
        $hour = (int) $now->format('G');
        $todayStart = $now->copy()->startOfDay()->utc();

        $waiting = Question::query()->where('status', '!=', Question::STATUS_LIVE)->count();

        return [
            'greeting' => $hour < 12 ? 'Good morning' : ($hour < 17 ? 'Good afternoon' : 'Good evening'),
            'name' => str(auth()->user()->name)->before(' '),
            'date' => $now->format('l, j F Y'),
            'actions' => [
                ['label' => 'Post a notice', 'icon' => 'heroicon-o-megaphone', 'url' => NoticeResource::getUrl('create')],
                ['label' => 'Add a question', 'icon' => 'heroicon-o-plus', 'url' => QuestionResource::getUrl('create'), 'primary' => true],
            ],
            'shortcuts' => [
                ['label' => 'Questions to review', 'icon' => 'heroicon-o-clipboard-document-check', 'url' => QuestionResource::getUrl('index').($waiting ? '?filters[status][value]=draft' : ''), 'value' => $waiting],
                ['label' => 'New students today', 'icon' => 'heroicon-o-user-plus', 'url' => UserResource::getUrl('index'), 'value' => User::query()->where('is_admin', false)->where('created_at', '>=', $todayStart)->count()],
                ['label' => 'Open job circulars', 'icon' => 'heroicon-o-document-text', 'url' => NoticeResource::getUrl('index'), 'value' => Notice::query()->published()->where('apply_until', '>=', $now->toDateString())->count()],
                ['label' => 'Upcoming exam dates', 'icon' => 'heroicon-o-calendar-days', 'url' => NoticeResource::getUrl('index'), 'value' => Notice::query()->published()->where('exam_date', '>=', $now->toDateString())->count()],
            ],
        ];
    }
}
