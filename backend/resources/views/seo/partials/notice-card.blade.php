<li class="card p-4">
    <a href="/notices/{{ $notice['slug'] }}" class="font-bold">{{ $notice['title'] }}</a>
    @if ($notice['title_bn'])
        <p class="bn text-sm font-medium" lang="bn">{{ $notice['title_bn'] }}</p>
    @endif
    <p class="mt-1 text-sm text-muted-foreground">{{ $notice['summary'] }}</p>
    <p class="mt-1 text-xs text-muted-foreground">
        {{ $notice['org'] }}
        @if ($notice['applyUntil']) · Apply until {{ \Illuminate\Support\Carbon::parse($notice['applyUntil'])->format('j M Y') }} @endif
        @if ($notice['examDate']) · Exam {{ \Illuminate\Support\Carbon::parse($notice['examDate'])->format('j M Y') }} @endif
    </p>
</li>
