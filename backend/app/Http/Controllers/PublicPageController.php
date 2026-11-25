<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\V1\PostController;
use App\Models\Post;
use App\Services\ExamPages;
use App\Services\NoticePages;
use App\Services\PageShell;
use App\Services\PastPapers;
use App\Services\PublicPage;
use App\Services\PublicPages;
use App\Services\QuestionPages;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;

/**
 * The website's public pages with their real content in the HTML. React then takes over with the same content.
 */
class PublicPageController extends Controller
{
    /** Pages of the app itself: served as they are, never shown in search results. */
    private const PRIVATE_PATHS = ['app', 'app/*', 'login', 'signup', 'onboarding', 'bcs-papers', 'bcs-papers/*'];

    /** Never answered with a web page. */
    private const OTHER_PATHS = ['api', 'api/*', 'admin', 'admin/*', 'livewire*', 'filament/*', 'storage/*', 'build/*', 'assets/*', 'css/*', 'js/*', 'fonts/*', 'vendor/*'];

    public function home(Request $request): Response|RedirectResponse
    {
        if (PageShell::path() === null) {
            return redirect('/admin');
        }

        return $this->page($request, function (): PublicPage {
            $content = PageShell::content();

            return new PublicPage(
                path: '/',
                title: 'Free BCS & Govt Job Exam Preparation | বিসিএস প্রস্তুতি – bd3schools',
                description: 'Free BCS, NTRCA, Primary & bank job exam prep in Bangladesh. বিসিএস প্রশ্ন সমাধান, মডেল টেস্ট ও চাকরির নোটিশ।',
                view: 'seo.home',
                viewData: [
                    'content' => $content,
                    'notices' => $this->notices()->take(10),
                    'posts' => $this->posts()->take(3),
                    'papers' => collect(PastPapers::numbers())->take(8)->map(fn (int $number): array => ['name' => PastPapers::source($number), 'path' => ExamPages::paperPath($number)]),
                ],
                data: ['notices' => $this->notices()->take(30)->values()],
            );
        });
    }

    public function blog(Request $request): Response|RedirectResponse
    {
        return $this->page($request, fn (): PublicPage => new PublicPage(
            path: '/blog',
            title: 'BCS Preparation Blog & Guides | বিসিএস প্রস্তুতি ব্লগ | bd3schools',
            description: 'Free guides and BCS question solutions with explanations. ১০ম থেকে ৪৮তম বিসিএস প্রশ্ন সমাধান, সিলেবাস, নম্বর বণ্টন ও প্রস্তুতির কৌশল — বিনামূল্যে।',
            view: 'seo.blog',
            viewData: ['posts' => $this->posts()],
            crumbs: ['Home' => '/', 'Blog' => '/blog'],
            data: ['blog' => (new PostController)->index()->getData(true)],
        ));
    }

    public function post(Request $request, string $slug): Response|RedirectResponse
    {
        return $this->page($request, function () use ($slug): ?PublicPage {
            $post = Post::query()->published()->firstWhere('slug', $slug);

            if (! $post) {
                return null;
            }

            $article = $post->toWebsite(withBody: true);
            $related = $this->relatedPosts($post)->map(fn (Post $other): array => $other->toWebsite())->all();
            $path = "/blog/{$slug}";

            return new PublicPage(
                path: $path,
                title: PublicPage::fit((string) preg_replace('/\s*[|—–-]\s*bd3schools.*$/u', '', $article['meta_title']), 62).' | bd3schools',
                description: $article['meta_description'],
                view: 'seo.post',
                viewData: ['post' => $article, 'related' => $related],
                lang: $post->lang,
                type: 'article',
                image: $article['cover_image'],
                jsonLd: [
                    PublicPage::article($path, $article['title'], $article['meta_description'], $article['published_at'], $article['updated_at'], $article['cover_image'], $post->lang),
                ],
                crumbs: ['Home' => '/', 'Blog' => '/blog', $article['title'] => $path],
                data: ["blog-{$slug}" => ['data' => $article, 'related' => $related]],
            );
        });
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function notices(): Collection
    {
        return NoticePages::all()->take(NoticePages::PRELOADED);
    }

    public function calendar(Request $request): Response|RedirectResponse
    {
        return $this->page($request, fn (): PublicPage => new PublicPage(
            path: '/calendar',
            title: 'Govt Exam Calendar | সরকারি চাকরির পরীক্ষার তারিখ | bd3schools',
            description: 'Upcoming BCS, bank, NTRCA and Primary exam dates and application deadlines from official notices. পরীক্ষার তারিখ ও আবেদনের শেষ সময়।',
            view: 'seo.calendar',
            viewData: ['notices' => $this->notices()->filter(fn (array $n): bool => $n['applyUntil'] || $n['examDate'])->sortBy(fn (array $n): string => $n['applyUntil'] ?: $n['examDate'])],
            crumbs: ['Home' => '/', 'Exam calendar' => '/calendar'],
            data: ['notices' => $this->notices()],
        ));
    }

    public function exams(Request $request): Response|RedirectResponse
    {
        return $this->page($request, fn (): ?PublicPage => ($exams = PageShell::content()['exams'] ?? null) ? new PublicPage(
            path: '/exams',
            title: 'Govt Job Exam Syllabus & Marks | সরকারি চাকরির পরীক্ষা | bd3schools',
            description: 'Exam format, marks and syllabus for BCS, NTRCA, Primary, Combined Bank and Bangladesh Bank. পরীক্ষার ধরন, নম্বর বণ্টন ও সিলেবাস — বিনামূল্যে।',
            view: 'seo.exams',
            viewData: ['exams' => $exams],
            crumbs: ['Home' => '/', 'Exams' => '/exams'],
        ) : null);
    }

    public function exam(Request $request, string $slug): Response|RedirectResponse
    {
        return $this->page($request, function () use ($slug): ?PublicPage {
            $exam = collect(PageShell::content()['exams'] ?? [])->firstWhere('slug', $slug);

            return $exam ? new PublicPage(
                path: "/exams/{$slug}",
                title: "{$exam['name']} Syllabus & Marks | সিলেবাস ও নম্বর | bd3schools",
                description: "{$exam['nameBn']} সিলেবাস ও নম্বর বণ্টন। {$exam['name']}: {$exam['summary']}",
                view: 'seo.exam',
                viewData: ['exam' => $exam, 'questionsPath' => ExamPages::examPath($slug), 'notices' => $this->notices()->where('exam', $slug)->take(5)],
                crumbs: ['Home' => '/', 'Exams' => '/exams', $exam['name'] => "/exams/{$slug}"],
                data: ['notices' => $this->notices()],
            ) : null;
        });
    }

    public function daily(Request $request): Response|RedirectResponse
    {
        return $this->page($request, fn (): PublicPage => new PublicPage(
            path: '/daily',
            title: "Today's BCS Quiz: 10 Free MCQ Questions | আজকের কুইজ | bd3schools",
            description: 'Take a free 10-question BCS, bank, NTRCA and Primary quiz with explanations. No sign-up. আজকের ফ্রি বিসিএস কুইজ, ব্যাখ্যাসহ।',
            view: 'seo.daily',
            viewData: ['daily' => PageShell::content()['daily'] ?? []],
            crumbs: ['Home' => '/', 'Daily quiz' => '/daily'],
        ));
    }

    /**
     * Pages written entirely by Laravel (see PublicPages).
     */
    public function serverPage(Request $request): Response|RedirectResponse
    {
        $address = PublicPages::address($request->getPathInfo(), $request->query());

        // One address per page: "?page=1" and the like lead to it.
        if ($request->getPathInfo() === '/notices' && $request->hasAny(['page', 'category'])
            && PublicPages::address('/notices', $request->only(['page', 'category'])) !== '/notices?'.http_build_query(array_filter($request->only(['category', 'page'])))) {
            return redirect($address, 301);
        }

        return $this->page($request, fn (): ?PublicPage => PublicPages::resolve($address), $address);
    }

    public function legal(Request $request): Response|RedirectResponse
    {
        $key = trim($request->path(), '/');

        return $this->page($request, function () use ($key): ?PublicPage {
            $legal = PageShell::content()['legal'] ?? null;
            $section = $legal['pages'][$key] ?? null;

            return $section ? new PublicPage(
                path: "/{$key}",
                title: $section['seo'],
                description: $section['description'],
                view: 'seo.legal',
                viewData: ['section' => $section, 'updated' => $legal['updated']],
                crumbs: ['Home' => '/', $section['title'][0] => "/{$key}"],
            ) : null;
        });
    }

    /**
     * Anything else: the app's own pages as they are (not for search engines), or a real "not found".
     */
    public function fallback(Request $request): Response|RedirectResponse
    {
        abort_if($request->is(...self::OTHER_PATHS) || PageShell::path() === null, 404);

        if ($request->is(...self::PRIVATE_PATHS)) {
            return $this->respond((string) file_get_contents((string) PageShell::path()))->header('X-Robots-Tag', 'noindex');
        }

        if ($request->is('index.html')) {
            return redirect('/', 301);
        }

        return $this->notFound();
    }

    /**
     * @param  callable(): ?PublicPage  $build
     */
    private function page(Request $request, callable $build, ?string $address = null): Response|RedirectResponse
    {
        $path = $request->getPathInfo();

        if ($path !== '/' && str_ends_with($path, '/')) {
            return redirect(rtrim($path, '/'), 301);
        }

        if ($moved = ExamPages::moved($path) ?? QuestionPages::moved($path)) {
            return redirect($moved, 301);
        }

        abort_if(PageShell::path() === null, 404);

        $html = PageShell::html($address ?? $path, $build);

        return $html === null ? $this->notFound() : $this->respond($html);
    }

    private function notFound(): Response
    {
        return $this->respond(PageShell::render(new PublicPage(
            path: '/404',
            title: 'Page not found | bd3schools',
            description: 'This page does not exist.',
            view: 'seo.not-found',
            index: false,
        )), 404);
    }

    private function respond(string $html, int $status = 200): Response
    {
        return response($html, $status)
            ->header('Content-Type', 'text/html; charset=utf-8')
            ->header('Cache-Control', 'no-cache');
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function posts(): Collection
    {
        return Post::query()->published()->orderByDesc('is_featured')->orderByDesc('published_at')->orderByDesc('id')->get()
            ->map(fn (Post $post): array => $post->toWebsite());
    }

    /**
     * @return Collection<int, Post>
     */
    private function relatedPosts(Post $post): Collection
    {
        return Post::query()->published()->whereKeyNot($post->id)->orderByRaw('category = ? desc', [$post->category])->orderByDesc('published_at')->limit(3)->get();
    }
}
