import { useMemo, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faXmark, faNewspaper, faRotateRight } from "@fortawesome/free-solid-svg-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PageHeader, EmptyState } from "@/components/shared"
import { useApi } from "@/lib/use-api"
import { blogApi } from "@/lib/api"
import { useApp } from "@/lib/app-context"
import { useSeo } from "@/lib/seo"
import { cn } from "@/lib/utils"
import { LeadPost, PostCard } from "@/components/BlogCards"

export default function Blog() {
  const { L } = useApp()
  const { data, error, loading, reload } = useApi(() => blogApi.list(), [], { key: "blog" })
  const [category, setCategory] = useState("all")
  const [q, setQ] = useState("")

  useSeo({
    title: L("Blog — BCS & govt job preparation guides", "ব্লগ — বিসিএস ও সরকারি চাকরির প্রস্তুতি গাইড"),
    description: L(
      "Preparation guides, syllabus breakdowns, exam strategy and study tips for BCS, Bank, NTRCA and Primary teacher exams.",
      "বিসিএস, ব্যাংক, এনটিআরসিএ ও প্রাথমিক শিক্ষক নিয়োগ পরীক্ষার প্রস্তুতি গাইড, সিলেবাস, পরীক্ষার কৌশল ও পড়াশোনার টিপস।"
    ),
  })

  const posts = useMemo(() => data?.data ?? [], [data])
  const usedCategories = useMemo(() => {
    const labels = new Map()
    posts.forEach((p) => labels.set(p.category, p.category_label))
    return [...labels]
  }, [posts])

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return posts.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (!needle || `${p.title} ${p.excerpt} ${(p.tags || []).join(" ")}`.toLowerCase().includes(needle))
    )
  }, [posts, category, q])

  const [lead, ...rest] = list
  const filtering = category !== "all" || q.trim() !== ""

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <PageHeader
        title={L("Blog", "ব্লগ")}
        subtitle={L("Guides, syllabus breakdowns and exam strategy for BCS and govt job exams.", "বিসিএস ও সরকারি চাকরির পরীক্ষার প্রস্তুতি গাইড, সিলেবাস ও কৌশল।")}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0">
          {[["all", L("All", "সব")], ...usedCategories].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={cn(
                "h-9 shrink-0 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors",
                category === value ? "bg-primary text-primary-foreground" : "border bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={L("Search articles…", "লেখা খুঁজুন…")}
            className="h-10 rounded-full bg-card pl-10 text-base md:text-sm"
            aria-label={L("Search articles", "লেখা খুঁজুন")}
          />
          {q && (
            <button onClick={() => setQ("")} className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" aria-label={L("Clear search", "খোঁজা মুছুন")}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="card h-80 animate-pulse bg-muted/40" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="card mt-6 flex flex-col items-start gap-3 p-5 text-sm">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" className="rounded-full" onClick={reload}>
            <FontAwesomeIcon icon={faRotateRight} /> {L("Try again", "আবার চেষ্টা করুন")}
          </Button>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-6">
          {list.length === 0 ? (
            <EmptyState
              icon={<FontAwesomeIcon icon={faNewspaper} />}
              title={posts.length ? L("No articles match", "কোনো লেখা মেলেনি") : L("Articles are coming soon", "শীঘ্রই লেখা আসছে")}
              text={posts.length ? L("Try another category or search term.", "অন্য বিষয় বা শব্দ দিয়ে খুঁজুন।") : undefined}
            />
          ) : (
            <>
              {!filtering && lead && <LeadPost post={lead} L={L} />}
              <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", !filtering && "mt-6")}>
                {(filtering ? list : rest).map((p) => (
                  <PostCard key={p.slug} post={p} L={L} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
