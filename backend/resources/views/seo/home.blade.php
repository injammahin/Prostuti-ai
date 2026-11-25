<section class="mx-auto max-w-6xl px-4 pt-8 pb-14 md:pt-14">
    <h1 class="mt-6 max-w-2xl text-[2.35rem] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[3.4rem] lg:text-[4rem]">Prepare smarter for <span class="text-primary">BCS</span> &amp; every govt job exam.</h1>
    <p class="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">Adaptive question drills, authentic timed model tests, spaced mistake revision, and verified exam dates — one beautifully simple app, made for your phone.</p>
    <p class="mt-8"><a href="/bcs" class="text-sm font-semibold text-primary">Previous BCS questions &amp; solutions — free</a></p>
    <div class="relative mx-auto mt-8 w-full max-w-[26.5rem]"><img src="/illustrations/study-desk.webp" srcset="/illustrations/study-desk-480.webp 480w, /illustrations/study-desk.webp 900w" sizes="(min-width: 448px) 424px, 92vw" alt="Student preparing at a desk" width="900" height="900" fetchpriority="high" class="aspect-square w-full object-contain"></div>
</section>
<section class="mx-auto max-w-6xl px-4 pt-10">
    <h2 class="text-2xl font-bold">Previous BCS questions &amp; solutions</h2>
    <p class="mt-1.5 text-muted-foreground">Every BCS preliminary paper, newest first. Read each question with its answer and explanation.</p>
    <ul class="mt-4 flex flex-wrap gap-2">
        @foreach ($papers as $paper)
            <li><a href="{{ $paper['path'] }}" class="inline-block rounded-full border px-3.5 py-1.5 text-sm font-semibold">{{ $paper['name'] }}</a></li>
        @endforeach
        <li><a href="/bcs" class="inline-block rounded-full border px-3.5 py-1.5 text-sm font-semibold text-primary">See all BCS papers</a></li>
    </ul>
</section>
<section class="mx-auto max-w-6xl px-4 pt-16">
    <h2 class="text-[1.8rem] font-semibold">Everything from circular to viva, in one place</h2>
    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @foreach ($content['features'] ?? [] as $feature)
            <div class="card p-6">
                <h3 class="text-lg font-bold">{{ $feature['title'] }}</h3>
                <p class="mt-1.5 text-sm text-muted-foreground">{{ $feature['text'] }}</p>
                <ul class="mt-3 space-y-1 text-sm">@foreach ($feature['points'] as $point)<li>{{ $point }}</li>@endforeach</ul>
            </div>
        @endforeach
    </div>
</section>
<section class="mx-auto max-w-6xl px-4 pt-16">
    <h2 class="text-[1.75rem] font-extrabold">Three steps to a better score</h2>
    <ol class="mt-5 space-y-3">
        @foreach ($content['steps'] ?? [] as $step)
            <li class="card p-4"><b>{{ $step[0] }}</b> <span class="text-sm text-muted-foreground">{{ $step[1] }}</span></li>
        @endforeach
    </ol>
</section>
<section class="mx-auto max-w-6xl px-4 pt-16">
    <h2 class="text-[1.05rem] font-bold">Latest verified notices</h2>
    <ul class="mt-3 grid gap-3 md:grid-cols-3">@foreach ($notices as $notice)@include('seo.partials.notice-card')@endforeach</ul>
</section>
<section class="mx-auto max-w-6xl px-4 pt-16">
    <h2 class="text-[1.05rem] font-bold">Exams we cover</h2>
    <ul class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        @foreach ($content['exams'] ?? [] as $exam)
            <li class="card p-4"><a href="/exams/{{ $exam['slug'] }}" class="font-bold">{{ $exam['name'] }}</a> <span class="bn block text-sm text-muted-foreground" lang="bn">{{ $exam['nameBn'] }}</span></li>
        @endforeach
    </ul>
</section>
<section class="mx-auto max-w-6xl px-4 pt-16">
    <h2 class="text-[1.05rem] font-bold">From the blog</h2>
    <ul class="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        @foreach ($posts as $post)
            <li class="card p-5"><a href="{{ $post['url'] }}" class="bn font-bold" lang="{{ $post['lang'] }}">{{ $post['title'] }}</a><p class="bn mt-1 text-sm text-muted-foreground">{{ $post['excerpt'] }}</p></li>
        @endforeach
    </ul>
</section>
<section class="mx-auto max-w-6xl px-4 pt-16">
    <h2 class="text-2xl font-extrabold">Questions?</h2>
    <div class="card mt-4 px-5">
        @foreach ($content['faqs'] ?? [] as $faq)
            <h3 class="pt-4 text-[0.95rem] font-semibold">{{ $faq[0] }}</h3>
            <p class="pb-4 text-muted-foreground">{{ $faq[1] }}</p>
        @endforeach
    </div>
</section>
