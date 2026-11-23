<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SiteSettingsController extends Controller
{
    /**
     * Public website settings (announcement bar, daily goal).
     */
    public function show(): JsonResponse
    {
        $settings = Setting::values();

        return response()->json([
            'announcement' => $settings['announcement_enabled'] && filled($settings['announcement_text'])
                ? [
                    'text' => $settings['announcement_text'],
                    'link' => $settings['announcement_link'] ?: null,
                    'tone' => $settings['announcement_tone'],
                ]
                : null,
            'daily_goal' => (int) $settings['daily_goal'],
        ]);
    }
}
