<x-filament-widgets::widget>
    <x-filament::section heading="Top pages" description="Most visited pages in the last 7 days">
        @if ($pages->isEmpty())
            <p style="font-size: .875rem; color: var(--gray-500);">No visits recorded yet. They appear here as soon as people open the website.</p>
        @else
            <div style="display: flex; flex-direction: column; gap: .8rem;">
                @foreach ($pages as $page)
                    <div>
                        <div style="display: flex; justify-content: space-between; gap: .75rem; font-size: .875rem; margin-bottom: .3rem;">
                            <span style="font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="{{ $page->path }}">{{ $page->path }}</span>
                            <span style="flex-shrink: 0; color: var(--gray-500); font-variant-numeric: tabular-nums;">
                                {{ number_format($page->views) }} views · {{ number_format($page->visitors) }} people
                            </span>
                        </div>
                        <div style="height: 6px; border-radius: 999px; background: color-mix(in oklab, var(--gray-400) 18%, transparent); overflow: hidden;">
                            <div style="height: 100%; border-radius: 999px; background: var(--primary-500); width: {{ round($page->views / $maxViews * 100) }}%;"></div>
                        </div>
                    </div>
                @endforeach
            </div>
        @endif

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
            <div>
                <p style="font-size: .7rem; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--gray-500); margin-bottom: .5rem;">Devices</p>
                @foreach (['mobile' => 'Mobile', 'desktop' => 'Desktop', 'tablet' => 'Tablet'] as $key => $label)
                    @php($count = (int) ($devices[$key] ?? 0))
                    <div style="display: flex; justify-content: space-between; padding: .2rem 0; font-size: .875rem;">
                        <span style="color: var(--gray-500);">{{ $label }}</span>
                        <span style="font-weight: 600; font-variant-numeric: tabular-nums;">{{ round($count / $deviceTotal * 100) }}%</span>
                    </div>
                @endforeach
            </div>
            <div>
                <p style="font-size: .7rem; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--gray-500); margin-bottom: .5rem;">Came from</p>
                @forelse ($sources as $source)
                    <div style="display: flex; justify-content: space-between; gap: .5rem; padding: .2rem 0; font-size: .875rem;">
                        <span style="color: var(--gray-500); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ $source->referrer }}</span>
                        <span style="font-weight: 600; font-variant-numeric: tabular-nums;">{{ number_format($source->visitors) }}</span>
                    </div>
                @empty
                    <p style="font-size: .875rem; color: var(--gray-500);">Direct visits only so far.</p>
                @endforelse
            </div>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
