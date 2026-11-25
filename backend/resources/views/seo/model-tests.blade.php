<div class="bn mx-auto max-w-5xl px-4 py-6 md:py-10" lang="bn">
    @include('seo.partials.crumbs')
    @if ($tests->isEmpty())
        <h1 class="text-[1.5rem] leading-snug font-bold md:text-[2.1rem]">ফ্রি বিসিএস মডেল টেস্ট <span class="block text-lg font-semibold text-muted-foreground md:text-xl">Free online BCS model tests</span></h1>
    @else
        <h1 class="text-[1.5rem] leading-snug font-bold md:text-[2.1rem]">ফ্রি মডেল টেস্ট: বিসিএস, এনটিআরসিএ, প্রাথমিক ও ব্যাংক <span class="block text-lg font-semibold text-muted-foreground md:text-xl">Free online model tests for BCS, NTRCA, Primary and bank jobs</span></h1>
    @endif
    <p class="mt-4 leading-relaxed">সময় ধরে, নেগেটিভ মার্কিংসহ পুরো পরীক্ষার মতো অনুশীলন করুন। পরীক্ষা শেষে সঙ্গে সঙ্গে নম্বর ও প্রতিটি প্রশ্নের সঠিক উত্তর দেখা যায়। সব বিনামূল্যে; অতিথি হিসেবেও দেওয়া যায়, অ্যাকাউন্ট থাকলে ফলাফল জমা থাকে।</p>
    <p class="mt-2 text-sm leading-relaxed text-muted-foreground" lang="en">Practise with a time limit and negative marking, like the real exam. You see your score and the right answer to every question as soon as you finish. Free, and open to guests.</p>
    <p class="mt-5 flex flex-wrap gap-3">
        @if ($tests->isNotEmpty())
            <a href="/app/model-test" class="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground">মডেল টেস্ট শুরু করুন</a>
        @endif
        <a href="/bcs-papers" @class(['inline-flex h-11 items-center rounded-full px-6 font-semibold', 'border' => $tests->isNotEmpty(), 'bg-primary text-primary-foreground' => $tests->isEmpty()])>বিসিএসের পুরো প্রশ্নপত্রে পরীক্ষা দিন</a>
        <a href="/app/practice" class="inline-flex h-11 items-center rounded-full border px-6 font-semibold">বিষয়ভিত্তিক অনুশীলন</a>
    </p>
    @foreach ($tests as $slug => $own)
        <h2 class="mt-9 text-xl font-bold">{{ $exams[$slug]['nameBn'] ?? $slug }} <span class="text-muted-foreground" lang="en">({{ $exams[$slug]['name'] ?? $slug }} model test)</span></h2>
        @include('seo.partials.tests', ['tests' => $own, 'details' => true])
        @if ($path = \App\Services\ExamPages::examPath($slug))
            <p class="mt-3"><a href="{{ $path }}" class="font-semibold text-primary">প্রশ্ন ও সমাধান দেখুন</a> · <a href="/exams/{{ $slug }}" class="font-semibold text-primary">সিলেবাস ও নম্বর বণ্টন</a></p>
        @endif
    @endforeach
    <h2 class="mt-9 text-xl font-bold">পুরো বিসিএস প্রশ্নপত্রে মডেল টেস্ট <span class="text-muted-foreground" lang="en">(full BCS papers)</span></h2>
    <p class="mt-2 leading-relaxed">যেকোনো বিসিএসের প্রশ্ন নিয়ে সময় ধরে পরীক্ষা দিন। প্রশ্ন ও সমাধান আগে দেখে নিতে চাইলে বিসিএসের নামে চাপুন।</p>
    <ul class="mt-3 flex flex-wrap gap-2">
        @foreach ($papers as $paper)
            <li><a href="{{ $paper['path'] }}" class="inline-block rounded-full border px-3 py-1.5 text-sm">{{ $paper['name_bn'] }} <span class="text-muted-foreground">({{ \App\Services\Bangla::digits($paper['year']) }})</span></a></li>
        @endforeach
    </ul>
    <h2 class="mt-9 text-xl font-bold">কোন বিষয়ে প্রশ্ন থাকে <span class="text-muted-foreground" lang="en">(subjects)</span></h2>
    <p class="mt-2 leading-relaxed">বিসিএস প্রিলিমিনারির পুরো পরীক্ষায় বাংলা ভাষা ও সাহিত্য, ইংরেজি ভাষা ও সাহিত্য, বাংলাদেশ বিষয়াবলি, আন্তর্জাতিক বিষয়াবলি, ভূগোল ও পরিবেশ, সাধারণ বিজ্ঞান, কম্পিউটার ও তথ্যপ্রযুক্তি, গাণিতিক যুক্তি, মানসিক দক্ষতা এবং নৈতিকতা ও সুশাসন থেকে প্রশ্ন আসে। পুরো পরীক্ষা ২০০ নম্বরের, সময় দুই ঘণ্টা, প্রতিটি ভুল উত্তরে ০.৫ নম্বর কাটা যায়।</p>
    <p class="mt-2 text-sm leading-relaxed text-muted-foreground" lang="en">A full BCS preliminary test covers Bangla, English, Bangladesh and international affairs, geography, science, ICT, mathematics, mental ability and ethics. It has 200 marks in two hours, and 0.5 is deducted for each wrong answer. Weak in one subject? Read it first on its <a href="/bcs" class="font-semibold text-primary">subject page</a>, then sit the test again.</p>
    <h2 class="mt-9 text-xl font-bold">মডেল টেস্ট দেওয়ার নিয়ম</h2>
    <ul class="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
        <li>শুরু করার পর সময় চলতে থাকে; সময় শেষ হলে উত্তরপত্র নিজে থেকেই জমা হয়।</li>
        <li>ভুল উত্তরে নম্বর কাটা যায়, না জানা প্রশ্ন ছেড়ে দিলে নম্বর কাটা যায় না।</li>
        <li>ফলাফলের পাতায় ভুল প্রশ্নগুলো দেখে সেই বিষয় আবার পড়ুন, তারপর নতুন টেস্ট দিন।</li>
    </ul>
    <p class="mt-5">প্রতিদিন ১০টি প্রশ্নের ছোট অনুশীলনের জন্য <a href="/daily" class="font-semibold text-primary">আজকের কুইজ</a> দেখুন।</p>
</div>
