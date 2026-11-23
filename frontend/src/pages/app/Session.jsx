import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faXmark,
  faBookmark as faBookmarkSolid,
  faFlag,
  faWandMagicSparkles,
  faCircleCheck,
  faCircleXmark,
  faArrowRight,
  faRotateRight,
  faTrophy,
  faCheck,
  faArrowLeft,
  faClock,
} from "@fortawesome/free-solid-svg-icons"
import { faBookmark } from "@fortawesome/free-regular-svg-icons"
import { Button } from "@/components/ui/button"
import { Bar, Pill, Panel, Ring } from "@/components/shared"
import ReportDialog from "@/components/ReportDialog"
import AskAiSheet from "@/components/AskAiSheet"
import { practiceApi } from "@/lib/api"
import { toast } from "sonner"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

const titles = {
  drill: ["Subject practice", "বিষয়ভিত্তিক অনুশীলন"],
  past: ["Old exam questions", "বিগত সালের প্রশ্ন"],
  diagnostic: ["Starting-level test", "প্রাথমিক মূল্যায়ন"],
  mistakes: ["Fixing my mistakes", "ভুল সংশোধন"],
}

export function Option({ i, text, state, onClick, disabled, lang }) {
  const { L } = useApp()
  const styles = {
    idle: "hover:border-primary/40 hover:bg-secondary/40",
    selected: "border-primary bg-secondary/70",
    correct: "border-success bg-success/8",
    wrong: "border-destructive bg-destructive/6",
    dim: "opacity-55",
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn("group flex w-full items-center gap-3.5 rounded-lg border bg-card p-3.5 text-left transition-colors disabled:cursor-default md:p-4", styles[state])}
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-md border bg-muted/60 text-sm font-semibold text-muted-foreground transition-colors",
          state === "idle" && "group-hover:border-primary/40 group-hover:text-primary",
          state === "correct" && "border-success bg-success text-white",
          state === "wrong" && "border-destructive bg-destructive text-white",
          state === "selected" && "border-primary bg-primary text-primary-foreground"
        )}
      >
        {state === "correct" ? <FontAwesomeIcon icon={faCheck} /> : state === "wrong" ? <FontAwesomeIcon icon={faXmark} /> : String.fromCharCode(65 + i)}
      </span>
      <span className={cn("flex-1 text-[0.95rem]", lang !== "en" && "bn")}>{text}</span>
      {state === "correct" && <span className="text-xs font-semibold text-success">{L("Correct answer", "সঠিক উত্তর")}</span>}
      {state === "wrong" && <span className="text-xs font-semibold text-destructive">{L("Your answer", "আপনার উত্তর")}</span>}
    </button>
  )
}

export default function Session() {
  const [params, setParams] = useSearchParams()
  const sessionId = params.get("id")
  const nav = useNavigate()
  const { bookmarks, toggleBookmark, L, num } = useApp()
  const nameOf = (x) => (x ? L(x.name, x.name_bn || x.name) : "")

  const [session, setSession] = useState(null)
  const [loadError, setLoadError] = useState("")
  const [idx, setIdx] = useState(0)
  const [results, setResults] = useState({}) // questionId -> { chosen, correct, answer, explanation }
  const [picked, setPicked] = useState({}) // questionId -> chosen index (before checking)
  const [saving, setSaving] = useState(false)
  const [report, setReport] = useState(false)
  const [ai, setAi] = useState(false)
  const [summary, setSummary] = useState(null)
  const [secs, setSecs] = useState(0)
  const shownAt = useRef(Date.now())
  const starting = useRef(false)

  // Start a new session (then put its id in the URL so a refresh resumes it), or resume an existing one.
  useEffect(() => {
    if (sessionId) {
      if (session?.id === sessionId) return
      practiceApi
        .show(sessionId)
        .then((data) => {
          const done = {}
          data.questions.forEach((q) => {
            if (q.chosen_index !== null && q.chosen_index !== undefined) {
              done[q.id] = { chosen: q.chosen_index, correct: q.chosen_index === q.answer_index, answer: q.answer_index, explanation: q.explanation }
            }
          })
          setSession(data)
          setResults(done)
          const firstOpen = data.questions.findIndex((q) => !done[q.id])
          setIdx(firstOpen === -1 ? 0 : firstOpen)
        })
        .catch((e) => setLoadError(e.message))
      return
    }
    if (starting.current) return
    starting.current = true
    practiceApi
      .start({
        mode: params.get("mode") === "wrong" ? "mistakes" : params.get("mode") || "drill",
        exam: params.get("exam"),
        subject: params.get("subject"),
        count: Number(params.get("n") || params.get("count")) || 20,
      })
      .then((data) => {
        setSession(data)
        setParams({ id: data.id }, { replace: true })
      })
      .catch((e) => setLoadError(e.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  useEffect(() => {
    if (summary || !session) return
    const t = setInterval(() => setSecs((x) => x + 1), 1000)
    return () => clearInterval(t)
  }, [summary, session])

  useEffect(() => {
    shownAt.current = Date.now()
  }, [idx])

  const qs = session?.questions ?? []
  const mode = session?.mode ?? params.get("mode") ?? "drill"
  const instant = mode !== "diagnostic"
  const q = qs[idx]
  const result = q ? results[q.id] : undefined
  const choice = q ? (result ? result.chosen : picked[q.id]) : undefined
  const revealed = instant && !!result
  const answered = Object.keys(results).length
  const correct = Object.values(results).filter((x) => x.correct).length
  const time = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`
  const sessionHeaderTitle = [nameOf(session?.exam), titles[mode] && L(...titles[mode])].filter(Boolean).join(" · ")

  const check = async (question, chosen) => {
    setSaving(true)
    try {
      const res = await practiceApi.answer(session.id, question.id, chosen, Date.now() - shownAt.current)
      setResults((prev) => ({ ...prev, [question.id]: { chosen: res.chosen_index, correct: res.is_correct, answer: res.answer_index, explanation: res.explanation } }))
      return true
    } catch (e) {
      toast.error(e.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  const choose = (i) => {
    if (result || saving) return
    if (instant) check(q, i)
    else setPicked({ ...picked, [q.id]: i })
  }

  const finish = async () => {
    try {
      setSummary(await practiceApi.finish(session.id))
    } catch (e) {
      toast.error(e.message)
    }
  }

  const next = async () => {
    // In the starting-level test answers are saved without showing whether they were right.
    if (!instant && picked[q.id] !== undefined && !result) {
      const ok = await check(q, picked[q.id])
      if (!ok) return
    }
    if (idx < qs.length - 1) setIdx(idx + 1)
    else finish()
  }
  const canNext = !saving && (revealed || (!instant && picked[q?.id] !== undefined) || !!result)

  if (loadError) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center py-10 text-center">
        <Panel>
          <p className="font-semibold">{L("Couldn't open this practice", "অনুশীলনটি খোলা যায়নি")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
          <Button asChild className="mt-4 rounded-full">
            <Link to="/app/practice">{L("Back to Practice", "অনুশীলনে ফিরে যান")}</Link>
          </Button>
        </Panel>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-3 py-10 text-sm text-muted-foreground">
        <span className="size-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
        {L("Getting your questions ready…", "আপনার প্রশ্নগুলো প্রস্তুত হচ্ছে…")}
      </div>
    )
  }

  if (summary) {
    const pct = Math.round((summary.correct / Math.max(summary.total, 1)) * 100)
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center py-10">
        <Panel className="text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-warning/15 text-2xl text-warning">
            <FontAwesomeIcon icon={faTrophy} />
          </div>
          <h1 className="mt-4 text-xl font-bold">{mode === "diagnostic" ? L("Starting-level test complete", "প্রাথমিক মূল্যায়ন সম্পন্ন") : L("Practice complete", "অনুশীলন সম্পন্ন")}</h1>
          <p className="text-sm text-muted-foreground">{sessionHeaderTitle}</p>
          <Ring value={pct} size={110} stroke={10} className="mx-auto my-6" label={<span className="text-2xl">{num(pct)}%</span>} />
          <div className="grid grid-cols-3 divide-x rounded-xl border text-center">
            <div className="py-3">
              <p className="text-lg font-bold text-success">{num(summary.correct)}</p>
              <p className="text-xs text-muted-foreground">{L("Correct", "সঠিক")}</p>
            </div>
            <div className="py-3">
              <p className="text-lg font-bold text-destructive">{num(summary.wrong)}</p>
              <p className="text-xs text-muted-foreground">{L("Wrong", "ভুল")}</p>
            </div>
            <div className="py-3">
              <p className="text-lg font-bold">{num(summary.skipped)}</p>
              <p className="text-xs text-muted-foreground">{L("Skipped", "বাদ")}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {summary.wrong > 0
              ? L("Your wrong answers are saved in My mistakes so you can try them again later.", "ভুল উত্তরগুলো 'আমার ভুলগুলো'-তে সংরক্ষিত হয়েছে, পরে আবার চেষ্টা করতে পারবেন।")
              : L("No mistakes this time — great work!", "এবার কোনো ভুল নেই — দারুণ!")}
          </p>
          <div className="mt-6 grid gap-2">
            <Button className="h-12 rounded-full" onClick={() => nav("/app/practice")}>
              {L("Continue practising", "অনুশীলন চালিয়ে যান")}
            </Button>
            {summary.wrong > 0 && (
              <Button variant="outline" className="h-12 rounded-full" onClick={() => nav("/app/notebook")}>
                <FontAwesomeIcon icon={faRotateRight} /> {L("Review my mistakes", "আমার ভুলগুলো দেখুন")}
              </Button>
            )}
          </div>
        </Panel>
      </div>
    )
  }

  if (!q) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center py-10 text-center">
        <Panel>
          <p className="font-semibold">{mode === "mistakes" ? L("No mistakes to fix right now 🎉", "এই মুহূর্তে ঠিক করার মতো কোনো ভুল নেই 🎉") : L("No questions here yet", "এখানে এখনো প্রশ্ন নেই")}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "mistakes"
              ? L("Questions you get wrong will appear here.", "যে প্রশ্নগুলো ভুল করবেন সেগুলো এখানে দেখাবে।")
              : L("We're adding more questions every week. Try another subject for now.", "প্রতি সপ্তাহে নতুন প্রশ্ন যোগ হচ্ছে। আপাতত অন্য একটি বিষয় চেষ্টা করুন।")}
          </p>
          <Button asChild className="mt-4 rounded-full">
            <Link to="/app/practice">{L("Back to Practice", "অনুশীলনে ফিরে যান")}</Link>
          </Button>
        </Panel>
      </div>
    )
  }

  const actions = (
    <>
      <Button variant="ghost" className="h-11 px-4 text-muted-foreground" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> <span className="hidden sm:inline">{L("Previous", "আগের")}</span>
      </Button>
      <div className="ml-auto flex gap-2">
        {!result && choice === undefined && (
          <Button variant="outline" className="h-11 px-5" disabled={saving} onClick={() => (idx < qs.length - 1 ? setIdx(idx + 1) : finish())}>
            {L("Skip", "বাদ দিন")}
          </Button>
        )}
        <Button className="h-11 px-6" disabled={!canNext} onClick={next}>
          {idx === qs.length - 1 ? L("Finish", "শেষ করুন") : instant ? (<><span className="sm:hidden">{L("Next", "পরের")}</span><span className="hidden sm:inline">{L("Next question", "পরের প্রশ্ন")}</span></>) : L("Save & next", "সংরক্ষণ ও পরের")} <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </div>
    </>
  )

  return (
    <div className="mx-auto w-full max-w-6xl pt-4 pb-28 md:pt-6 lg:pb-10">
      {/* Session header */}
      <div className="card mb-5 flex items-center gap-3 p-3 md:gap-4 md:px-5">
        <Link
          to="/app/practice"
          className="grid size-10 shrink-0 place-items-center rounded-lg border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
          aria-label={L("Exit session", "অনুশীলন থেকে বের হন")}
        >
          <FontAwesomeIcon icon={faXmark} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {sessionHeaderTitle} <span className="font-normal text-muted-foreground">· {nameOf(q.subject)}</span>
          </p>
          <div className="mt-1.5 flex items-center gap-3">
            <Bar value={((idx + 1) / qs.length) * 100} className="h-1.5 max-w-md" animate={false} />
            <span className="shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
              {num(idx + 1)} / {num(qs.length)}
            </span>
          </div>
        </div>
        <span className="hidden items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-semibold tabular-nums sm:flex">
          <FontAwesomeIcon icon={faClock} className="text-muted-foreground" /> {num(time)}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_19rem]">
        {/* Question card */}
        <div key={q.id} className="card rise p-5 md:p-7">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-primary">{L(`Question ${idx + 1}`, `প্রশ্ন ${num(idx + 1)}`)}</span>
            <span className="text-muted-foreground/50">·</span>
            {q.topic && <Pill tone="primary">{q.topic}</Pill>}
            {q.source && <Pill>{q.source}</Pill>}
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => toggleBookmark(q.id)}
                className={cn("grid size-9 place-items-center rounded-lg transition-colors hover:bg-muted", bookmarks.includes(q.id) ? "text-primary" : "text-muted-foreground")}
                aria-label={L("Bookmark", "সংরক্ষণ")}
                aria-pressed={bookmarks.includes(q.id)}
              >
                <FontAwesomeIcon icon={bookmarks.includes(q.id) ? faBookmarkSolid : faBookmark} />
              </button>
              <button onClick={() => setReport(true)} className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted" aria-label={L("Report question", "প্রশ্নটি রিপোর্ট করুন")}>
                <FontAwesomeIcon icon={faFlag} />
              </button>
            </div>
          </div>

          <h1 className={cn("mb-6 text-lg leading-relaxed md:text-xl", q.lang !== "en" && "bn")}>{q.body}</h1>

          <div className="space-y-3">
            {q.options.map((o, i) => {
              let state = "idle"
              if (revealed) state = i === result.answer ? "correct" : i === result.chosen ? "wrong" : "dim"
              else if (choice === i) state = "selected"
              return <Option key={i} i={i} text={o} state={state} lang={q.lang} disabled={revealed || saving || !!result} onClick={() => choose(i)} />
            })}
          </div>

          {revealed && (
            <div className={cn("rise mt-6 rounded-lg border-l-4 bg-muted/50 p-4", result.correct ? "border-success" : "border-destructive")}>
              <p className={cn("mb-1.5 flex items-center gap-2 text-sm font-semibold", result.correct ? "text-success" : "text-destructive")}>
                <FontAwesomeIcon icon={result.correct ? faCircleCheck : faCircleXmark} />
                {result.correct ? L("Correct — well done", "সঠিক — খুব ভালো!") : L("Not quite — here's the right answer", "হয়নি — সঠিক উত্তরটি দেখুন")}
              </p>
              {result.explanation && <p className={cn("text-[0.95rem] leading-relaxed text-foreground/85", q.lang !== "en" && "bn")}>{result.explanation}</p>}
              <button onClick={() => setAi(true)} className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg border bg-card px-3.5 text-sm font-semibold text-primary transition-colors hover:border-primary/40">
                <FontAwesomeIcon icon={faWandMagicSparkles} /> {L("Ask AI why", "AI-কে জিজ্ঞেস করুন")}
              </button>
            </div>
          )}

          {/* Desktop footer actions */}
          <div className="mt-8 hidden items-center border-t pt-5 lg:flex">{actions}</div>
        </div>

        {/* Right sidebar info */}
        <aside className="space-y-4">
          <Panel className="p-4">
            <h2 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{L("Current session", "বর্তমান অনুশীলন")}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{L("Answered", "উত্তর দেওয়া")}</span>
                <span className="font-semibold tabular-nums">{num(answered)} / {num(qs.length)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{L("Correct", "সঠিক")}</span>
                <span className="font-semibold tabular-nums">{instant && answered > 0 ? `${num(Math.round((correct / answered) * 100))}%` : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{L("Time", "সময়")}</span>
                <span className="font-semibold tabular-nums">{num(time)}</span>
              </div>
            </div>
          </Panel>

          {session.subject && (
            <Panel className="p-4">
              <h2 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{L("Subject", "বিষয়")}</h2>
              <p className="font-medium">{nameOf(session.subject)}</p>
              {session.exam && <p className="mt-1 text-xs text-muted-foreground">{nameOf(session.exam)}</p>}
            </Panel>
          )}
        </aside>
      </div>

      {/* Mobile sticky actions bar */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-20 flex items-center border-t bg-background/95 p-3 backdrop-blur lg:hidden">
        {actions}
      </div>

      <ReportDialog open={report} onOpenChange={setReport} questionId={q.id} />
      <AskAiSheet open={ai} onOpenChange={setAi} question={q} />
    </div>
  )
}
