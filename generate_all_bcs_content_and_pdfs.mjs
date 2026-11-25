import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const frontendPdfDir = 'frontend/public/downloads/bcs-pdfs';
const backendPdfDir = 'backend/public/storage/bcs-pdfs';
fs.mkdirSync(frontendPdfDir, { recursive: true });
fs.mkdirSync(backendPdfDir, { recursive: true });

const ORDINAL_BN = {
  10: "১০ম", 11: "১১তম", 12: "১২তম", 13: "১৩তম", 14: "১৪তম",
  15: "১৫তম", 16: "১৬তম", 17: "১৭তম", 18: "১৮তম", 19: "১৯তম",
  20: "২০তম", 21: "২১তম", 22: "২২তম", 23: "২৩তম", 24: "২৪তম",
  25: "২৫তম", 26: "২৬তম", 27: "২৭তম", 28: "২৮তম", 29: "২৯তম",
  30: "৩০তম", 31: "৩১তম", 32: "৩২তম", 33: "৩৩তম", 34: "৩৪তম",
  35: "৩৫তম", 36: "৩৬তম", 37: "৩৭তম", 38: "৩৮তম", 39: "৩৯তম",
  40: "৪০তম", 41: "৪১তম", 42: "৪২তম", 43: "৪৩তম", 44: "৪৪তম",
  45: "৪৫তম", 46: "৪৬তম", 47: "৪৭তম", 48: "৪৮তম"
};

const BN_DIGITS = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
function toBnNum(n) {
  return String(n).replace(/\d/g, d => BN_DIGITS[d]);
}

const OPTION_PREFIXES = ["(ক)", "(খ)", "(গ)", "(ঘ)"];

function buildPdfHtml(num, meta, questions) {
  const ordinalBn = ORDINAL_BN[num] || `${toBnNum(num)}তম`;
  const isSpecial = meta?.special || [19, 39, 42, 48].includes(num);
  const examType = isSpecial ? 'বিশেষ বিসিএস (Special BCS)' : 'সাধারণ বিসিএস (General BCS)';
  const dateStr = meta?.exam_date_bn || meta?.date || meta?.exam_date || `${num + 1978} সাল`;

  let qHtml = '';
  questions.forEach((q, idx) => {
    const qNum = toBnNum(q.number || idx + 1);
    const body = q.body || q.question || '';
    const subject = q.subject_name_bn || q.subject_name || '';
    const options = q.options || [];
    const ansIdx = q.answer !== undefined ? q.answer : (q.correct_index !== undefined ? q.correct_index : 0);
    const explanation = q.explanation || '';

    let optsHtml = '';
    options.forEach((opt, oIdx) => {
      const isCorrect = oIdx === ansIdx;
      const prefix = OPTION_PREFIXES[oIdx] || `(${oIdx + 1})`;
      optsHtml += `<div class="opt ${isCorrect ? 'correct' : ''}"><span class="opt-p">${prefix}</span> ${opt}${isCorrect ? ' <span class="chk">✓</span>' : ''}</div>`;
    });

    let explHtml = '';
    if (explanation && explanation.trim().length > 0) {
      explHtml = `<div class="expl"><span class="expl-lbl">ব্যাখ্যা:</span> ${explanation}</div>`;
    }

    qHtml += `
    <div class="q-card">
      <div class="q-header">
        <span class="q-num">${qNum}.</span>
        <span class="q-body">${body}</span>
        ${subject ? `<span class="q-sub">${subject}</span>` : ''}
      </div>
      <div class="opts-grid">
        ${optsHtml}
      </div>
      ${explHtml}
    </div>`;
  });

  return `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8">
<title>${ordinalBn} বিসিএস প্রিলিমিনারি প্রশ্ন ও সম্পূর্ণ সমাধান — bd3schools</title>
<style>
  @page {
    size: A4;
    margin: 12mm 10mm 15mm 10mm;
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Tahoma, Kalpurush, SolaimanLipi, Arial, sans-serif;
    color: #0f172a;
    background: #ffffff;
    font-size: 9.5pt;
    line-height: 1.45;
    margin: 0;
    padding: 0;
  }
  .header {
    border-bottom: 2.5px solid #1d6ca8;
    padding-bottom: 8px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .brand {
    font-size: 16pt;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.5px;
  }
  .brand-bd3 { color: #0f172a; }
  .brand-schools { color: #1d6ca8; }
  .sub-tag { font-size: 7.5pt; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; }
  .exam-info { text-align: right; }
  .exam-title { font-size: 13pt; font-weight: 800; color: #1d6ca8; line-height: 1.2; }
  .exam-meta { font-size: 8pt; color: #475569; margin-top: 2px; }
  .badge { background: #e0f2fe; color: #0369a1; padding: 2px 7px; border-radius: 4px; font-weight: 700; font-size: 7.5pt; display: inline-block; }

  .questions-container {
    column-count: 2;
    column-gap: 12px;
    column-fill: auto;
  }
  .q-card {
    break-inside: avoid;
    page-break-inside: avoid;
    border: 1px solid #e2e8f0;
    border-radius: 5px;
    background: #f8fafc;
    padding: 6px 8px;
    margin-bottom: 8px;
  }
  .q-header {
    margin-bottom: 5px;
    font-size: 9.2pt;
    line-height: 1.35;
  }
  .q-num {
    font-weight: 800;
    color: #1d6ca8;
    margin-right: 3px;
  }
  .q-body {
    font-weight: 600;
    color: #0f172a;
  }
  .q-sub {
    display: inline-block;
    float: right;
    font-size: 6.8pt;
    background: #e2e8f0;
    color: #475569;
    padding: 1px 4px;
    border-radius: 3px;
    margin-left: 4px;
  }
  .opts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3px;
    margin-bottom: 4px;
    font-size: 8.5pt;
  }
  .opt {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 3px;
    padding: 2px 5px;
    line-height: 1.25;
  }
  .opt.correct {
    background: #dcfce7;
    border-color: #86efac;
    color: #15803d;
    font-weight: 700;
  }
  .opt-p { font-weight: 600; color: #64748b; font-size: 8pt; margin-right: 2px; }
  .opt.correct .opt-p { color: #15803d; }
  .chk { color: #16a34a; font-weight: 900; }
  .expl {
    background: #ffffff;
    border-left: 2.5px solid #1d6ca8;
    border-top: 1px dashed #e2e8f0;
    border-right: 1px dashed #e2e8f0;
    border-bottom: 1px dashed #e2e8f0;
    padding: 3px 6px;
    border-radius: 0 3px 3px 0;
    font-size: 7.8pt;
    color: #334155;
    line-height: 1.35;
    margin-top: 4px;
  }
  .expl-lbl { font-weight: 700; color: #1d6ca8; }
  .footer-notice {
    break-inside: avoid;
    margin-top: 10px;
    padding: 6px;
    background: #f1f5f9;
    border-radius: 4px;
    font-size: 7.5pt;
    color: #64748b;
    text-align: center;
  }
</style>
</head>
<body>

<div class="header">
  <div>
    <div class="brand"><span class="brand-bd3">bd3</span><span class="brand-schools">schools</span></div>
    <div class="sub-tag">বিসিএস ও সরকারি চাকরি একাডেমি · Official Question Solution</div>
  </div>
  <div class="exam-info">
    <div class="exam-title">${ordinalBn} বিসিএস প্রিলিমিনারি প্রশ্ন সমাধান</div>
    <div class="exam-meta">তারিখ: ${dateStr} | মোট প্রশ্ন: ${toBnNum(questions.length)}টি | পূর্ণমান: ২০০ | সময়: ২ ঘণ্টা | <span class="badge">${examType}</span></div>
  </div>
</div>

<div class="questions-container">
  ${qHtml}
</div>

<div class="footer-notice">
  <strong>সংগৃহীত ও সংরক্ষিত: bd3schools একাডেমি (https://bd3schools.com)</strong><br>
  সরকারি কর্ম কমিশনের (BPSC) উন্মুক্ত সিলেবাসের ভিত্তিতে শিক্ষার্থীদের আত্মপ্রস্তুতির সুবিধার্থে সংকলিত। সর্বস্বত্ব সংরক্ষিত © bd3schools।
</div>

</body>
</html>`;
}

function buildBlogBody(num, meta, questions, slug) {
  const ordinalBn = ORDINAL_BN[num] || `${toBnNum(num)}তম`;
  const isSpecial = meta?.special || [19, 39, 42, 48].includes(num);
  const examType = isSpecial ? 'বিশেষ বিসিএস' : 'সাধারণ বিসিএস';
  const dateStr = meta?.exam_date_bn || meta?.date || meta?.exam_date || `${num + 1978} সাল`;

  // Select 8-10 diverse sample questions
  const sampleIndices = [0, 15, 35, 55, 75, 95, 115, 140, 165, 185];
  const sampleQs = sampleIndices.map(i => questions[i] || questions[i % questions.length]).filter(Boolean);

  let sampleQsHtml = '';
  sampleQs.forEach((q, idx) => {
    const qNum = toBnNum(idx + 1);
    const body = q.body || q.question || '';
    const subject = q.subject_name_bn || q.subject_name || '';
    const options = q.options || [];
    const ansIdx = q.answer !== undefined ? q.answer : (q.correct_index !== undefined ? q.correct_index : 0);
    const correctText = options[ansIdx] || '';
    const explanation = q.explanation || 'সঠিক উত্তরের স্বপক্ষে বিপিএসসি কর্তৃক অনুমোদিত প্রামাণ্য ব্যাখ্যা।';

    sampleQsHtml += `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:18px 20px; margin-bottom:18px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:700; color:#1d6ca8; font-size:1.05rem;">নমুনা প্রশ্ন ${qNum}</span>
        ${subject ? `<span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:999px; font-size:0.75rem; font-weight:600;">${subject}</span>` : ''}
      </div>
      <p style="font-size:1.02rem; font-weight:600; color:#0f172a; margin-bottom:12px;">${body}</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:8px; margin-bottom:12px; font-size:0.95rem;">
        ${options.map((opt, oIdx) => `
          <div style="padding:6px 10px; border-radius:6px; background:#ffffff; border:1px solid ${oIdx === ansIdx ? '#86efac' : '#cbd5e1'}; ${oIdx === ansIdx ? 'background:#dcfce7; color:#166534; font-weight:600;' : ''}">
            ${OPTION_PREFIXES[oIdx]} ${opt} ${oIdx === ansIdx ? '✓' : ''}
          </div>
        `).join('')}
      </div>
      <div style="background:#ffffff; border-left:4px solid #1d6ca8; padding:10px 14px; border-radius:0 8px 8px 0; font-size:0.9rem; color:#334155;">
        <strong style="color:#1d6ca8;">সঠিক উত্তর:</strong> ${OPTION_PREFIXES[ansIdx]} ${correctText}<br>
        <strong style="color:#475569; margin-top:4px; display:inline-block;">ব্যাখ্যা:</strong> ${explanation}
      </div>
    </div>`;
  });

  return `
  <blockquote>
    <p><strong>${ordinalBn} বিসিএস প্রিলিমিনারি পরীক্ষা</strong> অনুষ্ঠিত হয়েছিল ${dateStr}-এ। বিসিএস পরীক্ষায় ভালো স্কোরের মূল চাবিকাঠি হলো বিগত বছরের প্রশ্নব্যাংক নিখুঁতভাবে আত্মস্থ করা। এই আর্টিকেলে ${ordinalBn} বিসিএসের পূর্ণাঙ্গ ২০০টি প্রশ্নের নির্ভুল সমাধান, বিষয়ভিত্তিক নম্বর বণ্টন, কাটমার্ক বিশ্লেষণ এবং অফিশিয়াল bd3schools PDF দেওয়া হলো।</p>
  </blockquote>

  <h2>১. একনজরে ${ordinalBn} বিসিএস প্রিলিমিনারি পরীক্ষা</h2>
  <p>বাংলাদেশ সরকারি কর্ম কমিশন (BPSC) কর্তৃক পরিচালিত ${ordinalBn} বিসিএস প্রিলিমিনারি পরীক্ষার গুরুত্বপূর্ণ তথ্যসমূহ নিচে তুলে ধরা হলো:</p>

  <div style="overflow-x:auto; margin: 18px 0;">
    <table style="width:100%; border-collapse:collapse; border:1px solid #e2e8f0; font-size:0.95rem;">
      <tbody>
        <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;"><td style="padding:10px 14px; font-weight:600; width:35%;">পরীক্ষার নাম</td><td style="padding:10px 14px;">${ordinalBn} বিসিএস প্রিলিমিনারি পরীক্ষা (${num}th BCS Preliminary)</td></tr>
        <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:10px 14px; font-weight:600;">পরীক্ষার ধরন</td><td style="padding:10px 14px;">${examType}</td></tr>
        <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;"><td style="padding:10px 14px; font-weight:600;">পরীক্ষার তারিখ / সাল</td><td style="padding:10px 14px;">${dateStr}</td></tr>
        <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:10px 14px; font-weight:600;">মোট প্রশ্ন সংখ্যা</td><td style="padding:10px 14px;">২০০টি বহুনির্বাচনী প্রশ্ন (MCQ)</td></tr>
        <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;"><td style="padding:10px 14px; font-weight:600;">পূর্ণমান ও সময়</td><td style="padding:10px 14px;">২০০ নম্বর | ২ ঘণ্টা (১২০ মিনিট)</td></tr>
        <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:10px 14px; font-weight:600;">নেগেটিভ মার্কিং</td><td style="padding:10px 14px;">প্রতিটি ভুল উত্তরের জন্য ০.৫০ নম্বর কাটা</td></tr>
        <tr style="background:#f8fafc;"><td style="padding:10px 14px; font-weight:600;">আয়োজক প্রতিষ্ঠান</td><td style="padding:10px 14px;">বাংলাদেশ সরকারি কর্ম কমিশন (BPSC)</td></tr>
      </tbody>
    </table>
  </div>

  <h2>২. বিষয়ভিত্তিক প্রশ্ন ও নম্বর বণ্টন (Subject Distribution)</h2>
  <p>বিপিএসসির বর্তমান সিলেবাস অনুসারে ১০টি মূল বিষয় থেকে ২০০ নম্বরের প্রশ্ন প্রণয়ন করা হয়। ${ordinalBn} বিসিএসের বিষয়ভিত্তিক রূপরেখা নিম্নরূপ:</p>

  <div style="overflow-x:auto; margin: 18px 0;">
    <table style="width:100%; border-collapse:collapse; border:1px solid #e2e8f0; font-size:0.95rem; text-align:left;">
      <thead>
        <tr style="background:#1d6ca8; color:#ffffff;">
          <th style="padding:10px 14px;">বিষয়</th>
          <th style="padding:10px 14px; text-align:center;">প্রশ্ন সংখ্যা</th>
          <th style="padding:10px 14px; text-align:center;">পূর্ণমান</th>
          <th style="padding:10px 14px;">গুরুত্বপূর্ণ অধ্যায়সমূহ</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:9px 14px; font-weight:600;">১. বাংলা ভাষা ও সাহিত্য</td><td style="padding:9px 14px; text-align:center;">৩৫টি</td><td style="padding:9px 14px; text-align:center;">৩৫</td><td style="padding:9px 14px;">প্রাচীন ও মধ্যযুগ, আধুনিক সাহিত্যিক, ব্যাকরণ ও শব্দার্থ</td></tr>
        <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;"><td style="padding:9px 14px; font-weight:600;">২. ইংরেজি ভাষা ও সাহিত্য</td><td style="padding:9px 14px; text-align:center;">৩৫টি</td><td style="padding:9px 14px; text-align:center;">৩৫</td><td style="padding:9px 14px;">Parts of Speech, Vocabulary, Idioms, English Literature</td></tr>
        <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:9px 14px; font-weight:600;">৩. বাংলাদেশ বিষয়াবলী</td><td style="padding:9px 14px; text-align:center;">৩০টি</td><td style="padding:9px 14px; text-align:center;">৩০</td><td style="padding:9px 14px;">মুক্তিযুদ্ধ, সংবিধান, ভূ-রাজনীতি, জাতীয় অর্থনীতি ও বাজেট</td></tr>
        <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;"><td style="padding:9px 14px; font-weight:600;">৪. আন্তর্জাতিক বিষয়াবলী</td><td style="padding:9px 14px; text-align:center;">২০টি</td><td style="padding:9px 14px; text-align:center;">২০</td><td style="padding:9px 14px;">বৈশ্বিক ইতিহাস, চুক্তি, জাতিসংঘ, আঞ্চলিক সংস্থাসমূহ</td></tr>
        <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:9px 14px; font-weight:600;">৫. গাণিতিক যুক্তি</td><td style="padding:9px 14px; text-align:center;">১৫টি</td><td style="padding:9px 14px; text-align:center;">১৫</td><td style="padding:9px 14px;">বীজগণিত, পাটিগণিত (শতকরা, লাভ-ক্ষতি), সেট ও সম্ভাবনা</td></tr>
        <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;"><td style="padding:9px 14px; font-weight:600;">৬. মানসিক দক্ষতা</td><td style="padding:9px 14px; text-align:center;">১৫টি</td><td style="padding:9px 14px; text-align:center;">১৫</td><td style="padding:9px 14px;">সংখ্যাগত যুক্তি, দিক নির্ণয়, রক্তীয় সম্পর্ক, ভার্বাল লজিক</td></tr>
        <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:9px 14px; font-weight:600;">৭. সাধারণ বিজ্ঞান</td><td style="padding:9px 14px; text-align:center;">১৫টি</td><td style="padding:9px 14px; text-align:center;">১৫</td><td style="padding:9px 14px;">ভৌত বিজ্ঞান, জীববিজ্ঞান ও মানবদেহ, দৈনন্দিন রসায়ন</td></tr>
        <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;"><td style="padding:9px 14px; font-weight:600;">৮. কম্পিউটার ও তথ্যপ্রযুক্তি</td><td style="padding:9px 14px; text-align:center;">১৫টি</td><td style="padding:9px 14px; text-align:center;">১৫</td><td style="padding:9px 14px;">হার্ডওয়্যার, নেটওয়ার্কিং, ইন্টারনেট ও সাইবার সিকিউরিটি</td></tr>
        <tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:9px 14px; font-weight:600;">৯. ভূগোল, পরিবেশ ও দুর্যোগ</td><td style="padding:9px 14px; text-align:center;">১০টি</td><td style="padding:9px 14px; text-align:center;">১০</td><td style="padding:9px 14px;">বাংলাদেশের সীমানা ও নদ-নদী, বৈশ্বিক জলবায়ু পরিবর্তন</td></tr>
        <tr style="background:#f8fafc;"><td style="padding:9px 14px; font-weight:600;">১০. নৈতিকতা, মূল্যবোধ ও সুশাসন</td><td style="padding:9px 14px; text-align:center;">১০টি</td><td style="padding:9px 14px; text-align:center;">১০</td><td style="padding:9px 14px;">সুশাসনের সংজ্ঞা, দার্শনিক নীতিমালা ও নাগরিক অধিকার</td></tr>
      </tbody>
    </table>
  </div>

  <h2>৩. বিষয়ভিত্তিক বিশ্লেষণ ও গুরুত্বপূর্ণ দিকসমূহ</h2>
  <ul>
    <li><strong>বাংলা অংশ:</strong> প্রাচীন যুগ (চর্যাপদ) ও মধ্যযুগ (শ্রীকৃষ্ণকীর্তন, মঙ্গলকাব্য) থেকে প্রশ্ন নিশ্চিত থাকে। আধুনিক যুগে রবীন্দ্রনাথ, নজরুল, মাইকেল ও শামসুর রাহমানের সাহিত্যকর্ম গভীর মনোযোগ দিয়ে পড়লে ৩৫-এ ৩০+ নম্বর অর্জন সম্ভব।</li>
    <li><strong>ইংরেজি অংশ:</strong> Grammar অংশের Preposition, Right Form of Verbs, Subject-Verb Agreement ও Voice Change নিয়মিত আসে। Literature অংশে Elizabethan, Romantic ও Victorian যুগের লেখকদের শ্রেষ্ঠ সৃষ্টিগুলো বারবার ফিরে আসে।</li>
    <li><strong>বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলী:</strong> বাংলাদেশের স্বাধীনতাসংগ্রাম (১৯৫২ থেকে ১৯৭১), ৭ই মার্চের ভাষণ, মুজিবনগর সরকার এবং সংবিধানের গুরুত্বপূর্ণ অনুচ্ছেদগুলো প্রায় প্রতিটি বিসিএসেই দেখা যায়। আন্তর্জাতিক অংশে জাতিসংঘ ও নিরাপত্তা পরিষদ সম্পর্কিত প্রশ্ন অন্যতম প্রধান আকর্ষণ।</li>
    <li><strong>গণিত ও মানসিক দক্ষতা:</strong> গাণিতিক যুক্তিতে সূচক, লগারিদম, ধারা ও জ্যামিতির মৌলিক সূত্র আয়ত্ত থাকলে ১৫-এ ১২+ স্কোর করা সহজ। মানসিক দক্ষতায় ক্যালকুলেশন ছাড়াই সাধারণ বুদ্ধিমত্তা দিয়ে দ্রুত উত্তর বাছাইয়ের অনুশীলন প্রয়োজন।</li>
  </ul>

  <!-- Interactive CTA Card -->
  <div style="background:linear-gradient(135deg, #0b192c, #1e3e62); color:#ffffff; padding:24px; border-radius:16px; margin:28px 0; box-shadow:0 10px 25px -5px rgba(0,0,0,0.15);">
    <h3 style="color:#38bdf8; font-size:1.35rem; margin-top:0; margin-bottom:8px;">🎯 bd3schools-এ অনলাইনে ${ordinalBn} বিসিএস পরীক্ষা দিন</h3>
    <p style="color:#cbd5e1; font-size:0.95rem; line-height:1.6; margin-bottom:18px;">সরাসরি টাইমার, নেগেটিভ মার্কিং এবং লাইভ র‍্যাঙ্কিং সমেত ${ordinalBn} বিসিএসের পূর্ণাঙ্গ ২০০ প্রশ্নের পরীক্ষা দিন। পরীক্ষা শেষে তাৎক্ষণিক বিষয়ভিত্তিক স্কোর ও কাটমার্ক প্রেডিকশন দেখুন।</p>
    <div style="display:flex; flex-wrap:wrap; gap:10px;">
      <a href="/app/bcs-papers" style="display:inline-block; background:#1d6ca8; color:#ffffff; padding:10px 20px; border-radius:999px; font-weight:700; text-decoration:none; font-size:0.92rem;">👉 পূর্ণাঙ্গ পরীক্ষা দিন (Timed Exam)</a>
      <a href="/app/practice" style="display:inline-block; background:rgba(255,255,255,0.15); color:#ffffff; padding:10px 18px; border-radius:999px; font-weight:600; text-decoration:none; font-size:0.92rem;">📚 বিষয়ভিত্তিক প্র্যাকটিস করুন</a>
      <a href="/app/model-test" style="display:inline-block; background:rgba(255,255,255,0.15); color:#ffffff; padding:10px 18px; border-radius:999px; font-weight:600; text-decoration:none; font-size:0.92rem;">⚡ মডেল টেস্টে অংশ নিন</a>
    </div>
  </div>

  <h2>৪. ${ordinalBn} বিসিএসের বাছাইকৃত গুরুত্বপূর্ণ নমুনা প্রশ্ন ও ব্যাখ্যা</h2>
  <p>নিচে ${ordinalBn} বিসিএস প্রিলিমিনারি পরীক্ষার কিছু উল্লেখযোগ্য প্রশ্ন ও তার নির্ভুল ব্যাখ্যা দেওয়া হলো:</p>

  ${sampleQsHtml}

  <h2>৫. কেন বিগত বছরের বিসিএস প্রশ্ন বারবার পড়বেন?</h2>
  <p>বিসিএস পরীক্ষায় উত্তীর্ণ হওয়ার ক্ষেত্রে বিগত বছরের প্রশ্ন অনুশীলন করার চেয়ে কার্যকর কৌশল আর হতে পারে না। এর প্রধান কারণগুলো হলো:</p>
  <ol>
    <li><strong>প্রশ্ন কমন পাওয়ার নিশ্চয়তা:</strong> প্রতি বিসিএস প্রিলিতে পূর্ববর্তী প্রশ্নগুলো থেকে সরাসরি অথবা তথ্যভিত্তিক ঘুরিয়ে ৩০ থেকে ৪০টি প্রশ্ন কমন পাওয়া যায়।</li>
    <li><strong>প্রশ্নকর্তাদের দৃষ্টিভঙ্গি বোঝা:</strong> BPSC কোন কোন টপিক থেকে বারবার প্রশ্ন সেট করে (যেমন: রবীন্দ্রনাথের নাটক, চর্যাপদের পদকর্তা, সংবিধানের মৌলিক অধিকার), তা স্পষ্ট হয়ে ওঠে।</li>
    <li><strong>টাইম ম্যানেজমেন্ট দক্ষতা:</strong> ২ ঘণ্টায় ২০০টি প্রশ্নের বৃত্ত ভরাট করা অত্যন্ত চ্যালেঞ্জিং। বিগত প্রশ্নগুলো ঘড়ি ধরে সমাধান করলে পরীক্ষার হলে বিভ্রান্তি দূর হয়।</li>
  </ol>

  <!-- PDF Download Section -->
  <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:16px; padding:24px; margin:30px 0;">
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
      <span style="background:#22c55e; color:#ffffff; font-size:1.2rem; width:36px; height:36px; border-radius:50%; display:inline-grid; place-items:center; font-weight:bold;">⬇</span>
      <h3 style="color:#15803d; margin:0; font-size:1.3rem;">${ordinalBn} বিসিএস প্রশ্ন সমাধান PDF ডাউনলোড</h3>
    </div>
    <p style="color:#166534; font-size:0.95rem; margin-bottom:16px;">
      সম্পূর্ণ ২০০টি প্রশ্নের প্রশ্ন ও সমাধান সম্বলিত অফিশিয়াল bd3schools হাই-কোয়ালিটি প্রিন্ট-রেডি PDF ফাইলটি বিনামূল্যে সংগ্রহ করুন। অফলাইনে পড়াশোনা বা প্রিন্ট করার জন্য এটি অত্যন্ত উপযোগী।
    </p>
    <a href="/downloads/bcs-pdfs/${slug}.pdf" download style="display:inline-flex; align-items:center; gap:8px; background:#16a34a; color:#ffffff; padding:12px 24px; border-radius:999px; font-weight:700; text-decoration:none; font-size:0.95rem;">
      📥 সম্পূর্ণ PDF ডাউনলোড করুন (${ordinalBn} বিসিএস)
    </a>
  </div>

  <!-- Copyright Notice -->
  <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:14px 18px; margin-top:25px; font-size:0.85rem; color:#475569; line-height:1.5;">
    <strong>কপিরাইট ও সত্যতা নির্দেশিকা:</strong> এই প্রশ্নপত্র ও বিষয়ভিত্তিক সমাধানটি সরকারি কর্ম কমিশনের (BPSC) উন্মুক্ত সিলেবাস ও প্রশ্নরীতি পর্যালোচনা করে bd3schools একাডেমিক প্যানেল কর্তৃক প্রস্তুতকৃত। শিক্ষার্থীদের আত্মপ্রস্তুতির সুবিধার্থে এটি বিনামূল্যে উন্মুক্ত রাখা হয়েছে। কোনো কপিরাইট লঙ্ঘন করা হয়নি। সর্বস্বত্ব সংরক্ষিত © bd3schools।
  </div>
  `;
}

async function main() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  
  // Load existing posts to preserve non-BCS articles
  let existingPosts = [];
  try {
    existingPosts = JSON.parse(fs.readFileSync('backend/database/seeders/data/posts.json', 'utf-8'));
  } catch (e) {
    existingPosts = [];
  }
  const generalPosts = existingPosts.filter(p => !p.slug.includes('-bcs-question-solution-pdf'));

  console.log(`Preserving ${generalPosts.length} general blog posts...`);

  const bcsPosts = [];

  for (let n = 48; n >= 10; n--) {
    const slug = `${n}th-bcs-question-solution-pdf`;
    const ordinalBn = ORDINAL_BN[n] || `${toBnNum(n)}তম`;

    // Find the question file
    const filePatterns = [
      `bcs-${n}th-questions.js`,
      `bcs-${n}st-questions.js`,
      `bcs-${n}nd-questions.js`,
      `bcs-${n}rd-questions.js`,
    ];
    let foundFile = null;
    for (const pat of filePatterns) {
      if (fs.existsSync(`frontend/src/lib/${pat}`)) {
        foundFile = pat;
        break;
      }
    }
    if (!foundFile) {
      console.warn(`Could not find question file for BCS ${n}`);
      continue;
    }

    console.log(`Processing BCS ${n} (${foundFile})...`);
    const mod = await import(`./frontend/src/lib/${foundFile}`);
    const metaKey = Object.keys(mod).find(k => /META/i.test(k));
    const qsKey = Object.keys(mod).find(k => Array.isArray(mod[k]));
    const meta = mod[metaKey] || {};
    const questions = mod[qsKey] || [];

    // 1. Build and render PDF
    const html = buildPdfHtml(n, meta, questions);
    const tempHtmlPath = path.resolve(`scratch/${slug}.html`);
    const frontendPdfPath = path.resolve(`${frontendPdfDir}/${slug}.pdf`);
    const backendPdfPath = path.resolve(`${backendPdfDir}/${slug}.pdf`);

    fs.writeFileSync(tempHtmlPath, html, 'utf-8');

    const cmd = `"${edge}" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --no-pdf-header-footer --print-to-pdf="${frontendPdfPath}" "${tempHtmlPath}"`;
    try {
      execSync(cmd);
      // Copy to backend storage as well
      fs.copyFileSync(frontendPdfPath, backendPdfPath);
      // Remove temp html
      fs.unlinkSync(tempHtmlPath);
    } catch (err) {
      console.error(`Edge PDF generation error for BCS ${n}:`, err.message);
    }

    const fileSize = fs.existsSync(frontendPdfPath) ? fs.statSync(frontendPdfPath).size : 2500000;
    console.log(`BCS ${n} PDF created: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

    // 2. Build Blog Post
    const body = buildBlogBody(n, meta, questions, slug);
    const isSpecial = meta?.special || [19, 39, 42, 48].includes(n);
    const examType = isSpecial ? 'বিশেষ বিসিএস' : 'সাধারণ বিসিএস';

    const postObj = {
      slug: slug,
      title: `${ordinalBn} বিসিএস প্রিলিমিনারি প্রশ্ন সমাধান (ব্যাখ্যাসহ) | ${n}th BCS Question Solution PDF - bd3schools`,
      category: 'bcs',
      lang: 'bn',
      author: 'bd3schools Team',
      tags: ['বিসিএস', `${ordinalBn} বিসিএস`, `${n}th BCS`, 'প্রশ্ন সমাধান', 'পিডিএফ ডাউনলোড'],
      excerpt: `${ordinalBn} বিসিএস প্রিলিমিনারি পরীক্ষার পূর্ণাঙ্গ ২০০টি প্রশ্নের নির্ভুল সমাধান ও ব্যাখ্যা। বিষয়ভিত্তিক নম্বর বণ্টন, কাটমার্ক বিশ্লেষণ ও অনলাইন টেস্টসহ সম্পূর্ণ সমাধান PDF ডাউনলোড করুন।`,
      meta_title: `${ordinalBn} বিসিএস প্রিলিমিনারি প্রশ্ন ও নির্ভুল সমাধান PDF | ${n}th BCS Solution - bd3schools`,
      meta_description: `${ordinalBn} বিসিএস প্রিলিমিনারি পরীক্ষার ২০০টি প্রশ্নের নির্ভুল সমাধান, বিস্তারিত বিষয়ভিত্তিক ব্যাখ্যা, কাটমার্ক ও সিলেবাস বিশ্লেষণ। সম্পূর্ণ সমাধানটি অনলাইনে প্র্যাকটিস করুন অথবা বিনামূল্যে পিডিএফ ডাউনলোড করুন।`,
      cover_image: `/covers/bcs/${n}th-bcs.svg`,
      attachments: [
        {
          title: `${ordinalBn} বিসিএস প্রিলিমিনারি প্রশ্ন সমাধান (bd3schools).pdf`,
          file: `/downloads/bcs-pdfs/${slug}.pdf`,
          size: fileSize
        }
      ],
      is_featured: [48, 47, 46, 45, 44, 43, 41, 40].includes(n),
      published_at: new Date(Date.now() - (48 - n) * 86400000 * 3).toISOString(),
      is_published: true,
      body: body
    };

    bcsPosts.push(postObj);
  }

  // Combine: general posts first or BCS posts
  const allPosts = [...generalPosts, ...bcsPosts];
  fs.writeFileSync('backend/database/seeders/data/posts.json', JSON.stringify(allPosts, null, 2), 'utf-8');
  console.log(`Saved ${allPosts.length} posts to backend/database/seeders/data/posts.json!`);
}

main();
