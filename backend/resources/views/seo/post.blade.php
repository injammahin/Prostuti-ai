<div class="mx-auto max-w-6xl px-4 py-6 md:py-10">
    <article class="mx-auto max-w-3xl" lang="{{ $post['lang'] }}">
        @include('seo.partials.crumbs')
        <h1 class="bn mt-3 text-[1.75rem] leading-snug font-bold text-balance md:text-[2.4rem]">{{ $post['title'] }}</h1>
        <p class="bn mt-3 text-base text-muted-foreground md:text-lg">{{ $post['excerpt'] }}</p>
        <p class="mt-3 text-xs text-muted-foreground">{{ $post['author'] }} · <time datetime="{{ $post['published_at'] }}">{{ \Illuminate\Support\Carbon::parse($post['published_at'])->format('j F Y') }}</time></p>
        @if ($post['cover_image'])
            <img src="{{ $post['cover_image'] }}" alt="{{ $post['title'] }}" width="1200" height="670" fetchpriority="high" class="mt-6 aspect-[1200/670] w-full rounded-2xl object-cover">
        @endif
        @include('seo.partials.share', ['path' => "/blog/{$post['slug']}", 'title' => $post['title']])
        <div class="article bn mt-8">{!! $post['body'] !!}</div>
        @if ($post['attachments'])
            <h2 class="mt-8 text-lg font-bold">Downloads</h2>
            <ul class="mt-2 space-y-2">@foreach ($post['attachments'] as $file)<li><a href="{{ $file['url'] }}" class="font-semibold text-primary">{{ $file['title'] }}</a> ({{ $file['type'] }})</li>@endforeach</ul>
        @endif
    </article>
    @if ($related)
        <section class="mt-14">
            <h2 class="text-lg font-bold">Read next</h2>
            <ul class="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($related as $other)
                    <li class="card p-5"><a href="{{ $other['url'] }}" class="bn font-bold" lang="{{ $other['lang'] }}">{{ $other['title'] }}</a></li>
                @endforeach
            </ul>
        </section>
    @endif
</div>
