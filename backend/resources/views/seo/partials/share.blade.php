@php
    $shareUrl = \App\Services\PublicPage::absolute($path);
    $shareClass = 'inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-semibold';
@endphp
<p class="no-print mt-5 flex flex-wrap items-center gap-2">
    <span class="bn text-sm text-muted-foreground" lang="bn">শেয়ার করুন</span>
    <a href="https://www.facebook.com/sharer/sharer.php?u={{ rawurlencode($shareUrl) }}" target="_blank" rel="noopener" class="{{ $shareClass }}">Facebook</a>
    <a href="https://wa.me/?text={{ rawurlencode("{$title} {$shareUrl}") }}" target="_blank" rel="noopener" class="{{ $shareClass }}">WhatsApp</a>
    <a href="https://t.me/share/url?url={{ rawurlencode($shareUrl) }}&amp;text={{ rawurlencode($title) }}" target="_blank" rel="noopener" class="{{ $shareClass }}">Telegram</a>
    <button type="button" data-copy="{{ $shareUrl }}" data-done="কপি হয়েছে" class="bn {{ $shareClass }}" lang="bn">লিংক কপি</button>
</p>
