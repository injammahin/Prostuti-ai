<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Models\Question;
use App\Models\Report;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    /**
     * Save a mistake reported by a student or a guest. Admins see it under "Reports".
     */
    public function store(StoreReportRequest $request): JsonResponse
    {
        $isMessage = $request->validated('target') === 'page';
        $target = $isMessage ? null : Report::findTarget($request->validated('target'), $request->validated('target_ref'));

        abort_if($target === null && ! $isMessage, 404);

        Report::query()->create([
            ...$request->validated(),
            'user_id' => $request->user('sanctum')?->id,
            'target_title' => match (true) {
                $target === null => 'Message from the contact page',
                $target instanceof Question => str($target->body)->limit(200)->toString(),
                default => str($target->title)->limit(200)->toString(),
            },
        ]);

        return response()->json(['message' => 'Report saved.'], 201);
    }
}
