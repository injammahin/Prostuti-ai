import { useState } from "react"
import { Link, useParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faClock, faFilePdf, faFileArrowDown, faLink, faCheck, faBookOpen, faRotateRight, faNewspaper } from "@fortawesome/free-solid-svg-icons"
import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared"
import { useApi } from "@/lib/use-api"
import { blogApi } from "@/lib/api"
import { useApp } from "@/lib/app-context"
import { useSeo } from "@/lib/seo"
import { cn } from "@/lib/utils"
import { PostCard } from "@/components/BlogCards"

function fileSize(bytes) {
  if (!bytes) return ""
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export default function BlogPost() {
  const { slug } = useParams()
  const { L, num, fmtDate } = useApp()
  const { data, error, loading, reload } = useApi(() => blogApi.show(slug), [slug], { key: `blog-${slug}` })
  const [copied, setCopied] = useState(false)
  const post = data?.data
  const related = data?.related ?? []

  useSeo(
    post
      ? {
          title: post.meta_title,
          description: post.meta_description,
          image: post.cover_image,
          type: "article",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.meta_description,
            image: post.cover_image ? [post.cover_image] : undefined,
            datePublished: post.published_at,
            dateModified: post.updated_at,
            author: { "@type": "Organization", name: post.author },
            publisher: { "@type": "Organization", name: "DreamPrep" },
            inLanguage: post.lang === "bn" ? "bn-BD" : "en",
            mainEntityOfPage: typeof window !== "undefined" ? window.location.href : undefined,
          },
        }
      : {}
  )

  const pageUrl = typeof window !== "undefined" ? window.location.href : ""
  const copyLink = () =>
    navigator.clipboard?.writeText(pageUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
        <div className="aspect-[1.91/1] w-full animate-pulse rounded-2xl bg-muted" />
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-muted/70" />
        ))}
      </div>
    )
  }

  if (error || !post) {
    const missing = error && /not found|404/i.test(error)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={<FontAwesomeIcon icon={faNewspaper} />}
          title={missing ? L("This article isn't available", "এই লেখাটি পাওয়া যাচ্ছে না") : L("Couldn't load the article", "লেখাটি লোড করা যায়নি")}
          text={missing ? L("It may have been moved or unpublished.", "লেখাটি সরানো বা বন্ধ করা হয়ে থাকতে পারে।") : error}
          action={
            <div className="flex gap-2">
              {!missing && (
                <Button variant="outline" className="rounded-full" onClick={reload}>
                  <FontAwesomeIcon icon={faRotateRight} /> {L("Try again", "আবার চেষ্টা করুন")}
                </Button>
              )}
              <Button asChild className="rounded-full">
                <Link to="/blog">{L("All articles", "সব লেখা")}</Link>
              </Button>
            </div>
          }
        />
      </div>
    )
  }

  const isBn = post.lang === "bn"
  const share = encodeURIComponent(pageUrl)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <article className="mx-auto max-w-3xl" lang={isBn ? "bn" : "en"}>
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /> {L("All articles", "সব লেখা")}
        </Link>

        <header className="mt-5">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{post.category_label}</span>
          <h1 className={cn("mt-3 text-[1.75rem] leading-tight font-bold tracking-tight text-balance md:text-[2.4rem]", isBn && "bn leading-snug")}>{post.title}</h1>
          <p className={cn("mt-3 text-base text-muted-foreground md:text-lg", isBn && "bn")}>{post.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y py-3">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{post.author.slice(0, 1)}</span>
              <div className="text-sm">
                <p className="font-semibold">{post.author}</p>
                <p className="text-xs text-muted-foreground">
                  {fmtDate(post.published_at, { day: "numeric", month: "long", year: "numeric" })} · <FontAwesomeIcon icon={faClock} className="mx-0.5" />{" "}
                  {L(`${post.reading_minutes} min read`, `${num(post.reading_minutes)} মিনিটে পড়া`)}
                </p>
              </div>
            </div>
            <ShareButtons share={share} copied={copied} onCopy={copyLink} L={L} />
          </div>
        </header>

        {post.cover_image && <img src={post.cover_image} alt={post.title} className="mt-6 aspect-[1.91/1] w-full rounded-2xl object-cover" />}

        <div className={cn("article mt-8", isBn && "bn")} dangerouslySetInnerHTML={{ __html: post.body }} />

        {post.attachments?.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold">{L("Downloads", "ডাউনলোড")}</h2>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {post.attachments.map((f) => (
                <a
                  key={f.url}
                  href={f.url}
                  target="_blank"
                  rel="noopener"
                  download
                  className="card lift group flex items-center gap-3 p-3.5"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-destructive/10 text-lg text-destructive">
                    <FontAwesomeIcon icon={f.type === "PDF" ? faFilePdf : faFileArrowDown} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-sm font-semibold group-hover:text-primary", isBn && "bn")}>{f.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {f.type}
                      {f.size ? ` · ${fileSize(f.size)}` : ""}
                    </span>
                  </span>
                  <FontAwesomeIcon icon={faFileArrowDown} className="text-muted-foreground group-hover:text-primary" />
                </a>
              ))}
            </div>
          </section>
        )}

        {post.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Turn readers into practising students */}
        <div className="hero mt-10 flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold">{L("Put it into practice", "এখনই অনুশীলন করুন")}</p>
            <p className="mt-0.5 text-sm text-white/80">
              {L("Solve previous BCS papers with answers and explanations — free.", "বিগত বিসিএসের প্রশ্ন উত্তর ও ব্যাখ্যাসহ সমাধান করুন—সম্পূর্ণ ফ্রি।")}
            </p>
          </div>
          <Button asChild className="h-11 shrink-0 rounded-full bg-white px-6 font-semibold text-primary hover:bg-white/90">
            <Link to="/bcs-papers">
              <FontAwesomeIcon icon={faBookOpen} /> {L("Previous BCS questions", "বিগত বিসিএস প্রশ্ন")}
            </Link>
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t pt-5">
          <p className="text-sm font-semibold">{L("Found this useful? Share it", "উপকারী মনে হলে শেয়ার করুন")}</p>
          <ShareButtons share={share} copied={copied} onCopy={copyLink} L={L} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold">{L("Keep reading", "আরও পড়ুন")}</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} L={L} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ShareButtons({ share, copied, onCopy, L }) {
  const cls = "grid size-9 place-items-center rounded-full border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
  return (
    <div className="flex items-center gap-1.5">
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${share}`} target="_blank" rel="noopener" className={cls} aria-label="Share on Facebook">
        <FontAwesomeIcon icon={faFacebook} />
      </a>
      <a href={`https://wa.me/?text=${share}`} target="_blank" rel="noopener" className={cls} aria-label="Share on WhatsApp">
        <FontAwesomeIcon icon={faWhatsapp} />
      </a>
      <button onClick={onCopy} className={cls} aria-label={L("Copy link", "লিংক কপি করুন")}>
        <FontAwesomeIcon icon={copied ? faCheck : faLink} className={copied ? "text-success" : ""} />
      </button>
    </div>
  )
}
