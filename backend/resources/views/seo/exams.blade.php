<div class="mx-auto max-w-5xl px-4 py-6 md:py-10">
    @include('seo.partials.crumbs', ['items' => ['Home' => '/', 'Exams' => '/exams']])
    <h1 class="text-[1.35rem] leading-tight font-bold md:text-[1.7rem]">Exam catalog</h1>
    <p class="mt-1 text-sm text-muted-foreground">Find every government exam that fits you. Follow to get alerts.</p>
    <ul class="mt-4 grid gap-3 md:grid-cols-2">
        @foreach ($exams as $exam)
            <li class="card p-4">
                <h2 class="font-semibold"><a href="/exams/{{ $exam['slug'] }}">{{ $exam['name'] }}</a></h2>
                <p class="bn text-sm text-muted-foreground" lang="bn">{{ $exam['nameBn'] }} · {{ $exam['orgShort'] }}</p>
                <p class="mt-2 text-sm text-muted-foreground">{{ $exam['summary'] }}</p>
            </li>
        @endforeach
    </ul>
</div>
