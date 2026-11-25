<x-filament-widgets::widget>
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div class="pa-welcome">
            <div>
                <p class="pa-welcome-date">{{ $date }}</p>
                <h1 class="pa-welcome-title">{{ $greeting }}, {{ $name }}</h1>
                <p class="pa-welcome-sub">Here's how bd3schools is doing.</p>
            </div>

            <div class="pa-actions">
                @foreach ($actions as $action)
                    <a href="{{ $action['url'] }}" wire:navigate class="pa-action {{ ($action['primary'] ?? false) ? 'is-primary' : '' }}">
                        <x-filament::icon :icon="$action['icon']" class="pa-action-icon" />
                        <span>{{ $action['label'] }}</span>
                    </a>
                @endforeach
            </div>
        </div>

        <div class="pa-strip">
            @foreach ($shortcuts as $shortcut)
                <a href="{{ $shortcut['url'] }}" wire:navigate class="pa-cell {{ $shortcut['value'] ? 'has-work' : '' }}">
                    <span class="pa-cell-icon"><x-filament::icon :icon="$shortcut['icon']" /></span>
                    <span class="pa-cell-text">
                        <span class="pa-cell-value">{{ number_format($shortcut['value']) }}</span>
                        <span class="pa-cell-label">{{ $shortcut['label'] }}</span>
                    </span>
                    <x-filament::icon icon="heroicon-m-chevron-right" class="pa-cell-arrow" />
                </a>
            @endforeach
        </div>
    </div>
</x-filament-widgets::widget>
