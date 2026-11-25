@php
    $date = fn (?string $iso): ?string => $iso ? \Illuminate\Support\Carbon::parse($iso)->format('j M Y') : null;
    $dates = array_filter(['Published' => $date($notice['published']), 'Apply from' => $date($notice['applyFrom']), 'Apply until' => $date($notice['applyUntil']), 'Exam date' => $date($notice['examDate'])]);
@endphp
<div class="mx-auto max-w-4xl px-4 py-6 md:py-10">
    @include('seo.partials.crumbs', ['items' => ['Home' => '/', 'Notices' => '/notices', $notice['title'] => '']])
    <article>
        <h1 class="text-lg leading-tight font-bold md:text-2xl">{{ $notice['title'] }}</h1>
        @if ($notice['title_bn'])
            <p class="bn mt-1 text-lg font-semibold" lang="bn">{{ $notice['title_bn'] }}</p>
        @endif
        <p class="mt-2 text-sm">{{ $typeLabel }} · {{ $notice['org'] }}</p>
        <h2 class="mt-5 text-sm font-semibold text-muted-foreground">Summary</h2>
        <p class="mt-1 leading-relaxed">{{ $notice['summary'] }}</p>
        @if ($notice['summary_bn'])
            <p class="bn mt-3 leading-relaxed" lang="bn">{{ $notice['summary_bn'] }}</p>
        @endif
        <h2 class="mt-5 text-sm font-semibold text-muted-foreground">Key dates</h2>
        <ul class="mt-1 divide-y">@foreach ($dates as $label => $value)<li class="flex justify-between py-2"><span>{{ $label }}</span> <b>{{ $value }}</b></li>@endforeach</ul>
        @if ($notice['url'])
            <p class="mt-4"><a href="{{ $notice['url'] }}" rel="noreferrer" class="font-semibold text-primary">Official source</a></p>
        @endif
        <p class="mt-4 text-xs text-muted-foreground">Apply only through the official portal. bd3schools is not affiliated with BPSC or any ministry.</p>
    </article>
    @if ($related->isNotEmpty())
        <h2 class="mt-8 mb-3 font-semibold">Related notices</h2>
        <ul class="space-y-3">@foreach ($related as $notice)@include('seo.partials.notice-card')@endforeach</ul>
    @endif
</div>
