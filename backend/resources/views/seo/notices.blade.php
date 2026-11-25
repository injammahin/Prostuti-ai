<div class="mx-auto max-w-3xl px-4 py-6 md:py-10">
    @include('seo.partials.crumbs', ['items' => ['Home' => '/', 'Notices' => '/notices']])
    <h1 class="text-[1.35rem] leading-tight font-bold md:text-[1.7rem]">Govt job notice board</h1>
    <p class="mt-1 text-sm text-muted-foreground">Circulars, deadlines, admit cards and results for BCS, NTRCA, Primary and bank jobs.</p>
    <ul class="mt-5 space-y-3">@foreach ($notices as $notice)@include('seo.partials.notice-card')@endforeach</ul>
</div>
