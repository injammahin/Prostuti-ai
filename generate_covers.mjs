import fs from 'fs';
import path from 'path';

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

const frontendDir = 'frontend/public/covers/bcs';
const backendDir = 'backend/public/covers/bcs';
fs.mkdirSync(frontendDir, { recursive: true });
fs.mkdirSync(backendDir, { recursive: true });

for (let n = 10; n <= 48; n++) {
  const bn = ORDINAL_BN[n] || `${n}তম`;
  const isSpecial = [19, 39, 42, 48].includes(n);
  const badgeText = isSpecial ? 'বিশেষ বিসিএস (Special BCS)' : 'সাধারণ বিসিএস (General BCS)';
  
  // Palette variation for visual appeal
  const hue = (n * 17) % 360;
  const col1 = '#0f172a';
  const col2 = '#1e3a5f';
  const accent = '#1d6ca8';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b192c" />
      <stop offset="50%" stop-color="#1e3e62" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Grid decoration -->
  <g opacity="0.07" stroke="#ffffff" stroke-width="1">
    <line x1="0" y1="100" x2="1200" y2="100" />
    <line x1="0" y1="200" x2="1200" y2="200" />
    <line x1="0" y1="300" x2="1200" y2="300" />
    <line x1="0" y1="400" x2="1200" y2="400" />
    <line x1="0" y1="500" x2="1200" y2="500" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
  </g>

  <!-- Brand badge at top -->
  <g transform="translate(100, 75)">
    <rect width="210" height="42" rx="21" fill="#ffffff" fill-opacity="0.12" />
    <circle cx="25" cy="21" r="10" fill="#38bdf8" />
    <text x="45" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#ffffff">
      bd3<tspan fill="#38bdf8">schools</tspan> · BCS
    </text>
  </g>

  <!-- BCS Number Big Badge -->
  <g transform="translate(980, 80)">
    <circle cx="70" cy="70" r="65" fill="#ffffff" fill-opacity="0.08" stroke="#38bdf8" stroke-width="2" />
    <text x="70" y="80" text-anchor="middle" font-family="system-ui, sans-serif" font-size="52" font-weight="900" fill="#38bdf8">${n}</text>
    <text x="70" y="105" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="#ffffff" opacity="0.8">BCS</text>
  </g>

  <!-- Main Titles -->
  <text x="100" y="240" font-family="'Segoe UI', Tahoma, sans-serif" font-size="64" font-weight="800" fill="#ffffff">
    ${bn} বিসিএস প্রিলিমিনারি
  </text>
  <text x="100" y="315" font-family="'Segoe UI', Tahoma, sans-serif" font-size="40" font-weight="700" fill="url(#accent)">
    প্রশ্ন ও পূর্ণাঙ্গ সমাধান (PDF সহ)
  </text>

  <!-- Tagline / Subtitle -->
  <text x="100" y="385" font-family="'Segoe UI', Tahoma, sans-serif" font-size="22" fill="#94a3b8">
    ২০০টি প্রশ্নের বিষয়ভিত্তিক নির্ভুল সমাধান, ব্যাখ্যা ও কাটমার্ক পর্যালোচনা
  </text>

  <!-- Feature Pills -->
  <g transform="translate(100, 445)">
    <!-- Pill 1 -->
    <rect x="0" y="0" width="220" height="48" rx="10" fill="#ffffff" fill-opacity="0.1" />
    <text x="110" y="30" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="600" fill="#ffffff">
      ✓ ২০০ প্রশ্ন ও সমাধান
    </text>

    <!-- Pill 2 -->
    <rect x="235" y="0" width="200" height="48" rx="10" fill="#ffffff" fill-opacity="0.1" />
    <text x="335" y="30" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="600" fill="#38bdf8">
      ✓ বিস্তারিত ব্যাখ্যা
    </text>

    <!-- Pill 3 -->
    <rect x="450" y="0" width="220" height="48" rx="10" fill="#ffffff" fill-opacity="0.1" />
    <text x="560" y="30" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="600" fill="#ffffff">
      ✓ ফ্রি PDF ডাউনলোড
    </text>

    <!-- Pill 4 -->
    <rect x="685" y="0" width="230" height="48" rx="10" fill="#22c55e" fill-opacity="0.2" stroke="#22c55e" stroke-width="1.5" />
    <text x="800" y="30" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="700" fill="#4ade80">
      ✓ অনলাইন টেস্ট
    </text>
  </g>

  <!-- Footer bar -->
  <rect x="0" y="580" width="1200" height="50" fill="#000000" fill-opacity="0.5" />
  <text x="100" y="612" font-family="'Segoe UI', sans-serif" font-size="16" fill="#64748b">
    bd3schools.com — বিসিএস ও সরকারি চাকরি প্রস্তুতি একাডেমি
  </text>
  <text x="1100" y="612" text-anchor="end" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="600" fill="#94a3b8">
    ${badgeText}
  </text>
</svg>`;

  fs.writeFileSync(path.join(frontendDir, `${n}th-bcs.svg`), svg, 'utf-8');
  fs.writeFileSync(path.join(backendDir, `${n}th-bcs.svg`), svg, 'utf-8');
}

console.log('Successfully generated 39 SVG covers in both frontend and backend!');
