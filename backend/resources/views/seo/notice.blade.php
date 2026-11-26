@php
    $date = fn (?string $iso): ?string => $iso ? \Illuminate\Support\Carbon::parse($iso)->format('j F Y') : null;
    $dateBn = fn (?string $iso): ?string => $iso ? \App\Services\Bangla::date(\Illuminate\Support\Carbon::parse($iso)) : null;
    $both = fn (?string $iso): ?string => $iso ? $date($iso).' ('.$dateBn($iso).')' : null;
    $state = \App\Models\Notice::STATUSES[$notice['status'] ?? ''] ?? null;
    $badge = match ($notice['status'] ?? null) {
        'open' => 'bg-emerald-100 text-emerald-800',
        'closing' => 'bg-amber-100 text-amber-900',
        'closed' => 'bg-slate-200 text-slate-700',
        'result' => 'bg-sky-100 text-sky-800',
        default => 'bg-indigo-100 text-indigo-800',
    };
    $rows = array_filter([
        'Organization / প্রতিষ্ঠান' => trim($notice['org'].($notice['org_bn'] ? ' ('.$notice['org_bn'].')' : '')),
        'Post / পদের নাম' => $notice['posts'] ? null : $notice['post'],
        'Total vacancies / মোট পদসংখ্যা' => $notice['vacancies'],
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
    @if ($preview)
        <p class="mb-4 rounded-xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">Preview — this notice is not published yet. Search engines do not see this page.</p>
    @endif
    @include('seo.partials.crumbs')
    <article>
        @if ($state)
            <span class="inline-block rounded-full px-3 py-1 text-xs font-bold {{ $badge }}">{{ $state[0] }} · <span class="bn" lang="bn">{{ $state[1] }}</span></span>
        @endif
        <h1 class="bn mt-2 text-xl leading-tight font-bold md:text-[1.7rem]">{{ $notice['heading'] ?? $notice['title'] }}</h1>
        @if ($notice['heading'])
            <p class="mt-1 font-semibold">{{ $notice['title'] }}</p>
        @endif
        @if ($notice['title_bn'])
            <p class="bn mt-1 text-lg font-semibold" lang="bn">{{ $notice['title_bn'] }}</p>
        @endif
        <p class="mt-2 text-sm text-muted-foreground">{{ $typeLabel }} · Published / প্রকাশ: <time datetime="{{ $notice['published'] }}">{{ $date($notice['published']) }}</time>@if ($notice['updated']) · Updated / হালনাগাদ: <time datetime="{{ $notice['updated'] }}">{{ $date($notice['updated']) }}</time>@endif @if ($notice['verifiedAt']) · <span class="text-success-ink">Checked with the official circular on {{ $date($notice['verifiedAt']) }}</span>@endif</p>

        <p class="mt-4 leading-relaxed whitespace-pre-line">{{ $notice['summary'] }}</p>
        @if ($notice['summary_bn'])
            <p class="bn mt-2 leading-relaxed whitespace-pre-line" lang="bn">{{ $notice['summary_bn'] }}</p>
        @endif

        @if ($notice['applyUrl'] && in_array($notice['status'], ['open', 'closing'], true))
            <p class="mt-4"><a href="{{ $notice['applyUrl'] }}" target="_blank" rel="noopener nofollow" class="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground">Apply online / অনলাইনে আবেদন</a></p>
        @endif

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

        @if ($notice['posts'])
            <section class="card mt-5 overflow-x-auto">
                <h2 class="px-4 pt-4 font-bold md:px-5">Posts and vacancies <span class="bn" lang="bn">(পদ ও পদসংখ্যা)</span></h2>
                <table class="mt-2 w-full text-sm">
                    <thead><tr class="border-t text-left text-muted-foreground"><th class="px-4 py-2 font-medium md:px-5">Post / পদ</th><th class="px-4 py-2 font-medium">Grade / গ্রেড</th><th class="px-4 py-2 text-right font-medium md:px-5">Vacancies / পদসংখ্যা</th></tr></thead>
                    <tbody>
                        @foreach ($notice['posts'] as $post)
                            <tr class="border-t"><td class="px-4 py-2.5 font-semibold md:px-5">{{ $post['name'] }}</td><td class="px-4 py-2.5">{{ $post['grade'] ?? '—' }}</td><td class="px-4 py-2.5 text-right font-semibold md:px-5">{{ $post['vacancies'] ?? '—' }}</td></tr>
                        @endforeach
                    </tbody>
                </table>
            </section>
        @endif

        @if ($notice['howToApply'])
            <h2 class="mt-6 font-bold">How to apply <span class="bn" lang="bn">(আবেদনের নিয়ম)</span></h2>
            <ol class="mt-2 list-decimal space-y-1.5 pl-6 leading-relaxed">@foreach ($notice['howToApply'] as $step)<li>{{ $step }}</li>@endforeach</ol>
        @endif
        @if ($notice['changes'])
            <h2 class="mt-6 font-bold">Updates <span class="bn" lang="bn">(হালনাগাদ তথ্য)</span></h2>
            <ul class="mt-2 space-y-1.5 text-sm">@foreach ($notice['changes'] as $change)<li><b>{{ $change['field'] }}:</b> <s>{{ $change['old'] }}</s> → {{ $change['new'] }} ({{ $date($change['at']) }})</li>@endforeach</ul>
        @endif
        @if ($notice['circular'])
            <h2 class="mt-6 font-bold">Official circular <span class="bn" lang="bn">(মূল বিজ্ঞপ্তি)</span></h2>
            @if ($notice['circular']['image'])
                <a href="{{ $notice['circular']['url'] }}" target="_blank" rel="noopener"><img src="{{ $notice['circular']['url'] }}" alt="{{ $notice['heading'] ?? $notice['title'] }} – official circular" loading="lazy" decoding="async" class="mt-2 w-full rounded-2xl border"></a>
            @else
                <p class="mt-2"><a href="{{ $notice['circular']['url'] }}" target="_blank" rel="noopener" class="inline-flex h-11 items-center rounded-full border px-6 font-semibold">Download the circular (PDF)</a></p>
            @endif
        @endif
        @if ($notice['official'] || $notice['url'])
            <h2 class="mt-6 font-bold">Official source <span class="bn" lang="bn">(অফিসিয়াল সূত্র)</span></h2>
            <ul class="mt-2 space-y-1.5">
                @if ($notice['url'])<li><a href="{{ $notice['url'] }}" target="_blank" rel="noopener" class="font-semibold text-primary">Read the circular at the official source</a></li>@endif
                @if ($notice['official'])<li><a href="{{ $notice['official']['url'] }}" target="_blank" rel="noopener" class="font-semibold text-primary">{{ $notice['official']['name'] }} website: {{ preg_replace('#^https?://(www\.)?#', '', $notice['official']['url']) }}</a></li>@endif
            </ul>
        @endif

        <h2 class="mt-6 font-bold">Prepare for this exam <span class="bn" lang="bn">(প্রস্তুতি নিন)</span></h2>
        <ul class="mt-2 grid gap-2 sm:grid-cols-3">
            @foreach ($study as $link)
                <li><a href="{{ $link['path'] }}" class="card block p-3 text-sm font-semibold text-primary">{{ $link['label'] }}<span class="bn block text-xs font-medium text-muted-foreground" lang="bn">{{ $link['label_bn'] }}</span></a></li>
            @endforeach
        </ul>

        @include('seo.partials.share', ['path' => "/notices/{$notice['slug']}", 'title' => $notice['heading'] ?? $notice['title']])
        <p class="mt-4 text-xs leading-relaxed text-muted-foreground">Summary written by the bd3schools team from the official circular. Apply only through the official portal. bd3schools is not affiliated with any government office. <span class="bn" lang="bn">শুধু অফিসিয়াল পোর্টালেই আবেদন করুন।</span> <a href="/contact" class="underline">Report a mistake</a></p>
    </article>
    @if ($related->isNotEmpty())
        <h2 class="mt-8 mb-3 font-semibold">Related notices <span class="bn" lang="bn">(সংশ্লিষ্ট নোটিশ)</span></h2>
        <ul class="space-y-3">@foreach ($related as $notice)@include('seo.partials.notice-card')@endforeach</ul>
    @endif
</div>
