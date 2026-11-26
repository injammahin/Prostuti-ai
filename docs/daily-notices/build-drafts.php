<?php
/**
 * Builds the notices:import JSON for today's open circulars from the official Teletalk job feed
 * (alljobs.teletalk.com.bd/api/v1/govt-jobs/list) and the official portal pages.
 * Usage: php build-drafts.php <tt dir> <today Y-m-d> <out.json> <report.json>
 */
[$self, $dir, $today, $out, $reportFile] = $argv;
$jobs = json_decode(file_get_contents("{$dir}/all.json"), true);
$portals = json_decode(file_get_contents("{$dir}/portals.json"), true);
$dhaka = new DateTimeZone('Asia/Dhaka');
$local = fn (string $iso): DateTimeImmutable => (new DateTimeImmutable($iso))->setTimezone($dhaka);

/** Organisation short name => [English name, Bangla name, category, high demand]. */
$names = [
    'BOGMC' => ['Petrobangla', 'পেট্রোবাংলা', 'autonomous', true],
    'BEPZA' => ['BEPZA', 'বেপজা', 'autonomous', true],
    'CSSYLHET' => ['Civil Surgeon Office Sylhet', 'সিভিল সার্জন কার্যালয়, সিলেট', 'govt', true],
    'DGBPO' => ['Bangladesh Post Office', 'ডাক অধিদপ্তর', 'govt', true],
    'BPS' => ['Bangladesh Parliament Secretariat', 'জাতীয় সংসদ সচিবালয়', 'govt', true],
    'DAM' => ['Department of Agricultural Marketing', 'কৃষি বিপণন অধিদপ্তর', 'govt', true],
    'APSCL' => ['Ashuganj Power Station Company', 'আশুগঞ্জ পাওয়ার স্টেশন কোম্পানি', 'autonomous', true],
    'FRI' => ['Bangladesh Fisheries Research Institute', 'বাংলাদেশ মৎস্য গবেষণা ইনস্টিটিউট', 'autonomous', false],
    'TAX18' => ['Taxes Zone-18 Dhaka', 'কর অঞ্চল-১৮, ঢাকা', 'govt', false],
    'TAX17' => ['Taxes Zone-17 Dhaka', 'কর অঞ্চল-১৭, ঢাকা', 'govt', false],
    'TAX10' => ['Taxes Zone-10 Dhaka', 'কর অঞ্চল-১০, ঢাকা', 'govt', false],
    'TAX14' => ['Taxes Zone-14 Dhaka', 'কর অঞ্চল-১৪, ঢাকা', 'govt', false],
    'TAX15' => ['Taxes Zone-15 Dhaka', 'কর অঞ্চল-১৫, ঢাকা', 'govt', false],
    'TAXBOG' => ['Taxes Zone Bogura', 'কর অঞ্চল, বগুড়া', 'govt', false],
    'TAXDIN' => ['Taxes Zone Dinajpur', 'কর অঞ্চল, দিনাজপুর', 'govt', false],
    'DSCC' => ['Dhaka South City Corporation', 'ঢাকা দক্ষিণ সিটি কর্পোরেশন', 'autonomous', true],
    'DCSIRAJGANJ' => ['DC Office Sirajganj', 'জেলা প্রশাসকের কার্যালয়, সিরাজগঞ্জ', 'govt', false],
    'DCBAGERHAT' => ['DC Office Bagerhat', 'জেলা প্রশাসকের কার্যালয়, বাগেরহাট', 'govt', false],
    'BIWTC' => ['BIWTC', 'বিআইডব্লিউটিসি', 'autonomous', false],
    'BHTPA' => ['Bangladesh Hi-Tech Park Authority', 'বাংলাদেশ হাই-টেক পার্ক কর্তৃপক্ষ', 'autonomous', false],
    'DCJASHORE' => ['DC Office Jashore', 'জেলা প্রশাসকের কার্যালয়, যশোর', 'govt', false],
    'DMP' => ['Dhaka Metropolitan Police', 'ঢাকা মেট্রোপলিটন পুলিশ', 'govt', true],
    'BPC' => ['Bangladesh Petroleum Corporation', 'বাংলাদেশ পেট্রোলিয়াম কর্পোরেশন', 'autonomous', true],
    'DCKC' => ['DC Office Khagrachhari', 'জেলা প্রশাসকের কার্যালয়, খাগড়াছড়ি', 'govt', false],
    'AIS' => ['Agriculture Information Service', 'কৃষি তথ্য সার্ভিস', 'govt', false],
    'NACTAR' => ['NACTAR', 'নেকটার', 'govt', false],
    'NACTARS' => ['NACTAR', 'নেকটার', 'govt', false],
    'DCCHANDPUR' => ['DC Office Chandpur', 'জেলা প্রশাসকের কার্যালয়, চাঁদপুর', 'govt', false],
    'DCMAGURA' => ['DC Office Magura', 'জেলা প্রশাসকের কার্যালয়, মাগুরা', 'govt', false],
    'DIVCOMBSL' => ['Divisional Commissioner Office Barishal', 'বিভাগীয় কমিশনারের কার্যালয়, বরিশাল', 'govt', false],
    'CCB' => ['Bangladesh Competition Commission', 'বাংলাদেশ প্রতিযোগিতা কমিশন', 'govt', false],
    'TCB' => ['TCB', 'টিসিবি', 'autonomous', false],
    'MOD' => ['Ministry of Defence', 'প্রতিরক্ষা মন্ত্রণালয়', 'govt', false],
    'DCK' => ['Divisional Commissioner Office Khulna', 'বিভাগীয় কমিশনারের কার্যালয়, খুলনা', 'govt', false],
    'DCRANGAMATI' => ['DC Office Rangamati', 'জেলা প্রশাসকের কার্যালয়, রাঙ্গামাটি', 'govt', false],
    'SPOLALMONIRHAT' => ['SP Office Lalmonirhat', 'পুলিশ সুপারের কার্যালয়, লালমনিরহাট', 'govt', false],
    'DCRAJBARI' => ['DC Office Rajbari', 'জেলা প্রশাসকের কার্যালয়, রাজবাড়ী', 'govt', false],
    'BASB' => ['Bangladesh Armed Services Board', 'বাংলাদেশ সশস্ত্র বাহিনী বোর্ড', 'govt', false],
    'MODCR' => ['Ministry of Defence Constabulary', 'প্রতিরক্ষা মন্ত্রণালয় কনস্টেবুলারি', 'govt', false],
    'ITCNETROKONA' => ['In-Service Training Center Netrokona', 'ইন-সার্ভিস ট্রেনিং সেন্টার, নেত্রকোনা', 'govt', false],
    'CSRAJSHAHI' => ['Civil Surgeon Office Rajshahi', 'সিভিল সার্জন কার্যালয়, রাজশাহী', 'govt', false],
    'NSD' => ['Department of National Savings', 'জাতীয় সঞ্চয় অধিদপ্তর', 'govt', true],
    'BCSL' => ['Bangladesh Cable Shilpa', 'বাংলাদেশ ক্যাবল শিল্প', 'autonomous', false],
    'DCNOAKHALI' => ['DC Office Noakhali', 'জেলা প্রশাসকের কার্যালয়, নোয়াখালী', 'govt', false],
    'SPOSHERPUR' => ['SP Office Sherpur', 'পুলিশ সুপারের কার্যালয়, শেরপুর', 'govt', false],
];

/** Read from the circular itself (rendered and checked by hand). */
$read = [
    'BEPZA' => [
        'grades' => ['Security Officer' => '9th', 'Security Guard' => '20th', 'Office Assistant' => '20th', 'Office Support Staff' => '20th'],
        'eligibility' => "Security Officer: graduate and a retired Master Warrant Officer / Senior Warrant Officer / Warrant Officer of the Army or the equal rank of the Air Force or Navy.\nSecurity Guard: at least SSC (civilians) or a retired soldier/lance corporal with 5 years' service; height and weight limits apply.\nOffice Assistant: at least Class 8 pass.",
        'age_limit' => 'On 1 November 2026: Security Officer up to 55; Security Guard 18–32 (retired armed forces up to 35); Office Assistant 18–32.',
        'notes' => 'One candidate may apply for only one post.',
    ],
    'DGBPO' => [
        'eligibility' => 'Varies by post: a bachelor\'s degree for Junior Accountant, Inspector and similar posts; a second-class bachelor\'s degree for Upazila Postmaster; computer typing speed for stenotypist posts. Candidates from all districts can apply for the posts on the first page of the circular.',
        'grades' => ['Junior Accountant' => '11th', 'Upazila Postmaster' => '13th'],
    ],
    'BPS' => [
        'eligibility' => 'Varies by post (grades 11–20): e.g. Guide needs an English honours degree; Cataloguer a degree plus a library science diploma; Legislative Assistant a law degree; Stenotypist a degree plus typing speed.',
        'grades' => ['Guide' => '11th', 'Cataloguer' => '11th', 'Legislative Assistant' => '13th'],
    ],
    'BOGMC' => [
        'eligibility' => 'Assistant Manager (9th grade) posts in Admin, Law, Finance and Engineering need a master\'s degree, or a 4-year bachelor\'s degree after HSC, in the matching subject; engineering posts accept a B.Sc. in Engineering, or a diploma plus 5 years\' experience.',
        'notes' => 'Petrobangla and its 15+ companies (BAPEX, BGFCL, Titas, Jalalabad, Karnaphuli and others) recruit together.',
    ],
];

$groups = [];
foreach ($jobs as $job) {
    $short = strtoupper(trim($job['job_utilities_govtorganization']['short_name'] ?? 'X'));
    $key = $short.'|'.$job['application_site'];
    $groups[$key]['short'] = $short;
    $groups[$key]['org_full'] = $job['job_utilities_govtorganization']['name'] ?? $short;
    $groups[$key]['website'] = $job['job_utilities_govtorganization']['website'] ?? null;
    $groups[$key]['site'] = $job['application_site'];
    $groups[$key]['jobs'][] = $job;
}

$create = [];
$report = [];
$usedSlugs = [];
foreach ($groups as $group) {
    [$org, $orgBn, $category, $hot] = $names[$group['short']] ?? [$group['org_full'], null, 'govt', false];
    $start = min(array_map(fn ($j) => $local($j['published_date']), $group['jobs']));
    $end = max(array_map(fn ($j) => $local($j['deadline_date']), $group['jobs']));
    $vacancies = array_sum(array_map(fn ($j) => (int) $j['vacancy'], $group['jobs']));
    $portal = $portals[$group['site']] ?? ['pdf' => [], 'start' => '', 'deadline' => '', 'ref' => '', 'dated' => ''];
    $unclear = [];

    $row = [
        'org' => $org, 'posts' => count($group['jobs']), 'vacancies' => $vacancies,
        'deadline' => $end->format('Y-m-d H:i'), 'link' => $group['site'], 'hot' => $hot, 'category' => $category,
    ];

    if ($end->format('Y-m-d') <= $today) {
        $report[] = $row + ['slug' => null, 'result' => 'SKIPPED: closes today ('.$end->format('j M, g:i A').') — closed before it could be published', 'unclear' => []];
        continue;
    }

    // Circular PDF on the official portal: the official source.
    $subPages = ['BEPZA' => 'https://bepza.teletalk.com.bd/bepza202611/docs/20261119.pdf', 'BPC' => 'https://bpc.teletalk.com.bd/bpc2026_officer/docs/20261119.pdf', 'DGBPO' => 'http://dgbpo.teletalk.com.bd/dgbpo2026/docs/20261108.pdf', 'BOGMC' => 'http://bogmc.teletalk.com.bd/bogmc_2026/docs/20260929.pdf'];
    if (isset($subPages[$group['short']])) {
        $portal['pdf'] = [$subPages[$group['short']]];
    }
    $pdf = $portal['pdf'][0] ?? null;
    $base = str_ends_with($group['site'], '/') ? $group['site'] : preg_replace('#[^/]*$#', '', $group['site']);
    $source = $pdf ? (str_starts_with($pdf, 'http') ? $pdf : (str_starts_with($pdf, '/') ? preg_replace('#^(https?://[^/]+).*#', '$1', $group['site']).$pdf : $base.$pdf)) : $group['site'];
    $source = preg_replace_callback('#[^/]+$#', fn ($m) => rawurlencode(rawurldecode($m[0])), $source);
    if (strlen($source) > 255) {
        $source = $group['site'];
        $unclear[] = 'circular PDF name too long to store; source set to the portal page that links it';
    }
    if (! $pdf) {
        $unclear[] = 'circular PDF link (portal has a sub-page; source set to the portal)';
    }

    // The portal's own dates must agree with the feed.
    if ($portal['deadline'] !== '') {
        $portalEnd = DateTimeImmutable::createFromFormat('d/m/Y, h:i A', $portal['deadline'], $dhaka);
        if ($portalEnd && $portalEnd->format('Y-m-d') !== $end->format('Y-m-d')) {
            $unclear[] = "deadline: feed says {$end->format('j M')}, portal page says {$portalEnd->format('j M')}";
        }
    }
    if ($start->format('Y') !== '2026') {
        $unclear[] = 'start date in the feed is '.$start->format('j M Y').' (looks wrong)';
    }

    $extra = $read[$group['short']] ?? null;
    $posts = array_map(function ($j) use ($extra) {
        $name = trim($j['job_title']);
        $grade = null;
        foreach ($extra['grades'] ?? [] as $title => $g) {
            if (stripos($name, $title) === 0) {
                $grade = $g;
            }
        }

        return array_filter(['name' => $name, 'grade' => $grade, 'vacancies' => $j['vacancy_not_specific'] ? null : ltrim((string) $j['vacancy'], '0')]);
    }, $group['jobs']);

    if (! $extra) {
        $unclear[] = 'eligibility, age limit, fee and grades (scanned circular, not read)';
    } else {
        if (empty($extra['age_limit'])) {
            $unclear[] = 'age limit';
        }
        $unclear[] = 'fee';
        if (count(array_filter($posts, fn ($p) => isset($p['grade']))) < count($posts)) {
            $unclear[] = 'grades of some posts';
        }
    }

    $year = '2026';
    $slugBase = trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($org)), '-').'-job-circular-'.$year;
    $slug = $slugBase;
    for ($n = 2; isset($usedSlugs[$slug]); $n++) {
        $slug = "{$slugBase}-{$n}";
    }
    $usedSlugs[$slug] = true;

    $postCount = count($posts);
    $names3 = implode(', ', array_slice(array_column($posts, 'name'), 0, 3)).($postCount > 3 ? ' and more' : '');
    $bn = fn ($v) => strtr((string) $v, ['0' => '০', '1' => '১', '2' => '২', '3' => '৩', '4' => '৪', '5' => '৫', '6' => '৬', '7' => '৭', '8' => '৮', '9' => '৯']);
    $monthsBn = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    $dateBn = fn (DateTimeImmutable $d) => $bn($d->format('j')).' '.$monthsBn[(int) $d->format('n') - 1];
    $timeBn = fn (DateTimeImmutable $d) => ($d->format('G') >= 12 ? 'বিকেল ' : 'সকাল ').$bn($d->format('g:i'));

    $create[] = array_filter([
        'slug' => $slug,
        'org' => $org,
        'org_bn' => $orgBn,
        'title' => "{$vacancies} vacancies in {$postCount} ".($postCount === 1 ? 'post' : 'posts'),
        'title_bn' => $bn($postCount).'টি পদে '.$bn($vacancies).' জন নিয়োগ',
        'type' => 'circular',
        'category' => $category,
        'status' => 'open',
        'posts' => array_values($posts),
        'vacancies' => (string) $vacancies,
        'eligibility' => $extra['eligibility'] ?? null,
        'age_limit' => $extra['age_limit'] ?? null,
        'apply_from' => $start->format('Y-m-d'),
        'apply_until' => $end->format('Y-m-d'),
        'how_to_apply' => [
            "Open the official portal {$group['site']} and choose the post.",
            'Fill in the online form and upload a recent photo and your signature in the sizes the form asks for.',
            'Download the Applicant\'s Copy with your User ID.',
            'Pay the application fee from a Teletalk prepaid number by SMS within the time given in the circular; the application is complete only after payment.',
            'Applications close on '.$end->format('j F Y, g:i A').' (Bangladesh time).',
        ],
        'url' => $source,
        'apply_url' => $group['site'],
        'summary' => "{$org} has published a recruitment circular for {$vacancies} vacancies in {$postCount} ".($postCount === 1 ? 'post' : 'posts')." ({$names3}). Online applications run from ".$start->format('j F').' to '.$end->format('j F Y, g:i A').' through Teletalk. '.($extra['notes'] ?? '').' Check the official circular for eligibility, age limit and fee before applying.',
        'summary_bn' => ($orgBn ?? $org).' '.$bn($postCount).'টি পদে মোট '.$bn($vacancies).' জন নিয়োগ দেবে। টেলিটকের মাধ্যমে অনলাইনে আবেদন করা যাবে '.$dateBn($start).' থেকে '.$dateBn($end).' '.$timeBn($end).'টা পর্যন্ত। আবেদনের আগে মূল বিজ্ঞপ্তিতে যোগ্যতা, বয়সসীমা ও ফি দেখে নিন।',
    ], fn ($v) => $v !== null && $v !== '');

    $report[] = $row + ['slug' => $slug, 'result' => 'DRAFT', 'unclear' => $unclear, 'source' => $source, 'ref' => trim($portal['ref'].' '.$portal['dated'])];
}

file_put_contents($out, json_encode(['create' => $create, 'update' => []], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
file_put_contents($reportFile, json_encode($report, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
echo count($create)." drafts, ".(count($report) - count($create))." skipped\n";
