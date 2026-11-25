@php
    $letters = $question['lang'] === 'bn' ? ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ'] : ['A', 'B', 'C', 'D', 'E', 'F'];
    $tag = $tag ?? 'h3';
@endphp
<li id="q{{ $question['number'] }}" class="qa">
    <{{ $tag }} class="qa-body" lang="{{ $question['lang'] }}">{{ \App\Services\Bangla::digits($question['number']) }}. {{ $question['body'] }}</{{ $tag }}>
    <ul class="qa-options" lang="{{ $question['lang'] }}">
        @foreach ($question['options'] as $index => $option)
            <li @class(['qa-right' => $index === $question['answer']])>{{ $letters[$index] ?? $index + 1 }}) {{ $option }}</li>
        @endforeach
    </ul>
    <p class="qa-answer">সঠিক উত্তর: {{ $letters[$question['answer']] ?? $question['answer'] + 1 }}) {{ $question['options'][$question['answer']] ?? '' }}</p>
    @if (array_key_exists('note', $question))
        @if ($question['note'])<p class="qa-note">{{ $question['note'] }}</p>@endif
    @elseif (filled($question['explanation']))
        <details class="qa-why"><summary>ব্যাখ্যা</summary><p>{{ trim($question['explanation']) }}</p></details>
    @endif
    <p class="qa-meta">
        @if ($showSubject ?? false)
            @if ($question['subject']['path'])<a href="{{ $question['subject']['path'] }}">{{ $question['subject']['name_bn'] }}</a> ·@else{{ $question['subject']['name_bn'] }} ·@endif
        @endif
        @if ($question['from'])<a href="{{ $question['from']['path'] }}">{{ $question['from']['name'] }}@if ($question['from']['year']) ({{ $question['from']['year'] }})@endif</a> · <a href="{{ $question['from']['path'] }}#q{{ $question['paper_number'] }}" class="font-semibold text-primary">পূর্ণ ব্যাখ্যা →</a> ·@endif
        @if ($question['source']){{ $question['source'] }} ·@endif
        @if ($question['also'])
            আরও এসেছে:
            @foreach ($question['also'] as $other)<a href="{{ $other['path'] }}">{{ $other['name'] }}@if ($other['year']) ({{ $other['year'] }})@endif</a>@if (! $loop->last), @endif @endforeach ·
        @endif
        @if ($question['page'] && ($linkPage ?? false))<a href="{{ $question['page'] }}">এই প্রশ্নের পাতা</a> ·@endif
        <a href="/contact?question={{ $question['id'] }}" rel="nofollow" class="no-print">ভুল উত্তর জানান</a>
    </p>
</li>
