<?php

namespace App\Filament\Pages\Auth;

use Filament\Auth\Pages\Login as BaseLogin;

/**
 * There is one login for everyone: the website's. Admins who sign in there are sent into the panel automatically.
 */
class Login extends BaseLogin
{
    public function mount(): void
    {
        $this->redirect(rtrim((string) config('app.frontend_url'), '/').'/login?next=admin');
    }
}
