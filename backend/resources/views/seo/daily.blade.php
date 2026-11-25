<div class="mx-auto max-w-xl px-4 py-8 md:py-14">
    @include('seo.partials.crumbs')
    <div class="hero overflow-hidden rounded-3xl p-6 text-center md:p-9">
        <h1 class="mt-4 text-3xl font-bold md:text-4xl">Today's Quiz</h1>
        <p class="mx-auto mt-2 max-w-sm text-white/85">10 real exam questions from BCS, Bank, NTRCA &amp; Primary exams. See how you'd score today.</p>
        <p class="mt-4 text-sm">10 questions · About 5 min · No sign-up</p>
    </div>
    @foreach ($daily as [$heading, $headingBn, $text, $textBn])
        <section class="mt-6">
            <h2 class="text-lg font-bold">{{ $heading }} <span class="bn" lang="bn">({{ $headingBn }})</span></h2>
            <p class="mt-1.5 text-sm leading-relaxed">{{ $text }}</p>
            <p class="bn mt-1 text-sm leading-relaxed text-muted-foreground" lang="bn">{{ $textBn }}</p>
        </section>
    @endforeach
    <p class="mt-6 text-sm">More practice: <a href="/bcs" class="font-semibold text-primary">BCS questions</a> · <a href="/ntrca" class="font-semibold text-primary">NTRCA</a> · <a href="/primary-teacher" class="font-semibold text-primary">Primary</a> · <a href="/bank-jobs" class="font-semibold text-primary">Bank jobs</a> · <a href="/model-tests" class="font-semibold text-primary">Model tests</a></p>
</div>
