<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * The backend home page sends visitors to the admin panel.
     */
    public function test_home_redirects_to_the_admin_panel(): void
    {
        $this->get('/')->assertRedirect('/admin');
    }
}
