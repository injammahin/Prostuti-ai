<div class="mx-auto max-w-4xl px-4 py-6 md:py-10">
    @include('seo.partials.crumbs', ['items' => ['Home' => '/', 'Exams' => '/exams', $exam['name'] => '']])
    <h1 class="text-[1.35rem] leading-tight font-bold md:text-[1.7rem]">{{ $exam['name'] }} <span class="bn" lang="bn">({{ $exam['nameBn'] }})</span></h1>
    <p class="mt-1 text-sm text-muted-foreground">{{ $exam['org'] }} · Syllabus: {{ $exam['syllabusVersion'] }}</p>
    <p class="mt-4 leading-relaxed">{{ $exam['summary'] }}</p>
    @foreach ($exam['stages'] as $stage)
        <section class="card mt-6 p-4 sm:p-6">
            <h2 class="text-xl font-semibold">{{ $exam['name'] }} — {{ $stage['type'] }}</h2>
            <p class="mt-2 text-sm">Total marks: {{ $stage['marks'] }} · Time: {{ $stage['duration'] }} · Negative: {{ $stage['negative'] }} · Pass: {{ $stage['pass'] }}</p>
            @if ($stage['subjects'])
                <table class="mt-4 w-full border-collapse text-sm">
                    <thead><tr><th class="border px-3 py-2 text-left">Subject / বিষয়ের নাম</th><th class="border px-3 py-2">Marks / নম্বর</th></tr></thead>
                    <tbody>
                        @foreach ($stage['subjects'] as [$name, $nameBn, $marks])
                            <tr><td class="border px-3 py-2">{{ $name }} <span class="bn" lang="bn">({{ $nameBn }})</span></td><td class="border px-3 py-2 text-center">{{ $marks }}</td></tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </section>
    @endforeach
    @if ($notices->isNotEmpty())
        <h2 class="mt-8 mb-3 font-semibold">Notices</h2>
        <ul class="space-y-3">@foreach ($notices as $notice)@include('seo.partials.notice-card')@endforeach</ul>
    @endif
</div>
