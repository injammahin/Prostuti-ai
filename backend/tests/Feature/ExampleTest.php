<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * The backend's own address opens the admin panel when the website isn't built next to it (e.g. in development).
     */
    public function test_home_redirects_to_the_admin_panel(): void
    {
        $empty = storage_path('framework/testing/no-website');
        config(['seo.shell' => null]);
        $this->app->usePublicPath($empty);
        $this->app->setBasePath("{$empty}/backend");

        $this->get('/')->assertRedirect('/admin');
    }
}
