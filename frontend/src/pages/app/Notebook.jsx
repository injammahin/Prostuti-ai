import { useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotate, faPlay, faChevronDown, faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { PageHeader, Pill, EmptyState, Panel } from "@/components/shared"
import { mistakesApi } from "@/lib/api"
import { useApp } from "@/lib/app-context"
import { useApi } from "@/lib/use-api"
import { relDays } from "@/lib/format"
import { cn } from "@/lib/utils"

export default function Notebook() {
  const { mainExam, L, num } = useApp()
  const { data, loading, error, reload } = useApi(() => mistakesApi.list(mainExam), [mainExam])
  const [open, setOpen] = useState(null)
  const mistakes = data?.mistakes ?? []
  const due = data?.due_count ?? 0

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={L("My mistakes", "আমার ভুলগুলো")}
        subtitle={L("Questions you got wrong. Answer one correctly and it's cleared from this list.", "যে প্রশ্নগুলো ভুল করেছেন। একবার সঠিক উত্তর দিলেই তালিকা থেকে মুছে যাবে।")}
      />

      {error && (
        <Panel className="mb-4 flex items-center justify-between gap-3 text-sm">
          <span className="text-destructive">{error.message}</span>
          <Button size="sm" variant="outline" onClick={reload}>
            {L("Try again", "আবার চেষ্টা করুন")}
          </Button>
        </Panel>
      )}

      {mistakes.length > 0 && (
        <Panel className="mb-4 flex flex-wrap items-center gap-3 bg-secondary/60">
          <FontAwesomeIcon icon={faRotate} className="text-lg text-primary" />
          <p className="min-w-0 flex-1 text-sm">
            {due > 0 ? (
              L(
                <>
                  <b>
                    {due} {due === 1 ? "question is" : "questions are"} ready to retry.
                  </b>{" "}
                  Mistakes come back a day later, so you remember the right answer.
                </>,
                <>
                  <b>{num(due)}টি প্রশ্ন আবার চেষ্টার জন্য প্রস্তুত।</b> ভুলগুলো একদিন পর ফিরে আসে, যাতে সঠিক উত্তরটি মনে থাকে।
                </>
              )
            ) : (
              L(
                "Your mistakes come back a day after you make them. Nothing to retry right now.",
                "ভুল করার একদিন পর প্রশ্নগুলো আবার ফিরে আসে। এই মুহূর্তে আবার চেষ্টার মতো কিছু নেই।"
              )
            )}
          </p>
          <Button asChild size="sm" className="rounded-full">
            <Link to={`/app/practice/session?mode=mistakes&n=${Math.min(20, Math.max(5, mistakes.length))}`}>
              <FontAwesomeIcon icon={faPlay} /> {due > 0 ? L("Retry now", "এখনই চেষ্টা করুন") : L("Retry anyway", "তবুও চেষ্টা করুন")}
            </Link>
          </Button>
        </Panel>
      )}

      {data?.resolved_count > 0 && (
        <p className="mb-3 flex items-center gap-1.5 text-sm text-success">
          <FontAwesomeIcon icon={faCircleCheck} />{" "}
          {L(`You've fixed ${data.resolved_count} ${data.resolved_count === 1 ? "mistake" : "mistakes"} so far.`, `এখন পর্যন্ত ${num(data.resolved_count)}টি ভুল ঠিক করেছেন।`)}
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
                    {q.subject && <Pill>{L(q.subject.name, q.subject.name_bn || q.subject.name)}</Pill>}
                    <Pill tone={isDue ? "warning" : "muted"}>{isDue ? L("Ready to retry", "আবার চেষ্টার জন্য প্রস্তুত") : L(`Back ${relDays(nextReview.slice(0, 10)).toLowerCase()}`, `ফিরবে ${relDays(nextReview.slice(0, 10))}`)}</Pill>
                    {wrongCount > 1 && <Pill tone="destructive">{L(`Wrong ${wrongCount}×`, `${num(wrongCount)} বার ভুল`)}</Pill>}
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
            title={L("No mistakes to fix", "ঠিক করার মতো কোনো ভুল নেই")}
            text={L("When you answer a question wrong while practising, it will appear here so you can try it again.", "অনুশীলনে কোনো প্রশ্ন ভুল হলে তা এখানে দেখাবে, যাতে আবার চেষ্টা করতে পারেন।")}
          />
        )}
      </div>
    </div>
  )
}
