<div class="bn mx-auto max-w-2xl px-4 py-6 md:py-10" lang="bn">
    @include('seo.partials.crumbs')
    <h1 class="text-[1.5rem] leading-snug font-bold md:text-[2.1rem]">যোগাযোগ ও ভুল উত্তর জানান <span class="block text-lg font-semibold text-muted-foreground md:text-xl">Contact &amp; report a wrong answer</span></h1>
    <p class="mt-4 leading-relaxed">কোনো প্রশ্নের উত্তর, ব্যাখ্যা বা নোটিশে ভুল পেলে নিচের ফর্মে জানান। আমরা প্রতিটি বার্তা দেখি, যাচাই করি এবং ভুল থাকলে সেই পাতাতেই ঠিক করি। অন্য যেকোনো বিষয়েও এখানে লিখতে পারেন।</p>
    <p class="mt-2 text-sm leading-relaxed text-muted-foreground" lang="en">Found a mistake in an answer, an explanation or a notice? Tell us with the form below. We read every message, check it, and correct the page itself if something is wrong. You can also write to us about anything else.</p>
    @if ($email || $facebook)
        <ul class="mt-5 space-y-1.5">
            @if ($email)<li>ইমেইল (Email): <a href="mailto:{{ $email }}" class="font-semibold text-primary">{{ $email }}</a></li>@endif
            @if ($facebook)<li>ফেসবুক (Facebook): <a href="{{ $facebook }}" target="_blank" rel="noopener" class="font-semibold text-primary">bd3schools</a></li>@endif
        </ul>
    @endif
    <form data-report class="card mt-6 space-y-4 p-5 md:p-6" id="report">
        <h2 class="text-lg font-bold">ভুল উত্তর জানান (Report a wrong answer)</h2>
        <p data-report-question hidden class="rounded-xl bg-muted px-4 py-3 text-sm">প্রশ্ন নম্বর (Question ID): <b></b></p>
        <label class="block text-sm font-semibold">কী সমস্যা? (What is wrong?)
            <select name="reason" class="mt-1.5 block h-11 w-full rounded-xl border bg-card px-3 font-normal">
                <option value="Wrong answer key">উত্তর ভুল (Wrong answer)</option>
                <option value="Explanation is wrong">ব্যাখ্যা ভুল (Wrong explanation)</option>
                <option value="Mistake in the question">প্রশ্নে ভুল (Mistake in the question)</option>
                <option value="Wrong notice information">নোটিশের তথ্য ভুল (Wrong notice information)</option>
                <option value="Other">অন্য কিছু (Something else)</option>
            </select>
        </label>
        <label class="block text-sm font-semibold">বিস্তারিত লিখুন (Details)
            <textarea name="note" required maxlength="800" rows="5" class="mt-1.5 block w-full rounded-xl border bg-card px-3 py-2.5 text-base font-normal" placeholder="কোন প্রশ্ন, সঠিক উত্তর কী হওয়া উচিত এবং সূত্র"></textarea>
        </label>
        <label class="block text-sm font-semibold">আপনার ইমেইল, ইচ্ছা হলে (Your email, optional)
            <input type="email" name="email" maxlength="120" class="mt-1.5 block h-11 w-full rounded-xl border bg-card px-3 text-base font-normal">
        </label>
        <button type="submit" class="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground">পাঠান (Send)</button>
        <p data-report-result role="status" class="text-sm font-semibold"></p>
    </form>
    <p class="mt-6 text-sm"><a href="/about" class="font-semibold text-primary">আমরা যেভাবে উত্তর যাচাই করি (How we verify answers)</a></p>
</div>
