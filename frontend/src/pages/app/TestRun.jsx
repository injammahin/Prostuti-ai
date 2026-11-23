import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faClock, faTableCells, faFlag, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Pill } from "@/components/shared"
import { Option } from "@/pages/app/Session"
import { questions, modelTestsList } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function TestRun() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const testId = params.get("test") || "bcs-prelim-full"

  const testInfo = useMemo(() => {
    return modelTestsList.find((t) => t.id === testId) || modelTestsList[0]
  }, [testId])

  const qs = useMemo(() => {
    const matching = questions.filter((q) => q.exam === testInfo.exam)
    return matching.length > 0 ? matching : questions.slice(0, 15)
  }, [testInfo.exam])

  const duration = Math.min(qs.length * 60, 2 * 3600) // 1 min per question or max 2 hrs

  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [marked, setMarked] = useState([])
  const [left, setLeft] = useState(duration)
  const [grid, setGrid] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [exit, setExit] = useState(false)

  const submit = () =>
    nav("/app/test/result", {
      replace: true,
      state: {
        answers,
        testId: testInfo.id,
        testTitle: testInfo.title,
        negative: parseFloat(testInfo.negative) || 0.5,
        used: duration - left,
        exam: testInfo.exam,
      },
    })

  useEffect(() => {
    if (left <= 0) {
      submit()
      return
    }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left])

  const q = qs[idx] || qs[0]
  const answered = Object.keys(answers).length
  const mm = String(Math.floor(left / 60)).padStart(2, "0")
  const ss = String(left % 60).padStart(2, "0")
  const low = left < 60

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col">
      <header className="pt-safe sticky top-0 z-10 -mx-4 border-b bg-background/95 px-4 backdrop-blur md:mx-0 md:px-0">
        <div className="flex h-14 items-center gap-2">
          <button onClick={() => setExit(true)} className="-ml-2 grid size-10 place-items-center rounded-full hover:bg-muted" aria-label="Exit test">
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
          <div
            className={cn("flex h-9 items-center gap-2 rounded-full px-3 font-semibold tabular-nums", low ? "bg-destructive/10 text-destructive" : "bg-muted")}
            role="timer"
            aria-live={low ? "polite" : "off"}
          >
            <FontAwesomeIcon icon={faClock} className="text-sm" /> {mm}:{ss}
          </div>
          <span className="hidden truncate text-xs font-medium text-muted-foreground sm:inline">{testInfo.title}</span>
          <button onClick={() => setGrid(true)} className="ml-auto flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium">
            <FontAwesomeIcon icon={faTableCells} /> {answered}/{qs.length}
          </button>
          <Button size="sm" className="h-9 rounded-full px-4" onClick={() => setConfirm(true)}>
            Submit
          </Button>
        </div>
      </header>

      <main className="flex-1 pt-4 pb-32">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">Q{idx + 1} of {qs.length}</span>
          <Pill>{q.subject}</Pill>
          <span className="text-xs text-muted-foreground">({q.source})</span>
          <button
            onClick={() => setMarked(marked.includes(q.id) ? marked.filter((x) => x !== q.id) : [...marked, q.id])}
            className={cn("ml-auto flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium", marked.includes(q.id) ? "bg-warning/15 text-[oklch(0.5_0.12_65)] dark:text-warning" : "text-muted-foreground hover:bg-muted")}
            aria-pressed={marked.includes(q.id)}
          >
            <FontAwesomeIcon icon={faFlag} /> {marked.includes(q.id) ? "Marked" : "Mark for review"}
          </button>
        </div>
        <h1 className={cn("mb-5 text-lg leading-relaxed font-semibold", q.lang !== "en" && "bn")}>{q.body}</h1>
        <div className="space-y-2.5">
          {q.options.map((o, i) => (
            <Option
              key={i}
              i={i}
              text={o}
              lang={q.lang}
              state={answers[q.id] === i ? "selected" : "idle"}
              onClick={() => {
                const next = { ...answers }
                if (next[q.id] === i) delete next[q.id]
                else next[q.id] = i
                setAnswers(next)
              }}
            />
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Tap a selected option again to clear it. Negative marking: {testInfo.negative} marks per wrong answer.</p>
      </main>

      <footer className="pb-safe fixed inset-x-0 bottom-0 border-t bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <Button variant="outline" size="sm" className="h-10 rounded-full px-4" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
            <FontAwesomeIcon icon={faChevronLeft} /> Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            {answered} answered · {marked.length} marked
          </span>
          <Button size="sm" className="h-10 rounded-full px-5" onClick={() => (idx < qs.length - 1 ? setIdx((i) => i + 1) : setConfirm(true))}>
            {idx < qs.length - 1 ? (
              <>
                Next <FontAwesomeIcon icon={faChevronRight} />
              </>
            ) : (
              "Review & Submit"
            )}
          </Button>
        </div>
      </footer>

      {/* Question sheet / grid */}
      <Sheet open={grid} onOpenChange={setGrid}>
        <SheetContent side="bottom" className="max-h-[80dvh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Question overview</SheetTitle>
            <SheetDescription>Jump to any question or check marked items</SheetDescription>
          </SheetHeader>
          <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
            {qs.map((item, i) => {
              const isAnswered = answers[item.id] !== undefined
              const isMarked = marked.includes(item.id)
              const isCurrent = idx === i
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIdx(i)
                    setGrid(false)
                  }}
                  className={cn(
                    "flex h-11 flex-col items-center justify-center rounded-xl border text-sm font-semibold transition-colors",
                    isCurrent && "ring-2 ring-primary ring-offset-2",
                    isAnswered ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground",
                    isMarked && !isAnswered && "border-warning bg-warning/15 text-warning-foreground"
                  )}
                >
                  <span>{i + 1}</span>
                </button>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Submit model test?</DialogTitle>
            <DialogDescription>
              You have answered {answered} of {qs.length} questions ({qs.length - answered} skipped, {marked.length} marked).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Keep answering
            </Button>
            <Button onClick={submit}>
              Submit now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exit dialog */}
      <Dialog open={exit} onOpenChange={setExit}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Quit test?</DialogTitle>
            <DialogDescription>
              Your progress will not be saved if you exit now. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setExit(false)}>
              Resume
            </Button>
            <Button variant="destructive" onClick={() => nav("/app/test")}>
              Exit test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
