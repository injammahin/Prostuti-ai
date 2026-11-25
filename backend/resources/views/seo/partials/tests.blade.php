<ul class="mt-3 grid gap-3 sm:grid-cols-2">
    @foreach ($tests as $test)
        <li class="card p-4">
            <p class="bn font-bold" lang="bn">{{ $test['title_bn'] }}</p>
            <p class="text-sm">{{ $test['title'] }}</p>
            <p class="mt-1 text-sm text-muted-foreground">{{ $test['questions'] }} questions · {{ $test['minutes'] }} min · {{ $test['marks'] }} marks · −{{ $test['negative'] }} per wrong answer</p>
            @if ($test['syllabus'] && ($details ?? false))<p class="mt-1 text-xs text-muted-foreground">{{ $test['syllabus'] }}</p>@endif
        </li>
    @endforeach
</ul>
