<x-filament-widgets::widget>
    <div class="pa-strip is-compact">
        @foreach ($figures as $label => $value)
            <div class="pa-cell">
                <span class="pa-cell-text">
                    <span class="pa-cell-value">{{ $value }}</span>
                    <span class="pa-cell-label">{{ $label }}</span>
                </span>
            </div>
        @endforeach
    </div>
</x-filament-widgets::widget>
