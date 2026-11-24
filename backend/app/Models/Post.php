<?php

namespace App\Models;

use Database\Factories\PostFactory;
use Filament\Forms\Components\RichEditor\RichContentRenderer;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * A blog article shown on the website (/blog), written in the admin panel.
 */
#[Fillable(['slug', 'title', 'category', 'lang', 'excerpt', 'body', 'cover_image', 'author', 'tags', 'attachments', 'is_featured', 'meta_title', 'meta_description', 'published_at', 'is_published'])]
class Post extends Model
{
    /** @use HasFactory<PostFactory> */
    use HasFactory;

    /**
     * @var array<string, string>
     */
    public const CATEGORIES = [
        'guide' => 'Preparation guide',
        'bcs' => 'BCS',
        'bank' => 'Bank jobs',
        'ntrca' => 'NTRCA',
        'primary' => 'Primary teacher',
        'tips' => 'Study tips',
        'news' => 'News & updates',
    ];

    /**
     * @param  Builder<self>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', true)->whereNotNull('published_at')->where('published_at', '<=', now());
    }

    /** Roughly how long the article takes to read (about 200 words a minute). */
    public function readingMinutes(): int
    {
        return max(1, (int) ceil(str_word_count(strip_tags($this->body)) / 200));
    }

    /**
     * The fields the website needs; the full body only on the article page.
     *
     * @return array<string, mixed>
     */
    public function toWebsite(bool $withBody = false): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'category' => $this->category,
            'category_label' => self::CATEGORIES[$this->category] ?? Str::headline($this->category),
            'lang' => $this->lang,
            'excerpt' => $this->excerpt,
            'cover_image' => $this->coverUrl(),
            'author' => $this->author,
            'tags' => $this->tags ?? [],
            'meta_title' => $this->meta_title ?: $this->title,
            'meta_description' => $this->meta_description ?: Str::limit($this->excerpt, 160),
            'published_at' => $this->published_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'reading_minutes' => $this->readingMinutes(),
            'is_featured' => $this->is_featured,
            ...($withBody ? ['body' => $this->renderedBody(), 'attachments' => $this->downloadableFiles()] : []),
        ];
    }

    /**
     * The article as safe HTML: images added in the editor get their public URL,
     * and anything the editor doesn't support (e.g. scripts) is dropped.
     */
    public function renderedBody(): string
    {
        return RichContentRenderer::make($this->body)
            ->fileAttachmentsDisk('public')
            ->fileAttachmentsVisibility('public')
            ->toHtml();
    }

    /**
     * PDFs and other files attached for download.
     *
     * @return list<array{title: string, url: string, type: string, size: ?int}>
     */
    public function downloadableFiles(): array
    {
        return collect($this->attachments ?? [])
            ->filter(fn (array $file): bool => filled($file['file'] ?? null))
            ->map(fn (array $file): array => [
                'title' => $file['title'] ?? basename($file['file']),
                'url' => $this->publicUrl($file['file']),
                'type' => Str::upper(pathinfo($file['file'], PATHINFO_EXTENSION)),
                'size' => $file['size'] ?? (Storage::disk('public')->exists($file['file']) ? Storage::disk('public')->size($file['file']) : (file_exists(public_path(ltrim($file['file'], '/'))) ? filesize(public_path(ltrim($file['file'], '/'))) : null)),
            ])
            ->values()
            ->all();
    }

    private function coverUrl(): ?string
    {
        return blank($this->cover_image) ? null : $this->publicUrl($this->cover_image);
    }

    /** Uploads live on the public disk; full URLs and site paths are used as they are. */
    private function publicUrl(string $path): string
    {
        if (Str::startsWith($path, ['http://', 'https://', '/'])) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'attachments' => 'array',
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
            'is_published' => 'boolean',
        ];
    }
}
