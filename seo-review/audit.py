"""
SEO check of every public page.

    python seo-review/audit.py https://bd3schools.com

Reads the sitemaps as Googlebot, checks every page (status, canonical, h1, breadcrumbs, structured data), flags duplicate
or long titles and descriptions, then follows every internal link and file and lists the ones that fail.
Pages are only read; nothing is changed. Add --titles to print every title and description.
"""
import collections
import concurrent.futures
import html
import json
import re
import sys
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")
BASE = (sys.argv[1] if len(sys.argv) > 1 else "https://bd3schools.com").rstrip("/")
SITE = "https://bd3schools.com"
TITLE_MAX, DESCRIPTION_MAX = 62, 150
AGENT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


opener = urllib.request.build_opener(NoRedirect)


def get(path):
    error = None
    for _ in range(2):
        try:
            response = opener.open(urllib.request.Request(BASE + path, headers={"User-Agent": AGENT}), timeout=120)
            kind = response.headers.get("content-type", "")
            return response.status, response.headers, response.read().decode("utf-8", "replace") if "html" in kind or "xml" in kind else ""
        except urllib.error.HTTPError as failed:
            return failed.code, failed.headers, ""
        except Exception as failed:  # noqa: BLE001
            error = failed
    return f"failed: {error}", {}, ""


def local(url):
    return html.unescape(url).replace(SITE, "").replace(BASE, "") or "/"


def tag(pattern, page):
    found = re.search(pattern, page, re.S)
    return html.unescape(found.group(1)).strip() if found else None


maps = re.findall(r"<loc>(.*?)</loc>", get("/sitemap.xml")[2])
urls = []
for sitemap in maps:
    status, _, body = get(local(sitemap))
    found = re.findall(r"<loc>(.*?)</loc>", body)
    print(f"{local(sitemap)}: {status}, {len(found)} pages, {body.count('<lastmod>')} dates")
    urls += found

problems, titles, descriptions, links = [], collections.defaultdict(list), collections.defaultdict(list), {}
types = collections.Counter()
paths = [local(url) for url in urls]
with concurrent.futures.ThreadPoolExecutor(4) as pool:
    for path, (status, _, page) in zip(paths, pool.map(get, paths)):
        title = tag(r"<title>(.*?)</title>", page) or ""
        description = tag(r'name="description" content="([^"]*)"', page) or ""
        canonical = re.findall(r'rel="canonical"[^>]*href="([^"]*)"', page)
        main = tag(r"<main[^>]*>(.*?)</main>", page) or ""
        words = len(re.sub(r"<[^>]+>", " ", main).split())
        found_types = []
        for block in re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', page, re.S):
            try:
                found_types += [(node["@type"], node) for node in json.loads(block).get("@graph", [])]
            except ValueError:
                problems.append((path, "structured data is not valid JSON"))
        names = [name for name, _ in found_types]
        types.update(names)
        for name, node in found_types:
            if name == "Article":
                missing = [key for key in ("headline", "datePublished", "dateModified", "image", "author", "publisher") if not node.get(key)]
                if missing:
                    problems.append((path, f"Article without {', '.join(missing)}"))
            if name == "BreadcrumbList":
                visible = [re.sub(r"<[^>]+>", "", item).strip() for item in re.findall(r"<(?:a|span)[^>]*>(.*?)</(?:a|span)>", tag(r'<nav[^>]*aria-label="Breadcrumb"[^>]*>(.*?)</nav>', page) or "")]
                visible = [html.unescape(item) for item in visible if item not in ("›", "")]
                marked = [item["name"] for item in node["itemListElement"]]
                if visible != marked:
                    problems.append((path, f"breadcrumbs differ: page {visible} / markup {marked}"))
        robots = tag(r'name="robots" content="([^"]*)"', page) or ""
        h1 = len(re.findall(r"<h1[\s>]", page))
        for wrong, message in (
            (status != 200, f"status {status}"),
            (canonical != [SITE + (path if path != "/" else "/")], f"canonical {canonical}"),
            ("noindex" in robots, "noindex but in the sitemap"),
            (h1 != 1, f"{h1} h1"),
            (words < 100, f"only {words} words"),
            (path != "/" and "BreadcrumbList" not in names, "no BreadcrumbList"),
            (len(re.split(r" [|–] bd3schools$", title)[0]) > TITLE_MAX, f"title {len(re.split(r' [|–] bd3schools$', title)[0])}: {title}"),
            (not re.search(r" [|–] bd3schools$", title), f"title without brand: {title}"),
            (len(description) > DESCRIPTION_MAX or len(description) < 50, f"description {len(description)}: {description}"),
        ):
            if wrong:
                problems.append((path, message))
        titles[title].append(path)
        descriptions[description].append(path)
        if "--titles" in sys.argv:
            print(f"{path}\n    {title}\n    {description}")
        for link in re.findall(r'(?:href|src)="(/(?!/)[^"#]*)"', page) + [part.strip().split(" ")[0] for srcset in re.findall(r'srcset="([^"]*)"', page) for part in srcset.split(",")] + re.findall(r'href="https://bd3schools\.com(/[^"#]*)"', page):
            links.setdefault(html.unescape(link), path)

print(f"\n{len(urls)} pages; structured data: {dict(types)}")
print("duplicate titles:", [found for found in titles.values() if len(found) > 1] or "none")
print("duplicate descriptions:", [found for found in descriptions.values() if len(found) > 1] or "none")
print("problems:", "none" if not problems else "")
for path, message in problems:
    print("  ", path, "|", message)

todo = [link for link in links if link not in set(paths) and not re.match(r"^/(admin|api)(/|$)|^/contact[?]", link)]
with concurrent.futures.ThreadPoolExecutor(6) as pool:
    failed = [(link, result[0], result[1].get("location")) for link, result in zip(todo, pool.map(get, todo)) if result[0] != 200]
print(f"{len(links)} internal links and files; not 200:", "none" if not failed else "")
for link, status, location in failed:
    print("  ", status, link, "->", location, "| on", links[link])
