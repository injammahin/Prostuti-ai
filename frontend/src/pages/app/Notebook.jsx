import { useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotate, faPlay, faChevronDown, faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { PageHeader, Pill, EmptyState, Panel } from "@/components/shared"
import { mistakesApi } from "@/lib/api"
import { useApi } from "@/lib/use-api"
import { relDays } from "@/lib/format"
import { cn } from "@/lib/utils"

export default function Notebook() {
  const { data, loading, error, reload } = useApi(() => mistakesApi.list(), [])
  const [open, setOpen] = useState(null)
  const mistakes = data?.mistakes ?? []
  const due = data?.due_count ?? 0

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="My mistakes" subtitle="Questions you got wrong. Answer one correctly and it's cleared from this list." />

      {error && (
        <Panel className="mb-4 flex items-center justify-between gap-3 text-sm">
          <span className="text-destructive">{error.message}</span>
          <Button size="sm" variant="outline" onClick={reload}>
            Try again
          </Button>
        </Panel>
      )}

      {mistakes.length > 0 && (
        <Panel className="mb-4 flex flex-wrap items-center gap-3 bg-secondary/60">
          <FontAwesomeIcon icon={faRotate} className="text-lg text-primary" />
          <p className="min-w-0 flex-1 text-sm">
            {due > 0 ? (
              <>
                <b>
                  {due} {due === 1 ? "question is" : "questions are"} ready to retry.
                </b>{" "}
                Mistakes come back a day later, so you remember the right answer.
              </>
            ) : (
              <>Your mistakes come back a day after you make them. Nothing to retry right now.</>
            )}
          </p>
          <Button asChild size="sm" className="rounded-full">
            <Link to={`/app/practice/session?mode=mistakes&n=${Math.min(20, Math.max(5, mistakes.length))}`}>
              <FontAwesomeIcon icon={faPlay} /> Retry {due > 0 ? "now" : "anyway"}
            </Link>
          </Button>
        </Panel>
      )}

      {data?.resolved_count > 0 && (
        <p className="mb-3 flex items-center gap-1.5 text-sm text-success">
          <FontAwesomeIcon icon={faCircleCheck} /> You've fixed {data.resolved_count} {data.resolved_count === 1 ? "mistake" : "mistakes"} so far.
        </p>
      )}

      <div className="space-y-2">
        {loading &&
          [0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />)}

        {!loading &&
          mistakes.map(({ id, question: q, is_due: isDue, next_review_at: nextReview, wrong_count: wrongCount }) => (
            <div key={id} className="rounded-2xl border bg-card">
              <button onClick={() => setOpen(open === id ? null : id)} className="flex w-full items-start gap-2 p-3.5 text-left" aria-expanded={open === id}>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap gap-1.5">
                    {q.subject && <Pill>{q.subject.name}</Pill>}
                    <Pill tone={isDue ? "warning" : "muted"}>{isDue ? "Ready to retry" : `Back ${relDays(nextReview.slice(0, 10)).toLowerCase()}`}</Pill>
                    {wrongCount > 1 && <Pill tone="destructive">Wrong {wrongCount}×</Pill>}
                  </div>
                  <p className={cn("text-sm font-medium", q.lang !== "en" && "bn")}>{q.body}</p>
                </div>
                <FontAwesomeIcon icon={faChevronDown} className={cn("mt-2 text-xs text-muted-foreground transition-transform", open === id && "rotate-180")} />
              </button>
              {open === id && (
                <div className={cn("border-t p-3.5 text-sm", q.lang !== "en" && "bn")}>
                  <p className="font-medium text-success">
                    ✓ {String.fromCharCode(65 + q.answer_index)}. {q.options[q.answer_index]}
                  </p>
                  {q.explanation && <p className="mt-1.5 text-muted-foreground">{q.explanation}</p>}
                </div>
              )}
            </div>
          ))}

        {!loading && !error && mistakes.length === 0 && (
          <EmptyState
            icon={<FontAwesomeIcon icon={faCircleCheck} />}
            title="No mistakes to fix"
            text="When you answer a question wrong while practising, it will appear here so you can try it again."
          />
        )}
      </div>
    </div>
  )
}
