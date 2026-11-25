<x-filament-widgets::widget>
    <x-filament::section heading="Question bank" description="Live questions per subject — aim for at least {{ $target }} each.">
        <x-slot name="afterHeader">
            <span class="pa-chip">{{ number_format($totalLive) }} live</span>
            @if ($totalWaiting)
                <span class="pa-chip is-warning">{{ number_format($totalWaiting) }} waiting</span>
            @endif
        </x-slot>

        <div class="pa-bars">
            @foreach ($subjects as $subject)
                <a href="{{ $subject['url'] }}" wire:navigate class="pa-bar-row">
                    <span class="pa-bar-name">{{ $subject['name'] }}</span>
                    <span class="pa-bar-value">
                        {{ number_format($subject['live']) }}
                        @if ($subject['waiting'])
                            <span class="pa-bar-waiting">+{{ $subject['waiting'] }}</span>
                        @endif
                    </span>
                    <span class="pa-bar-track">
                        <span class="pa-bar-fill {{ $subject['live'] >= $target ? '' : ($subject['live'] < 20 ? 'is-low' : '') }}"
                              style="width: {{ max(2, min(100, round($subject['live'] / max($target, $max) * 100))) }}%"></span>
                    </span>
                </a>
            @endforeach
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
