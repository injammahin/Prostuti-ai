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
    @if (filled($question['explanation']))
        <p class="qa-why"><b>ব্যাখ্যা:</b> {{ trim($question['explanation']) }}</p>
    @endif
    @if ($question['from'] || $question['source'] || $question['also'] || ($showSubject ?? false))
        <p class="qa-meta">
            @if ($showSubject ?? false)
                @if ($question['subject']['path'])<a href="{{ $question['subject']['path'] }}">{{ $question['subject']['name_bn'] }}</a>@else{{ $question['subject']['name_bn'] }}@endif
            @endif
            @if ($question['from'])<a href="{{ $question['from']['path'] }}#q{{ $question['paper_number'] }}">{{ $question['from']['name'] }}@if ($question['from']['year']) ({{ $question['from']['year'] }})@endif</a>@endif
            @if ($question['source']){{ $question['source'] }}@endif
            @if ($question['also'])
                · আরও এসেছে:
                @foreach ($question['also'] as $other)<a href="{{ $other['path'] }}">{{ $other['name'] }}@if ($other['year']) ({{ $other['year'] }})@endif</a>@if (! $loop->last), @endif @endforeach
            @endif
        </p>
    @endif
</li>
