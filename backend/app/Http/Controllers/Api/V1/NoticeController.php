<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use App\Services\NoticePages;
use Illuminate\Http\JsonResponse;

class NoticeController extends Controller
{
    /**
     * The newest published notices, in the shape the website uses.
     */
    public function index(): JsonResponse
    {
        return response()->json(['data' => NoticePages::all()->take(NoticePages::PRELOADED)]);
    }

    /**
     * One notice, also when it is older than the list.
     */
    public function show(string $slug): JsonResponse
    {
        $notice = Notice::query()->published()->with('exam:id,slug')->where('slug', $slug)->firstOrFail();

        return response()->json(['data' => $notice->toWebsite()]);
    }
}
