<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShowPageRequest;
use App\Services\PageShell;
use App\Services\PublicPages;
use App\Services\ShareImage;
use Illuminate\Http\JsonResponse;

/**
 * A page made from the question bank, for visitors who move to it inside the website. The same content as its own address.
 */
class PageController extends Controller
{
    public function show(ShowPageRequest $request): JsonResponse
    {
        $path = $request->string('path')->toString();

        $page = PageShell::remember('fragment:'.md5($path), function () use ($path): ?array {
            $page = PublicPages::resolve($path);

            return $page ? [
                'path' => $page->path,
                'title' => $page->title,
                'description' => $page->description,
                'image' => $page->image ?: ShareImage::forPath($page->path),
                'type' => $page->type,
                'json_ld' => ['@context' => 'https://schema.org', '@graph' => $page->graph()],
                'html' => $page->content(),
            ] : null;
        });

        abort_if($page === null, 404);

        return response()->json($page);
    }
}
