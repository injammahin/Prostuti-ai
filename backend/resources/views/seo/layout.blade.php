{{-- Shown until React starts, and what search engines read. React then renders the same content. --}}
<div class="flex min-h-dvh flex-col bg-white">
    <header>
        <div class="relative mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:h-[4.5rem]">
            <a href="/" class="text-[1.25rem] font-extrabold tracking-[-0.03em]">bd3schools</a>
            <nav class="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
                @foreach (['/daily' => 'Daily quiz', '/notices' => 'Notices', '/calendar' => 'Calendar', '/exams' => 'Exams', '/bcs' => 'BCS questions', '/blog' => 'Blog'] as $href => $label)
                    <a href="{{ $href }}" class="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground">{{ $label }}</a>
                @endforeach
            </nav>
        </div>
    </header>
    <main class="flex-1">@include($page->view, $page->viewData)</main>
    <footer class="mt-16 border-t">
        <nav class="mx-auto flex max-w-6xl flex-wrap gap-x-5 gap-y-2 px-4 py-8 text-sm text-muted-foreground" aria-label="Footer">
            @foreach (['/bcs' => 'BCS questions & solutions', '/ntrca' => 'NTRCA', '/primary-teacher' => 'Primary Teacher', '/bank-jobs' => 'Bank jobs', '/model-tests' => 'Model tests', '/exams' => 'Exam syllabus & marks', '/notices' => 'Notice board', '/calendar' => 'Exam calendar', '/blog' => 'Blog', '/about' => 'About bd3schools', '/privacy' => 'Privacy policy', '/terms' => 'Terms'] as $href => $label)
                <a href="{{ $href }}">{{ $label }}</a>
            @endforeach
        </nav>
    </footer>
</div>
