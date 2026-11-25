// About, privacy and terms. Also used by the server for the first HTML (see vite.config.js), so keep this file free of imports.

export const UPDATED = "2026-11-25"

// Each section: [English heading, Bangla heading, [[English, Bangla], …]]
const privacy = [
  ["What we collect", "আমরা যা সংগ্রহ করি", [
    ["Account: your name, email address and, if you add it, your mobile number. If you sign in with Google, we also receive your Google account ID and profile picture. Passwords are stored only in encrypted (hashed) form.", "অ্যাকাউন্ট: আপনার নাম, ইমেইল এবং দিলে মোবাইল নম্বর। গুগল দিয়ে সাইন ইন করলে গুগল অ্যাকাউন্ট আইডি ও প্রোফাইল ছবি। পাসওয়ার্ড শুধু এনক্রিপ্ট (হ্যাশ) করা অবস্থায় থাকে।"],
    ["Study records: the questions you answer, your test results, mistakes and the exam you are preparing for.", "পড়াশোনার তথ্য: আপনার উত্তর, পরীক্ষার ফল, ভুল এবং কোন পরীক্ষার প্রস্তুতি নিচ্ছেন।"],
    ["Visits: the pages opened, where you came from, your device type and browser, and a random ID kept in your browser so we can count visitors.", "ভিজিট: কোন পাতা দেখলেন, কোথা থেকে এলেন, ডিভাইস ও ব্রাউজারের ধরন এবং দর্শক গোনার জন্য ব্রাউজারে রাখা একটি এলোমেলো আইডি।"],
    ["Activity log: actions such as signing in or starting a practice, with your IP address, to keep the service safe.", "কার্যকলাপের লগ: সাইন ইন বা অনুশীলন শুরুর মতো কাজ ও আইপি ঠিকানা, সেবা নিরাপদ রাখার জন্য।"],
    ["Reports: what you write when you report a mistake in a question or notice.", "রিপোর্ট: প্রশ্ন বা নোটিশের ভুল জানাতে আপনি যা লেখেন।"],
  ]],
  ["How we use it", "যেভাবে ব্যবহার করি", [
    ["To run your account, show your progress, suggest what to practise, fix mistakes and improve the site. We do not sell your information and do not show advertising based on it.", "আপনার অ্যাকাউন্ট চালাতে, অগ্রগতি দেখাতে, কী অনুশীলন করবেন জানাতে, ভুল সংশোধন ও সাইট উন্নত করতে। আমরা আপনার তথ্য বিক্রি করি না এবং এর ভিত্তিতে বিজ্ঞাপন দেখাই না।"],
  ]],
  ["Services that help us", "যেসব সেবা ব্যবহার করি", [
    ["Email provider: sends sign-up and password codes to your email address.", "ইমেইল সেবা: সাইন আপ ও পাসওয়ার্ডের কোড পাঠায়।"],
    ["Google: sign-in (only if you choose it) and the fonts on the site.", "গুগল: সাইন ইন (আপনি চাইলে) এবং সাইটের ফন্ট।"],
    ["AI provider: when you use “Ask AI”, the question and your message are sent to an AI service to write the answer. Please don't type personal details there.", "এআই সেবা: “এআই-কে জিজ্ঞেস করুন” ব্যবহার করলে প্রশ্ন ও আপনার লেখা উত্তর তৈরির জন্য একটি এআই সেবায় পাঠানো হয়। সেখানে ব্যক্তিগত তথ্য লিখবেন না।"],
  ]],
  ["Your browser", "আপনার ব্রাউজার", [
    ["We keep your sign-in, language, bookmarks and study routine in your browser's storage. Clearing site data removes them.", "আপনার সাইন ইন, ভাষা, বুকমার্ক ও পড়ার রুটিন ব্রাউজারে রাখা হয়। সাইট ডেটা মুছলে সেগুলো মুছে যায়।"],
  ]],
  ["Deleting your account", "অ্যাকাউন্ট মুছে ফেলা", [
    ["You can delete your account any time in Settings. Your profile, answers, results, mistakes and activity log are removed permanently. Visit counts and mistake reports stay, without any link to you. Copies in backups disappear as the backups are replaced.", "সেটিংস থেকে যেকোনো সময় অ্যাকাউন্ট মুছতে পারবেন। প্রোফাইল, উত্তর, ফল, ভুল ও কার্যকলাপের লগ স্থায়ীভাবে মুছে যায়। ভিজিটের সংখ্যা ও ভুলের রিপোর্ট থাকে, তবে আপনার সঙ্গে কোনো সংযোগ ছাড়া। ব্যাকআপের কপি ব্যাকআপ বদলানোর সঙ্গে মুছে যায়।"],
    ["You can also view and correct your name and mobile number in Settings.", "সেটিংসে আপনার নাম ও মোবাইল নম্বর দেখতে ও ঠিক করতে পারবেন।"],
  ]],
  ["Changes", "পরিবর্তন", [
    ["If this policy changes, we will update this page and its date.", "এই নীতি বদলালে এই পাতা ও তারিখ হালনাগাদ করা হবে।"],
  ]],
]

const terms = [
  ["About bd3schools", "bd3schools সম্পর্কে", [
    ["bd3schools is an independent exam preparation website. It is not affiliated with BPSC, NTRCA, DPE, Bangladesh Bank or any ministry.", "bd3schools একটি স্বাধীন পরীক্ষা প্রস্তুতির ওয়েবসাইট। বিপিএসসি, এনটিআরসিএ, ডিপিই, বাংলাদেশ ব্যাংক বা কোনো মন্ত্রণালয়ের সঙ্গে যুক্ত নয়।"],
  ]],
  ["Dates, notices and answers", "তারিখ, নোটিশ ও উত্তর", [
    ["We check notices and answers with care, but mistakes can happen and dates can change. Always confirm on the official website, and apply only through the official portal.", "আমরা যত্ন নিয়ে নোটিশ ও উত্তর যাচাই করি, তবু ভুল হতে পারে এবং তারিখ বদলাতে পারে। সবসময় অফিসিয়াল ওয়েবসাইটে মিলিয়ে নিন এবং শুধু অফিসিয়াল পোর্টালে আবেদন করুন।"],
    ["AI answers and score estimates are study help, not official results. Please report any mistake you find.", "এআই উত্তর ও সম্ভাব্য স্কোর পড়ার সহায়তা, অফিসিয়াল ফল নয়। ভুল পেলে জানান।"],
    ["Sets of previous BCS questions may include questions from other BCS papers; those are marked with their BCS and year.", "বিগত বিসিএসের সেটে অন্য বিসিএসের প্রশ্ন থাকতে পারে; সেগুলোতে বিসিএস ও সাল উল্লেখ থাকে।"],
  ]],
  ["Your account", "আপনার অ্যাকাউন্ট", [
    ["Give correct information, keep your password private and use one account per person. You are responsible for what is done with your account.", "সঠিক তথ্য দিন, পাসওয়ার্ড গোপন রাখুন এবং একজন একটি অ্যাকাউন্ট ব্যবহার করুন। আপনার অ্যাকাউন্টের কার্যক্রমের দায় আপনার।"],
  ]],
  ["Fair use", "সঠিক ব্যবহার", [
    ["Use the site for your own study. Do not copy the question bank in bulk, sell its content, attack or overload the site, or try to enter other people's accounts. We may close accounts that do.", "নিজের পড়াশোনার জন্য ব্যবহার করুন। একসঙ্গে প্রশ্নব্যাংক কপি, বিক্রি, সাইটে আক্রমণ বা চাপ সৃষ্টি কিংবা অন্যের অ্যাকাউন্টে ঢোকার চেষ্টা করবেন না। করলে অ্যাকাউন্ট বন্ধ হতে পারে।"],
  ]],
  ["The service", "সেবা", [
    ["bd3schools is free now and provided as it is. Features may change or stop, and we cannot promise it will always be available or that you will pass an exam.", "bd3schools এখন ফ্রি এবং যেমন আছে তেমনভাবে দেওয়া হয়। সুবিধা বদলাতে বা বন্ধ হতে পারে; সবসময় চালু থাকবে বা আপনি পরীক্ষায় পাস করবেন এমন নিশ্চয়তা নেই।"],
  ]],
  ["Changes", "পরিবর্তন", [
    ["If these terms change, we will update this page and its date. Using the site after that means you accept the new terms.", "শর্ত বদলালে এই পাতা ও তারিখ হালনাগাদ হবে। এরপর সাইট ব্যবহার করলে নতুন শর্ত মেনে নেওয়া হয়েছে ধরা হবে।"],
  ]],
]

const about = [
  ["What is bd3schools?", "bd3schools কী?", [
    ["bd3schools (bd3schools.com) is a free online exam preparation website in Bangladesh. It helps students prepare for the BCS, NTRCA teacher registration, Primary Assistant Teacher, combined bank and Bangladesh Bank exams.", "bd3schools (bd3schools.com) বাংলাদেশের একটি ফ্রি অনলাইন পরীক্ষা প্রস্তুতির ওয়েবসাইট। বিসিএস, এনটিআরসিএ শিক্ষক নিবন্ধন, প্রাথমিক সহকারী শিক্ষক, সমন্বিত ব্যাংক ও বাংলাদেশ ব্যাংক পরীক্ষার প্রস্তুতিতে সাহায্য করে।"],
    ["It is a website, not a school or a school district, and has no connection with schools in other countries.", "এটি একটি ওয়েবসাইট, কোনো স্কুল বা স্কুল ডিস্ট্রিক্ট নয়; অন্য কোনো দেশের স্কুলের সঙ্গে এর সম্পর্ক নেই।"],
  ]],
  ["What you will find here", "এখানে যা পাবেন", [
    ["Previous BCS questions from the 10th to the 48th BCS with answers and explanations.", "১০ম থেকে ৪৮তম বিসিএসের প্রশ্ন, উত্তর ও ব্যাখ্যাসহ।"],
    ["Model tests with a real timer and negative marking, and a daily quiz.", "আসল সময় ও নেগেটিভ মার্কিংসহ মডেল টেস্ট এবং প্রতিদিনের কুইজ।"],
    ["Job notices and exam dates with links to the official source.", "অফিসিয়াল সূত্রের লিংকসহ চাকরির নোটিশ ও পরীক্ষার তারিখ।"],
    ["Everything in Bangla and English.", "সবকিছু বাংলা ও ইংরেজিতে।"],
  ]],
  ["How we verify answers", "আমরা যেভাবে উত্তর যাচাই করি", [
    ["Official answer keys: where the authority publishes a key for an exam, its answer is the one we mark.", "অফিসিয়াল উত্তর: কর্তৃপক্ষ কোনো পরীক্ষার উত্তরপত্র প্রকাশ করলে আমরা সেই উত্তরই চিহ্নিত করি।"],
    ["Cross-checked sources: BPSC does not publish a key with explanations for most papers, so answers are compared with textbooks, the constitution, government publications and standard reference books.", "একাধিক সূত্র: বেশির ভাগ প্রশ্নপত্রের ব্যাখ্যাসহ উত্তর বিপিএসসি প্রকাশ করে না, তাই উত্তর পাঠ্যবই, সংবিধান, সরকারি প্রকাশনা ও প্রামাণ্য গ্রন্থের সঙ্গে মিলিয়ে দেখা হয়।"],
    ["Answers belong to their time: a membership number or an office holder is marked as it was when the exam was held, and the explanation gives today's figure where it has changed.", "সময় অনুযায়ী উত্তর: সদস্যসংখ্যা বা পদাধিকারীর মতো তথ্য পরীক্ষার সময়ের হিসাবে চিহ্নিত থাকে; বদলে গেলে ব্যাখ্যায় বর্তমান তথ্য দেওয়া হয়।"],
    ["Corrections: every question has a \"Report a wrong answer\" link. We check each report and correct the page itself; its \"Last updated\" date changes. With thousands of questions some mistakes remain, so please tell us.", "সংশোধন: প্রতিটি প্রশ্নের নিচে ভুল জানানোর লিংক আছে। আমরা প্রতিটি অভিযোগ যাচাই করে সেই পাতাতেই ঠিক করি এবং হালনাগাদের তারিখ বদলায়। হাজার হাজার প্রশ্নের মধ্যে কিছু ভুল থাকতে পারে, পেলে জানান।"],
    ["Notices are written from the official circular and link to it.", "নোটিশ অফিসিয়াল বিজ্ঞপ্তি থেকে লেখা হয় এবং তার লিংক দেওয়া থাকে।"],
  ]],
  ["Independent", "স্বাধীন প্ল্যাটফর্ম", [
    ["bd3schools is not affiliated with BPSC, NTRCA, DPE, Bangladesh Bank or any ministry.", "bd3schools বিপিএসসি, এনটিআরসিএ, ডিপিই, বাংলাদেশ ব্যাংক বা কোনো মন্ত্রণালয়ের সঙ্গে যুক্ত নয়।"],
  ]],
]

export const PAGES = {
  about: { sections: about, title: ["About bd3schools", "bd3schools সম্পর্কে"], seo: "About Us & How We Verify Answers | আমাদের সম্পর্কে | bd3schools", description: "bd3schools is a free online exam preparation website in Bangladesh for BCS, NTRCA, Primary and bank jobs. How we verify answers." },
  privacy: { sections: privacy, title: ["Privacy policy", "গোপনীয়তা নীতি"], seo: "Privacy Policy | গোপনীয়তা নীতি | bd3schools", description: "What bd3schools collects about you, why, and how to see or delete it. bd3schools-এর গোপনীয়তা নীতি।" },
  terms: { sections: terms, title: ["Terms of use", "ব্যবহারের শর্তাবলি"], seo: "Terms of Use | ব্যবহারের শর্তাবলি | bd3schools", description: "The terms for using bd3schools, the free exam preparation website. bd3schools ব্যবহারের শর্তাবলি।" },
}
