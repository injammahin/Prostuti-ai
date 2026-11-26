# Run today's notices

What "run today's notices" means. Follow the steps in order. Never publish without the owner's approval (step 6).

Helper files are in `docs/daily-notices/`:

- `build-drafts.php` turns the official Teletalk feed into a draft file.
- `render.py` turns circular PDFs into images, so scanned circulars can be read.

Each run also saves its own files there:

- `drafts-YYYY-MM-DD.json`: the draft file to import.
- `report-YYYY-MM-DD.json`: what was found, skipped and unclear.

## Rules

- **Official sources only for facts.** Newspapers, Facebook and job portals are for discovery only. Confirm every fact on the official circular, the official portal or the official Teletalk feed.
- **Your own words.** Write the summary and the how-to-apply steps yourself. Never copy text from news or job sites.
- **One circular = one page, forever.** Never make a second page for the admit card, exam date, result or a deadline extension. Put the update on the same notice: the `update` list in the import file, or **Update** in the admin panel. This changes `updated_at` and the status, and shows "Updates" on the page.
- **Unclear means empty.** If a field (eligibility, age, fee, grade) was not read on the circular, leave it empty and list it as unclear in the report. Never guess.
- **Slug:** `{organisation}-job-circular-{year}`, made automatically and never changed afterwards. A second circular from the same organisation in the same year gets `-2`.

## Steps

### 1. Close what expired

On the server:

```bash
php artisan notices:close-expired
```

This also runs every night at 00:05, Dhaka time, if the server cron `* * * * * php artisan schedule:run` is set up.

A circular whose deadline has passed leaves the notice board, the category pages, the home page and the app by itself the next day. Its page stays live, marked "Application closed", so search results and shared links keep working.

### 2. Find open circulars

Use official sources:

- **Teletalk's official feed** of every government application running now (most govt, semi-govt and autonomous jobs):

  ```bash
  for p in $(seq 1 25); do curl -s "https://alljobs.teletalk.com.bd/api/v1/govt-jobs/list?page=$p&limit=20" -o tt/jobs$(printf %02d $p).json; done
  ```

  Merge the pages into `tt/all.json`: one list of jobs, with duplicate ids removed. `build-drafts.php` also reads `tt/portals.json`, which maps each portal URL to `{ref, dated, start, deadline, pdf: [...]}` from step 2's portal pages. Each job has its title, vacancy, `application_site`, `published_date` (the application start) and `deadline_date`, all in UTC. Add 6 hours for Dhaka time.
- **Each portal page** (`application_site`): the circular reference, its date, the start and the deadline, and the circular PDF (`docs/*.pdf`). Some portals keep the circular on a sub-page (`bepza202611/`, `dgbpo2026/` …). Follow the blue "ongoing circular" link.
- **BPSC:** <https://bpsc.gov.bd> and <https://bpsc.teletalk.com.bd> (BCS and non-cadre).
- **Banks:** <https://erecruitment.bb.org.bd>, the Bangladesh Bank / BSCS "Job Circulars" box. It says "No ongoing Job Circulars found" when none are open.
- **NTRCA:** <https://ntrca.gov.bd>. **DPE:** <https://dpe.gov.bd>. Ministry and department sites can also be used.
- **Discovery only:** Prothom Alo Chakri, Jugantor, Jagonews and job portals. Find a lead there, then confirm it on an official site before it counts.

Keep only circulars whose deadline is **tomorrow or later**. One that closes today is closed before it could be published, so report it as skipped.

### 3. Skip what already exists

Compare against the notices on the website (admin → Job notices, or `php artisan tinker`). The import also skips any notice with the same slug or the same circular file.

If the circular is already there, do not create it. Write an `update` entry instead: a new deadline, the admit card, the exam date or the result.

### 4. Read the circulars

For high-demand circulars, read the PDF itself and fill in eligibility, age limit, fee and post grades. High demand means 9th–10th grade posts, 100+ vacancies, BPSC, banks, Petrobangla, BEPZA, Parliament, Post Office, police, power companies and city corporations.

Scanned PDFs have no text. Turn them into images and read those:

```bash
python -m venv venv && venv/Scripts/python -m pip install pymupdf
venv/Scripts/python docs/daily-notices/render.py png 2 1.3 tt/pdf/<file>.pdf
```

Put what you read into the `$read` list in `build-drafts.php`.

### 5. Make the draft file and import it as drafts

```bash
php docs/daily-notices/build-drafts.php tt YYYY-MM-DD docs/daily-notices/drafts-YYYY-MM-DD.json docs/daily-notices/report-YYYY-MM-DD.json
php artisan notices:import docs/daily-notices/drafts-YYYY-MM-DD.json --dry-run   # must end with "Dry run: nothing was saved."
php artisan notices:import docs/daily-notices/drafts-YYYY-MM-DD.json             # creates DRAFTS (not shown on the site)
```

Import file format (`--publish` would publish at once; don't use it before approval):

```json
{
  "create": [{"org": "BEPZA", "org_bn": "বেপজা", "title": "...", "category": "autonomous", "posts": [{"name": "...", "grade": "9th", "vacancies": "3"}],
              "apply_from": "2026-11-24", "apply_until": "2026-12-24", "url": "<official circular PDF>", "apply_url": "<teletalk portal>",
              "how_to_apply": ["step 1", "step 2"], "summary": "...", "summary_bn": "..."}],
  "update": [{"slug": "bpsc-non-cadre-83-96-2026", "status": "admit", "exam_date": "2027-01-10"}]
}
```

- **Categories:** `bcs`, `bank`, `primary`, `ntrca`, `govt`, `autonomous`, `others`.
- **Statuses:** `open`, `closing` (worked out by itself 3 days before the deadline), `closed`, `admit`, `exam`, `result`.

### 6. Report and wait for approval

Give the owner one table:

organization | posts | vacancies | deadline | official link | slug | unclear fields

- Mark the high-demand circulars with ★.
- List the skipped ones (closing today, duplicates, not confirmed on an official site).
- List the updates prepared.

Each draft can be checked in admin → Job notices → **Preview**.

### 7. After approval: publish and check

```bash
php artisan notices:publish <slug> <slug> ...
```

For every published URL, check all of these:

```bash
curl -s -A Googlebot https://bd3schools.com/notices/<slug> | grep -oE '<title>[^<]*</title>|<h1[^>]*>[^<]*</h1>|"date(Published|Modified)":"[^"]*"|"@type":"(Article|BreadcrumbList)"'
curl -s -o /dev/null -w "%{http_code}\n" https://bd3schools.com/notices/<slug>      # 200
curl -s https://bd3schools.com/sitemap-notices.xml | grep -c "/notices/<slug>"     # 1
```

Then give the owner:

- The **top 5 URLs** to submit in Search Console (URL inspection → Request indexing). Choose by demand: most vacancies and highest grades first.
- A **2–3 line Bangla Facebook post** for each: organisation, posts and vacancies, deadline, the bd3schools link, and a reminder to apply only on the official portal.

## Cache

Saving a notice in the admin panel or with these commands rebuilds the website pages at once. A deploy shows at once too: the cache key includes the code version, and `php artisan optimize` or `php artisan seo:refresh` also empties it. If a page still looks old, use admin → Job notices → **Clear website cache**.
