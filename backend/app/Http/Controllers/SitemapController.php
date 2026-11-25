<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use App\Models\Post;
use App\Services\ExamPages;
use App\Services\PageShell;
use App\Services\PublicPage;
use App\Services\QuestionPages;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * The sitemap: an index and one file per kind of page, with the date each page's content really changed.
 */
class SitemapController extends Controller
{
    public const SECTIONS = ['pages', 'bcs', 'questions', 'notices', 'blog'];

    public function index(): Response
    {
        return $this->xml('index', fn (): string => view('seo.sitemap-index', [
            'sitemaps' => collect(self::SECTIONS)
                ->mapWithKeys(fn (string $section): array => [$section => $this->urls($section)])
                ->filter(fn (Collection $urls): bool => $urls->isNotEmpty())
                ->mapWithKeys(fn (Collection $urls, string $section): array => [PublicPage::absolute("/sitemap-{$section}.xml") => $urls->filter()->max()]),
        ])->render());
    }

    public function section(string $section): Response
    {
        return $this->xml($section, fn (): string => view('seo.sitemap', [
            'urls' => $this->urls($section)->mapWithKeys(fn (?Carbon $changed, string $path): array => [PublicPage::absolute($path) => $changed]),
        ])->render());
    }

    /**
     * @return Collection<string, Carbon|null> path => last change, where known
     */
    private function urls(string $section): Collection
    {
        return match ($section) {
            'pages' => $this->pages(),
            'bcs' => ExamPages::paths()->filter(fn (Carbon $changed, string $path): bool => $path === '/bcs' || str_starts_with($path, '/bcs/')),
            'questions' => QuestionPages::paths(),
            'notices' => $this->notices(),
            'blog' => $this->posts(),
        };
    }

    /**
     * @return Collection<string, Carbon|null>
     */
    private function pages(): Collection
    {
        $notices = $this->notices()->max();
        $content = PageShell::content();
        $legal = isset($content['legal']['updated']) ? Carbon::parse($content['legal']['updated']) : null;

        return collect([
            '/' => collect([$notices, $this->posts()->max()])->filter()->max(),
            '/blog' => Post::query()->published()->get(['updated_at'])->max('updated_at'),
            '/notices' => $notices,
            '/calendar' => $notices,
            '/daily' => null,
            '/exams' => null,
            '/contact' => null,
            ...collect($content['exams'] ?? [])->mapWithKeys(fn (array $exam): array => ["/exams/{$exam['slug']}" => null]),
            ...ExamPages::paths()->reject(fn (Carbon $changed, string $path): bool => $path === '/bcs' || str_starts_with($path, '/bcs/')),
            ...collect($content['legal']['pages'] ?? [])->map(fn (): ?Carbon => $legal)->mapWithKeys(fn (?Carbon $changed, string $key): array => ["/{$key}" => $changed]),
        ]);
    }

    /**
     * @return Collection<string, Carbon|null>
     */
    private function notices(): Collection
    {
        return Notice::query()->published()->orderByDesc('published_on')->get(['slug', 'updated_at'])->toBase()
            ->mapWithKeys(fn (Notice $notice): array => ["/notices/{$notice->slug}" => $notice->updated_at]);
    }

    /**
     * @return Collection<string, Carbon|null>
     */
    private function posts(): Collection
    {
        return Post::query()->published()->orderByDesc('published_at')->get(['slug', 'updated_at'])->toBase()
            ->filter(fn (Post $post): bool => $post->path() === "/blog/{$post->slug}")
            ->mapWithKeys(fn (Post $post): array => [$post->path() => $post->updated_at]);
    }

    /**
     * @param  callable(): string  $build
     */
    private function xml(string $key, callable $build): Response
    {
        return response(PageShell::remember("sitemap:{$key}", $build))
            ->header('Content-Type', 'application/xml; charset=utf-8')
            ->header('Cache-Control', 'public, max-age=3600');
    }
}
