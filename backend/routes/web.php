<?php

use App\Http\Controllers\AdminSsoController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/admin');
});

Route::get('/admin-sso/{user}', [AdminSsoController::class, 'enter'])
    ->middleware(['signed', 'throttle:10,1'])
    ->name('admin.sso');
