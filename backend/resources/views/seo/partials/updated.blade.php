@if ($updated)
    <p class="mt-2 text-sm text-muted-foreground">bd3schools · সর্বশেষ হালনাগাদ (Last updated): <time datetime="{{ $updated->toIso8601String() }}">{{ \App\Services\Bangla::date($updated) }}</time></p>
@endif
