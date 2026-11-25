<x-filament-widgets::widget>
    <x-filament::section heading="Top pages" description="Most visited pages in the last 7 days">
        <div class="pa-split">
            <div class="pa-bars" style="grid-column: span 2 / span 2; min-width: 0;">
                @forelse ($pages as $page)
                    <div class="pa-bar-row">
                        <span class="pa-bar-name" title="{{ $page->path }}">{{ $page->path }}</span>
                        <span class="pa-bar-value">
                            {{ number_format($page->views) }} <span class="pa-bar-note">views · {{ number_format($page->visitors) }} people</span>
                        </span>
                        <span class="pa-bar-track"><span class="pa-bar-fill" style="width: {{ round($page->views / $maxViews * 100) }}%;"></span></span>
                    </div>
                @empty
                    <p class="pa-empty">No visits recorded yet. They appear here as soon as people open the website.</p>
                @endforelse
            </div>

            <div class="pa-list">
                <p class="pa-list-title">Devices</p>
                @foreach (['mobile' => 'Mobile', 'desktop' => 'Desktop', 'tablet' => 'Tablet'] as $key => $label)
                    <div class="pa-list-row">
                        <span class="pa-list-name">{{ $label }}</span>
                        <span class="pa-list-value">{{ round((int) ($devices[$key] ?? 0) / $deviceTotal * 100) }}%</span>
                    </div>
                @endforeach
            </div>

            <div class="pa-list">
                <p class="pa-list-title">Came from</p>
                @forelse ($sources as $source)
                    <div class="pa-list-row">
                        <span class="pa-list-name" title="{{ $source->referrer }}">{{ $source->referrer }}</span>
                        <span class="pa-list-value">{{ number_format($source->visitors) }}</span>
                    </div>
                @empty
                    <p class="pa-empty">Direct visits only so far.</p>
                @endforelse
            </div>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
