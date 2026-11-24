<x-filament-widgets::widget>
    <div class="pa-hero">
        <div class="pa-hero-glow" aria-hidden="true"></div>
        <div class="pa-hero-main">
            <p class="pa-hero-date">{{ $date }}</p>
            <h2 class="pa-hero-title">{{ $greeting }}, {{ $name }} 👋</h2>
            <p class="pa-hero-sub">Here's DreamPrep at a glance. Everything on this page updates on its own.</p>

            <div class="pa-hero-actions">
                @foreach ($actions as $action)
                    <a href="{{ $action['url'] }}"
                       @if ($action['external'] ?? false) target="_blank" rel="noopener" @else wire:navigate @endif
                       class="pa-hero-action {{ ($action['primary'] ?? false) ? 'is-primary' : '' }}">
                        <x-filament::icon :icon="$action['icon']" class="pa-hero-action-icon" />
                        <span>{{ $action['label'] }}</span>
                    </a>
                @endforeach
            </div>
        </div>

        <div class="pa-hero-facts">
            @foreach ($facts as $fact)
                <div class="pa-hero-fact">
                    <span class="pa-hero-fact-value">{{ $fact['value'] }}</span>
                    <span class="pa-hero-fact-label">{{ $fact['label'] }}</span>
                </div>
            @endforeach
        </div>
    </div>
</x-filament-widgets::widget>
