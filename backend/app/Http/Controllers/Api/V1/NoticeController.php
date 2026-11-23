<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use Illuminate\Http\JsonResponse;

class NoticeController extends Controller
{
    /**
     * All published notices, newest first, in the shape the website uses.
     */
    public function index(): JsonResponse
    {
        $notices = Notice::query()
            ->published()
            ->with('exam:id,slug')
            ->orderByDesc('published_on')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Notice $notice): array => $notice->toWebsite());

        return response()->json(['data' => $notices]);
    }
}
