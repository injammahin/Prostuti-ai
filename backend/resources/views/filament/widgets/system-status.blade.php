<x-filament-widgets::widget>
    <x-filament::section heading="Website status" description="Is everything set up and working?">
        <ul class="pa-status">
            @foreach ($checks as $check)
                <li class="pa-status-row">
                    <span class="pa-dot is-{{ $check['state'] }}" aria-hidden="true"></span>
                    <span class="pa-status-text">
                        <span class="pa-status-label">{{ $check['label'] }}</span>
                        <span class="pa-status-detail">{{ $check['detail'] }}</span>
                    </span>
                    @isset($check['url'])
                        <a href="{{ $check['url'] }}" wire:navigate class="pa-status-link">Manage</a>
                    @endisset
                </li>
            @endforeach
        </ul>
    </x-filament::section>
</x-filament-widgets::widget>
