<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Smaller, reusable API answers: Bangla text is sent as it is (half the size of \\u escapes), and public lists may be
 * reused by the browser for a minute, then shown while a fresh copy loads.
 */
class FastApiResponses
{
    /** Routes whose answer is the same for every visitor. */
    private const PUBLIC_ROUTES = [
        'api.v1.settings', 'api.v1.notices', 'api.v1.posts', 'api.v1.past-papers', 'api.v1.past-papers.show',
        'api.v1.model-tests.index', 'api.v1.model-tests.show',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($response instanceof JsonResponse) {
            $response->setEncodingOptions($response->getEncodingOptions() | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if ($request->isMethod('GET') && $response->isSuccessful() && in_array($request->route()?->getName(), self::PUBLIC_ROUTES, true)) {
            $response->headers->set('Cache-Control', 'private, max-age=60, stale-while-revalidate=600');
        }

        return $response;
    }
}
