@php $bn = \App\Services\Bangla::digits(...); @endphp
<div class="bn mx-auto max-w-4xl px-4 py-6 md:py-10" lang="bn">
    @include('seo.partials.crumbs', ['items' => ['Home' => '/', $hub['name'] => '']])
    <h1 class="text-[1.5rem] leading-snug font-bold md:text-[2.1rem]">{{ $hub['h1'] }} <span class="block text-lg font-semibold text-muted-foreground md:text-xl">{{ $hub['h1_en'] }}</span></h1>
    <p class="mt-4 leading-relaxed">এই পাতায় পরীক্ষার নম্বর বণ্টন, {{ $bn($groups->flatten(1)->count()) }}টি অনুশীলন প্রশ্ন (উত্তর ও ব্যাখ্যাসহ), মডেল টেস্ট ও সর্বশেষ নোটিশ এক জায়গায় পাবেন। সব বিনামূল্যে।</p>
    <p class="mt-2 text-sm leading-relaxed text-muted-foreground" lang="en">@foreach ($exams as $exam){{ $exam['name'] }}: {{ $exam['summary'] }} @endforeach Practice questions below are prepared for this exam's syllabus; where a question comes from a past exam, its name is shown.</p>

    @if ($notices->isNotEmpty())
        <h2 class="mt-9 text-xl font-bold">সর্বশেষ নোটিশ (latest notices)</h2>
        <ul class="mt-3 grid gap-3 md:grid-cols-2">@foreach ($notices as $notice)@include('seo.partials.notice-card')@endforeach</ul>
    @endif
    @if ($exams->isNotEmpty())
        <h2 class="mt-9 text-xl font-bold">সিলেবাস ও নম্বর বণ্টন (syllabus and marks)</h2>
        @foreach ($exams as $exam)@include('seo.partials.exam-format')@endforeach
    @endif
    @if ($tests->isNotEmpty())
        <h2 class="mt-9 text-xl font-bold">মডেল টেস্ট (model tests)</h2>
        @include('seo.partials.tests')
        <p class="mt-3"><a href="/model-tests" class="font-semibold text-primary">সব মডেল টেস্ট দেখুন</a></p>
    @endif

    <h2 class="mt-9 text-xl font-bold">প্রশ্ন, উত্তর ও ব্যাখ্যা (questions with answers)</h2>
    @php $number = 0; @endphp
    @foreach ($groups as $questions)
        <h3 class="mt-6 text-lg font-bold">{{ $questions->first()['subject']['name_bn'] }} <span class="text-muted-foreground" lang="en">({{ $questions->first()['subject']['name'] }})</span></h3>
        <ol class="mt-2">@foreach ($questions as $question)@include('seo.partials.question', ['question' => [...$question, 'number' => ++$number], 'tag' => 'h4'])@endforeach</ol>
    @endforeach

    <section class="no-print">
        <h2 class="mt-9 text-lg font-bold">অন্যান্য পরীক্ষা</h2>
        <ul class="mt-3 flex flex-wrap gap-2">
            <li><a href="/bcs" class="inline-block rounded-full border px-3 py-1.5 text-sm">বিসিএস প্রশ্ন ব্যাংক</a></li>
            @foreach ($hubs as $address => $other)<li><a href="/{{ $address }}" class="inline-block rounded-full border px-3 py-1.5 text-sm">{{ $other['h1'] }}</a></li>@endforeach
            <li><a href="/daily" class="inline-block rounded-full border px-3 py-1.5 text-sm">আজকের কুইজ</a></li>
        </ul>
    </section>
</div>
