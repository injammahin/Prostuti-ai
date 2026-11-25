import { useMemo, useState, useEffect } from "react"
import { Link, useParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faStopwatch,
  faEye,
  faEyeSlash,
  faWandMagicSparkles,
  faRotateRight,
  faHourglassHalf,
  faBookmark,
  faCopy,
  faCheck,
  faMagnifyingGlass,
  faLightbulb,
  faArrowLeft,
  faChevronDown,
  faListUl,
} from "@fortawesome/free-solid-svg-icons"
import { faBookmark as faBookmarkOutline } from "@fortawesome/free-regular-svg-icons"
import { Button } from "@/components/ui/button"
import AskAiSheet from "@/components/AskAiSheet"
import { useApp } from "@/lib/app-context"
import { useApi } from "@/lib/use-api"
import { pastPapersApi } from "@/lib/api"
import { COMPLETE_SHARE, examLink } from "@/lib/papers"
import { cn } from "@/lib/utils"

/** Printed BCS papers label options ক খ গ ঘ, even for English questions. */
const LETTERS = ["ক", "খ", "গ", "ঘ"]

/**
 * A previous BCS paper laid out like the printed question sheet: two columns,
 * ক/খ/গ/ঘ options and "উত্তর" beside every question, explanations on tap.
 */
export default function PaperSolutions() {
  const { number } = useParams()
  const { L, num, fmtDate, isGuest, requireAccount } = useApp()
  const { data, error, loading, reload } = useApi(() => pastPapersApi.show(number), [number], { key: `past-paper-${number}` })

  const [showAnswers, setShowAnswers] = useState(true)
  const [allExplanations, setAllExplanations] = useState(false)
  const [subject, setSubject] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [aiQuestion, setAiQuestion] = useState(null)
  const [userChoices, setUserChoices] = useState({})
  const [revealed, setRevealed] = useState({})
  const [openExplanations, setOpenExplanations] = useState({})
  const [copiedId, setCopiedId] = useState(null)
  const [filterBarVisible, setFilterBarVisible] = useState(true)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          // Always show when near the top of the page (within 60px) or when search input is focused
          if (currentScrollY < 60 || isSearchFocused) {
            setFilterBarVisible(true)
          } else {
            const diff = currentScrollY - lastScrollY
            // Scrolling down by more than 8px -> hide on mobile
            if (diff > 8) {
              setFilterBarVisible(false)
            } else if (diff < -8) {
              // Scrolling up by more than 8px -> show on mobile
              setFilterBarVisible(true)
            }
          }
          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isSearchFocused])
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bd3schools:bookmarks") || "[]")
    } catch {
      return []
    }
  })

  const paper = data?.paper
  const questions = useMemo(() => (data?.questions ?? []).map((q, i) => ({ ...q, number: q.number || i + 1 })), [data])
  const paperSize = Math.max(paper?.total ?? 0, questions.length)
  const fullMarks = paper?.full_marks ?? paperSize
  const paperTag = paper ? L(paper.name, paper.name_bn || paper.name) : ""

  const subjects = useMemo(() => {
    const map = new Map()
    questions.forEach((q) => {
      if (!q.subject?.slug) return
      if (!map.has(q.subject.slug)) {
        map.set(q.subject.slug, { slug: q.subject.slug, name: q.subject.name, name_bn: q.subject.name_bn || q.subject.name, count: 0 })
      }
      map.get(q.subject.slug).count += 1
    })
    return [...map.values()]
  }, [questions])

  const filteredQuestions = useMemo(() => {
    let list = questions
    if (subject !== "all") list = list.filter((q) => q.subject?.slug === subject)
    const needle = searchQuery.trim().toLowerCase()
    if (needle) {
      const digits = needle.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d))
      list = list.filter(
        (q) =>
          q.body?.toLowerCase().includes(needle) ||
          q.topic?.toLowerCase().includes(needle) ||
          q.options?.some((o) => o?.toLowerCase().includes(needle)) ||
          String(q.number) === digits
      )
    }
    return list
  }, [questions, subject, searchQuery])

  /** Consecutive questions of the same subject form one section, like the printed paper's parts. */
  const sections = useMemo(() => {
    const out = []
    filteredQuestions.forEach((q) => {
      const slug = q.subject?.slug ?? "other"
      const last = out[out.length - 1]
      if (last && last.slug === slug) last.questions.push(q)
      else out.push({ slug, subject: q.subject, questions: [q] })
    })
    return out
  }, [filteredQuestions])

  const askAi = (q) => {
    if (requireAccount("ask the AI tutor to explain a question")) setAiQuestion(q)
  }

  const toggleBookmark = (id) => {
    if (!requireAccount("bookmark questions")) return
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      try {
        localStorage.setItem("bd3schools:bookmarks", JSON.stringify(next))
      } catch {
        /* storage unavailable */
      }
      return next
    })
  }

  const copyQuestion = (q) => {
    const opts = q.options.map((opt, i) => `${LETTERS[i]}. ${opt}`).join("\n")
    const text = `${q.number}. ${q.body}\n${opts}\nউত্তর: ${LETTERS[q.answer_index]}. ${q.options[q.answer_index]}${q.explanation ? `\n\nব্যাখ্যা: ${q.explanation}` : ""}`
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(q.id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const chooseOption = (questionId, optionIndex) => {
    if (showAnswers || userChoices[questionId] !== undefined) return
    setUserChoices((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  const attempted = Object.keys(userChoices).length
  const correct = questions.filter((q) => userChoices[q.id] === q.answer_index).length

  return (
    <div className="space-y-4 pb-12 md:space-y-5">
      {/* Top bar: back + the two ways into the paper */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/app/bcs-papers"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          <span>{L("All previous BCS papers", "সব বিগত বিসিএস প্রশ্ন")}</span>
        </Link>
        {paper && questions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="h-9 rounded-full px-4 text-xs font-semibold" onClick={() => setShowAnswers((v) => !v)}>
              <FontAwesomeIcon icon={showAnswers ? faEyeSlash : faEye} />
              {showAnswers ? L("Hide answers (self-test)", "উত্তর লুকান (নিজে যাচাই)") : L("Show all answers", "সব উত্তর দেখান")}
            </Button>
            <Button asChild className="h-9 rounded-full px-4 text-xs font-semibold">
              <Link to={examLink(paper)}>
                <FontAwesomeIcon icon={faStopwatch} /> {L("Take as timed exam", "পরীক্ষা হিসেবে দিন")}
              </Link>
            </Button>
          </div>
        )}
      </div>

      {loading && (
        <div className="card space-y-4 p-6">
          <div className="mx-auto h-8 w-64 animate-pulse rounded bg-muted/60" />
          <div className="mx-auto h-4 w-40 animate-pulse rounded bg-muted/60" />
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-20 animate-pulse rounded bg-muted/40" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="card flex flex-col items-start gap-4 p-6 text-sm">
          <p className="font-semibold text-destructive">{error}</p>
          <Button variant="outline" className="rounded-full" onClick={reload}>
            <FontAwesomeIcon icon={faRotateRight} /> {L("Try again", "আবার চেষ্টা করুন")}
          </Button>
        </div>
      )}

      {paper && !loading && questions.length === 0 && (
        <div className="card flex flex-col items-center gap-3 p-12 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-muted text-2xl text-muted-foreground">
            <FontAwesomeIcon icon={faHourglassHalf} />
          </span>
          <p className="text-lg font-bold">{L("Questions for this paper are being added", "এই বিসিএসের প্রশ্ন যোগ করা হচ্ছে")}</p>
          <p className="max-w-md text-sm text-muted-foreground">
            {L("Check back soon, or practise another paper in the meantime.", "শীঘ্রই সম্পূর্ণ প্রশ্ন ও সমাধান উন্মুক্ত হবে। অন্য একটি বিসিএস অনুশীলন করতে পারেন।")}
          </p>
          <Button asChild variant="outline" className="mt-2 rounded-full">
            <Link to="/app/bcs-papers">{L("All BCS papers", "সব বিসিএস প্রশ্ন")}</Link>
          </Button>
        </div>
      )}

      {paper && questions.length > 0 && (
        <>
          {/* Sticky filter bar so 200 questions stay easy to move through */}
          <div
            className={cn(
              "sticky top-16 z-10 -mx-1 space-y-2 bg-background/95 px-1 py-2 backdrop-blur-md transition-all duration-300 ease-in-out md:top-[4.5rem] md:translate-y-0 md:opacity-100 md:pointer-events-auto",
              filterBarVisible
                ? "translate-y-0 opacity-100 pointer-events-auto"
                : "-translate-y-[120%] opacity-0 pointer-events-none"
            )}
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0">
                <SubjectChip active={subject === "all"} onClick={() => setSubject("all")} label={L("All", "সব")} count={num(questions.length)} />
                {subjects.map((s) => (
                  <SubjectChip key={s.slug} active={subject === s.slug} onClick={() => setSubject(s.slug)} label={L(s.name, s.name_bn)} count={num(s.count)} />
                ))}
              </div>
              <div className="relative w-full md:w-64 md:shrink-0">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-xs text-muted-foreground" />
                <input
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={L("Search, or type a question no.", "খুঁজুন বা প্রশ্ন নম্বর লিখুন")}
                  className="h-9 w-full rounded-full border bg-card pr-8 pl-9 text-base outline-none focus:border-primary md:text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label={L("Clear search", "খোঁজা মুছুন")}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                {L(`Showing ${num(filteredQuestions.length)} of ${num(questions.length)}`, `${num(questions.length)}টির মধ্যে ${num(filteredQuestions.length)}টি প্রশ্ন`)}
                {!showAnswers && attempted > 0 && (
                  <span className="ml-2 font-semibold text-primary">
                    · {L(`Your score: ${num(correct)}/${num(attempted)}`, `আপনার স্কোর: ${num(correct)}/${num(attempted)}`)}
                  </span>
                )}
              </span>
              <button onClick={() => setAllExplanations((v) => !v)} className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
                <FontAwesomeIcon icon={faListUl} />
                {allExplanations ? L("Collapse all explanations", "সব ব্যাখ্যা বন্ধ করুন") : L("Open all explanations", "সব ব্যাখ্যা খুলুন")}
              </button>
            </div>
          </div>

          {isGuest && (
            <div className="flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm">
                <b className="font-semibold">{L("You're reading as a guest.", "আপনি অতিথি হিসেবে পড়ছেন।")}</b>{" "}
                <span className="text-muted-foreground">
                  {L(
                    "Create a free account to save your exam scores, bookmark questions and ask the AI tutor.",
                    "ফ্রি অ্যাকাউন্ট খুলে পরীক্ষার স্কোর সংরক্ষণ, প্রশ্ন বুকমার্ক ও AI টিউটরের সাহায্য নিন।"
                  )}
                </span>
              </p>
              <Button asChild className="h-9 shrink-0 rounded-full px-5 text-xs font-semibold">
                <Link to="/signup" state={{ from: `/app/bcs-papers/${number}` }}>
                  {L("Create free account", "ফ্রি অ্যাকাউন্ট খুলুন")}
                </Link>
              </Button>
            </div>
          )}

          {/* The question sheet */}
          <article className="rounded-2xl border-2 border-primary/25 bg-card p-1 shadow-sm">
            <div className="rounded-xl border border-primary/15 px-3 py-5 sm:px-5 md:px-8 md:py-7">
              <header className="border-b-2 border-double border-primary/30 pb-4 text-center">
                <h1 className="bn text-2xl font-extrabold text-foreground md:text-3xl">
                  {L(`${paper.name} (Preliminary)`, `${paper.name_bn || paper.name} (প্রিলি.)`)}
                </h1>
                {paper.exam_date && (
                  <p className="bn mt-1 text-sm font-medium text-muted-foreground">
                    {L("Date", "তারিখ")}: {fmtDate(paper.exam_date, { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
                <div className="mx-auto mt-3 flex max-w-md items-center justify-between text-sm font-semibold text-foreground/80">
                  <span>{L(`Full marks: ${num(fullMarks)}`, `পূর্ণমান: ${num(fullMarks)}`)}</span>
                  <span className="text-xs font-medium text-muted-foreground">{L("−0.5 per wrong", "ভুলে −০.৫")}</span>
                  <span>{L(`Time: ${paperSize >= 200 ? "2 hours" : "1 hour"}`, `সময়: ${paperSize >= 200 ? "২ ঘণ্টা" : "১ ঘণ্টা"}`)}</span>
                </div>
                {paper.added > 0 && (
                  <p className="bn mx-auto mt-3 max-w-lg rounded-lg bg-secondary/70 px-3 py-2 text-xs font-medium text-secondary-foreground">
                    {L(
                      `${num(paper.own)} questions from this paper and ${num(paper.added)} from other BCS papers, each marked with its BCS and year.`,
                      `এই প্রশ্নপত্রের ${num(paper.own)}টি এবং অন্য বিসিএসের ${num(paper.added)}টি প্রশ্ন; প্রতিটিতে বিসিএস ও সাল উল্লেখ আছে।`
                    )}
                  </p>
                )}
                {questions.length < paperSize * COMPLETE_SHARE && (
                  <p className="mx-auto mt-3 max-w-lg rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300">
                    {L(
                      `${num(questions.length)} of ${num(paperSize)} questions are ready. The rest are being proofread and will appear here soon.`,
                      `${num(paperSize)}টির মধ্যে ${num(questions.length)}টি প্রশ্ন প্রস্তুত। বাকিগুলো যাচাই করা হচ্ছে, শীঘ্রই যোগ হবে।`
                    )}
                  </p>
                )}
                {!showAnswers && (
                  <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {L("Self-test: tap an option to check it, or tap “Show answer”.", "নিজে যাচাই: অপশনে চাপ দিয়ে উত্তর মিলিয়ে নিন, অথবা “উত্তর দেখুন” চাপুন।")}
                  </p>
                )}
              </header>

              {filteredQuestions.length === 0 && (
                <p className="py-10 text-center text-sm text-muted-foreground">{L("No question matches your search.", "কোনো প্রশ্ন মেলেনি।")}</p>
              )}

              {sections.map((section, si) => (
                <section key={`${section.slug}-${si}`} className="mt-5">
                  {section.subject && (
                    <h2 className="mb-1 flex items-center gap-3 text-sm font-bold tracking-wide text-primary">
                      <span className="h-px flex-1 bg-primary/20" />
                      <span>{L(section.subject.name, section.subject.name_bn || section.subject.name)}</span>
                      <span className="h-px flex-1 bg-primary/20" />
                    </h2>
                  )}
                  <div className="lg:columns-2 lg:gap-10 lg:[column-rule:1px_solid_var(--border)]">
                    {section.questions.map((q) => (
                      <QuestionItem
                        key={q.id}
                        q={q}
                        L={L}
                        num={num}
                        paperTag={q.from ? sourceLabel(q.from, L, num) : paperTag}
                        showAnswer={showAnswers || userChoices[q.id] !== undefined || !!revealed[q.id]}
                        selfTest={!showAnswers}
                        choice={userChoices[q.id]}
                        onChoose={(i) => chooseOption(q.id, i)}
                        onReveal={() => setRevealed((r) => ({ ...r, [q.id]: true }))}
                        explanationOpen={allExplanations || !!openExplanations[q.id]}
                        onToggleExplanation={() => setOpenExplanations((o) => ({ ...o, [q.id]: !o[q.id] }))}
                        bookmarked={bookmarks.includes(q.id)}
                        onBookmark={() => toggleBookmark(q.id)}
                        copied={copiedId === q.id}
                        onCopy={() => copyQuestion(q)}
                        onAskAi={() => askAi(q)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </>
      )}

      <AskAiSheet open={!!aiQuestion} onOpenChange={(open) => !open && setAiQuestion(null)} question={aiQuestion} />
    </div>
  )
}

function SubjectChip({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold whitespace-nowrap transition-colors",
        active ? "bg-primary text-primary-foreground" : "border bg-card text-muted-foreground hover:bg-muted"
      )}
    >
      <span>{label}</span>
      <span className={cn("rounded-full px-1.5 text-[0.68rem] font-bold", active ? "bg-white/20" : "bg-muted text-foreground")}>{count}</span>
    </button>
  )
}

/** "41st BCS (2021)" */
function sourceLabel(paper, L, num) {
  const name = L(paper.name, paper.name_bn)
  return paper.year ? `${name} (${num(String(paper.year))})` : name
}

/** One question as it appears on the printed sheet. */
function QuestionItem({
  q,
  L,
  num,
  paperTag,
  showAnswer,
  selfTest,
  choice,
  onChoose,
  onReveal,
  explanationOpen,
  onToggleExplanation,
  bookmarked,
  onBookmark,
  copied,
  onCopy,
  onAskAi,
}) {
  const bn = q.lang !== "en"
  const longOptions = q.options.some((o) => (o?.length ?? 0) > 28)

  return (
    <div id={`q-${q.number}`} className="break-inside-avoid border-b border-dashed border-border/80 py-3.5 last:border-b-0 lg:last:border-b">
      <div className="flex gap-2">
        <span className="bn w-8 shrink-0 pt-px text-[0.95rem] font-bold text-foreground tabular-nums">{num(q.number)}.</span>
        <div className="min-w-0 flex-1">
          <p className={cn("text-[0.95rem] leading-relaxed font-semibold text-foreground", bn && "bn")}>
            {q.body} <span className="bn text-[0.7rem] font-normal whitespace-nowrap text-muted-foreground italic">[{paperTag}]</span>
          </p>

          {(q.from || q.also_in?.length > 0) && (
            <p className="bn mt-1 flex flex-wrap gap-1.5 text-[0.7rem]">
              {q.from && (
                <span className="rounded bg-amber-500/12 px-1.5 py-px font-semibold text-amber-700 dark:text-amber-300">
                  {L(`From ${sourceLabel(q.from, L, num)}`, `${sourceLabel(q.from, L, num)} থেকে`)}
                </span>
              )}
              {q.also_in?.length > 0 && (
                <span className="rounded bg-primary/10 px-1.5 py-px font-semibold text-primary">
                  {L("Also asked in", "আরও এসেছে")}: {q.also_in.map((p) => sourceLabel(p, L, num)).join(", ")}
                </span>
              )}
            </p>
          )}

          <div className={cn("mt-1.5 grid gap-x-4 gap-y-0.5", longOptions ? "grid-cols-1" : "grid-cols-2")}>
            {q.options.map((opt, i) => {
              const isCorrect = i === q.answer_index
              const isChosen = choice === i
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!selfTest || choice !== undefined}
                  onClick={() => {
                    try {
                      if (typeof navigator !== "undefined" && navigator?.vibrate) {
                        navigator.vibrate(15)
                      }
                    } catch {}
                    onChoose(i)
                  }}
                  className={cn(
                    "flex items-start gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-all duration-150 disabled:cursor-default touch-manipulation select-none active:scale-[0.985]",
                    selfTest && choice === undefined && "hover:bg-primary/10 hover:border-primary/40 active:bg-primary/20",
                    showAnswer && isCorrect && "bg-emerald-500/15 ring-1 ring-emerald-500/30 font-semibold text-emerald-700 dark:text-emerald-300",
                    showAnswer && isChosen && !isCorrect && "bg-rose-500/15 ring-1 ring-rose-500/30 text-rose-700 line-through decoration-rose-500/60 dark:text-rose-300",
                    !showAnswer && isChosen && "border border-primary bg-primary/15 ring-2 ring-primary/40 font-semibold shadow-xs"
                  )}
                >
                  <span className="bn shrink-0 font-semibold">{LETTERS[i]}.</span>
                  <span className={cn("min-w-0", bn && "bn")}>{opt}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <div className="flex items-center gap-0.5 text-muted-foreground">
              {q.explanation && showAnswer && (
                <button
                  onClick={onToggleExplanation}
                  className="inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-xs font-semibold text-primary hover:bg-primary/8"
                >
                  <FontAwesomeIcon icon={faLightbulb} className="text-[0.7rem]" />
                  {L("Explanation", "ব্যাখ্যা")}
                  <FontAwesomeIcon icon={faChevronDown} className={cn("text-[0.6rem] transition-transform", explanationOpen && "rotate-180")} />
                </button>
              )}
              <IconAction onClick={onAskAi} title={L("Ask AI", "AI-কে জিজ্ঞেস করুন")}>
                <FontAwesomeIcon icon={faWandMagicSparkles} />
              </IconAction>
              <IconAction onClick={onBookmark} title={L("Bookmark", "সংরক্ষণ")} className={bookmarked && "text-amber-500"}>
                <FontAwesomeIcon icon={bookmarked ? faBookmark : faBookmarkOutline} />
              </IconAction>
              <IconAction onClick={onCopy} title={L("Copy", "কপি")}>
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? "text-emerald-500" : ""} />
              </IconAction>
            </div>

            {showAnswer ? (
              <span className="bn text-sm font-bold text-primary">
                {L("Ans", "উত্তর")}: {LETTERS[q.answer_index]}
              </span>
            ) : (
              <button onClick={onReveal} className="bn rounded-full border border-dashed border-primary/40 px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/8">
                {L("Show answer", "উত্তর দেখুন")}
              </button>
            )}
          </div>

          {explanationOpen && showAnswer && q.explanation && (
            <div className="mt-2 rounded-lg border-l-[3px] border-emerald-500 bg-emerald-500/6 px-3 py-2.5">
              <p className="mb-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span className="bn">
                  {L("Correct", "সঠিক উত্তর")}: {LETTERS[q.answer_index]}. {q.options[q.answer_index]}
                </span>
              </p>
              <p className={cn("text-[0.82rem] leading-relaxed whitespace-pre-line text-foreground/85", bn && "bn")}>{q.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function IconAction({ onClick, title, className, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn("grid size-7 place-items-center rounded-md text-[0.72rem] transition-colors hover:bg-muted hover:text-foreground", className)}
    >
      {children}
    </button>
  )
}
