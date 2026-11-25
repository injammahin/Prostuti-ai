<div class="mx-auto max-w-6xl px-4 py-6 md:py-10">
    @include('seo.partials.crumbs')
    <h1 class="text-[1.35rem] leading-tight font-bold md:text-[1.7rem]">Exam calendar</h1>
    <p class="mt-1 text-sm text-muted-foreground">Deadlines and exam dates from verified official notices</p>
    <ul class="mt-5 space-y-3">@foreach ($notices as $notice)@include('seo.partials.notice-card')@endforeach</ul>
</div>
