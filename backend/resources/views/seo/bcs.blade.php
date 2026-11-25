@php $bn = \App\Services\Bangla::digits(...); @endphp
<div class="bn mx-auto max-w-5xl px-4 py-6 md:py-10" lang="bn">
    @include('seo.partials.crumbs')
    <h1 class="text-[1.5rem] leading-snug font-bold md:text-[2.1rem]">বিসিএস প্রশ্ন ব্যাংক ও সমাধান <span class="block text-lg font-semibold text-muted-foreground md:text-xl">BCS Question Bank: 10th to {{ $latest }}th BCS Question Solution</span></h1>
    @include('seo.partials.updated')
    <p class="mt-4 leading-relaxed">১০ম থেকে {{ \App\Services\Bangla::ordinal($latest) }} বিসিএস প্রিলিমিনারি পরীক্ষার {{ $bn(number_format($total)) }}টি প্রশ্ন সঠিক উত্তরসহ এখানে আছে; এর মধ্যে {{ $bn(number_format($explained)) }}টির সঙ্গে ব্যাখ্যাও দেওয়া আছে। যে বিসিএসের প্রশ্ন দেখতে চান, নিচের তালিকা থেকে বেছে নিন। সব বিনামূল্যে, অ্যাকাউন্ট ছাড়াই পড়া যায়।</p>
    <p class="mt-2 text-sm leading-relaxed text-muted-foreground" lang="en">Every BCS preliminary paper from the 10th to the {{ $latest }}th, with the correct answer to each question and an explanation where we have one. Free to read, with no account needed.</p>
    @include('seo.partials.share', ['path' => '/bcs', 'title' => 'বিসিএস প্রশ্ন ব্যাংক ও সমাধান'])

    <h2 class="mt-9 text-xl font-bold">বিসিএস অনুযায়ী প্রশ্ন সমাধান (BCS question solution by year)</h2>
    <div class="card mt-3 overflow-x-auto">
        <table class="w-full text-sm">
            <thead><tr class="border-b text-left"><th class="px-4 py-3">বিসিএস</th><th class="px-3 py-3">সাল</th><th class="px-3 py-3">প্রশ্ন</th><th class="px-3 py-3">ব্যাখ্যা</th></tr></thead>
            <tbody>
                @foreach ($papers as $paper)
                    <tr class="border-b last:border-0">
                        <td class="px-4 py-2.5"><a href="{{ $paper['path'] }}" class="font-semibold text-primary">{{ $paper['name_bn'] }} প্রশ্ন সমাধান</a> <span class="text-muted-foreground" lang="en">({{ $paper['name'] }}{{ $paper['special'] ? ', special' : '' }})</span></td>
                        <td class="px-3 py-2.5">{{ $bn($paper['year']) }}</td>
                        <td class="px-3 py-2.5">{{ $bn($paper['questions']) }}</td>
                        <td class="px-3 py-2.5">{{ $bn($paper['explained']) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <h2 class="mt-9 text-xl font-bold">বিষয়ভিত্তিক বিসিএস প্রশ্ন (subject-wise BCS questions)</h2>
    <ul class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        @foreach ($subjects as $subject)
            <li class="card p-4"><a href="{{ $subject['path'] }}" class="font-bold text-primary">{{ $subject['name_bn'] }}</a> <span class="text-sm text-muted-foreground" lang="en">{{ $subject['name'] }}</span><span class="block text-sm text-muted-foreground">{{ $bn($subject['questions']) }}টি প্রশ্ন</span></li>
        @endforeach
    </ul>

    <h2 class="mt-9 text-xl font-bold">যেভাবে ব্যবহার করবেন</h2>
    <ol class="mt-3 list-decimal space-y-2 pl-6 leading-relaxed">
        <li>প্রথমে সাম্প্রতিক একটি বিসিএসের পুরো প্রশ্নপত্র দেখুন, যাতে কোন বিষয় থেকে কয়টি প্রশ্ন আসে তা বোঝা যায়।</li>
        <li>যে বিষয়ে দুর্বল, সেই বিষয়ের পাতায় গিয়ে বিভিন্ন বিসিএসের প্রশ্ন একসঙ্গে পড়ুন।</li>
        <li>একই প্রশ্ন একাধিক বিসিএসে এলে প্রশ্নের নিচে সেই বিসিএসের নাম ও সাল লেখা থাকে; এগুলো আগে শেষ করুন।</li>
        <li>শেষে অ্যাপে <a href="/bcs-papers" class="font-semibold text-primary">পুরো প্রশ্নপত্র সময় ধরে অনুশীলন করুন</a> বা <a href="/model-tests" class="font-semibold text-primary">মডেল টেস্ট</a> দিন।</li>
    </ol>

    @if ($exam)
        <h2 class="mt-9 text-xl font-bold">বিসিএস সিলেবাস ও নম্বর বণ্টন (BCS syllabus and marks)</h2>
        @include('seo.partials.exam-format')
    @endif
    @if ($tests->isNotEmpty())
        <h2 class="mt-9 text-xl font-bold">বিসিএস মডেল টেস্ট (BCS model tests)</h2>
        @include('seo.partials.tests')
        <p class="mt-3"><a href="/model-tests" class="font-semibold text-primary">সব মডেল টেস্ট</a></p>
    @endif
    @if ($notices->isNotEmpty())
        <h2 class="mt-9 text-xl font-bold">বিসিএস নোটিশ ও পরীক্ষার তারিখ</h2>
        <ul class="mt-3 grid gap-3 md:grid-cols-2">@foreach ($notices as $notice)@include('seo.partials.notice-card')@endforeach</ul>
    @endif
</div>
