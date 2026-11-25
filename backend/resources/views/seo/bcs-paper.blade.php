@php
    $bn = \App\Services\Bangla::digits(...);
    $srcset = preg_match('#^/covers/bcs/([^/]+)\.jpg$#', (string) $image, $cover) ? "/covers/bcs/sm/{$cover[1]}.webp 640w, /covers/bcs/{$cover[1]}.webp 1200w" : null;
@endphp
<div class="bn mx-auto max-w-4xl px-4 py-6 md:py-10" lang="bn">
    @include('seo.partials.crumbs', ['items' => ['Home' => '/', 'BCS' => '/bcs', $paper['name'] => '']])
    <h1 class="text-[1.5rem] leading-snug font-bold md:text-[2.1rem]">{{ $paper['name_bn'] }} প্রশ্ন সমাধান <span class="block text-lg font-semibold text-muted-foreground md:text-xl">{{ $paper['name'] }} Question Solution ({{ $with }})</span></h1>
    <p class="mt-2 text-sm text-muted-foreground">bd3schools · সর্বশেষ হালনাগাদ <time datetime="{{ $updated->toIso8601String() }}">{{ \App\Services\Bangla::date($updated) }}</time></p>
    <p class="mt-5 leading-relaxed">{{ $paper['name_bn'] }}{{ $paper['special'] ? ' (বিশেষ)' : '' }} প্রিলিমিনারি পরীক্ষা{{ $paper['date'] ? ' '.\App\Services\Bangla::date($paper['date']).' তারিখে' : '' }} অনুষ্ঠিত হয়। প্রশ্ন ছিল {{ $bn($paper['total']) }}টি, পূর্ণমান {{ $bn($paper['marks']) }}। এই পাতায় {{ $bn(count($questions)) }}টি প্রশ্ন সঠিক উত্তরসহ দেওয়া আছে@if ($explained), এর মধ্যে {{ $bn($explained) }}টির ব্যাখ্যা আছে@endif। একই প্রশ্ন অন্য বিসিএসেও এলে সেটির নাম ও সাল প্রশ্নের নিচে লেখা আছে।</p>
    <p class="mt-2 text-sm leading-relaxed text-muted-foreground" lang="en">{{ $paper['name'] }} preliminary{{ $paper['special'] ? ' (special)' : '' }} question solution{{ $paper['year'] ? ', held in '.$paper['year'] : '' }}: {{ count($questions) }} of {{ $paper['total'] }} questions with the correct answer. Answers are prepared by bd3schools; BPSC does not publish an answer key with explanations. Free to read online or save as a PDF.</p>
    <p class="no-print mt-5 flex flex-wrap gap-3">
        <a href="/bcs-papers/{{ $paper['number'] }}" class="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground">অ্যাপে অনুশীলন করুন</a>
        <button type="button" data-print class="inline-flex h-11 items-center rounded-full border px-6 font-semibold">PDF হিসেবে সেভ করুন</button>
    </p>

    <section class="card mt-7 overflow-x-auto">
        <h2 class="px-4 pt-4 text-lg font-bold">বিষয় অনুযায়ী প্রশ্ন</h2>
        <table class="mt-2 w-full text-sm">
            <tbody>
                @foreach ($subjects as $subject)
                    <tr class="border-t"><td class="px-4 py-2.5">@if ($subject['path'])<a href="{{ $subject['path'] }}" class="font-semibold text-primary">{{ $subject['name_bn'] }}</a>@else{{ $subject['name_bn'] }}@endif <span class="text-muted-foreground" lang="en">({{ $subject['name'] }})</span></td><td class="px-4 py-2.5 text-right">{{ $bn($subject['questions']) }}টি</td></tr>
                @endforeach
            </tbody>
        </table>
    </section>
    @if ($image)
        <img src="{{ $image }}" @if ($srcset) srcset="{{ $srcset }}" sizes="(min-width: 896px) 864px, 94vw" @endif alt="{{ $paper['name_bn'] }} প্রশ্ন সমাধান" width="1200" height="670" loading="lazy" decoding="async" class="no-print mt-7 aspect-[1200/670] w-full rounded-2xl object-cover">
    @endif

    <h2 class="mt-9 text-xl font-bold">{{ $paper['name_bn'] }} প্রশ্ন ও উত্তর ({{ $paper['name'] }} questions and answers)</h2>
    <ol class="mt-3">@foreach ($questions as $question)@include('seo.partials.question', ['showSubject' => true])@endforeach</ol>

    <nav class="no-print mt-8 flex justify-between gap-4 font-semibold text-primary" aria-label="Other BCS papers">
        <span>@if ($older)<a href="{{ $older['path'] }}">← {{ $older['name_bn'] }} ({{ $older['name'] }})</a>@endif</span>
        <span class="text-right">@if ($newer)<a href="{{ $newer['path'] }}">{{ $newer['name_bn'] }} ({{ $newer['name'] }}) →</a>@endif</span>
    </nav>
    @if ($notices->isNotEmpty())
        <section class="no-print">
            <h2 class="mt-9 text-lg font-bold">বিসিএস নোটিশ</h2>
            <ul class="mt-3 grid gap-3 md:grid-cols-3">@foreach ($notices as $notice)@include('seo.partials.notice-card')@endforeach</ul>
        </section>
    @endif
    <section class="no-print">
        <h2 class="mt-9 text-lg font-bold">অন্যান্য বিসিএস প্রশ্ন সমাধান</h2>
        <ul class="mt-3 flex flex-wrap gap-2">@foreach ($others as $other)<li><a href="{{ $other['path'] }}" class="inline-block rounded-full border px-3 py-1.5 text-sm">{{ $other['name_bn'] }}</a></li>@endforeach</ul>
        <p class="mt-4"><a href="/bcs" class="font-semibold text-primary">সব বিসিএস প্রশ্ন ব্যাংক</a> · <a href="/model-tests" class="font-semibold text-primary">মডেল টেস্ট</a></p>
    </section>
</div>
