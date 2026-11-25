<div class="mx-auto max-w-3xl px-4 py-6 md:py-10">
    @include('seo.partials.crumbs')
    <h1 class="text-[1.35rem] leading-tight font-bold md:text-[1.7rem]">{{ $section['title'][0] }}</h1>
    <p class="mt-1 text-sm text-muted-foreground">Last updated: {{ \Illuminate\Support\Carbon::parse($updated)->format('j F Y') }}</p>
    <div class="card mt-5 space-y-7 p-5 md:p-8">
        @foreach ($section['sections'] as [$heading, $headingBn, $items])
            <section>
                <h2 class="text-lg font-bold">{{ $heading }}</h2>
                <ul class="mt-2 space-y-2 text-[0.95rem] leading-relaxed">@foreach ($items as $item)<li>{{ $item[0] }}</li>@endforeach</ul>
            </section>
        @endforeach
    </div>
</div>
