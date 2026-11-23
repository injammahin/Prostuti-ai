<?php

namespace App\Http\Responses;

use Filament\Auth\Http\Responses\Contracts\LogoutResponse;
use Illuminate\Http\RedirectResponse;

/**
 * After logging out of the admin panel, return to the website login and sign out there too.
 */
class AdminLogoutResponse implements LogoutResponse
{
    public function toResponse($request): RedirectResponse
    {
        return redirect()->away(rtrim((string) config('app.frontend_url'), '/').'/login?logout=1');
    }
}
