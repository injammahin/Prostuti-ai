/**
 * 48th Special BCS (Health) Preliminary Question Paper & Full Solution
 * Exam Date: 18 July 2025
 * Total Questions: 200 (Full 200 Marks)
 * - Bangla Language & Literature (Q1 - Q20): 20 marks
 * - English Language & Literature (Q21 - Q40): 20 marks
 * - Bangladesh Affairs (Q41 - Q60): 20 marks
 * - International Affairs (Q61 - Q80): 20 marks
 * - Mathematical Reasoning & Mental Ability (Q81 - Q100): 20 marks
 * - Medical Science (Q101 - Q200): 100 marks
 */

export const BCS_48TH_META = {
  number: 48,
  source: "48th BCS",
  name: "48th BCS",
  name_bn: "৪৮তম বিশেষ বিসিএস",
  exam_date: "18 July 2025",
  exam_date_bn: "১৮ জুলাই, ২০২৫",
  total_marks: 200,
  duration_minutes: 120,
  negative_marking: 0.5,
  special: true,
  questions: 200,
  subjects: [
    { slug: "bangla", name: "Bangla", name_bn: "বাংলা ভাষা ও সাহিত্য", count: 20 },
    { slug: "english", name: "English", name_bn: "English Language & Literature", count: 20 },
    { slug: "bd-affairs", name: "Bangladesh Affairs", name_bn: "বাংলাদেশ বিষয়াবলি", count: 20 },
    { slug: "intl-affairs", name: "International Affairs", name_bn: "আন্তর্জাতিক বিষয়াবলি", count: 20 },
    { slug: "math", name: "Mathematics & Reasoning", name_bn: "গাণিতিক যুক্তি ও মানসিক দক্ষতা", count: 20 },
    { slug: "medical", name: "Medical Science", name_bn: "মেডিকেল সায়েন্স", count: 100 }
  ]
}

export const bcs48thQuestions = [
  {
    "id": 9001,
    "number": 1,
    "ref": "bcs48_q1",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "মধ্যযুগীয় সাহিত্য",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "'ইউসুফ-জোলেখা'র কবি শাহ মুহম্মদ সগীরের জন্ম কোথায়?",
    "options": [
      "বগুড়া",
      "সিলেট",
      "নদীয়া",
      "চট্টগ্রাম"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "শাহ মুহম্মদ সগীর গৌড়ের সুলতান গিয়াসউদ্দিন আজম শাহের (১৩৮৯-১৪১০) রাজত্বকালে ইউসুফ-জোলেখা কাব্য রচনা করেন। গবেষকদের মতে তাঁর জন্ম ও নিবাস ছিল তৎকালীন ত্রিপুরা ও চট্টগ্রাম অঞ্চলে।"
  },
  {
    "id": 9002,
    "number": 2,
    "ref": "bcs48_q2",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "বাক্য রূপান্তর",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "'তিনি কথা বললেন না।'—বাক্যটির অস্তিবাচক রূপ কোনটি?",
    "options": [
      "তিনি নীরব থাকতে চেষ্টা করলেন।",
      "তিনি নীরবে বসে রইলেন।",
      "তিনি কথা না বলে থাকলেন।",
      "তিনি চুপ করে থাকলেন।"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "অস্তিবাচক বাক্যে রূপান্তরের নিয়ম অনুযায়ী অর্থের পরিবর্তন না ঘটিয়ে নেতিবাচক শব্দ 'না' বর্জন করে সমার্থক অস্তিবাচক পদ ব্যবহার করতে হয়। তাই 'তিনি কথা বললেন না'-এর সঠিক অস্তিবাচক রূপ 'তিনি চুপ করে থাকলেন'।"
  },
  {
    "id": 9003,
    "number": 3,
    "ref": "bcs48_q3",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "এক কথায় প্রকাশ ও শব্দার্থ",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "'মন্দ্র' শব্দের অর্থ কী?",
    "options": [
      "হাতির ডাক",
      "মেঘের ডাক",
      "গম্ভীর ধ্বনি",
      "মধুর ধ্বনি"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "'মন্দ্র' শব্দের অর্থ গভীর বা গম্ভীর ধ্বনি বা গম্ভীর স্বর। অন্যদিকে হাতির ডাককে বৃংহিত, ঘোড়ার ডাককে হ্রেষা, এবং ময়ূরের ডাককে কেকা বলা হয়।"
  },
  {
    "id": 9004,
    "number": 4,
    "ref": "bcs48_q4",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "কারক ও বিভক্তি",
    "difficulty": "hard",
    "source": "48th BCS",
    "lang": "bn",
    "body": "নিচের কোনটি করণ কারকে শূন্য বিভক্তি?",
    "options": [
      "ডাক্তার ডাকো",
      "ঘোড়াকে চাবুক মারো",
      "তিনি চোখে দেখেন না",
      "আকাশ মেঘে ঢাকা"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "যে বস্তু বা উপায়ের সাহায্যে ক্রিয়া সম্পাদিত হয় তাকে করণ কারক বলে। 'ঘোড়াকে চাবুক মারো' বাক্যে 'চাবুক' হলো আঘাত করার মাধ্যম/উপকরণ এবং এতে কোনো বিভক্তি যুক্ত নেই (প্রথমা বা শূন্য বিভক্তি)।"
  },
  {
    "id": 9005,
    "number": 5,
    "ref": "bcs48_q5",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "এক কথায় প্রকাশ",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "'যিনি বিদ্যা লাভ করিয়াছেন'—এক কথায় কী হবে?",
    "options": [
      "বিদ্বান",
      "কৃতবিদ্যা",
      "কৃতবিদ্য",
      "শিক্ষিত"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "'যিনি বিদ্যা লাভ করিয়াছেন'—এক কথায় 'কৃতবিদ্য'। আর যার অনেক বিদ্যা আছে তাকে 'বিদ্বান' বলা হয়।"
  },
  {
    "id": 9006,
    "number": 6,
    "ref": "bcs48_q6",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "নজরুল সাহিত্য",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "কাজী নজরুল ইসলামের 'অগ্নিবীণা' কাব্যের প্রথম কবিতা কোনটি?",
    "options": [
      "ধূমকেতু",
      "প্রলয়োল্লাস",
      "বিদ্রোহী",
      "রক্তাম্বর-ধারিণী মা"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "'অগ্নিবীণা' (১৯২২) নজরুলের প্রথম কাব্যগ্রন্থ। এর প্রথম কবিতা 'প্রলয়োল্লাস' ('তোরা সব জয়ধ্বনি কর!') এবং দ্বিতীয় কবিতা হলো বিশ্বখ্যাত 'বিদ্রোহী'।"
  },
  {
    "id": 9007,
    "number": 7,
    "ref": "bcs48_q7",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "বাংলা ব্যাকরণের ইতিহাস",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "বাংলা ভাষার প্রথম ব্যাকরণ গ্রন্থ কে রচনা করেন?",
    "options": [
      "ম্যানুয়েল দ্য আসসুম্পসাঁও",
      "নাথানিয়েল ব্রাসি হ্যালহেড",
      "উইলিয়াম কেরি",
      "রাজা রামমোহন রায়"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "পর্তুগিজ পাদ্রি ম্যানুয়েল দ্য আসসুম্পসাঁও ১৭৪৩ সালে পর্তুগালের লিসবন থেকে রোমান হরফে প্রথম বাংলা ব্যাকরণ 'Vocabolario em idioma Bengalla e Portuguez' রচনা ও প্রকাশ করেন।"
  },
  {
    "id": 9008,
    "number": 8,
    "ref": "bcs48_q8",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "মধ্যযুগের সাহিত্য",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "'শ্রীকৃষ্ণকীর্তন' কাব্যের প্রধান চরিত্র কয়টি?",
    "options": [
      "২টি",
      "৩টি",
      "৪টি",
      "৫টি"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "বড়ু চণ্ডীদাস রচিত 'শ্রীকৃষ্ণকীর্তন' কাব্যের প্রধান চরিত্র ৩টি: ১. কৃষ্ণ (পরমাত্মা), ২. রাধা (জীবাত্মা), এবং ৩. বড়াই (দূতী বা সংযোগকারী)।"
  },
  {
    "id": 9009,
    "number": 9,
    "ref": "bcs48_q9",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "শব্দ প্রকরণ ও দ্বিরুক্ত শব্দ",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "অনুভূতিজাত দ্বিরুক্ত শব্দ কোনটি?",
    "options": [
      "ছমছম",
      "ঝমঝম",
      "টিকটিক",
      "ঠিক ঠিক"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "যে শব্দ মানসিক বা শারীরিক অনুভূতির দোলাচল বা আবেগ প্রকাশ করে তাকে অনুভূতিজাত দ্বিরুক্ত বলে। যেমন: গা ছমছম করা, খাঁ খাঁ করা, গা শিরশির করা।"
  },
  {
    "id": 9010,
    "number": 10,
    "ref": "bcs48_q10",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "রবীন্দ্র সাহিত্য",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "রবীন্দ্রনাথ ঠাকুরের কোন নাটকটি রূপকধর্মী?",
    "options": [
      "বিসর্জন",
      "রক্তকরবী",
      "চিরকুমার সভা",
      "ডাকঘর"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "রবীন্দ্রনাথ ঠাকুরের বিখ্যাত রূপক-সাংকেতিক নাটক হলো 'রক্তকরবী' (১৯২৬)। পুঁজিবাদী যান্ত্রিক সভ্যতার বিরুদ্ধে মানবিক প্রেম ও সৌন্দর্যের বিজয়ের প্রতীক নন্দিনী ও রাজা।"
  },
  {
    "id": 9011,
    "number": 11,
    "ref": "bcs48_q11",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "নাটক",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "মুনীর চৌধুরীর 'কবর' নাটকটির পটভূমি কী?",
    "options": [
      "মুক্তিযুদ্ধ",
      "ভাষা আন্দোলন",
      "গণঅভ্যুত্থান",
      "দেশভাগ"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "মুনীর চৌধুরী ১৯৫৩ সালের ১৭ জানুয়ারি ঢাকা কেন্দ্রীয় কারাগারে বন্দি অবস্থায় ১৯৫২ সালের মহান ভাষা আন্দোলনের পটভূমিতে কালজয়ী 'কবর' নাটকটি রচনা করেন।"
  },
  {
    "id": 9012,
    "number": 12,
    "ref": "bcs48_q12",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "সাহিত্যের রূপ ও রীতি",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "'আলেয়া' কী জাতীয় রচনা?",
    "options": [
      "নাটক",
      "উপন্যাস",
      "কাব্য",
      "ছোটগল্প"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "'আলেয়া' (১৯৩১) কাজী নজরুল ইসলাম রচিত একটি বিখ্যাত গীতিনাট্য বা নাটক।"
  },
  {
    "id": 9013,
    "number": 13,
    "ref": "bcs48_q13",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "ছোটগল্প",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "'পদ্মগোখরো' গল্পটির রচয়িতা কে?",
    "options": [
      "রবীন্দ্রনাথ ঠাকুর",
      "কাজী নজরুল ইসলাম",
      "শরৎচন্দ্র চট্টোপাধ্যায়",
      "তারাশঙ্কর বন্দ্যোপাধ্যায়"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "'পদ্মগোখরো' কাজী নজরুল ইসলামের রচিত বিখ্যাত গল্প। এটি তাঁর 'শিউলীমালা' (১৯৩১) গল্পগ্রন্থে সংকলিত।"
  },
  {
    "id": 9014,
    "number": 14,
    "ref": "bcs48_q14",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "আধুনিক কবিতা",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "জীবনানন্দ দাশের প্রথম প্রকাশিত কাব্যগ্রন্থ কোনটি?",
    "options": [
      "ধূসর পাণ্ডুলিপি",
      "বনলতা সেন",
      "ঝরা পালক",
      "রূপসী বাংলা"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "জীবনানন্দ দাশের প্রথম কাব্যগ্রন্থ 'ঝরা পালক' ১৯২৭ সালে প্রকাশিত হয়। তাঁর অন্যান্য বিখ্যাত কাব্য: ধূসর পাণ্ডুলিপি (১৯৩৬), বনলতা সেন (১৯৪২), রূপসী বাংলা (১৯৫৭)।"
  },
  {
    "id": 9015,
    "number": 15,
    "ref": "bcs48_q15",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "উপন্যাস",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "'চিলেকোঠার সেপাই' উপন্যাসের ঐতিহাসিক পটভূমি কোনটি?",
    "options": [
      "ঊনসত্তরের গণঅভ্যুত্থান",
      "ভাষা আন্দোলন",
      "একাত্তরের মুক্তিযুদ্ধ",
      "সাতচল্লিশের দেশভাগ"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "আখতারুজ্জামান ইলিয়াস রচিত কালজয়ী উপন্যাস 'চিলেকোঠার সেপাই' (১৯৮৬)-এর মূল উপজীব্য ১৯৬৯ সালের ঐতিহাসিক গণঅভ্যুত্থান।"
  },
  {
    "id": 9016,
    "number": 16,
    "ref": "bcs48_q16",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "বানান শুদ্ধি",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "নিচের কোন বানানটি শুদ্ধ?",
    "options": [
      "স্বায়ত্তশাসন",
      "স্বায়ত্বশাসন",
      "স্বায়ত্বশাসন",
      "স্বায়ত্বশাষন"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "শুদ্ধ বানান হলো 'স্বায়ত্তশাসন' (স্ব + আয়ত্ত + শাসন = স্বায়ত্তশাসন)। 'ত্ব' নয়, এখানে 'ত্ত' (ত+ত) যুক্তবর্ণ ব্যবহৃত হয়।"
  },
  {
    "id": 9017,
    "number": 17,
    "ref": "bcs48_q17",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "বাগধারা",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "'অর্ধচন্দ্র' বাগধারাটির অর্থ কী?",
    "options": [
      "অমাবস্যা",
      "গলাধাক্কা দেওয়া",
      "চিরতরে বিদায়",
      "একাদশী"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "'অর্ধচন্দ্র' বাগধারাটির প্রচলিত অর্থ গলাধাক্কা দেওয়া।"
  },
  {
    "id": 9018,
    "number": 18,
    "ref": "bcs48_q18",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "সমার্থক শব্দ",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "'অনিল' শব্দের সমার্থক শব্দ কোনটি?",
    "options": [
      "আগুন",
      "বাতাস",
      "পানি",
      "মাটি"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "'অনিল' শব্দের অর্থ বাতাস বা বায়ু (সমার্থক: পবন, সমীরণ, মারুত)। আর 'অনল' শব্দের অর্থ আগুন।"
  },
  {
    "id": 9019,
    "number": 19,
    "ref": "bcs48_q19",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "সমার্থক শব্দ",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "'সূর্য' শব্দের সমার্থক শব্দ কোনটি?",
    "options": [
      "সুধাকর",
      "শশাঙ্ক",
      "মিহির",
      "বিধু"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "'মিহির' শব্দের অর্থ সূর্য (সমার্থক: রবি, ভানু, সবিতা, দিবাকর)। অন্যদিকে সুধাকর, শশাঙ্ক ও বিধু হলো চাঁদের সমার্থক শব্দ।"
  },
  {
    "id": 9020,
    "number": 20,
    "ref": "bcs48_q20",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangla",
      "name_bn": "বাংলা ভাষা ও সাহিত্য",
      "slug": "bangla"
    },
    "topic": "সমাস",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "'উদ্বেল' শব্দের সঠিক ব্যাসবাক্য কোনটি?",
    "options": [
      "বেলাকে অতিক্রম",
      "বেলাকে অতিক্রান্ত",
      "উদ্বেলিত বেলা",
      "বেলা অতিক্রম"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "'বেলাকে অতিক্রান্ত = উদ্বেল'—এটি প্রাদি বা অব্যয়ীভাব সমাসের অন্তর্গত (যেখানে দূরবর্তী বা অতিক্রম অর্থে 'উৎ' উপসর্গ ব্যবহৃত হয়েছে)।"
  },
  {
    "id": 9021,
    "number": 21,
    "ref": "bcs48_q21",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Idioms & Phrases",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "What is the meaning of the idiom 'To keep one's head'?",
    "options": [
      "To be proud",
      "To remain calm",
      "To respect someone",
      "To hide something"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "'To keep one's head' means to remain calm, self-controlled, and rational in a difficult, confusing, or dangerous situation."
  },
  {
    "id": 9022,
    "number": 22,
    "ref": "bcs48_q22",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Vocabulary & Synonyms",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "The word 'Omnivorous' means:",
    "options": [
      "Eating all types of food",
      "Eating only meat",
      "Eating only grass and plants",
      "Eating only insects"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "'Omnivorous' (সর্বভুক) refers to an animal or person feeding on both animal and plant foods (all types of food). Herbivore = plant-eater; Carnivore = meat-eater."
  },
  {
    "id": 9023,
    "number": 23,
    "ref": "bcs48_q23",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Appropriate Prepositions",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Fill in the blank: 'He was accused _____ theft.'",
    "options": [
      "for",
      "of",
      "with",
      "about"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "The appropriate preposition after 'accuse' is 'of' (accuse someone of a crime/doing something). Charged takes 'with' (charged with theft)."
  },
  {
    "id": 9024,
    "number": 24,
    "ref": "bcs48_q24",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "English Literature",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "en",
    "body": "Who wrote 'A Tale of Two Cities'?",
    "options": [
      "William Shakespeare",
      "Charles Dickens",
      "George Eliot",
      "Thomas Hardy"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "'A Tale of Two Cities' (1859) is a historical novel by Charles Dickens, set in London and Paris before and during the French Revolution."
  },
  {
    "id": 9025,
    "number": 25,
    "ref": "bcs48_q25",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Voice Change",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Change the voice: 'Who taught you French?'",
    "options": [
      "By whom were you taught French?",
      "By whom was French taught to you?",
      "Who was French taught by you?",
      "Whom was taught French by you?"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Interrogative sentences starting with 'Who' change to 'By whom' in passive voice: By whom + auxiliary verb (were) + subject (you) + past participle (taught) + retained object (French)? -> 'By whom were you taught French?'"
  },
  {
    "id": 9026,
    "number": 26,
    "ref": "bcs48_q26",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "English Literature",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Which period in English literature is known as the 'Age of Sensibility'?",
    "options": [
      "1700 - 1745",
      "1745 - 1798",
      "1798 - 1832",
      "1832 - 1901"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "The Age of Sensibility (also known as the Age of Johnson) spans from 1745 to 1798 (the publication year of Lyrical Ballads). 1700-1745 is the Augustan Age."
  },
  {
    "id": 9027,
    "number": 27,
    "ref": "bcs48_q27",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Vocabulary & Antonyms",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "What is the antonym of the word 'Benign'?",
    "options": [
      "Friendly",
      "Gentle",
      "Malignant",
      "Peaceful"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "'Benign' means gentle, kind, or non-harmful. Its exact antonym is 'Malignant' (malevolent, malicious, or dangerously harmful)."
  },
  {
    "id": 9028,
    "number": 28,
    "ref": "bcs48_q28",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Grammar & Modals",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Choose the correct sentence:",
    "options": [
      "You had better to leave now.",
      "You had better leave now.",
      "You had better leaving now.",
      "You had better left now."
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "'Had better' is an idiom/modal verb phrase followed by a bare infinitive (base form of the verb without 'to'). Hence, 'You had better leave now.'"
  },
  {
    "id": 9029,
    "number": 29,
    "ref": "bcs48_q29",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Spelling",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Select the correctly spelt word:",
    "options": [
      "Bureaucracy",
      "Beurocracy",
      "Bureaucrasy",
      "Burocracy"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "The correct spelling is 'Bureaucracy' (B-U-R-E-A-U-C-R-A-C-Y), meaning government characterized by specialization of functions, adherence to fixed rules, and hierarchy of authority."
  },
  {
    "id": 9030,
    "number": 30,
    "ref": "bcs48_q30",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Shakespeare",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "en",
    "body": "'To be, or not to be, that is the question'—is a famous soliloquy from:",
    "options": [
      "Macbeth",
      "Othello",
      "Hamlet",
      "King Lear"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "This is Prince Hamlet's celebrated soliloquy in Act 3, Scene 1 of William Shakespeare's tragedy 'Hamlet', contemplating the nature of life, mortality, and death."
  },
  {
    "id": 9031,
    "number": 31,
    "ref": "bcs48_q31",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Parts of Speech",
    "difficulty": "hard",
    "source": "48th BCS",
    "lang": "en",
    "body": "In the sentence 'Still waters run deep', what part of speech is 'Still'?",
    "options": [
      "Noun",
      "Adjective",
      "Adverb",
      "Conjunction"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "In this proverb, 'waters' is a noun, and 'Still' modifies it by describing its state (calm/unmoving), functioning as an Adjective."
  },
  {
    "id": 9032,
    "number": 32,
    "ref": "bcs48_q32",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "English Literature",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "en",
    "body": "Who is known as the 'Poet of Nature' in English literature?",
    "options": [
      "John Keats",
      "William Wordsworth",
      "P. B. Shelley",
      "Lord Byron"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "William Wordsworth is widely celebrated as the 'Poet of Nature' (as well as High Priest of Nature). John Keats is the Poet of Beauty, while P. B. Shelley is the Revolutionary Poet."
  },
  {
    "id": 9033,
    "number": 33,
    "ref": "bcs48_q33",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Subject-Verb Agreement",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Neither the teacher nor the students _____ present in the auditorium.",
    "options": [
      "was",
      "were",
      "is",
      "are being"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "In 'Neither... nor' constructions, the verb agrees with the closer subject. Since 'the students' is plural, the past tense verb must be plural: 'were'."
  },
  {
    "id": 9034,
    "number": 34,
    "ref": "bcs48_q34",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Idioms & Phrases",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "What is the meaning of 'At the eleventh hour'?",
    "options": [
      "At 11:00 PM",
      "At the very last moment",
      "Early in the morning",
      "In high danger"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "'At the eleventh hour' is an English idiom meaning at the last possible moment before it is too late."
  },
  {
    "id": 9035,
    "number": 35,
    "ref": "bcs48_q35",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "One Word Substitution",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "A person who loves and collects books is called a:",
    "options": [
      "Bibliophile",
      "Philanthropist",
      "Polyglot",
      "Misologist"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "A 'Bibliophile' is a lover and collector of books (biblio = book, phile = love). Polyglot = speaker of many languages; Philanthropist = lover of humanity."
  },
  {
    "id": 9036,
    "number": 36,
    "ref": "bcs48_q36",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "English Literature",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "'Pride and Prejudice' is a famous romantic novel written by:",
    "options": [
      "Emily Brontë",
      "Charlotte Brontë",
      "Jane Austen",
      "Virginia Woolf"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "'Pride and Prejudice' (1813) was written by Jane Austen. The novel revolves around Elizabeth Bennet and Fitzwilliam Darcy."
  },
  {
    "id": 9037,
    "number": 37,
    "ref": "bcs48_q37",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Narration Change",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "He said, 'Let us go home.' Its indirect form is:",
    "options": [
      "He said that we should go home.",
      "He suggested that they should go home.",
      "He ordered them to go home.",
      "He proposed them going home."
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Imperative sentences with 'Let us' express a proposal/suggestion: Reporting verb changes to 'suggested/proposed' + that + they should + verb base form -> 'He suggested that they should go home.'"
  },
  {
    "id": 9038,
    "number": 38,
    "ref": "bcs48_q38",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Vocabulary & Synonyms",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "The synonym of 'Competent' is:",
    "options": [
      "Capable",
      "Clumsy",
      "Careless",
      "Complacent"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "'Competent' means having the necessary ability, knowledge, or skill to do something successfully (Capable, skilled, proficient)."
  },
  {
    "id": 9039,
    "number": 39,
    "ref": "bcs48_q39",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Literary Terms",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "A poem of fourteen lines is called a:",
    "options": [
      "Ballad",
      "Sonnet",
      "Elegy",
      "Ode"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "A 'Sonnet' is a poem of fourteen lines following a strict rhyme scheme and meter (iambic pentameter). An Elegy is a poem of mourning/lament."
  },
  {
    "id": 9040,
    "number": 40,
    "ref": "bcs48_q40",
    "exam": "bcs-general",
    "subject": {
      "name": "English",
      "name_bn": "English Language & Literature",
      "slug": "english"
    },
    "topic": "Conditionals",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "If he had invited me, I _____ attended the party.",
    "options": [
      "will have",
      "would have",
      "would",
      "should"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Third conditional structure: If + Past Perfect (had invited), Subject + would have + past participle (attended). Thus, 'I would have attended'."
  },
  {
    "id": 9041,
    "number": 41,
    "ref": "bcs48_q41",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "বাংলাদেশের সংবিধান",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "বাংলাদেশের সংবিধানের মৌলিক অধিকার বিষয়ক বিধানাবলি কোন ভাগে বর্ণিত আছে?",
    "options": [
      "প্রথম ভাগ",
      "দ্বিতীয় ভাগ",
      "তৃতীয় ভাগ",
      "চতুর্থ ভাগ"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধানের তৃতীয় ভাগে (অনুচ্ছেদ ২৭ থেকে ৪৪) নাগরিকদের মৌলিক অধিকারের নিশ্চয়তা দেওয়া হয়েছে। দ্বিতীয় ভাগে রাষ্ট্র পরিচালনার মূলনীতি এবং চতুর্থ ভাগে নির্বাহী বিভাগ রয়েছে।"
  },
  {
    "id": 9042,
    "number": 42,
    "ref": "bcs48_q42",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "মুক্তিযুদ্ধ ও সেক্টর",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "১৯৭১ সালের মুক্তিযুদ্ধে নৌ-সেক্টর ছিল কোন সেক্টরের অধীন?",
    "options": [
      "৮ নম্বর সেক্টর",
      "৯ নম্বর সেক্টর",
      "১০ নম্বর সেক্টর",
      "১১ নম্বর সেক্টর"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "মুক্তিযুদ্ধের সময় সমগ্র অভ্যন্তরীণ নৌপথ ও উপকূলীয় এলাকা ছিল ১০ নম্বর সেক্টরের অধীন। এই সেক্টরে কোনো নিয়মিত কমান্ডার ছিলেন না এবং এটি সরাসরি প্রধান সেনাপতির অধীনে পরিচালিত হতো ('অপারেশন জ্যাকপট')।"
  },
  {
    "id": 9043,
    "number": 43,
    "ref": "bcs48_q43",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "ঐতিহাসিক স্থান ও প্রত্নতত্ত্ব",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "প্রাচীন পুণ্ড্রবর্ধন নগরীর বর্তমান অবস্থান কোন জেলায়?",
    "options": [
      "দিনাজপুর",
      "বগুড়া",
      "নওগাঁ",
      "রাজশাহী"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "প্রাচীন বাংলার অন্যতম সমৃদ্ধ নগরী পুণ্ড্রবর্ধনের ধ্বংসাবশেষ বগুড়া জেলার করতোয়া নদীর পশ্চিম তীরে মহাস্থানগড়ে অবস্থিত।"
  },
  {
    "id": 9044,
    "number": 44,
    "ref": "bcs48_q44",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "মুক্তিযুদ্ধ ও মুজিবনগর",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "মুজিবনগর সরকার আনুষ্ঠানিকভাবে কবে শপথ গ্রহণ করে?",
    "options": [
      "১০ এপ্রিল ১৯৭১",
      "১৭ এপ্রিল ১৯৭১",
      "২৬ মার্চ ১৯৭১",
      "২৫ এপ্রিল ১৯৭১"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "মুজিবনগর সরকার ১৯৭১ সালের ১০ এপ্রিল গঠিত হয় এবং ১৭ এপ্রিল মেহেরপুরের বৈদ্যনাথতলার (বর্তমান মুজিবনগর) ভবেরপাড়া গ্রামের আম্রকাননে আনুষ্ঠানিকভাবে শপথ গ্রহণ করে।"
  },
  {
    "id": 9045,
    "number": 45,
    "ref": "bcs48_q45",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "বাংলাদেশের অর্থনীতি",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "বাংলাদেশের প্রথম পঞ্চবার্ষিক পরিকল্পনার (১৯৭৩-৭৮) সময়কাল ছিল:",
    "options": [
      "১৯৭২ - ১৯৭৭",
      "১৯৭৩ - ১৯৭৮",
      "১৯৭৪ - ১৯৭৯",
      "১৯৭৫ - ১৯৮০"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "স্বাধীন বাংলাদেশের প্রথম পঞ্চবার্ষিক পরিকল্পনা প্রণয়ন করে পরিকল্পনা কমিশন এবং এর বাস্তবায়ন কাল ছিল ১৯৭৩ সালের ১ জুলাই থেকে ১৯৭৮ সালের ৩০ জুন পর্যন্ত।"
  },
  {
    "id": 9046,
    "number": 46,
    "ref": "bcs48_q46",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "জাতীয় সংসদ ও আইন",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "জাতীয় সংসদের সংরক্ষিত নারী আসনের মেয়াদ সংবিধানের কততম সংশোধনীর মাধ্যমে ২৫ বছর বৃদ্ধি করা হয়?",
    "options": [
      "১৩তম",
      "১৪তম",
      "১৬তম",
      "১৭তম"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "সংবিধানের ১৭তম সংশোধনীর (২০১৮ সালে পাস) মাধ্যমে ৫০টি সংরক্ষিত নারী আসনের মেয়াদ পরবর্তী ২৫ বছরের জন্য বহাল রাখা হয়।"
  },
  {
    "id": 9047,
    "number": 47,
    "ref": "bcs48_q47",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "বাংলাদেশের ভূপ্রকৃতি ও নদ-নদী",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "তিস্তা নদীর উৎপত্তিস্থল কোথায়?",
    "options": [
      "মানস সরোবর",
      "তিব্বতের হিমালয়",
      "ভারতের সিকিমের সো লামো হ্রদ",
      "নাগা পাহাড়"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "তিস্তা নদী ভারতের সিকিম রাজ্যের হিমালয় পর্বতের সো লামো হ্রদ (পাভুহুনরি পর্বত) থেকে উৎপত্তি হয়ে পশ্চিমবঙ্গের জলপাইগুড়ি হয়ে বাংলাদেশে প্রবেশ করেছে এবং ব্রহ্মপুত্রে মিলিত হয়েছে।"
  },
  {
    "id": 9048,
    "number": 48,
    "ref": "bcs48_q48",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "ইতিহাস ও আন্দোলন",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "১৯৫৪ সালের যুক্তফ্রন্ট নির্বাচনে যুক্তফ্রন্টের নির্বাচনী প্রতীক কী ছিল?",
    "options": [
      "লাঙ্গল",
      "নৌকা",
      "ধানের শিষ",
      "পালতোলা নাও"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "১৯৫৪ সালের পূর্ববঙ্গ আইন পরিষদ নির্বাচনে মাওলানা ভাসানী, শেরে বাংলা এ কে ফজলুল হক এবং হোসেন শহীদ সোহরাওয়ার্দীর নেতৃত্বে গঠিত যুক্তফ্রন্টের নির্বাচনী প্রতীক ছিল 'নৌকা'।"
  },
  {
    "id": 9049,
    "number": 49,
    "ref": "bcs48_q49",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "সংবিধান ও রাষ্ট্রব্যবস্থা",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "বাংলাদেশের সংবিধান কার্যকর হয় কোন তারিখে?",
    "options": [
      "৪ নভেম্বর ১৯৭২",
      "১৬ ডিসেম্বর ১৯৭২",
      "২৬ মার্চ ১৯৭৩",
      "১৫ ডিসেম্বর ১৯৭২"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "বাংলাদেশের সংবিধান গণপরিষদে গৃহীত হয় ৪ নভেম্বর ১৯৭২ এবং প্রথম বিজয় দিবসে অর্থাৎ ১৬ ডিসেম্বর ১৯৭২ থেকে আনুষ্ঠানিকভাবে কার্যকর হয়।"
  },
  {
    "id": 9050,
    "number": 50,
    "ref": "bcs48_q50",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "বাংলাদেশের ক্ষুদ্র নৃগোষ্ঠী",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "গারোদের ঐতিহ্যবাহী সামাজিক ব্যবস্থা মূলত কোন ধরনের?",
    "options": [
      "পিতৃতান্ত্রিক",
      "মাতৃতান্ত্রিক",
      "গণতান্ত্রিক",
      "একক পরিবার"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "বাংলাদেশে বসবাসকারী ক্ষুদ্র নৃগোষ্ঠীর মধ্যে গারো এবং খাসিয়াদের পরিবার ও সমাজ ব্যবস্থা প্রধানত মাতৃতান্ত্রিক (মায়ের সূত্রে বংশ পরিচয় ও সম্পত্তি অর্জিত হয়)।"
  },
  {
    "id": 9051,
    "number": 51,
    "ref": "bcs48_q51",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "খনিজ সম্পদ ও জ্বালানি",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "বাংলাদেশের একমাত্র কয়লাভিত্তিক তাপবিদ্যুৎ কেন্দ্রগুলোর অন্যতম বড়পুকুরিয়া কয়লাখনি কোন জেলায়?",
    "options": [
      "রংপুর",
      "দিনাজপুর",
      "বগুড়া",
      "জয়পুরহাট"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "বড়পুকুরিয়া কয়লাখনি এবং তাপবিদ্যুৎ কেন্দ্র দিনাজপুর জেলার পার্বতীপুর উপজেলায় অবস্থিত।"
  },
  {
    "id": 9052,
    "number": 52,
    "ref": "bcs48_q52",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "বীরশ্রেষ্ঠ ও মুক্তিযুদ্ধ",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "মুক্তিযুদ্ধে সর্বোচ্চ বীরত্বসূচক পদক 'বীরশ্রেষ্ঠ' খেতাবপ্রাপ্ত শহীদের সংখ্যা কতজন?",
    "options": [
      "৫ জন",
      "৬ জন",
      "৭ জন",
      "৮ জন"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "মুক্তিযুদ্ধে অসীম সাহসিকতা ও আত্মত্যাগের জন্য ৭ জন অকুতোভয় যোদ্ধাকে সর্বোচ্চ সামরিক সম্মাননা 'বীরশ্রেষ্ঠ' খেতাবে ভূষিত করা হয়।"
  },
  {
    "id": 9053,
    "number": 53,
    "ref": "bcs48_q53",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "জাতীয় স্মৃতিসৌধ ও ভাস্কর্য",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "সাভারে অবস্থিত জাতীয় স্মৃতিসৌধের স্থপতি কে?",
    "options": [
      "হামিদুর রহমান",
      "সৈয়দ মাইনুল হোসেন",
      "মাজহারুল ইসলাম",
      "নিতুন কুণ্ডু"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "সাভারের জাতীয় স্মৃতিসৌধের নকশাকার ও স্থপতি সৈয়দ মাইনুল হোসেন। এর ৭ জোড়া ত্রিভুজাকৃতি দেয়াল বাংলাদেশের জাতীয় আন্দোলনের ৭টি গুরুত্বপূর্ণ পর্যায়কে নির্দেশ করে।"
  },
  {
    "id": 9054,
    "number": 54,
    "ref": "bcs48_q54",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "শিক্ষা ও ভাষা আন্দোলন",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "ইউনেস্কো কত সালে ২১শে ফেব্রুয়ারিকে 'আন্তর্জাতিক মাতৃভাষা দিবস' হিসেবে স্বীকৃতি প্রদান করে?",
    "options": [
      "১৯৯৭",
      "১৯৯৮",
      "১৯৯৯",
      "২০০০"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "১৯৯৯ সালের ১৭ নভেম্বর ইউনেস্কোর ৩০তম সাধারণ অধিবেশনে ২১শে ফেব্রুয়ারিকে আন্তর্জাতিক মাতৃভাষা দিবস হিসেবে ঐতিহাসিক স্বীকৃতি দেওয়া হয় এবং ২০০০ সাল থেকে বিশ্বব্যাপী পালিত হচ্ছে।"
  },
  {
    "id": 9055,
    "number": 55,
    "ref": "bcs48_q55",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "বাংলাদেশের সীমান্ত ও সীমানা",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "ভারতের সাথে বাংলাদেশের সীমান্তবর্তী জেলার সংখ্যা কয়টি?",
    "options": [
      "২৮টি",
      "২৯টি",
      "৩০টি",
      "৩২টি"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "বাংলাদেশের সীমান্তবর্তী মোট জেলা ৩২টি। এর মধ্যে ভারতের সাথে সীমান্তবর্তী জেলা ৩০টি এবং মিয়ানমারের সাথে ৩টি (রাঙ্গামাটি জেলা ভারত ও মিয়ানমার উভয় দেশের সাথেই যুক্ত)।"
  },
  {
    "id": 9056,
    "number": 56,
    "ref": "bcs48_q56",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "বাংলাদেশের বাজেট ও রাজস্ব",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "বাংলাদেশের সরকারের রাজস্ব আয়ের প্রধান উৎস কোনটি?",
    "options": [
      "আয়কর",
      "মূল্য সংযোজন কর (মূসক বা ভ্যাট)",
      "শুল্ক",
      "ভূমি রাজস্ব"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "জাতীয় রাজস্ব বোর্ডের (NBR) তথ্য অনুযায়ী বাংলাদেশ সরকারের অভ্যন্তরীণ রাজস্ব সংগ্রহের একক বৃহত্তম উৎস মূল্য সংযোজন কর (ভ্যাট/VAT)।"
  },
  {
    "id": 9057,
    "number": 57,
    "ref": "bcs48_q57",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "ঐতিহাসিক ৭ই মার্চের ভাষণ",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "বঙ্গবন্ধুর ৭ই মার্চের ভাষণকে ইউনেস্কো কবে 'মেমোরি অব দ্য ওয়ার্ল্ড রেজিস্টার'-এ বিশ্ব প্রামাণ্য ঐতিহ্য হিসেবে অন্তর্ভুক্ত করে?",
    "options": [
      "৩০ অক্টোবর ২০১৭",
      "৭ মার্চ ২০১৮",
      "১৫ আগস্ট ২০১৭",
      "১০ জানুয়ারি ২০১৬"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "২০১৭ সালের ৩০ অক্টোবর ইউনেস্কোর মহাপরিচালক ইরিনা বোকোভা বঙ্গবন্ধুর ঐতিহাসিক ৭ই মার্চের ভাষণকে মেমোরি অব দ্য ওয়ার্ল্ড ইন্টারন্যাশনাল রেজিস্টারে অন্তর্ভুক্তির ঘোষণা দেন।"
  },
  {
    "id": 9058,
    "number": 58,
    "ref": "bcs48_q58",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "কৃষি ও ফসল",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "'হরিধান' উদ্ভাবক কে ছিলেন?",
    "options": [
      "হরিশংকর রায়",
      "হরিপদ কাপালী",
      "ড. মাকসুদুল আলম",
      "হরগোবিন্দ খোরানা"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "ঝিনাইদহের সাধারণ কৃষক হরিপদ কাপালী নিজের উদ্ভাবনী ক্ষমতায় ১৯৯৫-৯৬ সালে উচ্চ ফলনশীল নিজস্ব ধানের জাত নির্বাচন করেন, যা পরে 'হরিধান' নামে দেশজুড়ে পরিচিতি লাভ করে।"
  },
  {
    "id": 9059,
    "number": 59,
    "ref": "bcs48_q59",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "সমুদ্রসীমা ও ব্লু-ইকোনমি",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "মায়ানমারের সাথে সমুদ্রসীমা বিরোধ নিষ্পত্তির মামলায় বাংলাদেশ আন্তর্জাতিক ট্রাইব্যুনাল (ITLOS)-এ রায় লাভ করে কবে?",
    "options": [
      "১৪ মার্চ ২০১২",
      "৭ জুলাই ২০১৪",
      "২০ সেপ্টেম্বর ২০১১",
      "১৫ ডিসেম্বর ২০১৩"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "জার্মানির হামবুর্গে অবস্থিত সমুদ্র আইন বিষয়ক আন্তর্জাতিক ট্রাইব্যুনাল (ITLOS) ২০১২ সালের ১৪ মার্চ বাংলাদেশ ও মিয়ানমারের মধ্যকার ঐতিহাসিক সমুদ্রসীমা নির্ধারণী রায় ঘোষণা করে।"
  },
  {
    "id": 9060,
    "number": 60,
    "ref": "bcs48_q60",
    "exam": "bcs-general",
    "subject": {
      "name": "Bangladesh Affairs",
      "name_bn": "বাংলাদেশ বিষয়াবলি",
      "slug": "bd-affairs"
    },
    "topic": "পদ্মা সেতু মেগা প্রকল্প",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "পদ্মা বহুমুখী সেতুর মূল দৈর্ঘ্য কত কিলোমিটার?",
    "options": [
      "৫.১৫ কিমি",
      "৬.১৫ কিমি",
      "৬.৮০ কিমি",
      "৭.১৫ কিমি"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "পদ্মা বহুমুখী সেতুর মূল কাঠামোর দৈর্ঘ্য ৬.১৫ কিলোমিটার (৪১টি স্প্যান, প্রতিটি ১৫০ মিটার দীর্ঘ)। এটি মুন্সীগঞ্জের মাওয়া প্রান্তকে শরীয়তপুরের জাজিরা প্রান্তের সাথে সংযুক্ত করেছে।"
  },
  {
    "id": 9061,
    "number": 61,
    "ref": "bcs48_q61",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "জাতিসংঘ ও আন্তর্জাতিক সংস্থা",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "আন্তর্জাতিক আদালত (ICJ - International Court of Justice)-এর সদর দপ্তর কোথায়?",
    "options": [
      "জেনেভা",
      "নিউইয়র্ক",
      "দ্য হেগ",
      "ভিয়েনা"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "জাতিসংঘের প্রধান বিচারিক অঙ্গ আন্তর্জাতিক বিচার আদালত (ICJ)-এর সদর দপ্তর নেদারল্যান্ডসের দ্য হেগ শহরের পিস প্যালেসে অবস্থিত।"
  },
  {
    "id": 9062,
    "number": 62,
    "ref": "bcs48_q62",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "আন্তর্জাতিক সম্মেলন ও জলবায়ু",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "জাতিসংঘের ঐতিহাসিক প্যারিস জলবায়ু চুক্তি কত সালে গৃহীত হয়?",
    "options": [
      "২০১২",
      "২০১৪",
      "২০১৫",
      "২০১৬"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "২০১৫ সালের ১২ ডিসেম্বর প্যারিসে অনুষ্ঠিত COP21 সম্মেলনে গ্রিনহাউস গ্যাস নির্গমন হ্রাস ও বৈশ্বিক উষ্ণতা বৃদ্ধি ২ ডিগ্রি সেলসিয়াসের নিচে রাখার লক্ষ্যে ঐতিহাসিক প্যারিস চুক্তি গৃহীত হয়।"
  },
  {
    "id": 9063,
    "number": 63,
    "ref": "bcs48_q63",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "সামরিক জোট ও নিরাপত্তা",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "সামরিক জোট ন্যাটো (NATO)-র বর্তমান সদর দপ্তর কোন শহরে অবস্থিত?",
    "options": [
      "প্যারিস",
      "ওয়াশিংটন",
      "ব্রাসেলস",
      "লন্ডন"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "উত্তর আটলান্টিক নিরাপত্তা জোট ন্যাটো (NATO)-র সদর দপ্তর বেলজিয়ামের ব্রাসেলস শহরে অবস্থিত। এটি ১৯৪৯ সালে প্রতিষ্ঠিত হয়।"
  },
  {
    "id": 9064,
    "number": 64,
    "ref": "bcs48_q64",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "অর্থনৈতিক জোট ও ব্যাংক",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "ব্রিকস (BRICS) প্রতিষ্ঠিত নিউ ডেভেলপমেন্ট ব্যাংক (NDB)-এর সদর দপ্তর কোথায়?",
    "options": [
      "মস্কো",
      "বেইজিং",
      "সাংহাই",
      "নতুন দিল্লি"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "ব্রিকস দেশগুলোর উদ্যোগে ২০১৪ সালে প্রতিষ্ঠিত নিউ ডেভেলপমেন্ট ব্যাংক (NDB)-এর প্রধান কার্যালয় চীনের সাংহাই শহরে অবস্থিত।"
  },
  {
    "id": 9065,
    "number": 65,
    "ref": "bcs48_q65",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "আন্তর্জাতিক প্রণালী ও ভূগোল",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "হরমুজ প্রণালী কোন দুটি জলরাশিকে যুক্ত করেছে?",
    "options": [
      "পারস্য উপসাগর ও ওমান উপসাগর",
      "লোহিত সাগর ও এডেন উপসাগর",
      "ভূমধ্যসাগর ও আটলান্টিক মহাসাগর",
      "কাস্পিয়ান সাগর ও কৃষ্ণ সাগর"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "বিশ্বের অন্যতম কৌশলগত জ্বালানি পরিবহন পথ হরমুজ প্রণালী পারস্য উপসাগরকে ওমান উপসাগর তথা আরব সাগরের সাথে সংযুক্ত করেছে (ইরান ও ওমান/সংযুক্ত আরব আমিরাতের মাঝে)।"
  },
  {
    "id": 9066,
    "number": 66,
    "ref": "bcs48_q66",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "নোবেল পুরস্কার",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "নোবেল শান্তি পুরস্কার কোন দেশ থেকে প্রদান করা হয়?",
    "options": [
      "সুইডেন",
      "নরওয়ে",
      "সুইজারল্যান্ড",
      "যুক্তরাজ্য"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "আলফ্রেড নোবেলের উইল অনুযায়ী একমাত্র নোবেল শান্তি পুরস্কার নরওয়ের রাজধানী অসলো থেকে প্রদান করা হয়। বাকি পাঁচটি নোবেল পুরস্কার সুইডেনের স্টকহোম থেকে দেওয়া হয়।"
  },
  {
    "id": 9067,
    "number": 67,
    "ref": "bcs48_q67",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "আন্তর্জাতিক চুক্তি",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "প্রথম বিশ্বযুদ্ধের পর প্রতিষ্ঠিত জাতিসংঘ পূর্বসূরি 'লিগ অব নেশনস' কোন চুক্তির মাধ্যমে গঠিত হয়?",
    "options": [
      "ভার্সাই চুক্তি",
      "ওয়েস্টফালিয়া চুক্তি",
      "জেনেভা কনভেনশন",
      "ইয়াল্টা চুক্তি"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "১৯১৯ সালে স্বাক্ষরিত প্রথম বিশ্বযুদ্ধোত্তর ঐতিহাসিক ভার্সাই চুক্তির মাধ্যমে আন্তর্জাতিক শান্তি ও নিরাপত্তার লক্ষ্যে লিগ অব নেশনস (League of Nations) গঠিত হয়েছিল।"
  },
  {
    "id": 9068,
    "number": 68,
    "ref": "bcs48_q68",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "বিশ্বের মুদ্রা ও অর্থনীতি",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "জাপানের মুদ্রার নাম কী?",
    "options": [
      "ইউয়ান",
      "ইয়েন",
      "ওন",
      "রিঙ্গিত"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "জাপানের সরকারি মুদ্রার নাম ইয়েন (Yen)। চীনের মুদ্রা ইউয়ান, দক্ষিণ কোরিয়ার ওন এবং মালয়েশিয়ার মুদ্রা রিঙ্গিত।"
  },
  {
    "id": 9069,
    "number": 69,
    "ref": "bcs48_q69",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "আন্তর্জাতিক ভৌগোলিক সীমারেখা",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "উত্তর ও দক্ষিণ কোরিয়ার মধ্যকার আন্তর্জাতিক সীমারেখাটির নাম কী?",
    "options": [
      "১৭তম সমান্তরাল রেখা",
      "২৪তম সমান্তরাল রেখা",
      "৩৮তম সমান্তরাল রেখা",
      "৪৯তম সমান্তরাল রেখা"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "উত্তর ও দক্ষিণ কোরিয়াকে বিভক্তকারী অসামরিক সীমারেখা ৩৮তম অক্ষরেখা বা সমান্তরাল রেখা (38th Parallel) নামে পরিচিত। ৪৯তম সমান্তরাল রেখা যুক্তরাষ্ট্র ও কানাডার সীমারেখা।"
  },
  {
    "id": 9070,
    "number": 70,
    "ref": "bcs48_q70",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "জাতিসংঘের মহাসচিব",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "জাতিসংঘের প্রথম মহাসচিব কে ছিলেন?",
    "options": [
      "উ থান্ট",
      "দগ হ্যামারশোল্ড",
      "ট্রিগভে লি",
      "কুর্ট ওয়াল্ডহেইম"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "জাতিসংঘের প্রথম নির্বাচিত মহাসচিব ছিলেন নরওয়ের নাগরিক ট্রিগভে লি (Trygve Lie, ১৯৪৬-১৯৫২)।"
  },
  {
    "id": 9071,
    "number": 71,
    "ref": "bcs48_q71",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "আন্তর্জাতিক সংস্থা ও মানবাধিকার",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "মানবাধিকার সংস্থা অ্যামনেস্টি ইন্টারন্যাশনাল (Amnesty International)-এর সদর দপ্তর কোথায়?",
    "options": [
      "লন্ডন",
      "প্যারিস",
      "জেনেভা",
      "নিউইয়র্ক"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "১৯৬১ সালে পিটার বেনেনসনের উদ্যোগে প্রতিষ্ঠিত আন্তর্জাতিক মানবাধিকার সংস্থা অ্যামনেস্টি ইন্টারন্যাশনালের কেন্দ্রীয় সদর দপ্তর যুক্তরাজ্যের লন্ডনে অবস্থিত।"
  },
  {
    "id": 9072,
    "number": 72,
    "ref": "bcs48_q72",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "আন্তর্জাতিক পরিবেশ ও চুক্তি",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "বায়ুমণ্ডলের ওজোন স্তর সুরক্ষার জন্য কোন আন্তর্জাতিক চুক্তি স্বাক্ষরিত হয়?",
    "options": [
      "কিয়োটো প্রোটোকল",
      "মন্ট্রিল প্রোটোকল",
      "রামসার কনভেনশন",
      "বাসেল কনভেনশন"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "ওজোন স্তর ক্ষয়কারী সিএফসি (CFC) গ্যাস ও রাসায়নিক নিয়ন্ত্রণের জন্য ১৯৮৭ সালে কানাডার মন্ট্রিলে ঐতিহাসিক 'মন্ট্রিল প্রোটোকল' স্বাক্ষরিত হয়।"
  },
  {
    "id": 9073,
    "number": 73,
    "ref": "bcs48_q73",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "বিশ্ব রাজনীতি ও কূটনীতি",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "যুক্তরাজ্য আনুষ্ঠানিকভাবে ইউরোপীয় ইউনিয়ন (EU) থেকে বের হয়ে যায় (ব্রেক্সিট কার্যকর হয়) কবে?",
    "options": [
      "২৩ জুন ২০১৬",
      "৩১ জানুয়ারি ২০২০",
      "৩১ ডিসেম্বর ২০১৯",
      "১ জানুয়ারি ২০২১"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "২০১৬ সালের ২৩ জুনের গণভোটের পর যুক্তরাজ্য ২০২০ সালের ৩১ জানুয়ারি মধ্যরাতে আনুষ্ঠানিকভাবে ইইউ ত্যাগ করে (ব্রেক্সিট সম্পন্ন হয়)।"
  },
  {
    "id": 9074,
    "number": 74,
    "ref": "bcs48_q74",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "আন্তর্জাতিক নদী ও জলধারা",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "বিশ্বের দীর্ঘতম নদী কোনটি?",
    "options": [
      "আমাজন",
      "নীলনদ",
      "ইয়াংসিকিয়াং",
      "মিসিসিপি"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "বিশ্বের দীর্ঘতম নদী আফ্রিকার নীল নদ (দৈর্ঘ্য প্রায় ৬,৬৫০ কিমি)। আর জলপ্রবাহ ও অববাহিকার আয়তনে বিশ্বের বৃহত্তম নদী আমাজন।"
  },
  {
    "id": 9075,
    "number": 75,
    "ref": "bcs48_q75",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "আন্তর্জাতিক ভূকৌশল",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "সুয়েজ খাল কোন দুটি সাগরকে যুক্ত করেছে?",
    "options": [
      "ভূমধ্যসাগর ও লোহিত সাগর",
      "লোহিত সাগর ও আরব সাগর",
      "কৃষ্ণ সাগর ও ভূমধ্যসাগর",
      "বাল্টিক সাগর ও উত্তর সাগর"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "১৮৬৯ সালে উন্মুক্ত মিসরে অবস্থিত কৃত্রিম সুয়েজ খাল ভূমধ্যসাগরকে লোহিত সাগরের সাথে যুক্ত করে ইউরোপ ও এশিয়ার মধ্যকার নৌ-দূরত্ব কয়েক হাজার মাইল হ্রাস করে।"
  },
  {
    "id": 9076,
    "number": 76,
    "ref": "bcs48_q76",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "বিশ্ব স্বাস্থ্য সংস্থা (WHO)",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "বিশ্ব স্বাস্থ্য সংস্থা (WHO) কত সালে প্রতিষ্ঠিত হয়?",
    "options": [
      "১৯৪৫",
      "১৯৪৭",
      "১৯৪৮",
      "১৯৫০"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "জাতিসংঘের বিশেষায়িত স্বাস্থ্য সংস্থা WHO ১৯৪৮ সালের ৭ এপ্রিল প্রতিষ্ঠিত হয়। তাই প্রতি বছর ৭ এপ্রিল 'বিশ্ব স্বাস্থ্য দিবস' পালিত হয়। এর সদর দপ্তর জেনেভায়।"
  },
  {
    "id": 9077,
    "number": 77,
    "ref": "bcs48_q77",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "জাতিসংঘ নিরাপত্তা পরিষদ",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "জাতিসংঘ নিরাপত্তা পরিষদের স্থায়ী সদস্য দেশ কয়টি?",
    "options": [
      "৫টি",
      "১০টি",
      "১৫টি",
      "৭টি"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "নিরাপত্তা পরিষদের মোট সদস্য ১৫টি। এর মধ্যে ৫টি স্থায়ী সদস্য (ভেটো ক্ষমতাপ্রাপ্ত): যুক্তরাষ্ট্র, যুক্তরাজ্য, ফ্রান্স, রাশিয়া ও চীন। বাকি ১০টি অস্থায়ী সদস্য (২ বছরের জন্য নির্বাচিত)।"
  },
  {
    "id": 9078,
    "number": 78,
    "ref": "bcs48_q78",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "পারমাণবিক নিরস্ত্রীকরণ",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "আন্তর্জাতিক পরমাণু শক্তি সংস্থা (IAEA)-এর সদর দপ্তর কোথায়?",
    "options": [
      "জেনেভা",
      "ভিয়েনা",
      "প্যারিস",
      "রোম"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "পারমাণবিক শক্তির শান্তিপূর্ণ ব্যবহার নিশ্চিতকরণের লক্ষ্যে ১৯৫৭ সালে গঠিত IAEA (International Atomic Energy Agency)-এর সদর দপ্তর অস্ট্রিয়ার ভিয়েনায় অবস্থিত।"
  },
  {
    "id": 9079,
    "number": 79,
    "ref": "bcs48_q79",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "আন্তর্জাতিক দ্বীপ ও অঞ্চল",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "বিশ্বের বৃহত্তম দ্বীপ গ্রিনল্যান্ড কোন দেশের মালিকানাধীন স্বায়ত্তশাসিত অঞ্চল?",
    "options": [
      "কানাডা",
      "যুক্তরাষ্ট্র",
      "ডেনমার্ক",
      "নরওয়ে"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "ভৌগোলিকভাবে উত্তর আমেরিকা মহাদেশে অবস্থিত বিশ্বের বৃহত্তম দ্বীপ গ্রিনল্যান্ড ইউরোপীয় দেশ ডেনমার্কের একটি স্বায়ত্তশাসিত অঙ্গরাজ্য/অঞ্চল।"
  },
  {
    "id": 9080,
    "number": 80,
    "ref": "bcs48_q80",
    "exam": "bcs-general",
    "subject": {
      "name": "International Affairs",
      "name_bn": "আন্তর্জাতিক বিষয়াবলি",
      "slug": "intl-affairs"
    },
    "topic": "আন্তর্জাতিক আদালত ও সনদ",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "আন্তর্জাতিক অপরাধ আদালত (ICC) কোন সনদের মাধ্যমে গঠিত হয়?",
    "options": [
      "রোম সংবিধি (Rome Statute)",
      "জেনেভা সনদ",
      "প্যারিস সনদ",
      "সান ফ্রান্সিসকো চুক্তি"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "১৯৯৮ সালে গৃহীত রোম সংবিধি (Rome Statute)-এর মাধ্যমে আন্তর্জাতিক অপরাধ আদালত (ICC) গঠিত হয় এবং ২০০২ সালের ১ জুলাই থেকে এর বিচারিক কার্যক্রম শুরু হয়।"
  },
  {
    "id": 9081,
    "number": 81,
    "ref": "bcs48_q81",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "বীজগণিতীয় সূত্রাবলি",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "যদি x + y = 7 এবং xy = 10 হয়, তবে (x - y)² এর মান কত?",
    "options": [
      "9",
      "16",
      "25",
      "49"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "আমরা জানি, (x - y)² = (x + y)² - 4xy\n= 7² - 4(10)\n= 49 - 40\n= 9."
  },
  {
    "id": 9082,
    "number": 82,
    "ref": "bcs48_q82",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "শতকরা ও অনুপাত",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "একটি দ্রব্যের বিক্রয়মূল্য ক্রয়মূল্যের ৪/৩ গুণ হলে শতকরা লাভের হার কত?",
    "options": [
      "২৫%",
      "৩৩.৩৩%",
      "২০%",
      "৫০%"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "ধরি, ক্রয়মূল্য = ৩ টাকা। অতএব বিক্রয়মূল্য = ৪ টাকা।\nলাভ = ৪ - ৩ = ১ টাকা।\nশতকরা লাভ = (১ / ৩) × ১০০% = ৩৩.৩৩% (বা ৩৩ ⅓%)।"
  },
  {
    "id": 9083,
    "number": 83,
    "ref": "bcs48_q83",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "ধারা ও অনুক্রম",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "১ + ২ + ৩ + ৪ + ....... + ৫০ = কত?",
    "options": [
      "১২০০",
      "১২৭৫",
      "১২২৫",
      "১৩৫০"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "প্রথম n-সংখ্যক স্বাভাবিক সংখ্যার সমষ্টি = [n(n + 1)] / ২\nএখানে n = ৫০\nসমষ্টি = [৫০ × (৫০ + ১)] / ২ = ২৫ × ৫১ = ১২৭৫।"
  },
  {
    "id": 9084,
    "number": 84,
    "ref": "bcs48_q84",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "সূচক ও লগারিদম",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "log₂ 32 এর মান কত?",
    "options": [
      "3",
      "4",
      "5",
      "6"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "32 = 2⁵\nঅতএব, log₂ 32 = log₂ (2⁵) = 5 log₂ 2 = 5 × 1 = 5."
  },
  {
    "id": 9085,
    "number": 85,
    "ref": "bcs48_q85",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "জ্যামিতি ও ক্ষেত্রফল",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "একটি সমকোণী ত্রিভুজের ভূমি ৮ সেমি এবং উচ্চতা ৬ সেমি হলে, এর অতিভুজের দৈর্ঘ্য কত?",
    "options": [
      "৯ সেমি",
      "১০ সেমি",
      "১২ সেমি",
      "১৪ সেমি"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "পিথাগোরাসের উপপাদ্য অনুযায়ী,\nঅতিভুজ² = ভূমি² + লম্ব²\n= ৮² + ৬² = ৬৪ + ৩৬ = ১০০\nঅতএব, অতিভুজ = √১০০ = ১০ সেমি।"
  },
  {
    "id": 9086,
    "number": 86,
    "ref": "bcs48_q86",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "ঐকিক নিয়ম ও কাজ",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "ক একটি কাজ ১০ দিনে এবং খ তা ১৫ দিনে করতে পারে। তারা একত্রে কাজটি কত দিনে শেষ করতে পারবে?",
    "options": [
      "৫ দিন",
      "৬ দিন",
      "৭ দিন",
      "৮ দিন"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "ক ১ দিনে করে ১/১০ অংশ এবং খ ১ দিনে করে ১/১৫ অংশ।\nএকত্রে ১ দিনে করে (১/১০ + ১/১৫) = (৩ + ২)/৩০ = ৫/৩০ = ১/৬ অংশ।\nসুতরাং তারা একত্রে কাজটি ৬ দিনে সম্পন্ন করতে পারবে।"
  },
  {
    "id": 9087,
    "number": 87,
    "ref": "bcs48_q87",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "অনুপাত ও মিশ্রণ",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "দুটি সংখ্যার অনুপাত ৫ : ৭ এবং তাদের গ.সা.গু ৪ হলে, সংখ্যা দুটির ল.সা.গু কত?",
    "options": [
      "১০০",
      "১২০",
      "১৪০",
      "১৬০"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "সংখ্যা দুটি = ৫ × ৪ = ২০ এবং ৭ × ৪ = ২৮।\nল.সা.গু = ২০ ও ২৮ এর ল.সা.গু = ৪ × ৫ × ৭ = ১৪০।"
  },
  {
    "id": 9088,
    "number": 88,
    "ref": "bcs48_q88",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "মানসিক দক্ষতা - দিক নির্ণয়",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "এক ব্যক্তি উত্তর দিকে ৪ কিমি গিয়ে ডানদিকে ঘুরে ৩ কিমি পথ গেল। যাত্রা স্থান থেকে সে সোজা কত দূরত্বে আছে?",
    "options": [
      "৫ কিমি",
      "৬ কিমি",
      "৭ কিমি",
      "৮ কিমি"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "এটি একটি সমকোণী ত্রিভুজ তৈরি করে যার লম্ব ৪ কিমি এবং ভূমি ৩ কিমি।\nসরাসরি দূরত্ব = √(৪² + ৩²) = √(১৬ + ৯) = √২৫ = ৫ কিমি।"
  },
  {
    "id": 9089,
    "number": 89,
    "ref": "bcs48_q89",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "মানসিক দক্ষতা - সম্পর্ক নির্ণয়",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "রহিম বললেন, 'ওই মহিলাটি আমার বাবার একমাত্র ছেলের মেয়ে।' মহিলাটি রহিমের কী হন?",
    "options": [
      "বোন",
      "মেয়ে",
      "ভাগ্নি",
      "ভাতিজি"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "রহিমের বাবার একমাত্র ছেলে রহিম নিজে। অতএব, রহিমের বাবার একমাত্র ছেলের মেয়ে অর্থাৎ রহিমের নিজের মেয়ে।"
  },
  {
    "id": 9090,
    "number": 90,
    "ref": "bcs48_q90",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "মানসিক দক্ষতা - সংখ্যা সিরিজ",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "ধারাটির পরবর্তী সংখ্যাটি কত? ৩, ৭, ১৫, ৩১, ৬৩, .....?",
    "options": [
      "৯৫",
      "১০৮",
      "১২৭",
      "১৩৫"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "নিয়ম: পূর্ববর্তী সংখ্যা × ২ + ১\n৩ × ২ + ১ = ৭\n৭ × ২ + ১ = ১৫\n১৫ × ২ + ১ = ৩১\n৩১ × ২ + ১ = ৬৩\n৬৩ × ২ + ১ = ১২৭।"
  },
  {
    "id": 9091,
    "number": 91,
    "ref": "bcs48_q91",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "বিন্যাস ও সমাবেশ",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "১০ জন ব্যক্তির একটি দল থেকে কত উপায়ে ৩ জনের একটি কমিটি গঠন করা যায়?",
    "options": [
      "১০০",
      "১২০",
      "১৫০",
      "৭২০"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "সমাবেশ সূত্র অনুযায়ী, ¹⁰C₃ = (১০ × ৯ × ৮) / (৩ × ২ × ১) = ৭২০ / ৬ = ১২০ উপায়ে।"
  },
  {
    "id": 9092,
    "number": 92,
    "ref": "bcs48_q92",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "সম্ভাবনা (Probability)",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "একটি নিরপেক্ষ ছক্কা একবার নিক্ষেপ করলে মৌলিক সংখ্যা উঠার সম্ভাবনা কত?",
    "options": [
      "১/২",
      "১/৩",
      "১/৬",
      "২/৩"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "ছক্কার মোট সম্ভাব্য ফলাফল = {১, ২, ৩, ৪, ৫, ৬} অর্থাৎ ৬টি।\nমৌলিক সংখ্যা = {২, ৩, ৫} অর্থাৎ ৩টি।\nসম্ভাবনা = ৩/৬ = ১/২।"
  },
  {
    "id": 9093,
    "number": 93,
    "ref": "bcs48_q93",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "বৃত্ত ও পরিমিতি",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "একটি বৃত্তের ব্যাসার্ধ দ্বিগুণ করা হলে এর ক্ষেত্রফল কতগুণ বৃদ্ধি পাবে?",
    "options": [
      "২ গুণ",
      "৩ গুণ",
      "৪ গুণ",
      "৮ গুণ"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "বৃত্তের ক্ষেত্রফল A = πr²। ব্যাসার্ধ r দ্বিগুণ (2r) করা হলে নতুন ক্ষেত্রফল হবে π(2r)² = 4πr², অর্থাৎ ক্ষেত্রফল ৪ গুণ হবে।"
  },
  {
    "id": 9094,
    "number": 94,
    "ref": "bcs48_q94",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "মানসিক দক্ষতা - সাদৃশ্য",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "bn",
    "body": "কলম : কালি :: বন্দুক : ?",
    "options": [
      "যুদ্ধ",
      "গুলি",
      "শিকার",
      "সেনা"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "কলমের জ্বালানি বা অভ্যন্তরীণ উপকরণ যেমন কালি, তেমনি বন্দুকের প্রয়োজনীয় গুলি (কার্তুজ)।"
  },
  {
    "id": 9095,
    "number": 95,
    "ref": "bcs48_q95",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "মানসিক দক্ষতা - দিন নির্ণয়",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "আজ শুক্রবার হলে আজ থেকে ৬০ দিন পর কী বার হবে?",
    "options": [
      "মঙ্গলবার",
      "বুধবার",
      "বৃহস্পতিবার",
      "শুক্রবার"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "প্রতি ৭ দিন পর পর একই বার ফিরে আসে।\n৬০ কে ৭ দিয়ে ভাগ করলে: ৬০ = (৭ × ৮) + ৪, অর্থাৎ অবশিষ্ট থাকে ৪ দিন।\nশুক্রবার + ৪ দিন = শনিবার (১), রবিবার (২), সোমবার (৩), মঙ্গলবার (৪)। সুতরাং ৬০ দিন পর মঙ্গলবার হবে।"
  },
  {
    "id": 9096,
    "number": 96,
    "ref": "bcs48_q96",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "মানসিক দক্ষতা - বর্ণমালা সিরিজ",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Find the missing letter in the sequence: A, C, F, J, O, _____?",
    "options": [
      "S",
      "T",
      "U",
      "V"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Alphabet positions difference:\nA (1) + 2 = C (3)\nC (3) + 3 = F (6)\nF (6) + 4 = J (10)\nJ (10) + 5 = O (15)\nO (15) + 6 = U (21).\nSo the missing letter is U."
  },
  {
    "id": 9097,
    "number": 97,
    "ref": "bcs48_q97",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "গতিবেগ ও দূরত্ব",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "ঘণ্টায় ৬০ কিমি বেগে চলমান একটি ট্রেন ৩০ সেকেন্ডে একটি খুঁটি অতিক্রম করে। ট্রেনটির দৈর্ঘ্য কত?",
    "options": [
      "৪০০ মিটার",
      "৪৫০ মিটার",
      "৫০০ মিটার",
      "৬০০ মিটার"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "৬০ কিমি/ঘণ্টা = (৬০ × ১০০০) / ৩৬০০ মি/সে = ৫০/৩ মিটার/সেকেন্ড।\nএকটি খুঁটি অতিক্রম করতে ট্রেনটিকে নিজের দৈর্ঘ্যের সমান দূরত্ব অতিক্রম করতে হয়।\nদূরত্ব (দৈর্ঘ্য) = বেগ × সময় = (৫০/৩) × ৩০ = ৫০০ মিটার।"
  },
  {
    "id": 9098,
    "number": 98,
    "ref": "bcs48_q98",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "মানসিক দক্ষতা - ঘড়ির কাঁটা",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "bn",
    "body": "একটি ঘড়িতে যখন দুপুর ২:৩০ বাজে, তখন ঘণ্টার কাঁটা ও মিনিটের কাঁটার মধ্যবর্তী কোণ কত ডিগ্রি?",
    "options": [
      "১০০°",
      "১০৫°",
      "১১০°",
      "১১৫°"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "কোণ নির্ণয়ের সূত্র: |(১১M - ৬০H) / ২|\nএখানে H = ২, M = ৩০\n= |(১১ × ৩০ - ৬০ × ২) / ২|\n= |(৩৩০ - ১২০) / ২|\n= |২১০ / ২| = ১০৫°।"
  },
  {
    "id": 9099,
    "number": 99,
    "ref": "bcs48_q99",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "মানসিক দক্ষতা - কোডিং ডিকোডিং",
    "difficulty": "easy",
    "source": "48th BCS",
    "lang": "en",
    "body": "If BOOK is coded as 43, then PEN is coded as:",
    "options": [
      "32",
      "35",
      "38",
      "40"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Sum of alphabetical positions:\nBOOK = B(2) + O(15) + O(15) + K(11) = 43.\nPEN = P(16) + E(5) + N(14) = 35."
  },
  {
    "id": 9100,
    "number": 100,
    "ref": "bcs48_q100",
    "exam": "bcs-general",
    "subject": {
      "name": "Mathematics & Reasoning",
      "name_bn": "গাণিতিক যুক্তি ও মানসিক দক্ষতা",
      "slug": "math"
    },
    "topic": "দ্বিঘাত সমীকরণ",
    "difficulty": "hard",
    "source": "48th BCS",
    "lang": "bn",
    "body": "k এর মান কত হলে kx² + 3x + 4 = 0 সমীকরণের মূলদ্বয় পরস্পর সমান হবে?",
    "options": [
      "9/16",
      "16/9",
      "3/4",
      "4/3"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "ax² + bx + c = 0 সমীকরণের মূলদ্বয় বাস্তব ও সমান হওয়ার শর্ত হলো নিশ্চায়ক D = b² - 4ac = 0।\nএখানে a = k, b = 3, c = 4\n∴ 3² - 4 × k × 4 = 0\n⇒ 9 - 16k = 0\n⇒ 16k = 9\n∴ k = 9/16।"
  },
  {
    "id": 9101,
    "number": 101,
    "ref": "bcs48_q101",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Symptoms of mild shock is",
    "options": [
      "Rise of respiratory rate",
      "Fall of blood pressure",
      "Reduced Urinary output",
      "Coma"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Rise of respiratory rate:\tIn mild (compensated) shock,\nthe body attempts to maintain perfusion by increasing\nrespiratory rate and heart rate.\nOther Options:\nখ)\tFall of blood pressure: This is a sign of\ndecompensated (moderate to severe) shock, not mild.\nগ)\tReduced Urinary output: Typically occurs in\nmoderate to severe shock.\nঘ)\tComa: Suggests severe cerebral hypoperfusion, a late\nand severe sign."
  },
  {
    "id": 9102,
    "number": 102,
    "ref": "bcs48_q102",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Majority of body fluid remains in",
    "options": [
      "Blood",
      "Intra cellular fluid",
      "Interstitial fluid",
      "Lymph"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Intracellular fluid:\tAbout 2/3 of total body water is\ninside cells.\nOther Options:\nক)\tBlood: Only a small portion of extracellular fluid.\nগ)\tInterstitial fluid: It’s part of extracellular fluid but\nless than intracellular.\nঘ)\tLymph: Very small percentage."
  },
  {
    "id": 9103,
    "number": 103,
    "ref": "bcs48_q103",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Complication of Caesarean section is",
    "options": [
      "Postpartum Hemorrhage",
      "Vaginal stenosis",
      "Low platelet count",
      "Injury to liver"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Postpartum Hemorrhage:\tCommon complication due to\nuterine atony or surgical trauma.\nOther Options:\nখ)\tVaginal stenosis: Not related to C-section.\nগ)\tLow platelet count: Not a direct complication.\nঘ)\tInjury to liver: Rare and usually only with very\ndifficult upper-segment surgeries."
  },
  {
    "id": 9104,
    "number": 104,
    "ref": "bcs48_q104",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "The antigen presenting cell on skin is",
    "options": [
      "Basal cells",
      "Keralinocytes",
      "Langerhan cells",
      "Melanocytes"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Langerhan cells:\tDendritic cells in the epidermis;\npresent antigen to T-cells.\nOther Options:\nক)\tBasal cells: Keratinocyte precursors.\nখ)\tKeratinocytes: Structural role, not APCs.\nঘ)\tMelanocytes: Pigment-producing, not immune cells."
  },
  {
    "id": 9105,
    "number": 105,
    "ref": "bcs48_q105",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "The largerst tributaries that drain into inferior Vena Cava is",
    "options": [
      "Left renal Vein",
      "Lumber Veins",
      "Hepatic Veins",
      "Right Renal Vein"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Hepatic veins:\tLarge vessels draining blood from liver\ndirectly into IVC.\nOther Options:\nক)\tLeft renal vein: Drains left kidney.\nখ)\tLumbar veins: Small tributaries.\nঘ)\tRight renal vein: Similar to left, but not the largest."
  },
  {
    "id": 9106,
    "number": 106,
    "ref": "bcs48_q106",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Carpal tunnel consists of",
    "options": [
      "Median nerve",
      "Musculocutaneous nerve",
      "Radial nerve",
      "Ulnar nerve"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Median nerve:\tPasses through carpal tunnel and is\ncompressed in carpal tunnel syndrome.\nOther Options:\nখ) Musculocutaneous nerve: Supplies anterior arm\nmuscles.\nগ) Radial nerve: Does not pass through carpal tunnel.\nঘ) Ulnar nerve: Passes through Guyon’s canal, not\ncarpal tunnel."
  },
  {
    "id": 9107,
    "number": 107,
    "ref": "bcs48_q107",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Late sign of death is",
    "options": [
      "adipocere formation",
      "cooling of body",
      "dilatation of pupils",
      "rigor mortis"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Adipocere formation:\tPostmortem change occurring\nafter days/weeks; sign of late decomposition.\nOther Options:\nখ)\tCooling of body: Early sign (algor mortis).\nগ)\tDilatation of pupils: Early sign.\nঘ)\tRigor mortis: Appears within hours."
  },
  {
    "id": 9108,
    "number": 108,
    "ref": "bcs48_q108",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Genital fistula can be prevented by",
    "options": [
      "Improving essential obstetric care",
      "Early operations of fibroid uterus",
      "Treating PID cases",
      "correcting maternal anaemia"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "care\nImproving essential obstetric care:\tPrevents obstructed\nlabor, the most common cause.\nOther Options:\nখ)\tEarly operations of fibroid uterus: Not directly\npreventive.\nগ)\tTreating PID cases: PID is not a major cause of\ngenital fistula.\nঘ)\tCorrecting maternal anemia: Important for general\nhealth, not directly for fistula."
  },
  {
    "id": 9109,
    "number": 109,
    "ref": "bcs48_q109",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Detection of hidden disease among apparently healthy population is done by",
    "options": [
      "Screening",
      "Intervention",
      "Contact tracing",
      "Follow-up"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Screening:\tEarly detection among asymptomatic people\n(e.g., breast cancer screening).\nOther Options:\nখ)\tIntervention: Comes after detection.\nগ)\tContact tracing: Related to infectious diseases, not\ngeneral screening.\nঘ)\tFollow-up: For known cases, not for detection."
  },
  {
    "id": 9110,
    "number": 110,
    "ref": "bcs48_q110",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Feature of atropinization is",
    "options": [
      "Mild dialated pupil",
      "Tachycardia",
      "Crepitation in Lungs",
      "Bronchorrhoea"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Tachycardia:\tClassic sign due to vagal inhibition.\nOther Options:\nক)\tMild dilated pupil: Atropine causes marked dilatation.\nগ)\tCrepitation in lungs: Suggestive of pulmonary\nedema/infection, not atropine.\nঘ)\tBronchorrhoea: Atropine reduces secretions, used to\ntreat bronchorrhoea."
  },
  {
    "id": 9111,
    "number": 111,
    "ref": "bcs48_q111",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Indication of hospitalization of a burn patient is",
    "options": [
      "5% burn in the trunk of an adult patient",
      "10% burn in the trunk of a child",
      "Inhalation burn",
      "10% Circumferential burn in the lower limb"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Inhalation burn:\tSerious complication, needs airway\nmanagement, oxygenation, and ICU.\nOther Options:\nক)\t5% burn in the trunk of an adult: Minor burn — can\nbe managed outpatient.\nখ)\t10% burn in the trunk of a child: Moderate — may\nneed observation but not a strong indication.\nঘ)\t10% circumferential burn in the lower limb:\nImportant but not an immediate life threat unless it\ncompromises circulation."
  },
  {
    "id": 9112,
    "number": 112,
    "ref": "bcs48_q112",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "The most common type of anaemia in pregnancy is",
    "options": [
      "Thalassemia",
      "Hereditary Spherocytosis",
      "Iron deficiency anemia",
      "Folic acid deficiency anaemia"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Iron deficiency anemia:\tDue to increased demand and\ndietary insufficiency in pregnancy.\nOther Options:\nক)\tThalassemia: Genetic and less common.\nখ)\tHereditary Spherocytosis: Rare inherited condition.\nঘ)\tFolic acid deficiency anaemia: Second most common,\nbut not the top one."
  },
  {
    "id": 9113,
    "number": 113,
    "ref": "bcs48_q113",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Oligo hydromnios is sever in",
    "options": [
      "Gestational Diabetes",
      "Anencephaly",
      "Nulliparous women",
      "Renal agenesis of fetus"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Renal agenesis:\tKidneys produce urine, which is a major\ncomponent of amniotic fluid. Without kidneys → severe\noligohydramnios.\nক)\tGestational diabetes: More often causes\npolyhydramnios.\nখ)\tAnencephaly: Also associated with polyhydramnios.\nগ)\tNulliparous women: Parity doesn’t directly relate to\namniotic fluid."
  },
  {
    "id": 9114,
    "number": 114,
    "ref": "bcs48_q114",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Which of the following is not a typical presentation of pain in acute pancreatitis?",
    "options": [
      "Severe constant upper abdominal pain",
      "Radiation pain to back",
      "Absent muscle guarding",
      "Presence of rebound tenderness"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Absent muscle guarding:\tTypically there is muscle\nguarding (peritonitis sign).\nOther Options:\nক)\tSevere constant upper abdominal pain: Classical\nfeature.\nখ)\tRadiation to back: Common due to retroperitoneal\nlocation of pancreas.\nঘ)\tRebound tenderness: Can occur due to peritoneal\nirritation."
  },
  {
    "id": 9115,
    "number": 115,
    "ref": "bcs48_q115",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Which of the following signs is characteristic for Stevens-Jhonson syndrome?",
    "options": [
      "Koebner phenomenon",
      "Auspitz sign",
      "Dimple sign",
      "Nikolsky sign"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Nikolsky sign:\tSkin sloughs off with slight rubbing —\nseen in SJS, TEN.\nOther Options:\nক)\tKoebner phenomenon: Seen in psoriasis and lichen\nplanus.\nখ)\tAuspitz sign: Pinpoint bleeding in psoriasis.\nগ)\tDimple sign: Seen in dermatofibroma."
  },
  {
    "id": 9116,
    "number": 116,
    "ref": "bcs48_q116",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Nerve responsible for sensation of smell is",
    "options": [
      "Olfactory",
      "Trigeminal",
      "Facial",
      "Oculomotor"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Olfactory:\tCN I — purely sensory, for smell.\nOther Options:\nখ)\tTrigeminal: Touch/pain/temp of face.\nগ)\tFacial: Taste (anterior 2/3 tongue), not smell.\nঘ)\tOculomotor: Eye movement, not sensory."
  },
  {
    "id": 9117,
    "number": 117,
    "ref": "bcs48_q117",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Lining of urinary tract is",
    "options": [
      "Ciliated Columnar epithelium",
      "Endothelium",
      "Mesothelium",
      "Transitional epithelium"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Transitional epithelium:\tSpecialized to stretch — seen\nin renal pelvis, ureter, bladder.\nOther Options:\nক)\tCiliated columnar epithelium: Found in respiratory\ntract.\nখ)\tEndothelium: Lines blood vessels.\nগ)\tMesothelium: Lines body cavities (pleura,\nperitoneum)."
  },
  {
    "id": 9118,
    "number": 118,
    "ref": "bcs48_q118",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "The base of heart is formed mainly by",
    "options": [
      "Left atrium",
      "Left Ventricle",
      "Right atrium",
      "Right Ventricle"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Left atrium:\tLies posteriorly, forms base of heart\n(posterior surface).\nOther Options:\nখ)\tLeft ventricle: Forms apex and part of diaphragmatic\nsurface.\nগ)\tRight atrium: Right border.\nঘ)\tRight ventricle: Forms anterior surface."
  },
  {
    "id": 9119,
    "number": 119,
    "ref": "bcs48_q119",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Causative Organism responsible for Cervical cancer",
    "options": [
      "HSV",
      "HPV",
      "Chlamydia",
      "Herpes zoster"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "HPV:\tEspecially high-risk types 16 & 18 cause cervical\nintraepithelial neoplasia (CIN).\nOther Options:\nক)\tHSV: Not linked to cervical cancer.\nগ)\tChlamydia: Can cause PID but not cancer.\nঘ)\tHerpes zoster: Reactivation of varicella-zoster virus,\nnot linked to cancer."
  },
  {
    "id": 9120,
    "number": 120,
    "ref": "bcs48_q120",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Feature of a malignant ulcer is",
    "options": [
      "Undermined edge",
      "Punched out edge",
      "Everted edge",
      "sloping edge"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Everted edge:\tTypical of squamous cell carcinoma\nulcers.\nOther Options:\nক)\tUndermined edge: Seen in TB ulcers.\nখ)\tPunched out edge: Common in trophic or gummatous\nsyphilitic ulcers.\nঘ)\tSloping edge: Found in healing ulcers."
  },
  {
    "id": 9121,
    "number": 121,
    "ref": "bcs48_q121",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Part of Parasympathetic nervous system is",
    "options": [
      "Celiac ganglion",
      "Cervical ganglion",
      "Ciliary ganglion",
      "Sacral ganglion"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Ciliary ganglion:\tA parasympathetic ganglion supplying\nthe eye.\nOther Options:\nক)\tCeliac ganglion: Part of sympathetic nervous system.\nখ)\tCervical ganglion: Also sympathetic (e.g., superior\ncervical ganglion).\nঘ)\tSacral ganglion: Anatomically refers to sympathetic\nchain ganglia."
  },
  {
    "id": 9122,
    "number": 122,
    "ref": "bcs48_q122",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Example of probability sampling is",
    "options": [
      "Stratified random sampling",
      "Quota sampling",
      "Purposive sampling",
      "Accidental sampling"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Stratified random sampling:\tPopulation is divided into\nstrata, then randomly sampled — a type of probability\nsampling.\nOther Options:\nখ)\tQuota sampling: Non-probability sampling, though\nsimilar to stratified.\nগ)\tPurposive sampling: Also non-probability — based on\njudgment.\nঘ)\tAccidental sampling: A type of convenience sampling,\nnot probability-based."
  },
  {
    "id": 9123,
    "number": 123,
    "ref": "bcs48_q123",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Indication of Circumcision",
    "options": [
      "Epispadias",
      "Hypospadias",
      "Undescended Testes",
      "Phimosis"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Phimosis:\tTight foreskin that can’t be retracted — most\ncommon indication for circumcision.\nOther Options:\nক)\tEpispadias: Surgical correction needed, but not by\ncircumcision.\nখ)\tHypospadias: Circumcision is avoided because\nforeskin may be used for repair.\nগ)\tUndescended testes: Not related to foreskin."
  },
  {
    "id": 9124,
    "number": 124,
    "ref": "bcs48_q124",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Congenital malformation can be attributed to maternal infection with-",
    "options": [
      "poliomyelitis",
      "Measles",
      "Chicken Pox",
      "Toxoplasmosis"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "TORCH infections cause congenital anomalies:\nT = Toxoplasmosis\nO = Other (Syphilis, VZV)\nR = Rubella\nC = CMV\nH = HSV\nPolio, measles, chickenpox: Less commonly associated\nwith congenital malformations."
  },
  {
    "id": 9125,
    "number": 125,
    "ref": "bcs48_q125",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Programmed cell death is regulated by",
    "options": [
      "Endoplasmic reticulum",
      "Golgi apparatus",
      "Lysosome",
      "Mitochondria"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Mitochondria:\tRelease cytochrome c, activating caspases\n→ apoptosis.\nOther Options:\nক)\tEndoplasmic reticulum: Involved in protein\nsynthesis/folding.\nখ)\tGolgi apparatus: Involved in protein\nprocessing/packaging.\nগ)\tLysosome: Involved in autophagy, not apoptosis."
  },
  {
    "id": 9126,
    "number": 126,
    "ref": "bcs48_q126",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Utero-vaginal prolapse",
    "options": [
      "is a very painful condition",
      "is worse in erect posture",
      "is common in nulliparous women",
      "may resolve spontaneously"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Worse in erect posture:\tGravity worsens the prolapse\nsymptoms.\nOther Options:\nক)\tVery painful: Usually painless; heaviness or dragging\nsensation is common.\nগ)\tCommon in nulliparous: More common in\nmultiparous women.\nঘ)\tMay resolve spontaneously: Usually requires pelvic\nfloor exercises or surgery."
  },
  {
    "id": 9127,
    "number": 127,
    "ref": "bcs48_q127",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Fever is mediated by",
    "options": [
      "Bradykinin",
      "Complements",
      "Hageman factor",
      "Interleukin-1"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Interleukin-1:\tA pyrogen that acts on the hypothalamus\nto raise body temperature.\nOther Options:\nক)\tBradykinin: Involved in pain and vasodilation.\nখ)\tComplement: Role in immunity, not fever.\nগ)\tHageman factor: Initiates clotting and inflammation."
  },
  {
    "id": 9128,
    "number": 128,
    "ref": "bcs48_q128",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "ln Ectopic pregnancy",
    "options": [
      "Bleeding precedes pain",
      "Isthmus of fallopian tube in the commonest site of ectopic implantation",
      "incidence is more common among women taking oral contraceptives for long time",
      "Abdominal pain preceded by amenorrhoea"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "amenorrhoea\nAbdominal pain preceded by amenorrhoea:\tClassical\ntriad — amenorrhoea → pain → bleeding.\nOther Options:\nক)\tBleeding precedes pain: Usually pain precedes or\ncoincides with bleeding.\nখ)\tIsthmus is the commonest site: Ampulla of fallopian\ntube is most common.\nগ)\tMore common among OCP users: OCPs reduce risk of\nectopic."
  },
  {
    "id": 9129,
    "number": 129,
    "ref": "bcs48_q129",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Primary blood buffer system is",
    "options": [
      "Ammonia buffer",
      "Bicarbonate buffer",
      "Phosphate buffer",
      "Protein buffer"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Bicarbonate buffer:\tMain buffer in plasma. HCO₃⁻ + H⁺\n↔ H₂CO₃\n↔ CO₂ + H₂O.\nOther Options:\nক)\tAmmonia buffer: Important in renal tubules, not\nprimary in blood.\nগ)\tPhosphate buffer: Also renal, not primary in blood.\nঘ)\tProtein buffer: Contributes, but not the primary."
  },
  {
    "id": 9130,
    "number": 130,
    "ref": "bcs48_q130",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Absolute indication of splenectomy is",
    "options": [
      "Lymphoma",
      "Thelassemia",
      "Leukemia",
      "Grade V spleen injury"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Grade V spleen injury:\tMassive injury with shattered\nspleen — life-saving splenectomy.\nOther Options:\nক)\tLymphoma: Not absolute — only if symptomatic or\ndiagnostic need.\nখ)\tThalassemia: Relative indication — if hypersplenism\nor transfusion-dependent.\nগ)\tLeukemia: Again, not absolute."
  },
  {
    "id": 9131,
    "number": 131,
    "ref": "bcs48_q131",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Leukocyte induced acute tissue injury is",
    "options": [
      "Arthritis",
      "Asthma",
      "Atherosclerosis",
      "Pulmonary fibrosis"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Arthritis:\tCorrect. In acute inflammatory arthritis (like\ngout or septic arthritis), neutrophils infiltrate joints and\nrelease enzymes and ROS causing tissue damage.\nExample: Gouty arthritis involves urate crystals that\nattract neutrophils, leading to leukocyte-mediated\ninjury.\nOther Options:\nখ)\tAsthma\n• Though leukocytes like eosinophils play a role in\nchronic inflammation in asthma, it is not primarily an\nacute leukocyte-induced tissue injury.\n• It is more of a chronic hypersensitivity reaction.\nগ)\tAtherosclerosis\n• \tIt is a chronic inflammatory disease, with\nmacrophages and T cells playing a long-term role in\nplaque formation.\n• \tNot typically classified under acute leukocyte-induced\ninjury.\nঘ)\tPulmonary fibrosis\n• \tThis is the result of chronic inflammation and repair,\noften involving fibroblast activation and collagen\ndeposition.\n• \tIt’s chronic, not acute, and leukocyte injury is not the\npredominant mechanism."
  },
  {
    "id": 9132,
    "number": 132,
    "ref": "bcs48_q132",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Most common cause of Epistaxis is",
    "options": [
      "Idiopathic",
      "Hypertension",
      "Thrombocytopenia",
      "Coagulation disorder"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Idiopathic:\tMost common cause, especially from Little’s\narea/Kiesselbach’s plexus.\nOther Options:\nখ)\tHypertension: A known cause, especially in older\nadults, but not the most common.\nগ)\tThrombocytopenia: Rare, usually associated with\ngeneralized bleeding.\nঘ)\tCoagulation disorder: Less common and usually seen\nin known bleeding disorders."
  },
  {
    "id": 9133,
    "number": 133,
    "ref": "bcs48_q133",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Choice of intravenous fluid in burn patient is",
    "options": [
      "Hartman's solution",
      "5% Dextrose in Aqua",
      "5% Dextrose in normal saline",
      "Hypertonic Normal saline"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Hartmann’s (Ringer’s lactate):\tBest fluid for initial\nresuscitation in burns — closely mimics plasma.\nOther Options:\nখ)\t5% Dextrose in Aqua: No electrolytes, not suitable for\nvolume resuscitation.\nগ)\t5% Dextrose in normal saline: Hyperosmolar, not\nideal for large-volume replacement.\nঘ)\tHypertonic saline: Can cause fluid shifts, not first-\nline."
  },
  {
    "id": 9134,
    "number": 134,
    "ref": "bcs48_q134",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Most activity growing area of a long bone is",
    "options": [
      "Diaphysis",
      "Epiphysis",
      "Epiphysial Cartilage",
      "Metaphysis"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Epiphyseal cartilage (growth plate):\tSite of longitudinal\ngrowth.\nOther Options:\nক)\tDiaphysis: Shaft of the bone, not growth center.\nখ)\tEpiphysis: End part of bone but not the main growth\nplate.\nঘ)\tMetaphysis: Rich vascular area but not the growth\nzone itself."
  },
  {
    "id": 9135,
    "number": 135,
    "ref": "bcs48_q135",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "In ECG, which feature is indicative for thrombolytic therapy?",
    "options": [
      "New onset LBBB",
      "ST depression",
      "Appearance of Q wave",
      "T inversion"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "New onset LBBB:\tConsidered a STEMI equivalent —\nimmediate thrombolysis or PCI is warranted.\nOther Options:\nখ)\tST depression: Indicates ischemia but not a trigger\nfor thrombolysis.\nগ)\tAppearance of Q wave: Indicates old infarct.\nঘ)\tT inversion: Can be seen in ischemia but not an\nindication for thrombolytics."
  },
  {
    "id": 9136,
    "number": 136,
    "ref": "bcs48_q136",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Secondary hypertension is caused by",
    "options": [
      "Conn's Syndrome",
      "Burn",
      "Renal ischemia",
      "Septic Shock"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Conn’s Syndrome:\tPrimary hyperaldosteronism →\nsodium retention → HTN → secondary HTN.\nOther Options:\nখ)\tBurn: Can lead to fluid shifts but not chronic HTN.\nগ)\tRenal ischemia: True, also causes secondary HTN (via\nrenin-angiotensin), but not the best choice over Conn’s.\nঘ)\tSeptic shock: Associated with hypotension, not HTN."
  },
  {
    "id": 9137,
    "number": 137,
    "ref": "bcs48_q137",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Component of Active management of third stage of labour (AMTSL) is",
    "options": [
      "Aortic compression",
      "inj. Oxytocin 10 units IM",
      "Perineal message",
      "examination of cervix"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Oxytocin 10 units IM:\tGold standard to prevent\npostpartum hemorrhage.\nOther Options:\nক)\tAortic compression: Emergency measure in PPH, not\nroutine AMTSL.\nগ)\tPerineal massage: Not part of AMTSL.\nঘ)\tCervix exam: Done but not a component of AMTSL."
  },
  {
    "id": 9138,
    "number": 138,
    "ref": "bcs48_q138",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Mycobacterium tuberculosis is stained by",
    "options": [
      "Giemsa stain",
      "Gram stain",
      "Silver stain",
      "Ziehl-Neelson stain"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Ziehl-Neelsen stain:\tAcid-fast stain — stains mycolic\nacid in MTB cell wall.\nOther Options:\nক)\tGiemsa: Used for parasites like malaria.\nখ)\tGram stain: Mycobacteria are gram-indeterminate.\nগ)\tSilver stain: For fungi, pneumocystis."
  },
  {
    "id": 9139,
    "number": 139,
    "ref": "bcs48_q139",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Cephalosporin appropriate for renal impairment is",
    "options": [
      "Cefazolin",
      "Cefotetan",
      "Ceftriaxone",
      "Cefuroxime"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Ceftriaxone:\tMostly excreted by liver → safer in renal\nimpairment.\nOther Options:\nক)\tCefazolin: Requires dose adjustment in renal failure.\nখ)\tCefotetan: Dose adjustment needed.\nঘ)\tCefuroxime: Excreted renally → not ideal without\ndose adjustment."
  },
  {
    "id": 9140,
    "number": 140,
    "ref": "bcs48_q140",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "First step in blood coagulation is",
    "options": [
      "Activation of clotting factors",
      "Clot retraction",
      "Fibrin mesh formation",
      "Platelet aggregation"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Platelet aggregation:\tInitial step — forms the temporary\nhemostatic plug.\nOther Options:\nক)\tActivation of clotting factors: Occurs after platelet\nplug forms.\nখ)\tClot retraction: Final phase of hemostasis.\nগ)\tFibrin mesh formation: Later stage to stabilize clot."
  },
  {
    "id": 9141,
    "number": 141,
    "ref": "bcs48_q141",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Acid-Peptic disease include",
    "options": [
      "Inflammatory bowel disease",
      "Irritable bowel syndrome",
      "Non-ulcer dyspepsia",
      "Pyloric stenosis"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Non-ulcer dyspepsia:\tA functional disorder under acid-\npeptic spectrum (includes gastritis, GERD, peptic ulcer).\nOther Options:\nক)\tInflammatory bowel disease: Autoimmune condition\naffecting the colon and small intestine.\nখ)\tIrritable bowel syndrome: Functional GI disorder;\nunrelated to acid or ulcers.\nঘ)\tPyloric stenosis: Mechanical obstruction, not\nprimarily acid-related."
  },
  {
    "id": 9142,
    "number": 142,
    "ref": "bcs48_q142",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Cause of maternal death in Eclumpsia is",
    "options": [
      "Retained Placenta",
      "Ruptured Uterus",
      "Cerebral hemorrhage",
      "Septicemia"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Cerebral hemorrhage:\tRaised BP → hemorrhage →\ncoma/death — commonest direct cause in eclampsia.\nther Options:\nক)\tRetained placenta: Causes hemorrhage but not the\nusual cause of death in eclampsia.\nখ)\tRuptured uterus: Obstetric emergency but not due to\neclampsia.\nঘ)\tSepticemia: Less likely unless secondary infection\noccurs."
  },
  {
    "id": 9143,
    "number": 143,
    "ref": "bcs48_q143",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Which of the following drug can be used in a pregnant lady with Rheumatoid Arthritis?",
    "options": [
      "Methotrexate",
      "Salfasalazine",
      "Leflunamide",
      "Mycophenolate Mofetil"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Sulfasalazine:\tSafe in pregnancy; commonly used in\ninflammatory arthritis.\nOther Options:\nক)\tMethotrexate: Teratogenic — contraindicated.\nগ)\tLeflunomide: Highly teratogenic; contraindicated.\nঘ)\tMycophenolate mofetil: Teratogenic\nimmunosuppressant."
  },
  {
    "id": 9144,
    "number": 144,
    "ref": "bcs48_q144",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Fibrinolysis is done by",
    "options": [
      "Plasminogen",
      "Prothrombin",
      "Fibrinogen",
      "Haptoglobin"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Plasminogen:\tConverted to plasmin → breaks down\nfibrin clots.\nOther Options:\nখ)\tProthrombin: Involved in coagulation, not fibrinolysis.\nগ)\tFibrinogen: Precursor to fibrin (forms clots), not\nbreakdown.\nঘ)\tHaptoglobin: Binds free hemoglobin, unrelated to\nclotting."
  },
  {
    "id": 9145,
    "number": 145,
    "ref": "bcs48_q145",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Which of the following is true for wound healing by secondary intention?",
    "options": [
      "Takes place is clean wound",
      "Fine scar formation",
      "Applicable for infected wound",
      "Less evidence of inflammation"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Applicable for infected wound:\tLeft open to heal from\nbase — e.g., abscess cavity.\nOther Options:\nক)\tTakes place in clean wound: Clean wounds →\nprimary intention.\nখ)\tFine scar formation: Secondary intention → larger\nscars.\nঘ)\tLess evidence of inflammation: More inflammation\nand granulation occurs."
  },
  {
    "id": 9146,
    "number": 146,
    "ref": "bcs48_q146",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "A 35-year-old woman presented with palpitation, excessive sweating and heat intolerence for 02 weeks; her serum FT3 & FT4 levels were high and TSH level was undetectable; radio iodine uptake of thyroid gland was low. The most likely diagnosis is",
    "options": [
      "Graves disease",
      "Toxic adenoma",
      "Toxic multi-noduler goitre",
      "Sub acute thyroiditis"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Subacute thyroiditis:\tPreformed hormone release →\nlow TSH, low uptake, and self-limiting.\nOther Options:\nক)\tGraves disease: High iodine uptake.\nখ)\tToxic adenoma: Focal high uptake.\nগ)\tToxic multinodular goitre: Patchy uptake."
  },
  {
    "id": 9147,
    "number": 147,
    "ref": "bcs48_q147",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Clinical feature of minor surgical site infection is",
    "options": [
      "Mild sero-sanguineous discharge",
      "Copious purulent discharge",
      "Fever",
      "Formation of huge granulation tissue"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Mild serosanguinous discharge:\tCommon in minor,\nsuperficial infections.\nOther Options:\nখ)\tCopious purulent discharge: Suggests major or deep\ninfection.\nগ)\tFever: Systemic involvement.\nঘ)\tHuge granulation tissue: Seen in chronic non-healing\nwounds."
  },
  {
    "id": 9148,
    "number": 148,
    "ref": "bcs48_q148",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Megaloblastic anemia with peripheral neuropathy occur due to deficiency of",
    "options": [
      "Folic acid",
      "Iron",
      "Pyridoxine",
      "Vit B12"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Vitamin B12:\tMegaloblastic anemia + posterior column\nneuropathy (tingling, numbness, gait issues).\nOther Options:\nক)\tFolic acid: Causes megaloblastic anemia but not\nneuropathy.\nখ)\tIron: Microcytic anemia, no neuropathy.\nগ)\tPyridoxine (B6): Neuropathy, yes — but not\nmegaloblastic anemia."
  },
  {
    "id": 9149,
    "number": 149,
    "ref": "bcs48_q149",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "A45-year-old man has been suffering from cirrhosis of liver due to Hepatitis B Virus; the sign of decompression of cirrhosis is",
    "options": [
      "Loss of hair",
      "Splenomegaly",
      "Ascites",
      "Testicular atrophy"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Ascites:\tIndicates portal hypertension and hepatic\ndysfunction — hallmark of decompensation.\nOther Options:\nক)\tLoss of hair: Non-specific.\nখ)\tSplenomegaly: May occur in portal hypertension but\nnot a marker of decompensation.\nঘ)\tTesticular atrophy: May occur in chronic liver\ndisease, but not defining decompensation."
  },
  {
    "id": 9150,
    "number": 150,
    "ref": "bcs48_q150",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Causes of painless Jaundice in surgical ward is",
    "options": [
      "Cholelithiasis",
      "Cholangitis",
      "Mucocele of gall bladder",
      "Peri-ampullary carcinoma"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Periampullary carcinoma:\tObstructs bile flow without\npain — “painless progressive jaundice”.\nOther Options:\nক)\tCholelithiasis: Painful jaundice due to obstruction.\nখ)\tCholangitis: Pain, fever, jaundice (Charcot’s triad).\nগ)\tMucocele of gallbladder: Rare and not a typical cause\nof jaundice."
  },
  {
    "id": 9151,
    "number": 151,
    "ref": "bcs48_q151",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Autoimmune disease includes",
    "options": [
      "Bronchial asthma",
      "Hypertension",
      "Heart failure",
      "Rheumatic fever"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Rheumatic fever:\tAutoimmune response to group A\nstreptococcal infection → molecular mimicry causes\nheart, joint, skin, and brain involvement.\nOther Options:\nক)\tBronchial asthma: Hypersensitivity disorder, not\nautoimmune.\nখ)\tHypertension: Multifactorial, not autoimmune.\nগ)\tHeart failure: A complication of cardiac disease, not\nimmune-mediated."
  },
  {
    "id": 9152,
    "number": 152,
    "ref": "bcs48_q152",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Cause of intrauterine death (IUD) is",
    "options": [
      "Diabetes Mellitus",
      "Respiratory distress syndrome",
      "Breech presentation",
      "Bicornuate Uterus"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Diabetes Mellitus:\tPoorly controlled maternal diabetes\ncan cause fetal hypoxia, macrosomia, congenital\nmalformations → IUD.\nOther Options:\nখ)\tRespiratory distress syndrome: Postnatal condition.\nগ)\tBreech presentation: Can cause complications during\ndelivery but not a direct IUD cause.\nঘ)\tBicornuate uterus: May increase miscarriage risk but\nnot the most common cause of IUD."
  },
  {
    "id": 9153,
    "number": 153,
    "ref": "bcs48_q153",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "A 40-year old man presented at Medicine OPD with recurrent haemoptysis for last 05 years: general examination revealed clubbing. Which one of the following is the most likely diagnosis",
    "options": [
      "Bronchiectasis",
      "Interstitial Lung discase",
      "Mitral Stenosis",
      "Lung Cancer"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Bronchiectasis:\tChronic productive cough, hemoptysis,\nclubbing — hallmark triad.\nOther Options:\nখ)\tInterstitial lung disease: Clubbing may occur but\nhemoptysis is rare.\nগ)\tMitral stenosis: May cause hemoptysis but not\nrecurrent for years with clubbing.\nঘ)\tLung cancer: May cause hemoptysis, but less likely\nover 5 years with stable symptoms."
  },
  {
    "id": 9154,
    "number": 154,
    "ref": "bcs48_q154",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "The largest gland of human body is",
    "options": [
      "Adrenal",
      "Liver",
      "Pancreas",
      "Thyroid"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Liver:\tLargest gland — both endocrine (glucose\nmetabolism, albumin) and exocrine (bile).\nOther Options:\nক)\tAdrenal: Small endocrine gland.\nগ)\tPancreas: Mixed gland but smaller.\nঘ)\tThyroid: Largest endocrine gland only, but not\noverall largest."
  },
  {
    "id": 9155,
    "number": 155,
    "ref": "bcs48_q155",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "The following layer of digestive tract contains nerves & vessels",
    "options": [
      "Mucosa",
      "Muscular Layer",
      "Serous Layer",
      "Submucosa"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Submucosa:\tContains Meissner’s nerve plexus, blood\nvessels, lymphatics.\nOther Options:\nক)\tMucosa: Absorption and secretion.\nখ)\tMuscular layer: For peristalsis.\nগ)\tSerous layer: Outer protective layer."
  },
  {
    "id": 9156,
    "number": 156,
    "ref": "bcs48_q156",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Consent become invalid if taken from",
    "options": [
      "Insane person",
      "Elderly person",
      "Illiterate person",
      "Sick person"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Insane person:\tLacks legal capacity to understand →\nconsent is invalid.\nOther Options:\nখ)\tElderly person: Valid if mentally sound.\nগ)\tIlliterate person: Consent valid if information is\nproperly explained and understood.\nঘ)\tSick person: As long as mental capacity is intact,\nconsent is valid."
  },
  {
    "id": 9157,
    "number": 157,
    "ref": "bcs48_q157",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "The EPl vaccine given at birth is",
    "options": [
      "BCG",
      "Diphtheria",
      "Measles",
      "Tetanus"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "BCG:\tGiven at birth to prevent severe forms of\ntuberculosis.\nOther Options:\nখ)\tDiphtheria: Part of DPT — given at 6 weeks.\nগ)\tMeasles: Given at 9 months.\nঘ)\tTetanus: Not directly given at birth (Tetanus toxoid\ngiven to mothers antenatally)."
  },
  {
    "id": 9158,
    "number": 158,
    "ref": "bcs48_q158",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Ligature mark in typical hanging is",
    "options": [
      "Completely encircling neck",
      "Contineous",
      "Obligue",
      "Transverse"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Oblique:\tTypical of hanging — runs upward and\nobliquely due to suspension.\nOther Options:\nক)\tCompletely encircling neck: More common in\nstrangulation.\nখ)\tContinuous: Ligature marks in hanging are often\nincomplete.\nঘ)\tTransverse: Seen in strangulation, not hanging."
  },
  {
    "id": 9159,
    "number": 159,
    "ref": "bcs48_q159",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Which of the following is a common complication of SGLT2 inhibitors?",
    "options": [
      "Genital infection",
      "Lactic acidosis",
      "Fluid retention",
      "Peripheral neuropathy"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Genital infection:\tDue to glycosuria, common in both\nmales and females.\nOther Options:\nখ)\tLactic acidosis: More associated with metformin.\nগ)\tFluid retention: Not typical; more with TZDs (e.g.,\npioglitazone).\nঘ)\tPeripheral neuropathy: Not a common adverse effect\nof SGLT2 inhibitors."
  },
  {
    "id": 9160,
    "number": 160,
    "ref": "bcs48_q160",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "The structural and functional unit of Lung is",
    "options": [
      "Alveoli",
      "Bronchiole",
      "Bronchus",
      "Trachea"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Alveoli:\tSite of gas exchange — functional unit.\nOther Options:\nখ)\tBronchiole: Conducting airways, no gas exchange.\nগ)\tBronchus: Larger conducting airway.\nঘ)\tTrachea: Air conduction only, not functional for gas\nexchange."
  },
  {
    "id": 9161,
    "number": 161,
    "ref": "bcs48_q161",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "In normal pregnancy",
    "options": [
      "Factor X increases",
      "Antithrombin III concentration increases",
      "Venous pressure falls",
      "Iron binding capacity falls"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Factor X increases:\tCoagulation factors like fibrinogen,\nfactor VII, VIII, X increase — pregnancy is a\nhypercoagulable state.\nOther Options:\nখ)\tAntithrombin III concentration increases: It decreases,\nenhancing coagulation tendency.\nগ)\tVenous pressure falls: It rises due to mechanical\npressure by gravid uterus.\nঘ)\tIron binding capacity falls: It increases due to\nelevated transferrin levels."
  },
  {
    "id": 9162,
    "number": 162,
    "ref": "bcs48_q162",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Antigen test for COVID-19 is featured by",
    "options": [
      "High accuracy",
      "High sensitivity",
      "High specificity",
      "Low cost"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Low cost:\tRapid antigen tests are cheap and used for\nmass screening.\nOther Options:\nক)\tHigh accuracy: Less accurate than RT-PCR.\nখ)\tHigh sensitivity: Sensitivity is low, especially in\nasymptomatic patients.\nগ)\tHigh specificity: Moderate, not highest."
  },
  {
    "id": 9163,
    "number": 163,
    "ref": "bcs48_q163",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Excess CO2 retention in blood leads to",
    "options": [
      "Metabolic acidosis",
      "Metabolic alkalosis",
      "Respiratory acidosis",
      "Respiratory alkalosis"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Respiratory acidosis:\tCO₂ buildup → ↓pH → respiratory\nacidosis.\nOther Options:\nক)\tMetabolic acidosis: Caused by acid accumulation (e.g.,\nDKA, renal failure), not CO₂.\nখ)\tMetabolic alkalosis: Seen with vomiting or diuretics.\nঘ)\tRespiratory alkalosis: Happens with low CO₂ (e.g.,\nhyperventilation)."
  },
  {
    "id": 9164,
    "number": 164,
    "ref": "bcs48_q164",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Criteria of an ideal suture material is",
    "options": [
      "Shrimable",
      "Non Predictable tissue behavior",
      "Non Electrolyte",
      "Carcinogenic"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Non-electrolyte:\tReduces tissue reaction and avoids\ngalvanic corrosion with metals.\nOther Options:\nক)\tShrimable: Not a valid term in suture material\ncontext.\nখ)\tNon-predictable tissue behavior: Ideal material should\nhave predictable behavior.\nঘ)\tCarcinogenic: Absolutely undesirable in any material."
  },
  {
    "id": 9165,
    "number": 165,
    "ref": "bcs48_q165",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Adverse drug reaction includes",
    "options": [
      "Synergism",
      "Antagonism",
      "Idiosyncracy",
      "Enzyme induction"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Idiosyncrasy:\tAn unusual, unpredictable reaction due to\ngenetic factors — a type of ADR.\nOther Options:\nক)\tSynergism: Therapeutic concept — beneficial or\nharmful, not always ADR.\nখ)\tAntagonism: Drug interaction concept.\nঘ)\tEnzyme induction: Pharmacokinetic change, not an\nadverse reaction itself."
  },
  {
    "id": 9166,
    "number": 166,
    "ref": "bcs48_q166",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Co-administration of Phenobarbital & warfarin shows",
    "options": [
      "Antiplatelet effect",
      "Fibrinolytic effect",
      "Increased bleeding tendency",
      "Thromboembolic episode"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Thromboembolic episode:\tDue to reduced warfarin\nlevels (CYP induction) → clot formation risk.\nOther Options:\nক)\tAntiplatelet effect: Warfarin works on coagulation\nfactors, not platelets.\nখ)\tFibrinolytic effect: Warfarin doesn’t increase clot\nbreakdown.\nগ)\tIncreased bleeding tendency: Phenobarbital is an\nenzyme inducer, reduces warfarin efficacy."
  },
  {
    "id": 9167,
    "number": 167,
    "ref": "bcs48_q167",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Ideal graft for coronary artery bipass graft is",
    "options": [
      "Great saphenous vein",
      "Ulner artery",
      "Radial artery",
      "Left internal mammary artery"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Left internal mammary artery (LIMA):\tMost durable,\nwith best long-term patency.\nOther Options:\nক)\tGreat saphenous vein: Used often but less durable\nthan arterial grafts.\nখ)\tUlnar artery: Rarely used.\nগ)\tRadial artery: Can be used, but second-line."
  },
  {
    "id": 9168,
    "number": 168,
    "ref": "bcs48_q168",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Which of the following is not a feature of acute type II respiratory failure",
    "options": [
      "PaO2 < 8.0 kpa",
      "PaCo2 > 6 kpa",
      "HCO3 - is increased",
      "H+ is increased"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "HCO₃⁻ is increased:\tOnly in chronic compensation. In\nacute, it remains normal or slightly increased.\nOther Options:\nক)\tPaO₂ < 8.0 kPa: Hypoxemia — characteristic.\nখ)\tPaCO₂ > 8.0 kPa: Hypercapnia — defining for Type II.\nঘ)\tH⁺ is increased: Respiratory acidosis leads to\nacidemia."
  },
  {
    "id": 9169,
    "number": 169,
    "ref": "bcs48_q169",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Which of the following is a compressible swelling?",
    "options": [
      "Neuro fibroma",
      "Chondroma",
      "Lymphoma",
      "Haemangioma"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Haemangioma:\tVascular tumor — soft, compressible,\nmay refill on release.\nOther Options:\nক)\tNeurofibroma: Solid and non-compressible.\nখ)\tChondroma: Cartilage tumor — firm.\nগ)\tLymphoma: Firm, rubbery lymph node swelling."
  },
  {
    "id": 9170,
    "number": 170,
    "ref": "bcs48_q170",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Irreversible sign of vitamin-A deficiency is",
    "options": [
      "Bitot's spot",
      "Xerosis Conjunctive",
      "Keratomalacia",
      "Night blindness"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Keratomalacia:\tCorneal softening → permanent\nblindness — irreversible.\nOther Options:\nক)\tBitot’s spot: Early and reversible.\nখ)\tXerosis conjunctivae: Reversible.\nঘ)\tNight blindness: Earliest sign, completely reversible\nwith treatment."
  },
  {
    "id": 9171,
    "number": 171,
    "ref": "bcs48_q171",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Common feature to all Spondylo arthritis is",
    "options": [
      "Symmetrical poly arthritis",
      "Conjunctivitis",
      "Positive HLA B27",
      "Oral Ulceration"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Positive HLA-B27:\tGenetic marker found in most types\nincluding ankylosing spondylitis, reactive arthritis,\npsoriatic arthritis, and IBD-related arthritis.\nOther Options:\nক)\tSymmetrical polyarthritis: Seen in rheumatoid\narthritis, not typical for spondyloarthritis (which is\nusually asymmetric).\nখ)\tConjunctivitis: Seen in reactive arthritis, not universal\nto all spondyloarthropathies.\nঘ)\tOral ulceration: Common in Behçet’s disease or SLE,\nnot typical in spondyloarthritis."
  },
  {
    "id": 9172,
    "number": 172,
    "ref": "bcs48_q172",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Clinical feature of raised intracranial pressure is",
    "options": [
      "Raised respiratory rate",
      "Bradycardia",
      "Fever",
      "Hypotension"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Bradycardia:\tPart of Cushing’s triad (bradycardia,\nhypertension, irregular respiration).\nOther Options:\nক)\tRaised respiratory rate: Often depressed in late\nstages.\nগ)\tFever: Not a classic sign of raised ICP.\nঘ)\tHypotension: Hypertension is typical in raised ICP."
  },
  {
    "id": 9173,
    "number": 173,
    "ref": "bcs48_q173",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Bony metastasis may occur in",
    "options": [
      "Carcinoma gall bladder",
      "Malignant melanoma",
      "Squamous Cell Carcinoma of skin",
      "Follicular Carcinoma of thyroid"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Follicular carcinoma of thyroid:\tSpreads\nhematogenously → commonly to bone and lungs.\nOther Options:\nক)\tCarcinoma gallbladder: Rarely metastasizes to bone.\nখ)\tMalignant melanoma: Commonly spreads to skin,\nliver, lungs.\nগ)\tSquamous cell carcinoma of skin: Local invasion more\ncommon."
  },
  {
    "id": 9174,
    "number": 174,
    "ref": "bcs48_q174",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Which one is derived from mesoderm?",
    "options": [
      "Muscle",
      "Skin",
      "Nail",
      "Mucous membrane"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Muscle:\tDerived from paraxial mesoderm (somites).\nOther Options:\nখ)\tSkin: Epidermis comes from ectoderm.\nগ)\tNail: Ectodermal derivative.\nঘ)\tMucous membrane: Endoderm in origin (respiratory,\nGI)."
  },
  {
    "id": 9175,
    "number": 175,
    "ref": "bcs48_q175",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Forensic radiology deals with determination of",
    "options": [
      "Poison",
      "Foreign body",
      "Age",
      "Pregnancy"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Age:\tBone ossification centers, dental X-rays —\ncommonly used in age estimation.\nOther Options:\nক)\tPoison: Identified by toxicology.\nখ)\tForeign body: Yes, radiology can help, but not the\nprimary use in forensics.\nঘ)\tPregnancy: Determined clinically or by ultrasound,\nnot primarily forensic."
  },
  {
    "id": 9176,
    "number": 176,
    "ref": "bcs48_q176",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "CA-125 is the tumor marker for",
    "options": [
      "Breast cancer",
      "Colon cancer",
      "Ovarian cancer",
      "Pancreatic cancer"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Ovarian cancer:\tEspecially in epithelial ovarian cancers\n(used for diagnosis & follow-up).\nOther Options:\nক)\tBreast cancer: CA 15-3 is used.\nখ)\tColon cancer: CEA (Carcinoembryonic antigen) is\nused.\nঘ)\tPancreatic cancer: CA 19-9 is used."
  },
  {
    "id": 9177,
    "number": 177,
    "ref": "bcs48_q177",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Cause of severe dysmenorrhea in an adolescent girl is",
    "options": [
      "Endometriosis",
      "Polycystic ovary disease",
      "Adenomyosis",
      "Trichomomiasis"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Endometriosis:\tCommon cause of secondary\ndysmenorrhea in adolescents.\nOther Options:\nখ)\tPolycystic ovary disease (PCOS): Typically presents\nwith oligomenorrhea, not painful periods.\nগ)\tAdenomyosis: Common in older, multiparous women.\nঘ)\tTrichomoniasis: STI with discharge, not\ndysmenorrhea."
  },
  {
    "id": 9178,
    "number": 178,
    "ref": "bcs48_q178",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Ethambutol is rarely prescribed in children because it causes",
    "options": [
      "Peripheral neuropathy",
      "Hepatitis",
      "Rash",
      "Retrobulbar neuritis"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Retrobulbar neuritis:\tDose-dependent optic neuritis —\naffects color vision, visual acuity; hard to detect in\nyoung children.\nOther Options:\nক)\tPeripheral neuropathy: More with isoniazid.\nখ)\tHepatitis: Seen more with isoniazid, rifampicin, and\npyrazinamide.\nগ)\tRash: Minor side effect."
  },
  {
    "id": 9179,
    "number": 179,
    "ref": "bcs48_q179",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "In Bangladesh minimum recommended number of antenatal care (ANC) visit is",
    "options": [
      "Four",
      "Six",
      "Eight",
      "Twelve"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Four:\tAs per WHO’s focused ANC model, minimum 4\nvisits (though newer guidelines recommend 8).\nOther Options:\nখ)\tSix: May be practiced, but not officially minimum.\nগ)\tEight: New WHO recommendation, not national\nminimum yet.\nঘ)\tTwelve: Too high — not the recommendation."
  },
  {
    "id": 9180,
    "number": 180,
    "ref": "bcs48_q180",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Which one of the following is reproductive organ?",
    "options": [
      "Uterus",
      "Urinary bladder",
      "Urethra",
      "Bone"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Uterus:\tFemale reproductive organ involved in\nmenstruation and pregnancy.\nOther Options:\nখ)\tUrinary bladder: Excretory system.\nগ)\tUrethra: Excretory function.\nঘ)\tBone: Skeletal system, unrelated."
  },
  {
    "id": 9181,
    "number": 181,
    "ref": "bcs48_q181",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Viral disease that may cause thrombocytopenia is",
    "options": [
      "SARS-Cov-2",
      "Influenza",
      "Dengue",
      "Hepatitis B"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Dengue:\tCauses bone marrow suppression and\nperipheral platelet destruction — hallmark is\nthrombocytopenia.\nOther Options:\nক)\tSARS-CoV-2: May cause mild thrombocytopenia but\nnot characteristically.\nখ)\tInfluenza: Rarely associated with significant drop in\nplatelets.\nঘ)\tHepatitis B: May rarely cause it in advanced cases but\nnot typical."
  },
  {
    "id": 9182,
    "number": 182,
    "ref": "bcs48_q182",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "A 35-year-old man came to you with following reports HbsAg (-VE), Anti HBc lgG (+VE), Anti HBc IgM(-VE), Anti HBs (+VE) which senario will match with the above mentioned reports",
    "options": [
      "Acute hepatitis (early)",
      "Convalescence",
      "Post infection",
      "Immunization without infection"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Post-infection:\tClassical serological profile.\nOther Options:\nThis is a resolved HBV infection profile:\n○ HBsAg (-): No active infection.\n○ Anti-HBc IgG (+): Past exposure.\n○ Anti-HBs (+): Immunity.\n○ Anti-HBc IgM (-): No recent infection.\nক) Acute hepatitis (early): Would have HBsAg (+) and\nIgM (+).\nখ) Convalescence: Might be possible, but Anti-HBs\nusually not yet formed.\nঘ) Immunization without infection: No Anti-HBc present\nin vaccine-induced immunity."
  },
  {
    "id": 9183,
    "number": 183,
    "ref": "bcs48_q183",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Dose schedule of a drug with half life 03 hours will be",
    "options": [
      "3 hourly",
      "6 hourly",
      "12 hourly",
      "Once daily"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "6 hourly:\tAppropriate based on 3-hour half-life.\nOther Options:\nRule of thumb: Dose interval ≈ 1–2 times the half-life\nfor steady-state.\nক)\t3 hourly: Too frequent — unnecessary.\nগ)\t12 hourly: Not frequent enough — drug may drop\nbelow therapeutic level.\nঘ)\tOnce daily: Too long an interval."
  },
  {
    "id": 9184,
    "number": 184,
    "ref": "bcs48_q184",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Solid tumor of ovary is",
    "options": [
      "Chocolate cyst of ovary",
      "Theca Lutein cyst",
      "Fibroma",
      "Parovarian cyst"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Fibroma:\tSolid, benign tumor of ovarian stromal origin.\nOther Options:\nক)\tChocolate cyst: Endometriotic cyst — not solid.\nখ)\tTheca lutein cyst: Functional cyst, not solid.\nঘ)\tParovarian cyst: Cystic structure, not a solid tumor."
  },
  {
    "id": 9185,
    "number": 185,
    "ref": "bcs48_q185",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Multidrug resistant tuberculosis is treated by",
    "options": [
      "Amikacin",
      "Streptomycin",
      "Tazobactum",
      "Ethambutol"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Amikacin:\tSecond-line aminoglycoside used in MDR-TB.\nOther Options:\nখ)\tStreptomycin: First-line but not effective in MDR-TB.\nগ)\tTazobactam: β-lactamase inhibitor — no role in TB.\nঘ)\tEthambutol: First-line drug; resistance likely in MDR-\nTB."
  },
  {
    "id": 9186,
    "number": 186,
    "ref": "bcs48_q186",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Protein is digested by",
    "options": [
      "Amylase",
      "Bile Salt",
      "Lipase",
      "Trypsin"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Trypsin:\tSecreted by pancreas, breaks down proteins\ninto peptides.\nOther Options:\nক)\tAmylase: Digests starch (carbohydrates).\nখ)\tBile salt: Emulsifies fats, no enzymatic action.\nগ)\tLipase: Digests fats."
  },
  {
    "id": 9187,
    "number": 187,
    "ref": "bcs48_q187",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Universally accepted indicator of health status of a population is",
    "options": [
      "Child death rate",
      "Case fatality rate",
      "Infant mortality rate",
      "Under-5 mortality rate"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Infant mortality rate:\tMost widely used global health\nindicator.\nOther Options:\nIMR reflects:\n○ Maternal health\n○ Health service access\n○ Nutrition\nক) Child death rate: Broader and less specific.\nখ) Case fatality rate: Measures disease severity, not\npopulation health.\nঘ) Under-5 mortality rate: Good indicator, but IMR is\nmore accepted."
  },
  {
    "id": 9188,
    "number": 188,
    "ref": "bcs48_q188",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Bone metabolism is the primary concern of",
    "options": [
      "Glucagon",
      "Growth hormone",
      "Parathyroid hormone",
      "Thyroid stimulating hormone"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Parathyroid hormone:\tRegulates calcium/phosphate\nbalance, increases bone resorption.\nOther Options:\nক)\tGlucagon: Raises blood glucose, not involved in\nbones.\nখ)\tGrowth hormone: Promotes growth, but indirectly\naffects bone.\nঘ)\tThyroid-stimulating hormone: Acts on thyroid, not\nbone metabolism directly."
  },
  {
    "id": 9189,
    "number": 189,
    "ref": "bcs48_q189",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Scabies is characterized by",
    "options": [
      "Comedon",
      "Burrow",
      "Silvery Scale",
      "Wickman Striae"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Burrow:\tThin, grayish lines in finger webs, wrists —\ndiagnostic of scabies.\nOther Options:\nক)\tComedon: Seen in acne.\nগ)\tSilvery scale: Psoriasis.\nঘ)\tWickham’s striae: Lichen planus."
  },
  {
    "id": 9190,
    "number": 190,
    "ref": "bcs48_q190",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Cause of acute starvation is",
    "options": [
      "Self refusal",
      "Dysphasia",
      "Anorexia",
      "Entrapment in mine"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Entrapment in mine:\tSudden unavailability of food →\nacute starvation.\nOther Options:\nক)\tSelf-refusal: Chronic starvation (e.g., anorexia\nnervosa).\nখ)\tDysphasia: Can cause feeding problems but not the\ntypical cause of acute starvation.\nগ)\tAnorexia: Again, a chronic issue."
  },
  {
    "id": 9191,
    "number": 191,
    "ref": "bcs48_q191",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Which of the following is a compelling indication of calcium channel blocker in the management of Hypertension?",
    "options": [
      "Heart failure",
      "Secondary stroke prevention",
      "Older patient",
      "Left ventricular dysfunction"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Older patient:\tCCBs are particularly effective in elderly\nhypertensives, especially with isolated systolic HTN.\nOther Options:\nক)\tHeart failure: Some CCBs (especially non-\ndihydropyridines like verapamil) may worsen heart\nfailure.\nখ)\tSecondary stroke prevention: Not specifically CCBs;\nACEIs or diuretics preferred.\nঘ)\tLeft ventricular dysfunction: Beta-blockers or ACEIs\npreferred."
  },
  {
    "id": 9192,
    "number": 192,
    "ref": "bcs48_q192",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Component of secondary survey in a traumatic patient is",
    "options": [
      "Airway and cervical spine control",
      "Head to toe examination",
      "Breathing and ventilation",
      "Circulation and control of haemorrhage"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Head to toe examination:\tThis is done during secondary\nsurvey to assess all systems thoroughly after stabilizing\nthe patient.\nOther Options:\nক)\tAirway and cervical spine control: Part of primary\nsurvey.\nগ)\tBreathing and ventilation: Part of primary survey.\nঘ)\tCirculation and control of hemorrhage: Also part of\nprimary survey."
  },
  {
    "id": 9193,
    "number": 193,
    "ref": "bcs48_q193",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Diabetes in pregnancy should be treated by",
    "options": [
      "Glipizide",
      "Metformin",
      "Insulin",
      "Rosiglitazone"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Insulin:\tDoes not cross placenta, preferred for both\ngestational and pregestational diabetes.\nOther Options:\nক)\tGlipizide: Sulfonylureas cross the placenta → risk to\nfetus.\nখ)\tMetformin: Can be used in some cases (GDM), but\ninsulin is gold standard.\nঘ)\tRosiglitazone: Contraindicated in pregnancy."
  },
  {
    "id": 9194,
    "number": 194,
    "ref": "bcs48_q194",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Which of the following antidepressants does not have any weight gain property?",
    "options": [
      "Escitalopram",
      "Fluoxetine",
      "Paroxetine",
      "Sertraline"
    ],
    "answer_index": 1,
    "answer": 1,
    "explanation": "Fluoxetine:\tKnown to be weight neutral or even cause\nweight loss.\nOther Options:\nক)\tEscitalopram: May cause mild weight gain with long-\nterm use.\nগ)\tParoxetine: Commonly associated with weight gain.\nঘ)\tSertraline: Mild weight gain possible with chronic\nuse."
  },
  {
    "id": 9195,
    "number": 195,
    "ref": "bcs48_q195",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Respiratory Center is Located in",
    "options": [
      "Medulla",
      "Spinal Cord",
      "Brain Cortex",
      "Cerebellum"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "Medulla:\tContains dorsal and ventral respiratory groups\n— controls inspiration and expiration.\nOther Options:\nখ)\tSpinal cord: Conveys impulses but not the control\ncenter.\nগ)\tBrain cortex: Can influence voluntary breathing but\nnot autonomic.\nঘ)\tCerebellum: Coordinates movement, not respiration."
  },
  {
    "id": 9196,
    "number": 196,
    "ref": "bcs48_q196",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Amniotic fluid embolism causes",
    "options": [
      "Hypertension",
      "Bronchodilatation",
      "Cyanosis",
      "Sever anaemia"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Cyanosis:\tClassic sign due to sudden respiratory collapse\nand hypoxia.\nOther Options:\nক)\tHypertension: Usually causes hypotension due to\nshock.\nখ)\tBronchodilatation: Opposite occurs — bronchospasm\nmay occur.\nঘ)\tSevere anemia: Not a feature; shock is due to\nembolism and coagulopathy."
  },
  {
    "id": 9197,
    "number": 197,
    "ref": "bcs48_q197",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "The most reliable clinical feature of strangulaed inguinal hernia is",
    "options": [
      "Pain",
      "Fever",
      "Tense and tender lump in the inguinal region",
      "Vomiting"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "inguinal region\nTense and tender lump:\tNon-reducible, irreducible,\ntender, and tense mass = strangulation.\nOther Options:\nক)\tPain: Present in both reducible and strangulated\nhernia.\nখ)\tFever: Can occur later, not specific.\nঘ)\tVomiting: Non-specific symptom of intestinal\nobstruction."
  },
  {
    "id": 9198,
    "number": 198,
    "ref": "bcs48_q198",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Uterine contractions in labour",
    "options": [
      "are consciously controllable",
      "are efficient at 5 mmHg",
      "start at fundus of uterus",
      "are painful due to ischemia"
    ],
    "answer_index": 2,
    "answer": 2,
    "explanation": "Start at fundus of uterus:\tPacemaker region initiates\ncontraction → spreads downward.\nOther Options:\nক)\tConsciously controllable: Involuntary, smooth muscle\naction.\nখ)\tEfficient at 5 mmHg: Requires higher intrauterine\npressure (>30 mmHg).\nঘ)\tAre painful due to ischemia: Pain mainly due to\nstretching and cervical dilation."
  },
  {
    "id": 9199,
    "number": 199,
    "ref": "bcs48_q199",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Normal anion gap metabolic acidosis is found in",
    "options": [
      "Chronic renal failure",
      "Diabetic keto acidosis",
      "Methanol poisoning",
      "Renal tubular acidosis"
    ],
    "answer_index": 3,
    "answer": 3,
    "explanation": "Renal tubular acidosis:\tNormal anion gap due to\nbicarbonate loss without unmeasured anions.\nOther Options:\nক)\tChronic renal failure: Causes high anion gap acidosis.\nখ)\tDiabetic ketoacidosis: High anion gap acidosis due to\nketones.\nগ)\tMethanol poisoning: High anion gap due to formic\nacid."
  },
  {
    "id": 9200,
    "number": 200,
    "ref": "bcs48_q200",
    "exam": "bcs-general",
    "subject": {
      "name": "Medical Science",
      "name_bn": "মেডিকেল সায়েন্স",
      "slug": "medical"
    },
    "topic": "Medical & Clinical Science",
    "difficulty": "medium",
    "source": "48th BCS",
    "lang": "en",
    "body": "Plasma albumin helps in",
    "options": [
      "Colloidal osmotic pressure maintenance",
      "Blood clotting",
      "Iron transport",
      "Copper transport"
    ],
    "answer_index": 0,
    "answer": 0,
    "explanation": "maintenance\nColloidal osmotic pressure maintenance:\tMaintains\noncotic pressure to prevent edema.\nOther Options:\nখ)\tBlood clotting: Role of fibrinogen, not albumin.\nগ)\tIron transport: Done by transferrin.\nঘ)\tCopper transport: Done by ceruloplasmin.\n- সমাপ্ত -\nLive MCQ কী এবং েকন?\nLive MCQ বাংলােদেশর পৰ্থম পৰ্িতেযািগতামূলক অনলাইন পরীক্ষােকন্দৰ্। বাংলােদেশর সকল পৰ্িতেযািগতামূলক পরীক্ষার (েযমন, িবিসএস ও\nিবিভন্ন চাকিরর পরীক্ষা) পৰ্স্তুিতর সময় পরীক্ষাথর্ীরা েবশ কেয়কিট সমসGায় পেড়ন, েসসব সমসGার সমাধান করাই Live MCQ এর পৰ্ধান লক্ষG।\nএকটু িবস্তািরত বলা যাক -\nবাংলােদেশর কেয়কিট চাকিরর পরীক্ষা (েযমন, NTRCA, BJS) ছাড়া বািক পৰ্ায় সব চাকিরর িপৰ্িল পরীক্ষা পৰ্িতেযািগতামূলক। আপিন পড়াশ‌ুনা\nকরেলন, মেডল েটেস্টর বইেত পরীক্ষা িদেয় ভাল নামব্ার েপেলন আর ভাবেলন েয কাট মাকর্েতা এমনই থােক তাই পৰ্স্তুিত িঠক আেছ। আসেলই\nিক তাই?\nপিরসংখGান বেল, চাকিরেভেদ িপৰ্িলিমনাির পরীক্ষায় পাশ করেত হেল আপনােক পৰ্থম ৫-১০% এর মেধG থাকেত হেব। িকন্তু চূ ড়ান্ত পরীক্ষার\nআেগ আপিন েকানভােবই িনেজর অবস্থান জানেত পারেছন না। কারণ, আপিন কখেনাই িপৰ্িল পরীক্ষার আেগ আপনার পৰ্িতদব্ন্দব্ীেদর সােথ\nপরীক্ষা েদয়ার সুেযাগ পােচ্ছন না। েযমন, িবিসএেসর িপৰ্িলর জনG আপিন একা একা মেডল েটস্ট িদেয় েয পৰ্েশ্ন ১১০ েপেলন এবং আেগর\nবছেরর কাট মাকর্গ‌ুেলা েদেখ িনিশ্চত েভেব বসেলন েয পৰ্স্তুিত িঠক আেছ। আদেত েদখা যােব, েসই একই পৰ্েশ্ন পরীক্ষা হেল, ৪ লাখ পরীক্ষা\nিদেল, ২৫ হাজার পােবন ১২০ এর উপের। পুেরাটাই িনভর্র করেছ পৰ্শ্ন কিঠন না সহজ হেলা তার উপর। অথর্াৎ, এই পৰ্েশ্ন পরীক্ষা হেল আপনার\nপাশ করার েকান সম্ভাবনা েনই বলেলই চেল।\nপৰ্স্তুিতর পৰ্কৃ ত অবস্থান জানেত আপিন যােদর সেঙ্গ পৰ্িতদব্িন্দব্তা করেবন িঠক তােদর সােথই পরীক্ষা িদেত হেব, একা নয়।\nLive MCQ আপনােক েসই সুেযাগিট কের িদেয়েছ। Live MCQ বGবহার কের, আপিন -\nØ ঘের বেসই িবিসএস এবং অনGানG চাকিরর জনG পৰ্স্তুিত িনেত পারেবন।\nØ চূ ড়ান্ত পরীক্ষার মত একিট িনিদর্ষ্ট সমেয় হাজােরা পরীক্ষাথর্ীর সােথ Live পরীক্ষায়/মেডল েটেস্ট অংশগৰ্হণ করার সুেযাগ পােবন।\nØ একই ‘মেডল েটেস্ট’ সকল পৰ্িতেযাগীর সােপেক্ষ আপনার পৰ্স্তুিত এবং অবস্থান সম্পেকর্ জানেত পারেবন।\nØ েকান পৰ্কার আলাদা পিরশৰ্ম ও সময় বGয় না কের পৰ্িতিট পৰ্েশ্নর িবস্তািরত বGাখGা েরফােরন্সসহ পােবন।\nØ আপিন েয েকান সময় আকর্াইভ েথেক পুরাতন পৰ্শ্নপতৰ্ েদখেত ও পড়েত পারেবন এবং এই পৰ্েশ্ন পরীক্ষা িদেত পারেবন।\nLive MCQ এর অনGতম ৈবিশষ্টGসমূহ:\nü পৰ্কৃ ত পৰ্িতেযাগীেদর সােথ একই সমেয় LIVE মেডল েটস্ট।\nü পুেরাপুির িবজ্ঞাপনমুক্ত (Ad Free)।\nü চূ ড়ান্ত পরীক্ষা সম্পন্ন হওয়ার পূবর্ পযর্ন্ত িনয়িমত মেডল েটস্ট।\nü িবষয়িভিত্তক পৰ্স্তুিতর জনG রেয়েছ টিপকগ‌ুরু।\nü পৰ্িত সপ্তােহ ২০০ মােকর্র িফৰ্ মেডল েটস্ট।\nü স্মাটর্ সােচর্র মাধGেম েয েকান পৰ্েশ্নর উত্তর ও বGাখGা সহেজই খুঁেজ পাওয়ার সুেযাগ।\nü কনিফউিজং ও িবতিকর্ত সমসGা িনেয় িবেশ্লষণমূলক আেলাচনা (তথGকল্পদৰ্ুম)।\nü িনেজর মত কের টিপক, পৰ্শ্নসংখGা ও সময় িনধর্ারন কের কু ইজ পরীক্ষা েদয়ার সুেযাগ।\nü িবষয়িভিত্তক িভিডেয়া ক্লাস ও ক্লাস টিপেকর উপর পরীক্ষা।\nü পৰ্িত পরীক্ষার েশেষ ভু ল ও েছেড় েদয়া পৰ্শ্নগ‌ুেলা একসােথ েদখেত পােবন Wrong and Unasnwered বাটেন।\nü পিরবিতর্ত তেথGর জনG রেয়েছ ডায়নািমক ইনেফা পGােনল।\nü িনয়িমত িরেয়ল জেবর উপর লাইভ পরীক্ষা ও জব সলুGশেনর সমৃদ্ধ আকর্াইভ।\nü এপেসর মেধGই পােবন স্টািড গৰ্ুেপ সংযুক্ত হওয়ার সুেযাগ।\nপৰ্িতেযািগতার পরীক্ষায় পৰ্িতেযািগতার মাধGেমই পৰ্স্তুিত িনন। আপিন এই দুইিটর েযেকােনা একিটর মাধGেম আমােদর প্লGাটফমর্ বGবহার করেত\nপারেবন:\nWebsite\nios App\nAndriod App\n[Play Store Link]\nlivemcq.com\n[App Store Link]"
  }
]
