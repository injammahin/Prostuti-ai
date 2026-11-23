<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Notices\NoticeResource;
use App\Filament\Resources\Questions\QuestionResource;
use App\Models\Notice;
use App\Models\Question;
use App\Models\SessionAnswer;
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
            'facts' => [
                ['value' => number_format(User::query()->where('is_admin', false)->where('created_at', '>=', $todayStart)->count()), 'label' => 'new students today'],
                ['value' => number_format(SessionAnswer::query()->where('created_at', '>=', $todayStart)->count()), 'label' => 'questions answered today'],
                ['value' => number_format(Question::query()->live()->count()), 'label' => 'live questions'],
                ['value' => number_format(Notice::query()->published()->where('apply_until', '>=', $now->toDateString())->count()), 'label' => 'open job circulars'],
            ],
            'actions' => [
                ['label' => 'Add a question', 'icon' => 'heroicon-o-plus-circle', 'url' => QuestionResource::getUrl('create'), 'primary' => true],
                ['label' => $waiting ? "Review {$waiting} drafts" : 'Question bank', 'icon' => 'heroicon-o-clipboard-document-check', 'url' => QuestionResource::getUrl('index').($waiting ? '?filters[status][value]=draft' : '')],
                ['label' => 'Post a notice', 'icon' => 'heroicon-o-megaphone', 'url' => NoticeResource::getUrl('create')],
                ['label' => 'Announcement', 'icon' => 'heroicon-o-bell-alert', 'url' => route('filament.admin.pages.site-settings')],
                ['label' => 'Open website', 'icon' => 'heroicon-o-arrow-top-right-on-square', 'url' => config('app.frontend_url'), 'external' => true],
            ],
        ];
    }
}
