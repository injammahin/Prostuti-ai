import { useMemo, useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faBell, faCalendarDays, faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NoticeCard, PageHeader, Segmented, EmptyState } from "@/components/shared"
import { notices, exams, noticeTypes } from "@/lib/data"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"
import { useNoticesVersion } from "@/lib/notices-store"

const typeFilters = [
  { value: "all", label: "All" },
  { value: "circular", label: "Circulars" },
  { value: "schedule", label: "Exam dates" },
  { value: "admit", label: "Admit cards" },
  { value: "result", label: "Results" },
  { value: "deadline", label: "Deadlines" },
  { value: "syllabus", label: "Syllabus" },
]

export default function Notices({ inApp = false }) {
  const noticesVersion = useNoticesVersion()
  const { followed, user } = useApp()
  const [type, setType] = useState("all")
  const [exam, setExam] = useState("all")
  const [mine, setMine] = useState(inApp)
  const [q, setQ] = useState("")

  const list = useMemo(
    () =>
      notices.filter(
        (n) =>
          (type === "all" || n.type === type) &&
          (exam === "all" || n.exam === exam) &&
          (!mine || followed.includes(n.exam)) &&
          (!q || (n.title + n.org + n.summary).toLowerCase().includes(q.toLowerCase()))
      ),
    [type, exam, mine, q, followed, noticesVersion]
  )

  const body = (
    <>
      <div className="space-y-3">
        <div className="relative">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search circulars, organisations…"
            className="h-11 rounded-full bg-card pl-10 text-base md:text-sm"
            aria-label="Search notices"
          />
          {q && (
            <button onClick={() => setQ("")} className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" aria-label="Clear search">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
        <Segmented options={typeFilters} value={type} onChange={setType} />
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            className="h-9 rounded-full border bg-card px-3 text-sm"
            aria-label="Filter by exam"
          >
            <option value="all">All exams</option>
            {exams.map((e) => (
              <option key={e.slug} value={e.slug}>
                {e.name}
              </option>
            ))}
          </select>
          {user && (
            <button
              onClick={() => setMine(!mine)}
              className={cn(
                "h-9 rounded-full border px-3 text-sm font-medium",
                mine ? "border-primary bg-secondary text-secondary-foreground" : "bg-card text-muted-foreground"
              )}
              aria-pressed={mine}
            >
              <FontAwesomeIcon icon={faBell} className="mr-1.5" />
              My exams
            </button>
          )}
          <span className="ml-auto text-xs text-muted-foreground">{list.length} notices</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {list.length ? (
          list.map((n) => <NoticeCard key={n.slug} n={n} base={inApp ? "/app/notices" : "/notices"} />)
        ) : (
          <EmptyState icon={<FontAwesomeIcon icon={faMagnifyingGlass} />} title="No notices match" text="Try a different filter or search term." />
        )}
      </div>

      <p className="mt-6 flex gap-2 rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
        <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5" />
        Summaries are written by our team. Always confirm on the official website and apply only through the official portal. bd3schools is not affiliated with
        BPSC or any ministry.
      </p>
    </>
  )

  if (inApp) {
    return (
      <>
        <PageHeader
          title="Notice board"
          subtitle="Verified circulars, dates and results"
          action={
            <Button asChild variant="outline" size="sm" className="h-9 rounded-full">
              <Link to="/app/calendar">
                <FontAwesomeIcon icon={faCalendarDays} /> <span className="hidden sm:inline">Calendar</span>
              </Link>
            </Button>
          }
        />
        {body}
      </>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      <PageHeader
        title="Govt job notice board"
        subtitle={`Circulars, deadlines, admit cards and results — ${Object.keys(noticeTypes).length - 1} notice types, all verified.`}
        action={
          <Button asChild variant="outline" size="sm" className="h-9 rounded-full">
            <Link to="/calendar">
              <FontAwesomeIcon icon={faCalendarDays} /> <span className="hidden sm:inline">Calendar</span>
            </Link>
          </Button>
        }
      />
      {!user && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-secondary p-3.5 text-sm text-secondary-foreground">
          <FontAwesomeIcon icon={faBell} className="text-lg" />
          <p className="flex-1">Get free alerts before deadlines close.</p>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/login">Turn on</Link>
          </Button>
        </div>
      )}
      {body}
    </div>
  )
}
