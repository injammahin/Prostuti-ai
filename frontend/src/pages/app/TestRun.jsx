import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faXmark,
  faClock,
  faTableCells,
  faFlag,
  faChevronLeft,
  faChevronRight,
  faRotateRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Pill } from "@/components/shared"
import { Option } from "@/pages/app/Session"
import { modelTestsApi } from "@/lib/api"
import { bcs48thQuestions } from "@/lib/bcs-48th-questions"
import { cn } from "@/lib/utils"

export default function TestRun() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const testId = params.get("test") || "bcs-prelim-model-test-1"

  const [loading, setLoading] = useState(true)
  const [testInfo, setTestInfo] = useState(null)
  const [qs, setQs] = useState([])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [marked, setMarked] = useState([])
  const [left, setLeft] = useState(120 * 60)
  const [grid, setGrid] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [exit, setExit] = useState(false)

  // Fetch test and full questions
  useEffect(() => {
    let mounted = true
    setLoading(true)

    modelTestsApi.show(testId)
      .then((res) => {
        if (!mounted) return
        if (res?.test && res?.questions && res.questions.length > 0) {
          setTestInfo(res.test)
          setQs(res.questions)
          setLeft(res.test.duration_seconds || res.test.duration_minutes * 60 || 7200)
        } else {
          fallbackLoad()
        }
      })
      .catch(() => {
        if (mounted) fallbackLoad()
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    function fallbackLoad() {
      // Offline fallback: Use 200 authentic questions
      const mockQuestions = bcs48thQuestions.slice(0, 200)
      setTestInfo({
        id: testId,
        title: "BCS Preliminary Full Model Test",
        duration_minutes: 120,
        total_marks: 200,
        negative_marking: 0.50,
        total_questions: 200,
      })
      setQs(mockQuestions)
      setLeft(120 * 60)
    }

    return () => {
      mounted = false
    }
  }, [testId])

  const duration = (testInfo?.duration_minutes ? testInfo.duration_minutes * 60 : 7200)

  const submit = () => {
    nav("/app/test/result", {
      replace: true,
      state: {
        answers,
        testId: testInfo?.id || testId,
        testTitle: testInfo?.title || "BCS Model Test",
        negative: parseFloat(testInfo?.negative_marking) || 0.5,
        totalMarks: parseFloat(testInfo?.total_marks) || qs.length,
        used: duration - left,
        questions: qs,
      },
    })
  }

  // Timer countdown
  useEffect(() => {
    if (loading || !testInfo) return
    if (left <= 0) {
      submit()
      return
    }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, loading, testInfo])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-primary" />
        <p className="text-sm font-semibold text-muted-foreground">Preparing dynamic model test questions...</p>
      </div>
    )
  }

  const q = qs[idx] || qs[0]
  if (!q) return null

  const answered = Object.keys(answers).length
  const hours = Math.floor(left / 3600)
  const mm = String(Math.floor((left % 3600) / 60)).padStart(2, "0")
  const ss = String(left % 60).padStart(2, "0")
  const timeFormatted = hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`
  const low = left < 300 // under 5 minutes

  // Extract distinct subjects for quick jumping
  const subjectJumpIndices = []
  const seenSubs = new Set()
  qs.forEach((item, i) => {
    const sName = item.subject?.name || item.subject_name || item.subject || "General"
    if (!seenSubs.has(sName)) {
      seenSubs.add(sName)
      subjectJumpIndices.push({ name: sName, index: i })
    }
  })

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-3 md:px-0">
      {/* Test Header */}
      <header className="sticky top-0 z-20 -mx-3 border-b bg-background/95 px-4 backdrop-blur md:mx-0 md:rounded-b-2xl">
        <div className="flex h-14 items-center gap-2.5">
          <button
            onClick={() => setExit(true)}
            className="-ml-1.5 grid size-9 place-items-center rounded-full hover:bg-muted"
            aria-label="Exit test"
          >
            <FontAwesomeIcon icon={faXmark} className="text-base text-muted-foreground" />
          </button>

          <div
            className={cn(
              "flex h-9 items-center gap-2 rounded-full px-3 text-sm font-bold tabular-nums shadow-xs",
              low ? "bg-destructive/15 text-destructive animate-pulse ring-1 ring-destructive/30" : "bg-primary/10 text-primary"
            )}
            role="timer"
          >
            <FontAwesomeIcon icon={faClock} className="text-xs" />
            <span>{timeFormatted}</span>
          </div>

          <span className="hidden truncate text-xs font-semibold text-muted-foreground sm:inline max-w-[200px]">
            {testInfo?.title}
          </span>

          <button
            onClick={() => setGrid(true)}
            className="ml-auto flex h-9 items-center gap-1.5 rounded-full border bg-card px-3 text-xs font-bold hover:bg-muted"
          >
            <FontAwesomeIcon icon={faTableCells} className="text-primary text-xs" />
            <span>{answered}/{qs.length}</span>
          </button>

          <Button
            size="sm"
            className="h-9 rounded-full px-4 font-semibold shadow-xs"
            onClick={() => setConfirm(true)}
          >
            Submit
          </Button>
        </div>

        {/* Quick Subject Jump Strip */}
        {subjectJumpIndices.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-t text-[11px] no-scrollbar">
            {subjectJumpIndices.map((s) => {
              const isCurrentSub = (q.subject?.name || q.subject_name || q.subject) === s.name
              return (
                <button
                  key={s.name}
                  onClick={() => setIdx(s.index)}
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 font-medium transition-colors",
                    isCurrentSub
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {s.name}
                </button>
              )
            })}
          </div>
        )}
      </header>

      {/* Main Question Interface */}
      <main className="flex-1 pt-5 pb-32">
        <div className="mb-3.5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Question {idx + 1} of {qs.length}
          </span>
          <Pill tone="primary" className="text-[11px]">
            {q.subject?.name_bn || q.subject?.name || q.subject_name || "General"}
          </Pill>
          {q.topic && (
            <span className="text-xs text-muted-foreground">· {q.topic}</span>
          )}

          <button
            onClick={() => {
              const qId = q.id || q.number
              setMarked((prev) =>
                prev.includes(qId) ? prev.filter((x) => x !== qId) : [...prev, qId]
              )
            }}
            className={cn(
              "ml-auto flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors",
              marked.includes(q.id || q.number)
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <FontAwesomeIcon icon={faFlag} className="text-xs" />
            <span>{marked.includes(q.id || q.number) ? "Marked" : "Mark for review"}</span>
          </button>
        </div>

        {/* Question Body */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs mb-5">
          <h1 className={cn("text-base md:text-lg leading-relaxed font-semibold text-foreground", q.lang !== "en" && "bn")}>
            {q.body}
          </h1>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options?.map((opt, i) => {
            const qKey = q.id || q.number
            const isSelected = answers[qKey] === i
            return (
              <Option
                key={i}
                i={i}
                text={opt}
                lang={q.lang}
                state={isSelected ? "selected" : "idle"}
                onClick={() => {
                  const next = { ...answers }
                  if (next[qKey] === i) {
                    delete next[qKey] // toggle off
                  } else {
                    next[qKey] = i
                  }
                  setAnswers(next)
                }}
              />
            )
          })}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Tip: Tap an option to select, tap again to clear. Negative marking: -{testInfo?.negative_marking || 0.5} marks per wrong answer.
        </p>
      </main>

      {/* Navigation Footer */}
      <footer className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 px-4 py-3 backdrop-blur md:rounded-t-2xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-full px-4 font-semibold"
            disabled={idx === 0}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="mr-1.5 text-xs" />
            Previous
          </Button>

          <span className="text-xs font-medium text-muted-foreground">
            <span className="font-bold text-foreground">{answered}</span> answered ·{" "}
            <span className="font-bold text-amber-600">{marked.length}</span> marked
          </span>

          <Button
            size="sm"
            className="h-10 rounded-full px-5 font-semibold"
            onClick={() => (idx < qs.length - 1 ? setIdx((i) => i + 1) : setConfirm(true))}
          >
            {idx < qs.length - 1 ? (
              <>
                Next <FontAwesomeIcon icon={faChevronRight} className="ml-1.5 text-xs" />
              </>
            ) : (
              "Review & Submit"
            )}
          </Button>
        </div>
      </footer>

      {/* Question Palette Grid Sheet */}
      <Sheet open={grid} onOpenChange={setGrid}>
        <SheetContent side="bottom" className="max-h-[85dvh] rounded-t-3xl p-6">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-lg font-bold">Question Palette ({qs.length} Questions)</SheetTitle>
            <SheetDescription className="text-xs">
              Green = Answered ({answered}) · Amber = Marked for review ({marked.length}) · White = Unanswered ({qs.length - answered})
            </SheetDescription>
          </SheetHeader>

          <div className="max-h-[60dvh] overflow-y-auto pr-1">
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
              {qs.map((item, i) => {
                const qKey = item.id || item.number
                const isAnswered = answers[qKey] !== undefined
                const isMarked = marked.includes(qKey)
                const isCurrent = idx === i
                return (
                  <button
                    key={qKey || i}
                    onClick={() => {
                      setIdx(i)
                      setGrid(false)
                    }}
                    className={cn(
                      "flex h-11 flex-col items-center justify-center rounded-xl border text-xs font-bold transition-all",
                      isCurrent && "ring-2 ring-primary ring-offset-2 scale-105",
                      isAnswered
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : isMarked
                        ? "border-amber-400 bg-amber-500/20 text-amber-700 dark:text-amber-400"
                        : "bg-card text-foreground hover:bg-muted"
                    )}
                  >
                    <span>{i + 1}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Submit Confirmation Dialog */}
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Submit Model Test?</DialogTitle>
            <DialogDescription className="text-sm">
              You have answered <b className="text-primary">{answered}</b> of <b>{qs.length}</b> questions.
              <br />
              Unanswered: <b className="text-destructive">{qs.length - answered}</b> · Marked: <b className="text-amber-600">{marked.length}</b>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" className="rounded-full" onClick={() => setConfirm(false)}>
              Keep Answering
            </Button>
            <Button className="rounded-full font-bold px-6" onClick={submit}>
              Submit Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog open={exit} onOpenChange={setExit}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Quit Test?</DialogTitle>
            <DialogDescription className="text-sm">
              Your test progress will not be saved if you exit now. Are you sure you want to quit?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" className="rounded-full" onClick={() => setExit(false)}>
              Resume Test
            </Button>
            <Button variant="destructive" className="rounded-full" onClick={() => nav("/app/test")}>
              Quit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
