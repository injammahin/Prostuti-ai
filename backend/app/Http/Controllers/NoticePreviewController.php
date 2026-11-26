<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use App\Models\User;
use App\Services\NoticePages;
use App\Services\PageShell;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

/**
 * A notice exactly as it will look on the website, drafts included. Only for the admin, never indexed or cached.
 */
class NoticePreviewController extends Controller
{
    public function __invoke(Notice $notice): Response
    {
        $admin = Auth::guard('web')->user();
        abort_unless($admin instanceof User && $admin->is_admin, 403);
        abort_if(PageShell::path() === null, 404, 'The website build (index.html) was not found.');

        return response(PageShell::render(NoticePages::page($notice, preview: true)))
            ->header('Content-Type', 'text/html; charset=utf-8')
            ->header('Cache-Control', 'no-store')
            ->header('X-Robots-Tag', 'noindex, nofollow');
    }
}
