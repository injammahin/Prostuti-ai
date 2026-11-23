import { useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faWandMagicSparkles, faCamera, faKeyboard, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons"
import { PageHeader, Panel, Pill, Segmented, SectionTitle } from "@/components/shared"
import { writtenQuestions } from "@/lib/data"
import { cn } from "@/lib/utils"

const recent = [
  { id: "w1", title: "রেমিট্যান্সের ভূমিকা", score: 13.5, of: 20, date: "Yesterday" },
  { id: "w3", title: "ভাষা আন্দোলনের সাংস্কৃতিক প্রভাব", score: 7, of: 10, date: "17 Nov" },
]

export default function Written() {
  const [subject, setSubject] = useState("All")
  const subjects = ["All", ...new Set(writtenQuestions.map((w) => w.subject))]
  const list = writtenQuestions.filter((w) => subject === "All" || w.subject === subject)

  return (
    <>
      <PageHeader title="Written practice" subtitle="Write, get AI feedback in under a minute" />

      <Panel className="mb-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </span>
          <div className="flex-1">
            <p className="font-semibold">Instant AI evaluation</p>
            <p className="text-sm text-muted-foreground">Score, rubric breakdown, missed points and a model answer.</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground sm:flex-col sm:gap-1">
          <span><FontAwesomeIcon icon={faKeyboard} fixedWidth /> Type in বাংলা / English</span>
          <span><FontAwesomeIcon icon={faCamera} fixedWidth /> Or photograph handwriting</span>
        </div>
      </Panel>

      {recent.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Recent evaluations" />
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:px-0">
            {recent.map((r) => (
              <Link key={r.id} to={`/app/written/${r.id}/result`} className="tap w-60 shrink-0 rounded-2xl border bg-card p-3.5">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FontAwesomeIcon icon={faClockRotateLeft} /> {r.date}
                </p>
                <p className="bn mt-1 truncate font-semibold">{r.title}</p>
                <p className="mt-1 text-lg font-bold text-primary">
                  {r.score}
                  <span className="text-sm font-normal text-muted-foreground">/{r.of}</span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <SectionTitle title="Question library" />
      <Segmented options={subjects} value={subject} onChange={setSubject} className="mb-3" />
      <div className="space-y-2.5">
        {list.map((w) => (
          <Link key={w.id} to={`/app/written/${w.id}`} className="tap flex items-center gap-3 rounded-2xl border bg-card p-4 hover:border-primary/40">
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex flex-wrap gap-1.5">
                <Pill tone="primary">{w.subject}</Pill>
                <Pill>{w.source}</Pill>
              </div>
              <p className={cn("leading-snug font-semibold", w.lang !== "en" && "bn")}>{w.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {w.marks} marks · {w.words} words{w.attempts ? ` · attempted ${w.attempts}×` : ""}
              </p>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-xs text-muted-foreground" />
          </Link>
        ))}
      </div>
    </>
  )
}
