<?php

namespace App\Http\Responses;

use Filament\Auth\Http\Responses\Contracts\LogoutResponse;
use Filament\Facades\Filament;
use Illuminate\Http\RedirectResponse;

/**
 * After logging out of the admin panel, go back to the admin login.
 */
class AdminLogoutResponse implements LogoutResponse
{
    public function toResponse($request): RedirectResponse
    {
        return redirect()->to(Filament::getLoginUrl());
    }
}
