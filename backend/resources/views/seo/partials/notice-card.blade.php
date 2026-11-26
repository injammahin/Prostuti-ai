@php
    $day = fn (?string $iso): ?string => $iso ? \Illuminate\Support\Carbon::parse($iso)->format('j M Y') : null;
    $state = \App\Models\Notice::STATUSES[$notice['status'] ?? ''] ?? null;
@endphp
<li class="card p-4">
    <a href="/notices/{{ $notice['slug'] }}" class="font-bold">{{ $notice['heading'] ?? $notice['title'] }}</a>
    @if ($notice['heading'] ?? null)
        <p class="text-sm font-medium">{{ $notice['title'] }}</p>
    @elseif ($notice['title_bn'])
        <p class="bn text-sm font-medium" lang="bn">{{ $notice['title_bn'] }}</p>
    @endif
    <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">{{ $notice['summary'] }}</p>
    <p class="mt-1 text-xs text-muted-foreground">
        {{ $notice['org'] }} · Published <time datetime="{{ $notice['published'] }}">{{ $day($notice['published']) }}</time>
        @if ($notice['updated'] && $day($notice['updated']) !== $day($notice['published'])) · Updated <time datetime="{{ $notice['updated'] }}">{{ $day($notice['updated']) }}</time>@endif
        @if ($notice['applyUntil']) · Apply until {{ $day($notice['applyUntil']) }} @endif
        @if ($notice['examDate']) · Exam {{ $day($notice['examDate']) }} @endif
        @if ($state) · <b>{{ $state[0] }}</b> @endif
    </p>
</li>
