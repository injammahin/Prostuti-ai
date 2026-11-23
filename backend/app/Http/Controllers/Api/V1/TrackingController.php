<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\PageView;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TrackingController extends Controller
{
    /**
     * Record a page opened on the website.
     */
    public function pageView(Request $request): Response
    {
        $validated = $request->validate([
            'visitor_id' => ['required', 'string', 'max:36'],
            'path' => ['required', 'string', 'max:255'],
            'referrer' => ['nullable', 'string', 'max:255'],
        ]);

        $userAgent = $request->userAgent();

        PageView::query()->create([
            'visitor_id' => $validated['visitor_id'],
            'user_id' => $request->user('sanctum')?->id,
            'path' => $validated['path'],
            'referrer' => $this->externalReferrer($validated['referrer'] ?? null, $request),
            'device' => PageView::deviceFrom($userAgent),
            'browser' => PageView::browserFrom($userAgent),
        ]);

        return response()->noContent();
    }

    /**
     * Record a finished daily quiz (guests included).
     */
    public function dailyQuizCompleted(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'score' => ['required', 'integer', 'min:0', 'max:50'],
            'total' => ['required', 'integer', 'min:1', 'max:50'],
            'seconds' => ['nullable', 'integer', 'min:0'],
        ]);

        $user = $request->user('sanctum');
        $who = $user?->name ?? 'A guest';

        ActivityLog::record(
            'daily_quiz.completed',
            "{$who} scored {$validated['score']}/{$validated['total']} on the daily quiz",
            $user,
            $validated,
            $request,
        );

        return response()->json(['ok' => true]);
    }

    /**
     * Keep only referrers from other websites (where visitors came from).
     */
    private function externalReferrer(?string $referrer, Request $request): ?string
    {
        if (! $referrer) {
            return null;
        }

        $host = parse_url($referrer, PHP_URL_HOST);
        $ownHosts = array_filter([
            parse_url((string) config('app.frontend_url'), PHP_URL_HOST),
            $request->getHost(),
        ]);

        return $host && ! in_array($host, $ownHosts, true) ? $host : null;
    }
}
