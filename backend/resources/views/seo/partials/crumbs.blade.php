<nav class="mb-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
    @foreach ($crumbs as $label => $href)
        @if (! $loop->last)
            <a href="{{ $href }}">{{ $label }}</a> <span aria-hidden="true">›</span>
        @else
            <span>{{ $label }}</span>
        @endif
    @endforeach
</nav>
