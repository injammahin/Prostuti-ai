<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

/**
 * Lets an admin who signed in on the website jump straight into the admin panel without a second login.
 */
class AdminSsoController extends Controller
{
    /**
     * Give a signed-in admin a one-minute, single-use link into the admin panel.
     */
    public function link(Request $request): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $nonce = Str::random(40);
        Cache::put("admin-sso:{$nonce}", $request->user()->id, now()->addMinute());

        return response()->json([
            'url' => URL::temporarySignedRoute('admin.sso', now()->addMinute(), ['user' => $request->user()->id, 'nonce' => $nonce]),
        ]);
    }

    /**
     * Open the admin panel session from a valid signed link (each link works once).
     */
    public function enter(Request $request, User $user): RedirectResponse
    {
        abort_unless($user->is_admin, 403);
        abort_unless(Cache::pull('admin-sso:'.$request->query('nonce')) === $user->id, 403, 'This link has already been used. Please sign in again.');

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return redirect('/admin');
    }
}
