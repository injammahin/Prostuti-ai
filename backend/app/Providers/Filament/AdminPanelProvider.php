<?php

namespace App\Providers\Filament;

use App\Filament\Pages\Auth\Login;
use App\Filament\Pages\Dashboard;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\NavigationGroup;
use Filament\Navigation\NavigationItem;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Enums\Width;
use Filament\Support\Icons\Heroicon;
use Filament\View\PanelsRenderHook;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\HtmlString;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login(Login::class)
            ->brandName('bd3schools Admin')
            ->brandLogo(fn (): HtmlString => new HtmlString(
                '<span style="display:flex;align-items:center;gap:.65rem;font-weight:800;font-size:1.08rem;letter-spacing:-.02em;">'
                .'<img src="'.asset('favicon.svg').'" alt="bd3schools" style="width:2.1rem;height:2.1rem;">'
                .'<span style="display:flex;flex-direction:column;line-height:1.05;"><span>bd3<span style="color:#1d6ca8;">schools</span></span>'
                .'<span style="font-size:.62rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;opacity:.55;margin-top:.2rem;">Admin console</span></span></span>'
            ))
            ->brandLogoHeight('2.25rem')
            ->favicon(asset('favicon.svg'))
            ->colors([
                'primary' => Color::hex('#1b63a8'),
                'gray' => Color::Slate,
                'info' => Color::Blue,
                'success' => Color::Emerald,
                'warning' => Color::Amber,
                'danger' => Color::Rose,
            ])
            ->font('Plus Jakarta Sans')
            ->sidebarCollapsibleOnDesktop()
            ->maxContentWidth(Width::Full)
            ->spa()
            ->unsavedChangesAlerts()
            ->globalSearchKeyBindings(['command+k', 'ctrl+k'])
            ->navigationGroups([
                NavigationGroup::make('Question bank')->icon(Heroicon::OutlinedRectangleStack),
                NavigationGroup::make('Students & activity')->icon(Heroicon::OutlinedPresentationChartLine),
                NavigationGroup::make('Website')->icon(Heroicon::OutlinedComputerDesktop),
            ])
            ->navigationItems([
                NavigationItem::make('Open website')
                    ->url(fn (): string => config('app.frontend_url'), shouldOpenInNewTab: true)
                    ->icon(Heroicon::OutlinedArrowTopRightOnSquare)
                    ->group('Website')
                    ->sort(9),
            ])
            ->renderHook(
                PanelsRenderHook::HEAD_END,
                fn (): HtmlString => new HtmlString(
                    '<link rel="stylesheet" href="'.asset('css/bd3schools-admin.css').'?v='.@filemtime(public_path('css/bd3schools-admin.css')).'">'
                ),
            )
            ->renderHook(
                PanelsRenderHook::BODY_END,
                fn (): HtmlString => new HtmlString(
                    '<script src="'.asset('js/share-images.js').'?v='.@filemtime(public_path('js/share-images.js')).'" defer data-navigate-once></script>'
                ),
            )
            ->renderHook(
                PanelsRenderHook::TOPBAR_LOGO_AFTER,
                fn (): HtmlString => new HtmlString(
                    '<button type="button" class="pa-sidebar-toggle" x-data="{}" aria-controls="fi-main-sidebar"'
                    .' aria-label="Show or hide the menu" title="Show or hide the menu" x-bind:aria-expanded="$store.sidebar.isOpen"'
                    .' x-on:click="$store.sidebar.isOpen ? $store.sidebar.close() : $store.sidebar.open()">'
                    .'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13"/></svg></button>'
                ),
            )
            ->renderHook(
                PanelsRenderHook::GLOBAL_SEARCH_AFTER,
                fn (): HtmlString => new HtmlString(
                    '<span class="pa-live">Live</span>'
                ),
            )
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
