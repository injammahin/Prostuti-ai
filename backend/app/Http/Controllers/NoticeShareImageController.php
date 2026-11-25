<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShareImageRequest;
use App\Models\Notice;
use App\Services\PageShell;
use App\Services\ShareImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

/**
 * Pictures for sharing notices: the admin panel asks which are missing, draws them and sends them back.
 */
class NoticeShareImageController extends Controller
{
    private const AT_ONCE = 5;

    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $missing = Notice::query()->published()->latest('id')->limit(200)->get()
            ->filter(fn (Notice $notice): bool => ShareImage::forNotice($notice) === null)
            ->take(self::AT_ONCE)
            ->map(fn (Notice $notice): array => ['id' => $notice->id, 'title' => $notice->title, 'title_bn' => $notice->title_bn, 'org' => $notice->org])
            ->values();

        return response()->json(['data' => $missing]);
    }

    public function store(StoreShareImageRequest $request, Notice $notice): Response
    {
        Storage::disk('public')->put(ShareImage::noticeFile($notice), $request->file('image')->getContent(), 'public');
        PageShell::refresh();

        return response()->noContent();
    }
}
