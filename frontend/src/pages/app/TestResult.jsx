import { useState } from "react"
import { Link, useLocation } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRankingStar, faChevronDown, faCircleCheck, faCircleXmark, faCircleMinus, faRotateRight } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { PageHeader, Panel, Bar, SectionTitle, Pill, accuracyTone } from "@/components/shared"
import { questions, modelTestsList } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function TestResult() {
  const { state } = useLocation()
  const testId = state?.testId || "bcs-prelim-full"
  const testTitle = state?.testTitle || "Model test"
  const negativeMark = state?.negative !== undefined ? state.negative : 0.5
  const exam = state?.exam

  const testQs = exam ? questions.filter((q) => q.exam === exam) : questions.slice(0, 15)
  const answers = state?.answers ?? { [testQs[0]?.id]: testQs[0]?.answer }
  const [open, setOpen] = useState(null)

  const rows = testQs.map((q) => ({
    q,
    a: answers[q.id],
    ok: answers[q.id] === q.answer,
    skip: answers[q.id] === undefined,
  }))

  const right = rows.filter((r) => r.ok).length
  const wrong = rows.filter((r) => !r.ok && !r.skip).length
  const skipped = rows.filter((r) => r.skip).length
  const score = Math.max(0, right - wrong * negativeMark)
  const pct = Math.max(0, Math.round((score / testQs.length) * 100))

  // per-subject
  const bySubject = Object.values(
    rows.reduce((m, r) => {
      const s = (m[r.q.subject] ||= { name: r.q.subject, right: 0, total: 0 })
      s.total++
      if (r.ok) s.right++
      return m
    }, {})
  )

  return (
    <>
      <PageHeader back="/app/test" title="Test result" subtitle={`${testTitle} · Negative marking: -${negativeMark}`} />

      <Panel className="mb-4">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">Your score</p>
            <p className="text-4xl font-bold tracking-tight">
              {score.toFixed(1)}
              <span className="text-lg font-medium text-muted-foreground">/{testQs.length}</span>
            </p>
            <Pill tone={pct >= 60 ? "success" : "warning"} className="mt-1">
              {pct}% · {pct >= 60 ? "Above expected cut-off" : "Needs revision"}
            </Pill>
          </div>
          <div className="grid w-full flex-1 grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-success/10 p-3">
              <p className="text-xl font-bold text-success">{right}</p>
              <p className="text-xs text-muted-foreground">Correct (+{right})</p>
            </div>
            <div className="rounded-xl bg-destructive/8 p-3">
              <p className="text-xl font-bold text-destructive">{wrong}</p>
              <p className="text-xs text-muted-foreground">Wrong (−{(wrong * negativeMark).toFixed(2)})</p>
            </div>
            <div className="rounded-xl bg-muted p-3">
              <p className="text-xl font-bold">{skipped}</p>
              <p className="text-xs text-muted-foreground">Skipped</p>
            </div>
          </div>
        </div>
      </Panel>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Panel className="flex items-center gap-3">
          <FontAwesomeIcon icon={faRankingStar} className="text-2xl text-warning" />
          <div>
            <p className="font-semibold">Simulated Merit Rank: 412 / 5,200</p>
            <p className="text-sm text-muted-foreground">Percentile: 92.1 · High qualification probability</p>
          </div>
        </Panel>
        <Panel className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-semibold">Negative marking impact: -{(wrong * negativeMark).toFixed(2)} marks</p>
            <p className="text-sm text-muted-foreground">Strategically skip when you cannot eliminate at least 2 choices.</p>
          </div>
        </Panel>
      </div>

      <SectionTitle title="Performance by subject" />
      <Panel className="mb-6 space-y-3">
        {bySubject.map((s) => {
          const a = Math.round((s.right / s.total) * 100)
          return (
            <div key={s.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {s.right}/{s.total} ({a}%)
                </span>
              </div>
              <Bar value={a} tone={accuracyTone(a)} />
            </div>
          )
        })}
      </Panel>

      <SectionTitle title="Detailed Question Review" />
      <div className="space-y-2.5">
        {rows.map(({ q, a, ok, skip }, i) => (
          <Panel key={q.id} className="p-4">
            <div className="flex items-start gap-3">
              <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold", ok ? "bg-success text-white" : skip ? "bg-muted text-muted-foreground" : "bg-destructive text-white")}>
                {ok ? <FontAwesomeIcon icon={faCircleCheck} /> : skip ? <FontAwesomeIcon icon={faCircleMinus} /> : <FontAwesomeIcon icon={faCircleXmark} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap gap-2 text-xs">
                  <Pill>{q.subject}</Pill>
                  <span className="text-muted-foreground">Q{i + 1} · {q.source}</span>
                </div>
                <p className={cn("font-medium", q.lang !== "en" && "bn")}>{q.body}</p>
                <div className="mt-2 text-sm">
                  <p className="text-success">
                    <b>Correct Answer:</b> {q.options[q.answer]}
                  </p>
                  {!ok && !skip && (
                    <p className="text-destructive">
                      <b>Your Answer:</b> {q.options[a]}
                    </p>
                  )}
                  {skip && <p className="text-muted-foreground"><i>Skipped</i></p>}
                </div>
                {q.explanation && (
                  <div className="mt-2.5 rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground">
                    <b>Explanation:</b> {q.explanation}
                  </div>
                )}
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button asChild variant="outline" className="rounded-full px-6">
          <Link to="/app/test">
            Back to Model tests
          </Link>
        </Button>
        <Button asChild className="rounded-full px-6">
          <Link to={`/app/test/run?test=${testId}`}>
            <FontAwesomeIcon icon={faRotateRight} /> Retake test
          </Link>
        </Button>
      </div>
    </>
  )
}
