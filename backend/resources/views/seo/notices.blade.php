@php $tab = 'inline-block rounded-full border px-3.5 py-1.5 text-sm font-semibold'; @endphp
<div class="mx-auto max-w-3xl px-4 py-6 md:py-10">
    @include('seo.partials.crumbs')
    @if ($category)
        <h1 class="text-[1.35rem] leading-tight font-bold md:text-[1.7rem]">{{ $heading }} <span class="bn text-lg font-semibold text-muted-foreground" lang="bn">{{ $headingBn }}</span></h1>
    @else
        <h1 class="text-[1.35rem] leading-tight font-bold md:text-[1.7rem]">Govt job notice board <span class="bn text-lg font-semibold text-muted-foreground" lang="bn">সরকারি চাকরির নোটিশ বোর্ড</span></h1>
    @endif
    <p class="mt-1 text-sm text-muted-foreground">Circulars, deadlines, admit cards and results, newest first, each with its official source. <a href="/calendar" class="font-semibold text-primary">Exam calendar</a></p>
    <nav class="mt-4 flex flex-wrap gap-2" aria-label="Notice sections">
        <a href="/notices" @class([$tab, 'border-primary text-primary' => ! $category])>All / সব ({{ $total }})</a>
        @foreach (\App\Models\Notice::CATEGORIES as $key => [$name, $nameBn])
            <a href="/notices?category={{ $key }}" @class([$tab, 'border-primary text-primary' => $category === $key])>{{ $name }} / {{ $nameBn }} ({{ $counts[$key] ?? 0 }})</a>
        @endforeach
    </nav>
    <ul class="mt-5 space-y-3">@foreach ($notices as $notice)@include('seo.partials.notice-card')@endforeach</ul>
    @if ($notices->isEmpty())
        <p class="mt-4 text-sm text-muted-foreground">No notices in this section yet. <span class="bn" lang="bn">এই বিভাগে এখনো কোনো নোটিশ নেই।</span></p>
    @endif
    @if ($pages > 1)
        <nav class="mt-6 flex flex-wrap items-center gap-2" aria-label="Pages">
            @if ($page > 1)<a href="{{ $address($page - 1) }}" rel="prev" class="{{ $tab }}">← Newer</a>@endif
            @for ($number = 1; $number <= $pages; $number++)
                @if ($number === $page)<span class="{{ $tab }} border-primary text-primary" aria-current="page">{{ $number }}</span>@elseif ($number <= 2 || $number > $pages - 2 || abs($number - $page) <= 2)<a href="{{ $address($number) }}" class="{{ $tab }}">{{ $number }}</a>@endif
            @endfor
            @if ($page < $pages)<a href="{{ $address($page + 1) }}" rel="next" class="{{ $tab }}">Older →</a>@endif
        </nav>
    @endif
</div>
