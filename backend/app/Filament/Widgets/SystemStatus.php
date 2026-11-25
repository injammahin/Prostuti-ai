<?php

namespace App\Filament\Widgets;

use App\Filament\Pages\SiteSettings;
use App\Filament\Resources\Notices\NoticeResource;
use App\Models\Notice;
use App\Models\Setting;
use Filament\Widgets\Widget;

class SystemStatus extends Widget
{
    protected static ?int $sort = 7;

    protected string $view = 'filament.widgets.system-status';

    /**
     * @return array<string, mixed>
     */
    protected function getViewData(): array
    {
        $sender = (string) config('mail.from.address');
        $announcementOn = (bool) Setting::get('announcement_enabled');
        $upcomingExams = Notice::query()->published()->where('exam_date', '>=', now()->toDateString())->count();

        $ai = match (true) {
            filled(config('services.anthropic.key')) => ['ok', 'Claude is answering "Ask AI why"'],
            filled(config('services.gemini.key')) => ['ok', 'Gemini is answering "Ask AI why"'],
            default => ['warn', 'Using built-in answers — add an AI key in .env'],
        };

        return [
            'checks' => [
                [
                    'label' => 'Email (sign-up codes)',
                    'state' => $sender && ! str_ends_with($sender, 'example.com') ? 'ok' : 'error',
                    'detail' => $sender && ! str_ends_with($sender, 'example.com') ? "Sending from {$sender}" : 'Set MAIL_FROM_ADDRESS to a verified Brevo sender',
                ],
                [
                    'label' => 'Google sign-in',
                    'state' => filled(config('services.google.client_id')) ? 'ok' : 'warn',
                    'detail' => filled(config('services.google.client_id')) ? 'Connected' : 'Add GOOGLE_CLIENT_ID to turn it on',
                ],
                ['label' => 'AI tutor', 'state' => $ai[0], 'detail' => $ai[1]],
                [
                    'label' => 'Announcement bar',
                    'state' => $announcementOn ? 'ok' : 'off',
                    'detail' => $announcementOn ? (string) str((string) Setting::get('announcement_text'))->limit(48) : 'Off',
                    'url' => SiteSettings::getUrl(),
                ],
                [
                    'label' => 'Upcoming exam dates',
                    'state' => $upcomingExams ? 'ok' : 'warn',
                    'detail' => $upcomingExams ? "{$upcomingExams} on the calendar" : 'No upcoming exams — post one',
                    'url' => NoticeResource::getUrl('index'),
                ],
            ],
        ];
    }
}
