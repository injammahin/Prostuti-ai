<div class="mx-auto max-w-6xl px-4 py-6 md:py-10">
    @include('seo.partials.crumbs')
    <h1 class="text-[1.35rem] leading-tight font-bold md:text-[1.7rem]">Blog</h1>
    <p class="mt-1 text-sm text-muted-foreground">Guides, syllabus breakdowns and exam strategy for BCS and govt job exams.</p>
    <ul class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        @foreach ($posts as $post)
            <li class="card p-5">
                <h2 class="bn font-bold" lang="{{ $post['lang'] }}"><a href="{{ $post['url'] }}">{{ $post['title'] }}</a></h2>
                <p class="bn mt-1.5 text-sm text-muted-foreground">{{ $post['excerpt'] }}</p>
            </li>
        @endforeach
    </ul>
</div>
