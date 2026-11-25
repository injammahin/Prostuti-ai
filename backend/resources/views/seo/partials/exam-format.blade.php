@foreach ($exam['stages'] as $stage)
    @if ($stage['subjects'])
        <section class="card mt-5 p-4 sm:p-6">
            <h3 class="font-bold"><span class="bn" lang="bn">{{ $exam['nameBn'] }}</span> ({{ $exam['name'] }}) — {{ $stage['type'] }}</h3>
            <p class="mt-1 text-sm text-muted-foreground">Total marks: {{ $stage['marks'] }} · Time: {{ $stage['duration'] }} · Negative: {{ $stage['negative'] }} · Pass: {{ $stage['pass'] }}</p>
            <div class="mt-3 overflow-x-auto">
                <table class="w-full border-collapse text-sm">
                    <thead><tr><th class="border px-3 py-2 text-left">বিষয় / Subject</th><th class="border px-3 py-2">নম্বর / Marks</th></tr></thead>
                    <tbody>@foreach ($stage['subjects'] as [$name, $nameBn, $marks])<tr><td class="border px-3 py-2">{{ $nameBn }} ({{ $name }})</td><td class="border px-3 py-2 text-center">{{ $marks }}</td></tr>@endforeach</tbody>
                </table>
            </div>
        </section>
    @endif
@endforeach
<p class="mt-3 text-sm"><a href="/exams/{{ $exam['slug'] }}" class="font-semibold text-primary">{{ $exam['name'] }}: full syllabus and mark distribution</a></p>
