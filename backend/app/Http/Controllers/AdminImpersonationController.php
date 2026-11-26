<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * "Log in as" from the admin panel: opens the website signed in as a student, to see exactly what they see.
 */
class AdminImpersonationController extends Controller
{
    public const TOKEN_NAME = 'admin-impersonation';

    public function __invoke(Request $request, User $user): RedirectResponse
    {
        $admin = Auth::guard('web')->user();
        abort_unless($admin instanceof User && $admin->is_admin, 403);
        abort_if($user->is_admin, 403, 'This is the admin account.');

        // Short-lived token, kept only in the opened browser tab by the website.
        $token = $user->createToken(self::TOKEN_NAME, ['*'], now()->addHours(2))->plainTextToken;

        ActivityLog::record('admin.impersonated', "Admin logged in as {$user->name}", $user, ['admin' => $admin->email], $request);

        // The token travels in the #fragment, which browsers never send to any server.
        return redirect()->away(rtrim((string) config('app.frontend_url'), '/').'/impersonate#token='.urlencode($token));
    }
}
