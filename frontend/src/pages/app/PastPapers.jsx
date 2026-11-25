import { useMemo, useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen, faStopwatch, faFileLines, faHourglassHalf, faMagnifyingGlass, faRotateRight, faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { examLink, paperStatus } from "@/lib/papers"
import { Button } from "@/components/ui/button"
import { PageHeader, HeroCard } from "@/components/shared"
import { useApp } from "@/lib/app-context"
import { useApi } from "@/lib/use-api"
import { pastPapersApi } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useSeo } from "@/lib/seo"

export default function PastPapers() {
  const { L, num } = useApp()
  const { data, error, loading, reload } = useApi(() => pastPapersApi.list(), [], { key: "past-papers" })
  const [query, setQuery] = useState("")

  useSeo({
    title: "Previous BCS Questions & Full Solutions (10th to 48th BCS) | বিগত বিসিএস প্রশ্ন সমাধান — bd3schools",
    description: "১০ম থেকে ৪৮তম বিসিএস প্রিলিমিনারি পরীক্ষার ৩৯টি আসল প্রশ্নপত্র, ২০০টি প্রশ্ন ও পূর্ণাঙ্গ নির্ভুল সমাধান। অনলাইনে পরীক্ষা দিন বা বিনামূল্যে PDF সংগ্রহ করুন।",
    keywords: "10th to 48th bcs question solution, 14 bcs question with solution, bcs question bank, bcs preliminary question with answer, বিগত বিসিএস প্রশ্ন সমাধান, bcs previous year question, bd3schools",
  })

  const papers = useMemo(() => {
    const all = data?.papers ?? []
    const q = query.trim().replace(/[^0-9০-৯]/g, "")
    if (!q) return all
    // Accept Bangla or English digits, e.g. "47" or "৪৭".
    const digits = q.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d))
    return all.filter((p) => String(p.number).includes(digits))
  }, [data, query])

  const ready = (data?.papers ?? []).length
  const latest = data?.papers?.[0]

  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader
        title={L("Previous BCS questions", "বিগত বিসিএস প্রশ্ন ও সমাধান")}
        subtitle={L(
          "Every BCS preliminary paper, newest first. Solve a paper and see the right answer with an explanation after each question.",
          "সব বিসিএস প্রিলিমিনারি প্রশ্ন, সর্বশেষটি আগে। প্রশ্ন সমাধান করুন—প্রতিটি উত্তরের পর সঠিক উত্তর ও ব্যাখ্যা দেখুন।"
        )}
        className="mb-0 md:mb-0"
      />

      {latest && (
        <HeroCard className="p-4 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[0.7rem] font-semibold">
                <span className="size-1.5 rounded-full bg-glow" />
                <span>{L("Latest paper", "সর্বশেষ প্রশ্ন")}</span>
              </span>
              <h2 className="mt-2 text-lg font-bold md:text-2xl">{L(latest.name, latest.name_bn)}</h2>
              <p className="mt-0.5 text-sm text-white/80">
                {L(`${num(data.papers.length)} papers in total · ${num(ready)} ready to solve`, `মোট ${num(data.papers.length)}টি বিসিএস · ${num(ready)}টি সমাধানের জন্য প্রস্তুত`)}
              </p>
            </div>
            <PaperAction paper={latest} L={L} onHero />
          </div>
        </HeroCard>
      )}

      <div className="relative max-w-sm">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputMode="numeric"
          placeholder={L("Find a BCS, e.g. 44", "বিসিএস খুঁজুন, যেমন ৪৪")}
          className="h-11 w-full rounded-full border bg-card pr-4 pl-10 text-base outline-none focus:border-primary md:text-sm"
        />
      </div>

      {loading && (
        <div className="grid gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="card h-[136px] animate-pulse bg-muted/40" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="card flex flex-col items-start gap-3 p-5 text-sm">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" className="rounded-full" onClick={reload}>
            <FontAwesomeIcon icon={faRotateRight} /> {L("Try again", "আবার চেষ্টা করুন")}
          </Button>
        </div>
      )}

      {!loading && !error && (
        <>
          {papers.length === 0 ? (
            <p className="card p-5 text-sm text-muted-foreground">{L("No BCS matches that number.", "এই নম্বরের কোনো বিসিএস পাওয়া যায়নি।")}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-3">
              {papers.map((paper) => {
                const is48th = paper.number === 48
                const is47th = paper.number === 47
                const isHighlight = true
                return (
                  <div
                    key={paper.number}
                    className={cn(
                      "card flex flex-col p-4.5 transition-all hover:border-primary/40",
                      isHighlight && "border-primary/40 bg-gradient-to-br from-primary/3 via-card to-card shadow-sm ring-1 ring-primary/20"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "grid size-12 shrink-0 place-items-center rounded-xl text-base font-bold tabular-nums",
                          isHighlight ? "bg-primary text-white shadow-xs" : "bg-primary/10 text-primary"
                        )}
                      >
                        {num(paper.number)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="leading-snug font-bold">{L(paper.name, paper.name_bn)}</h3>
                          {is48th && (
                            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-400">
                              {L("Latest Special", "সর্বশেষ বিশেষ")}
                            </span>
                          )}
                          {is47th && (
                            <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[0.65rem] font-bold text-blue-600 dark:text-blue-400">
                              {L("Latest General", "সর্বশেষ সাধারণ")}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                          <span>{L("Preliminary MCQ", "প্রিলিমিনারি এমসিকিউ")}</span>
                          {paper.special && (
                            <span className="rounded bg-amber-500/15 px-1.5 py-px text-[0.7rem] font-semibold text-amber-700 dark:text-amber-400">
                              {L("Special", "বিশেষ")}
                            </span>
                          )}
                          <span className="rounded bg-primary/10 px-1.5 py-px text-[0.7rem] font-semibold text-primary">
                            {L(`${num(paper.full_marks)} marks`, `${num(paper.full_marks)} নম্বর`)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs font-medium text-muted-foreground">
                      <FontAwesomeIcon
                        icon={faFileLines}
                        className="mr-1.5 text-primary"
                      />
                      {L(`${num(paper.questions)} questions with answers`, `উত্তরসহ ${num(paper.questions)}টি প্রশ্ন`)}
                      {paper.added > 0 && (
                        <span className="mt-1 block font-normal">
                          {L(`${num(paper.own)} from this paper · ${num(paper.added)} from other BCS, with the year`, `এই প্রশ্নপত্রের ${num(paper.own)}টি · অন্য বিসিএসের ${num(paper.added)}টি (সালসহ)`)}
                        </span>
                      )}
                    </p>

                    <div className="mt-4">
                      <PaperAction paper={paper} L={L} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5" />
            <span>
              {L(
                "Open “Questions & solutions” to read every question with its answer and explanation, or “Take as exam” to sit the paper with the real time limit and −0.5 negative marking.",
                "“প্রশ্ন ও সমাধান”-এ সব প্রশ্ন উত্তর ও ব্যাখ্যাসহ পড়ুন, অথবা “পরীক্ষা দিন”-এ আসল সময়সীমা ও −০.৫ নেগেটিভ মার্কিংসহ পরীক্ষা দিন।"
              )}
            </span>
          </p>
        </>
      )}
    </div>
  )
}

/** Two ways into a paper: read every question with its solution, or take it as a timed exam. */
function PaperAction({ paper, L, onHero = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        asChild
        className={cn("h-10 flex-1 rounded-full font-semibold sm:flex-none sm:px-5", onHero ? "bg-white text-primary hover:bg-white/90" : "")}
      >
        <Link to={`/app/bcs-papers/${paper.number}`}>
          <FontAwesomeIcon icon={faBookOpen} className="text-xs" /> {L("Questions & solutions", "প্রশ্ন ও সমাধান")}
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className={cn("h-10 flex-1 rounded-full font-semibold sm:flex-none sm:px-5", onHero && "border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white")}
      >
        <Link to={examLink(paper)}>
          <FontAwesomeIcon icon={faStopwatch} className="text-xs" /> {L("Take as exam", "পরীক্ষা দিন")}
        </Link>
      </Button>
    </div>
  )
}
