// Home page texts. Also used by the server for the first HTML (see vite.config.js), so keep this file free of imports.

export const faqs = [
  ["What is bd3schools?", "bd3schools is a free online exam preparation website in Bangladesh. Students use it to prepare for BCS, NTRCA teacher registration, Primary Assistant Teacher and bank job exams with previous questions, model tests and job notices.", "bd3schools কী?", "bd3schools বাংলাদেশের একটি ফ্রি অনলাইন পরীক্ষা প্রস্তুতির ওয়েবসাইট। বিসিএস, এনটিআরসিএ, প্রাথমিক সহকারী শিক্ষক ও ব্যাংক পরীক্ষার বিগত প্রশ্ন, মডেল টেস্ট ও চাকরির নোটিশ এখানে পাওয়া যায়।"],
  ["Is bd3schools official or linked to BPSC?", "No. We are an independent preparation platform. Every notice links to its official source, and you should always apply only through the official portal.", "bd3schools কি অফিসিয়াল বা বিপিএসসির সঙ্গে যুক্ত?", "না। আমরা একটি স্বাধীন প্রস্তুতি প্ল্যাটফর্ম। প্রতিটি নোটিশে অফিসিয়াল সূত্রের লিংক থাকে; সবসময় শুধু অফিসিয়াল পোর্টালেই আবেদন করবেন।"],
  ["How does the real exam simulation work?", "Every model test strictly reflects official exam conditions: exact question counts (90, 100, or 200 marks), authentic time limits, and official negative marking (-0.50 for BCS, -0.25 for Bank, NTRCA & Primary).", "আসল পরীক্ষার মতো মডেল টেস্ট কীভাবে হয়?", "প্রতিটি মডেল টেস্ট আসল পরীক্ষার নিয়মেই হয়: একই প্রশ্নসংখ্যা (৯০, ১০০ বা ২০০ নম্বর), একই সময় এবং অফিসিয়াল নেগেটিভ মার্কিং (বিসিএস -০.৫০; ব্যাংক, এনটিআরসিএ ও প্রাইমারি -০.২৫)।"],
  ["Which government exams are supported?", "We currently specialize in 5 major exams: BCS General, NTRCA Teacher Registration, Primary Assistant Teacher, Combined Bank Jobs (BSCS), and Bangladesh Bank.", "কোন কোন সরকারি পরীক্ষার প্রস্তুতি নেওয়া যায়?", "বর্তমানে ৫টি প্রধান পরীক্ষা: বিসিএস সাধারণ, এনটিআরসিএ শিক্ষক নিবন্ধন, প্রাথমিক সহকারী শিক্ষক, সমন্বিত ব্যাংক (বিএসসিএস) ও বাংলাদেশ ব্যাংক।"],
  ["Can I try it without an account?", "Yes. Continue as a guest to practice and browse notices. Create a free account when you want to save progress, bookmarks and alerts.", "অ্যাকাউন্ট ছাড়া কি ব্যবহার করা যাবে?", "হ্যাঁ। অতিথি হিসেবে অনুশীলন করুন ও নোটিশ দেখুন। অগ্রগতি, বুকমার্ক ও অ্যালার্ট সংরক্ষণ করতে চাইলে ফ্রি অ্যাকাউন্ট খুলুন।"],
  ["Is it really free?", "Yes. Every feature — adaptive practice drills, full model tests, syllabus guides, mistake notebook and alerts — is 100% free right now.", "এটা কি সত্যিই ফ্রি?", "হ্যাঁ। অনুশীলন, পূর্ণাঙ্গ মডেল টেস্ট, সিলেবাস গাইড, ভুলের নোটবুক ও অ্যালার্ট — সব সুবিধা এখন ১০০% ফ্রি।"],
]

export const features = [
  {
    tone: "primary",
    title: "Real-format model tests",
    text: "Timed tests with the real question count, time limit and negative marking of each exam.",
    points: ["Exact BCS, Bank & NTRCA format", "−0.50 / −0.25 negative marking", "Score and weak subjects after each test"],
    titleBn: "আসল পরীক্ষার মতো মডেল টেস্ট",
    textBn: "প্রতিটি পরীক্ষার আসল প্রশ্নসংখ্যা, সময় ও নেগেটিভ মার্কিংসহ মডেল টেস্ট।",
    pointsBn: ["বিসিএস, ব্যাংক ও এনটিআরসিএর হুবহু ফরম্যাট", "−০.৫০ / −০.২৫ নেগেটিভ মার্কিং", "প্রতি টেস্ট শেষে স্কোর ও দুর্বল বিষয়"],
  },
  {
    tone: "primary",
    title: "Previous BCS questions",
    text: "Every BCS preliminary paper, newest first, with the right answer and an explanation for each question.",
    points: ["Read questions with solutions", "Sit any paper as a timed exam", "Filter by subject or search"],
    titleBn: "বিগত বিসিএস প্রশ্ন",
    textBn: "সব বিসিএস প্রিলিমিনারি প্রশ্ন, প্রতিটির সঠিক উত্তর ও ব্যাখ্যাসহ।",
    pointsBn: ["সমাধানসহ প্রশ্ন পড়ুন", "যেকোনো প্রশ্নপত্রে সময় ধরে পরীক্ষা দিন", "বিষয় ধরে বা সার্চ করে খুঁজুন"],
  },
  {
    tone: "info",
    title: "Verified notice board",
    text: "Circulars, deadlines, admit cards and results, each checked against the official source.",
    points: ["Links to the official notice", "Exam calendar with deadlines", "Alerts for the exams you follow"],
    titleBn: "যাচাইকৃত নোটিশ বোর্ড",
    textBn: "সার্কুলার, শেষ তারিখ, প্রবেশপত্র ও ফলাফল — সবই অফিসিয়াল সূত্রে যাচাই করা।",
    pointsBn: ["অফিসিয়াল নোটিশের লিংক", "শেষ তারিখসহ পরীক্ষার ক্যালেন্ডার", "আপনার পরীক্ষার অ্যালার্ট"],
  },
  {
    tone: "warning",
    title: "Bank & teacher exams",
    text: "Separate question banks for Bangladesh Bank, Combined Bank, NTRCA and Primary Assistant Teacher.",
    points: ["Questions sorted by subject", "Explanations in Bangla & English", "Practice 10 to 50 at a time"],
    titleBn: "ব্যাংক ও শিক্ষক নিয়োগ পরীক্ষা",
    textBn: "বাংলাদেশ ব্যাংক, সমন্বিত ব্যাংক, এনটিআরসিএ ও প্রাথমিক শিক্ষকের আলাদা প্রশ্নব্যাংক।",
    pointsBn: ["বিষয়ভিত্তিক সাজানো প্রশ্ন", "বাংলা ও ইংরেজিতে ব্যাখ্যা", "একবারে ১০ থেকে ৫০টি অনুশীলন"],
  },
  {
    tone: "success",
    title: "Daily study plan",
    text: "A plan built around your target exam that brings weak topics back before you forget them.",
    points: ["3–5 focused tasks a day", "Mistakes come back for revision", "Track your streak and progress"],
    titleBn: "প্রতিদিনের পড়ার রুটিন",
    textBn: "আপনার লক্ষ্য পরীক্ষা অনুযায়ী রুটিন, যা ভুলে যাওয়ার আগেই দুর্বল টপিক ফিরিয়ে আনে।",
    pointsBn: ["দিনে ৩–৫টি নির্দিষ্ট কাজ", "ভুলগুলো রিভিশনে ফিরে আসে", "ধারাবাহিকতা ও অগ্রগতি দেখুন"],
  },
  {
    tone: "info",
    title: "AI tutor",
    text: "Stuck on a question? Ask the AI tutor to explain the answer in simple Bangla or English.",
    points: ["Why the other options are wrong", "Short tricks to remember", "Follow-up questions in chat"],
    titleBn: "এআই টিউটর",
    textBn: "প্রশ্নে আটকে গেছেন? এআই টিউটর সহজ বাংলা বা ইংরেজিতে বুঝিয়ে দেবে।",
    pointsBn: ["অন্য অপশন কেন ভুল", "মনে রাখার ছোট কৌশল", "চ্যাটে আরও প্রশ্ন করুন"],
  },
]

export const steps = [
  ["Take a 15-minute diagnostic", "We find your level in every subject of your target exam.", "১৫ মিনিটের যাচাই পরীক্ষা দিন", "আপনার লক্ষ্য পরীক্ষার প্রতিটি বিষয়ে আপনার অবস্থান জানুন।"],
  ["Follow your daily plan", "3–5 focused tasks a day. Weak topics come back before you forget them.", "প্রতিদিনের রুটিন মেনে চলুন", "দিনে ৩–৫টি নির্দিষ্ট কাজ। ভুলে যাওয়ার আগেই দুর্বল টপিক ফিরে আসবে।"],
  ["Test, get feedback, improve", "Real-format timed model tests and instant diagnostic feedback on weak subjects.", "পরীক্ষা দিন, জানুন, উন্নতি করুন", "আসল ফরম্যাটে সময় ধরে মডেল টেস্ট এবং দুর্বল বিষয়ের তাৎক্ষণিক বিশ্লেষণ।"],
]
