@php
    $date = fn (?string $iso): ?string => $iso ? \Illuminate\Support\Carbon::parse($iso)->format('j F Y') : null;
    $dateBn = fn (?string $iso): ?string => $iso ? \App\Services\Bangla::date(\Illuminate\Support\Carbon::parse($iso)) : null;
    $both = fn (?string $iso): ?string => $iso ? $date($iso).' ('.$dateBn($iso).')' : null;
    $state = \App\Models\Notice::STATUSES[$notice['status'] ?? ''] ?? null;
    $rows = array_filter([
        'Organization / প্রতিষ্ঠান' => $notice['org'],
        'Post / পদের নাম' => $notice['post'],
        'Vacancies / পদসংখ্যা' => $notice['vacancies'],
        'Eligibility / যোগ্যতা' => $notice['eligibility'],
        'Age limit / বয়সসীমা' => $notice['ageLimit'],
        'Application fee / আবেদন ফি' => $notice['fee'],
        'Application starts / আবেদন শুরু' => $both($notice['applyFrom']),
        'Application ends / আবেদনের শেষ তারিখ' => $both($notice['applyUntil']),
        'Exam date / পরীক্ষার তারিখ' => $both($notice['examDate']),
        'Status / অবস্থা' => $state ? "{$state[0]} ({$state[1]})" : null,
    ], filled(...));
@endphp
<div class="mx-auto max-w-4xl px-4 py-6 md:py-10">
    @include('seo.partials.crumbs')
    <article>
        <h1 class="text-xl leading-tight font-bold md:text-[1.7rem]">{{ $notice['title'] }}</h1>
        @if ($notice['title_bn'])
            <p class="bn mt-1 text-lg font-semibold" lang="bn">{{ $notice['title_bn'] }}</p>
        @endif
        <p class="mt-2 text-sm text-muted-foreground">{{ $typeLabel }} · Published / প্রকাশ: <time datetime="{{ $notice['published'] }}">{{ $date($notice['published']) }}</time>@if ($notice['updated']) · Updated / হালনাগাদ: <time datetime="{{ $notice['updated'] }}">{{ $date($notice['updated']) }}</time>@endif @if ($notice['verifiedAt']) · <span class="text-success-ink">Checked with the official source on {{ $date($notice['verifiedAt']) }}</span>@endif</p>

        <section class="card mt-5 overflow-hidden">
            <h2 class="px-4 pt-4 font-bold md:px-5">At a glance <span class="bn" lang="bn">(এক নজরে)</span></h2>
            <table class="mt-2 w-full text-sm">
                <tbody>
                    @foreach ($rows as $label => $value)
                        <tr class="border-t align-top"><th scope="row" class="w-2/5 px-4 py-2.5 text-left font-medium text-muted-foreground md:px-5">{{ $label }}</th><td class="px-4 py-2.5 font-semibold whitespace-pre-line md:px-5">{{ $value }}</td></tr>
                    @endforeach
                </tbody>
            </table>
        </section>

        <h2 class="mt-6 font-bold">Summary</h2>
        <p class="mt-1 leading-relaxed whitespace-pre-line">{{ $notice['summary'] }}</p>
        @if ($notice['summary_bn'])
            <h2 class="bn mt-5 font-bold" lang="bn">সারসংক্ষেপ</h2>
            <p class="bn mt-1 leading-relaxed whitespace-pre-line" lang="bn">{{ $notice['summary_bn'] }}</p>
        @endif
        @if ($notice['howToApply'])
            <h2 class="mt-6 font-bold">How to apply <span class="bn" lang="bn">(আবেদনের নিয়ম)</span></h2>
            <ol class="mt-2 list-decimal space-y-1.5 pl-6 leading-relaxed">@foreach ($notice['howToApply'] as $step)<li>{{ $step }}</li>@endforeach</ol>
        @endif
        @if ($notice['changes'])
            <h2 class="mt-6 font-bold">What changed <span class="bn" lang="bn">(যা পরিবর্তন হয়েছে)</span></h2>
            <ul class="mt-2 space-y-1.5 text-sm">@foreach ($notice['changes'] as $change)<li><b>{{ $change['field'] }}:</b> <s>{{ $change['old'] }}</s> → {{ $change['new'] }} ({{ $date($change['at']) }})</li>@endforeach</ul>
        @endif
        @if ($notice['official'] || $notice['url'])
            <h2 class="mt-6 font-bold">Official source <span class="bn" lang="bn">(অফিসিয়াল সূত্র)</span></h2>
            <ul class="mt-2 space-y-1.5">
                @if ($notice['official'])<li><a href="{{ $notice['official']['url'] }}" target="_blank" rel="noopener" class="font-semibold text-primary">{{ $notice['official']['name'] }} website: {{ preg_replace('#^https?://(www\.)?#', '', $notice['official']['url']) }}</a></li>@endif
                @if ($notice['url'])<li><a href="{{ $notice['url'] }}" target="_blank" rel="noopener" class="font-semibold text-primary">Read this notice at the official source</a></li>@endif
            </ul>
        @endif
        @if ($notice['circular'])
            <h2 class="mt-6 font-bold">Circular <span class="bn" lang="bn">(বিজ্ঞপ্তি)</span></h2>
            @if ($notice['circular']['image'])
                <a href="{{ $notice['circular']['url'] }}" target="_blank" rel="noopener"><img src="{{ $notice['circular']['url'] }}" alt="{{ $notice['title'] }} circular" loading="lazy" decoding="async" class="mt-2 w-full rounded-2xl border"></a>
            @else
                <p class="mt-2"><a href="{{ $notice['circular']['url'] }}" target="_blank" rel="noopener" class="inline-flex h-11 items-center rounded-full border px-6 font-semibold">Download the circular (PDF)</a></p>
            @endif
        @endif
        @include('seo.partials.share', ['path' => "/notices/{$notice['slug']}", 'title' => $notice['title']])
        <p class="mt-4 text-xs leading-relaxed text-muted-foreground">Summary written by the bd3schools team. Apply only through the official portal. bd3schools is not affiliated with BPSC or any ministry. <span class="bn" lang="bn">শুধু অফিসিয়াল পোর্টালেই আবেদন করুন।</span> <a href="/contact" class="underline">Report a mistake</a></p>
    </article>
    @if ($related->isNotEmpty())
        <h2 class="mt-8 mb-3 font-semibold">More notices <span class="bn" lang="bn">(আরও নোটিশ)</span></h2>
        <ul class="space-y-3">@foreach ($related as $notice)@include('seo.partials.notice-card')@endforeach</ul>
    @endif
</div>
