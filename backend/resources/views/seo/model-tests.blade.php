<div class="bn mx-auto max-w-5xl px-4 py-6 md:py-10" lang="bn">
    @include('seo.partials.crumbs', ['items' => ['Home' => '/', 'Model tests' => '']])
    <h1 class="text-[1.5rem] leading-snug font-bold md:text-[2.1rem]">ফ্রি মডেল টেস্ট: বিসিএস, এনটিআরসিএ, প্রাথমিক ও ব্যাংক <span class="block text-lg font-semibold text-muted-foreground md:text-xl">Free online model tests for BCS, NTRCA, Primary and bank jobs</span></h1>
    <p class="mt-4 leading-relaxed">সময় ধরে, নেগেটিভ মার্কিংসহ পুরো পরীক্ষার মতো মডেল টেস্ট দিন। পরীক্ষা শেষে সঙ্গে সঙ্গে নম্বর, বিষয়ভিত্তিক ফলাফল ও প্রতিটি প্রশ্নের সঠিক উত্তর দেখা যায়। সব বিনামূল্যে; অতিথি হিসেবেও দেওয়া যায়, অ্যাকাউন্ট থাকলে ফলাফল জমা থাকে।</p>
    <p class="mt-2 text-sm leading-relaxed text-muted-foreground" lang="en">Each test uses the real exam's time limit and negative marking. You see your score, the result by subject and the right answer to every question as soon as you finish.</p>
    <p class="mt-5"><a href="/app/model-test" class="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground">মডেল টেস্ট শুরু করুন</a></p>
    @foreach ($tests as $slug => $own)
        <h2 class="mt-9 text-xl font-bold">{{ $exams[$slug]['nameBn'] ?? $slug }} <span class="text-muted-foreground" lang="en">({{ $exams[$slug]['name'] ?? $slug }} model test)</span></h2>
        @include('seo.partials.tests', ['tests' => $own, 'details' => true])
        @if ($path = \App\Services\ExamPages::examPath($slug))
            <p class="mt-3"><a href="{{ $path }}" class="font-semibold text-primary">প্রশ্ন ও সমাধান দেখুন</a> · <a href="/exams/{{ $slug }}" class="font-semibold text-primary">সিলেবাস ও নম্বর বণ্টন</a></p>
        @endif
    @endforeach
    <h2 class="mt-9 text-xl font-bold">মডেল টেস্ট দেওয়ার নিয়ম</h2>
    <ul class="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
        <li>শুরু করার পর সময় চলতে থাকে; সময় শেষ হলে উত্তরপত্র নিজে থেকেই জমা হয়।</li>
        <li>ভুল উত্তরে নম্বর কাটা যায়, না জানা প্রশ্ন ছেড়ে দিলে নম্বর কাটা যায় না।</li>
        <li>ফলাফলের পাতায় ভুল প্রশ্নগুলো দেখে সেই বিষয় আবার পড়ুন, তারপর নতুন টেস্ট দিন।</li>
    </ul>
    <p class="mt-5">প্রতিদিন ১০টি প্রশ্নের ছোট অনুশীলনের জন্য <a href="/daily" class="font-semibold text-primary">আজকের কুইজ</a> দেখুন।</p>
</div>
