<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;

/**
 * The public blog: published articles, newest first.
 */
class PostController extends Controller
{
    public function index(): JsonResponse
    {
        $posts = Post::query()
            ->published()
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Post $post): array => $post->toWebsite());

        return response()->json([
            'data' => $posts,
            'categories' => Post::CATEGORIES,
        ]);
    }

    /**
     * One article with its full text, plus up to three related ones from the same category.
     */
    public function show(string $slug): JsonResponse
    {
        $post = Post::query()->published()->where('slug', $slug)->firstOrFail();
        $post->increment('views');

        $related = Post::query()
            ->published()
            ->whereKeyNot($post->id)
            ->orderByRaw('category = ? desc', [$post->category])
            ->orderByDesc('published_at')
            ->limit(3)
            ->get()
            ->map(fn (Post $other): array => $other->toWebsite());

        return response()->json([
            'data' => $post->toWebsite(withBody: true),
            'related' => $related,
        ]);
    }
}
