@php $letters = $question['lang'] === 'bn' ? ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ'] : ['A', 'B', 'C', 'D', 'E', 'F']; @endphp
<article class="bn mx-auto max-w-3xl px-4 py-6 md:py-10" lang="{{ $question['lang'] }}">
    @include('seo.partials.crumbs')
    <h1 class="text-[1.35rem] leading-snug font-bold whitespace-pre-line md:text-[1.8rem]">{{ $question['body'] }}</h1>
    @include('seo.partials.updated')
    <ul class="mt-5 grid gap-2 sm:grid-cols-2">
        @foreach ($question['options'] as $index => $option)
            <li @class(['rounded-xl border px-4 py-3', 'border-success font-semibold text-success-ink' => $index === $question['answer']])>{{ $letters[$index] ?? $index + 1 }}) {{ $option }}</li>
        @endforeach
    </ul>
    <p class="mt-5 text-lg font-semibold text-success-ink">সঠিক উত্তর: {{ $letters[$question['answer']] ?? $question['answer'] + 1 }}) {{ $question['options'][$question['answer']] ?? '' }}</p>
    <h2 class="mt-6 text-lg font-bold">ব্যাখ্যা (Explanation)</h2>
    <p class="mt-2 leading-relaxed break-words whitespace-pre-line">{{ trim($question['explanation']) }}</p>
    <dl class="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <div class="card p-4"><dt class="text-muted-foreground">যে পরীক্ষায় এসেছে (Exam)</dt><dd class="mt-1"><a href="{{ $paper['path'] }}#q{{ $question['number'] }}" class="font-semibold text-primary">{{ $paper['name_bn'] }} ({{ $paper['name'] }}{{ $paper['year'] ? ", {$paper['year']}" : '' }})</a>@foreach ($question['also'] as $other), <a href="{{ $other['path'] }}" class="font-semibold text-primary">{{ $other['name'] }}</a>@endforeach</dd></div>
        <div class="card p-4"><dt class="text-muted-foreground">বিষয় (Subject)</dt><dd class="mt-1">@if ($question['subject']['path'])<a href="{{ $question['subject']['path'] }}" class="font-semibold text-primary">{{ $question['subject']['name_bn'] }} ({{ $question['subject']['name'] }})</a>@else{{ $question['subject']['name_bn'] }} ({{ $question['subject']['name'] }})@endif</dd></div>
    </dl>
    @include('seo.partials.share', ['path' => $question['page'], 'title' => $question['body']])
    <p class="mt-4 text-sm"><a href="/contact?question={{ $question['id'] }}" rel="nofollow" class="text-muted-foreground underline">ভুল উত্তর জানান (Report a wrong answer)</a></p>
    @if ($related->isNotEmpty())
        <h2 class="mt-8 text-lg font-bold">একই বিষয়ের আরও প্রশ্ন</h2>
        <ul class="mt-3 space-y-2">@foreach ($related as $other)<li><a href="{{ $other['path'] }}" class="text-primary">{{ $other['title'] }}</a></li>@endforeach</ul>
    @endif
</article>
