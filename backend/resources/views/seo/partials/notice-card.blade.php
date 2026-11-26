@php
    $parse = fn (?string $iso): ?\Illuminate\Support\Carbon => $iso ? \Illuminate\Support\Carbon::parse($iso) : null;
    $day = fn (?string $iso): ?string => $iso ? $parse($iso)->format('j M Y') : null;
    $today = now(config('app.student_timezone') ?: 'Asia/Dhaka')->startOfDay();
    $applyUntil = $parse($notice['applyUntil']);
    $examDate = $parse($notice['examDate']);
    // The date that matters most: the deadline while open, then the exam, otherwise when it was published.
    [$chipLabel, $chipDate] = match (true) {
        $applyUntil && $applyUntil->gte($today) => ['Apply', $applyUntil],
        $examDate && $examDate->gte($today) => ['Exam', $examDate],
        default => ['Pub', $parse($notice['published'])],
    };
    $urgent = $chipLabel !== 'Pub' && $chipDate->diffInDays($today, true) <= 3;
    $status = $notice['status'] ?? null;
    $state = \App\Models\Notice::STATUSES[$status] ?? null;
    $statusTone = match ($status) {
        'open' => 'bg-success/12 text-success-ink',
        'closing' => 'bg-destructive/10 text-destructive-ink',
        'closed' => 'bg-muted text-muted-foreground',
        'result' => 'bg-info/10 text-info-ink',
        default => 'bg-primary/10 text-primary',
    };
    $pill = 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap';
@endphp
<li>
    <a href="/notices/{{ $notice['slug'] }}" class="card lift group flex gap-3.5 p-3.5 md:p-4">
        @if ($chipDate)
            <span @class(['flex w-[3.6rem] shrink-0 flex-col items-center justify-center self-start rounded-xl py-2 text-center', 'bg-destructive/10 text-destructive-ink' => $urgent, 'bg-secondary text-secondary-foreground' => ! $urgent])>
                <span class="text-[0.6rem] font-bold tracking-wide uppercase">{{ $chipLabel }}</span>
                <span class="text-xl leading-tight font-extrabold">{{ $chipDate->format('j') }}</span>
                <span class="text-[0.65rem] font-semibold">{{ $chipDate->format('M') }}</span>
            </span>
        @endif
        <span class="block min-w-0 flex-1">
            <span class="mb-1.5 flex flex-wrap items-center gap-1.5">
                <span class="{{ $pill }} bg-muted text-muted-foreground">{{ \App\Models\Notice::TYPES[$notice['type']] ?? 'Notice' }}</span>
                @if ($state)
                    <span class="{{ $pill }} {{ $statusTone }}">{{ $state[0] }}</span>
                @endif
                @if ($notice['isNew'] ?? false)
                    <span class="{{ $pill }} bg-success/12 text-success-ink">New</span>
                @endif
            </span>
            <span class="bn line-clamp-2 block text-[0.95rem] leading-snug font-bold transition-colors group-hover:text-primary">{{ $notice['heading'] ?? $notice['title'] }}</span>
            <span class="mt-1 line-clamp-1 block text-sm text-muted-foreground">{{ $notice['heading'] ? $notice['title'] : $notice['summary'] }}</span>
            <span class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span class="font-semibold text-foreground/80">{{ $notice['org'] }}</span>
                <span>Published <time datetime="{{ $notice['published'] }}">{{ $day($notice['published']) }}</time></span>
                @if ($notice['updated'] && $day($notice['updated']) !== $day($notice['published']))
                    <span>Updated <time datetime="{{ $notice['updated'] }}">{{ $day($notice['updated']) }}</time></span>
                @endif
            </span>
        </span>
        <svg class="mt-1 hidden size-3 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" viewBox="0 0 320 512" fill="currentColor" aria-hidden="true"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
    </a>
</li>
