@php $bn = \App\Services\Bangla::digits(...); @endphp
<div class="bn mx-auto max-w-4xl px-4 py-6 md:py-10" lang="bn">
    @include('seo.partials.crumbs')
    <h1 class="text-[1.5rem] leading-snug font-bold md:text-[2.1rem]">বিসিএস {{ $subject->name_bn }} প্রশ্ন সমাধান <span class="block text-lg font-semibold text-muted-foreground md:text-xl">BCS {{ $subject->name }} Questions with Answers</span></h1>
    @include('seo.partials.updated')
    @if ($intro)
        <p class="mt-4 leading-relaxed">{{ $intro['bn'] }}</p>
        <p class="mt-3 text-sm leading-relaxed text-muted-foreground" lang="en">{{ $intro['en'] }}</p>
    @endif
    <p class="mt-3 leading-relaxed">আমাদের সংগ্রহে এই বিষয়ের {{ $bn(number_format($total)) }}টি বিসিএস প্রশ্ন আছে। নিচে {{ $bn(count($questions)) }}টি প্রশ্ন, সঠিক উত্তর ও এক লাইনের নোট দেওয়া হলো, নতুন বিসিএস থেকে পুরোনো। পূর্ণ ব্যাখ্যা সংশ্লিষ্ট বিসিএসের পাতায় আছে।</p>
    @include('seo.partials.share', ['path' => \App\Services\ExamPages::subjectPath($subject->slug), 'title' => "বিসিএস {$subject->name_bn} প্রশ্ন সমাধান"])

    <ol class="mt-6">@foreach ($questions as $question)@include('seo.partials.question', ['tag' => 'h2'])@endforeach</ol>

    <section class="no-print">
        <h2 class="mt-9 text-lg font-bold">কোন বিসিএসে কয়টি প্রশ্ন</h2>
        <ul class="mt-3 flex flex-wrap gap-2">@foreach ($byPaper as $paper)<li><a href="{{ $paper['path'] }}" class="inline-block rounded-full border px-3 py-1.5 text-sm">{{ $paper['name_bn'] }}: {{ $bn($paper['questions']) }}টি</a></li>@endforeach</ul>
        <h2 class="mt-9 text-lg font-bold">অন্যান্য বিষয়</h2>
        <ul class="mt-3 flex flex-wrap gap-2">@foreach ($subjects as $other)@if ($other['name'] !== $subject->name)<li><a href="{{ $other['path'] }}" class="inline-block rounded-full border px-3 py-1.5 text-sm">{{ $other['name_bn'] }}</a></li>@endif @endforeach</ul>
        <p class="mt-4"><a href="/bcs" class="font-semibold text-primary">বিসিএস প্রশ্ন ব্যাংক</a> · <a href="/model-tests" class="font-semibold text-primary">মডেল টেস্ট</a></p>
    </section>
</div>
