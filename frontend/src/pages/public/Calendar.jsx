import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChevronLeft,
  faChevronRight,
  faCalendarPlus,
  faList,
  faTableCells,
  faArrowRight,
  faCircleCheck,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { Crumbs, PageHeader, Segmented, EmptyState } from "@/components/shared"
import { notices, exams, examFamilies, TODAY } from "@/lib/data"
import { fmtDate, daysUntil, tr, td, examName, noticeTitle, dateLocale, localDigits } from "@/lib/format"
import { downloadIcs } from "@/lib/ics"
import { useApp } from "@/lib/app-context"
import { useSeo } from "@/lib/seo"
import { cn } from "@/lib/utils"
import { useNoticesVersion } from "@/lib/notices-store"

const kinds = {
  applyFrom: { label: "Apply opens", dot: "bg-info", text: "text-info", soft: "bg-info/10", time: "T09:00:00" },
  applyUntil: { label: "Deadline", dot: "bg-destructive", text: "text-destructive", soft: "bg-destructive/10", time: "T23:59:59" },
  examDate: { label: "Exam", dot: "bg-primary", text: "text-primary", soft: "bg-primary/10", time: "T10:00:00" },
}

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

function split(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

function timeLeft(ms) {
  const { d, h, m } = split(ms)
  if (ms <= 0) return tr("Now", "এখন")
  if (d > 0) return tr(`${d}d ${h}h left`, `${localDigits(d)} দিন ${localDigits(h)} ঘণ্টা বাকি`)
  if (h > 0) return tr(`${h}h ${m}m left`, `${localDigits(h)} ঘণ্টা ${localDigits(m)} মিনিট বাকি`)
  return tr(`${m}m left`, `${localDigits(m)} মিনিট বাকি`)
}

// Countdown manages its own second-by-second timer locally so parent Calendar never re-renders
function Countdown({ target }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const t = split(target - now)
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" role="timer" aria-label={`${t.d} days ${t.h} hours ${t.m} minutes left`}>
      {[
        [t.d, tr("Days", "দিন")],
        [t.h, tr("Hours", "ঘণ্টা")],
        [t.m, tr("Minutes", "মিনিট")],
        [t.s, tr("Seconds", "সেকেন্ড")],
      ].map(([v, l]) => (
        <div key={l} className="rounded-lg border border-white/15 bg-white/10 px-2 py-3 text-center sm:py-4">
          <p className="text-2xl leading-none font-semibold tabular-nums sm:text-4xl">{localDigits(String(v).padStart(2, "0"))}</p>
          <p className="mt-1.5 text-[0.65rem] tracking-wide text-white/70 uppercase sm:text-xs">{l}</p>
        </div>
      ))}
    </div>
  )
}

// Standalone row component defined outside Calendar so React doesn't recreate component type on render
function EventRow({ e, base, now }) {
  const k = kinds[e.kind] || kinds.applyUntil
  const d = new Date(e.date + "T00:00")
  const days = daysUntil(e.date)
  return (
    <li className="card lift group flex items-center gap-3 p-3 md:gap-4 md:p-4">
      <div className={cn("flex w-14 shrink-0 flex-col items-center rounded-lg py-2", k.soft, k.text)}>
        <span className="text-[0.6rem] font-semibold uppercase">{d.toLocaleString(dateLocale(), { weekday: "short" })}</span>
        <span className="text-xl leading-tight font-semibold">{localDigits(d.getDate())}</span>
        <span className="text-[0.6rem] font-semibold uppercase">{d.toLocaleString(dateLocale(), { month: "short" })}</span>
      </div>
      <Link to={`${base}/${e.notice.slug}`} className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={cn("size-1.5 rounded-full", k.dot)} />
          <span className="font-medium text-foreground/80">{td(k.label)}</span> · {examName(e.exam)}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold transition-colors group-hover:text-primary md:text-[0.95rem]">{noticeTitle(e.notice)}</p>
        {e.notice.verifiedAt && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-success">
            <FontAwesomeIcon icon={faCircleCheck} /> {tr("Verified", "যাচাইকৃত")} {fmtDate(e.notice.verifiedAt, false)}
          </p>
        )}
      </Link>
      <span
        className={cn(
          "hidden shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums sm:inline-flex",
          days <= 3 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
        )}
      >
        <FontAwesomeIcon icon={faHourglassHalf} className="text-[0.65rem]" /> {timeLeft(e.at - now)}
      </span>
      <button
        onClick={() => downloadIcs(e.notice)}
        className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
        aria-label="Add to calendar"
      >
        <FontAwesomeIcon icon={faCalendarPlus} />
      </button>
    </li>
  )
}

function MiniMonthView({ month, setMonth, cells, byDate, selected, setSelected, base, big = false }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="font-semibold">{month.toLocaleString(dateLocale(), { month: "long", year: "numeric" })}</p>
        <div className="flex gap-1">
          <button
            className="grid size-8 place-items-center rounded-lg hover:bg-muted"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            aria-label="Previous month"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          </button>
          <button
            className="grid size-8 place-items-center rounded-lg hover:bg-muted"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            aria-label="Next month"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-7 text-center text-[0.65rem] font-medium text-muted-foreground">
          {tr(["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"], ["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র"]).map((d) => (
            <span key={d} className="py-1">
              {big ? d : tr(d[0], d)}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d) => {
            const k = iso(d)
            const evs = byDate[k] || []
            const out = d.getMonth() !== month.getMonth()
            const isToday = k === iso(TODAY)
            const sel = selected === k
            return (
              <button
                key={k}
                onClick={() => setSelected(k)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-lg text-sm transition-colors",
                  big ? "h-14 p-1" : "h-9",
                  out && "text-muted-foreground/40",
                  isToday && "font-bold text-primary",
                  sel ? "bg-primary font-semibold text-primary-foreground" : "hover:bg-muted"
                )}
              >
                <span>{localDigits(d.getDate())}</span>
                <span className="flex gap-0.5">
                  {evs.slice(0, 3).map((ev, i) => (
                    <span key={i} className={cn("size-1.5 rounded-full", sel ? "bg-primary-foreground" : kinds[ev.kind]?.dot)} />
                  ))}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="border-t p-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">{fmtDate(selected)}</p>
        {(byDate[selected] || []).length ? (
          <ul className="space-y-1.5">
            {byDate[selected].map((e, i) => (
              <li key={i}>
                <Link to={`${base}/${e.notice.slug}`} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                  <span className={cn("size-2 shrink-0 rounded-full", kinds[e.kind]?.dot)} />
                  <span className="truncate">{noticeTitle(e.notice)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{tr("No events on this day.", "এই দিনে কিছু নেই।")}</p>
        )}
      </div>
    </div>
  )
}

export default function Calendar({ inApp = false }) {
  const noticesVersion = useNoticesVersion()
  const { followed, mainExam, user, isGuest, L, num } = useApp()
  const [fixedNow] = useState(() => Date.now())
  const [view, setView] = useState("list")
  const [family, setFamily] = useState(inApp ? (exams.find((e) => e.slug === mainExam)?.family ?? "all") : "all")
  const [mine, setMine] = useState(false)
  const [month, setMonth] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
  const [selected, setSelected] = useState(iso(TODAY))
  useSeo(inApp ? {} : { title: "Govt Exam Calendar | সরকারি চাকরির পরীক্ষার তারিখ ও আবেদনের শেষ সময় — bd3schools", description: "Upcoming BCS, bank, NTRCA and Primary exam dates and application deadlines from official notices. পরীক্ষার তারিখ ও আবেদনের শেষ সময়।" })
  const base = inApp ? "/app/notices" : "/notices"

  const events = useMemo(() => {
    const out = []
    notices.forEach((n) => {
      const exam = exams.find((e) => e.slug === n.exam)
      if (family !== "all" && exam?.family !== family) return
      if (mine && !followed.includes(n.exam)) return
      Object.keys(kinds).forEach((k) => n[k] && out.push({ date: n[k], kind: k, notice: n, exam, at: new Date(n[k] + kinds[k].time).getTime() }))
    })
    return out.sort((a, b) => a.at - b.at)
  }, [family, mine, followed, noticesVersion])

  const upcoming = events.filter((e) => e.at > fixedNow)
  const next = upcoming[0] || events[0]
  const byDate = events.reduce((m, e) => ((m[e.date] ||= []).push(e), m), {})
  const byMonth = upcoming.reduce((m, e) => {
    const k = new Date(e.date + "T00:00").toLocaleDateString(dateLocale(), { month: "long", year: "numeric" })
    ;(m[k] ||= []).push(e)
    return m
  }, {})

  const start = new Date(month)
  start.setDate(1 - ((start.getDay() + 1) % 7))
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })

  const body = (
    <>
      {!inApp && <Crumbs items={[[L("Exam calendar", "পরীক্ষার ক্যালেন্ডার")]]} />}
      <PageHeader
        title={L("Exam calendar", "পরীক্ষার ক্যালেন্ডার")}
        subtitle={L("Deadlines and exam dates from verified official notices", "যাচাইকৃত অফিসিয়াল নোটিশের শেষ তারিখ ও পরীক্ষার তারিখ")}
        action={
          <div className="flex rounded-lg bg-muted p-1" role="tablist">
            {[
              ["list", faList, L("List", "তালিকা")],
              ["month", faTableCells, L("Month", "মাস")],
            ].map(([v, ic, l]) => (
              <button
                key={v}
                role="tab"
                aria-selected={view === v}
                onClick={() => setView(v)}
                className={cn("flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium transition-all", view === v ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}
              >
                <FontAwesomeIcon icon={ic} className="text-xs" /> <span className="hidden sm:inline">{l}</span>
              </button>
            ))}
          </div>
        }
      />

      {/* Next deadline countdown */}
      {next && (
        <div className="hero mb-6 rounded-2xl p-5 md:p-7">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-white/75 uppercase">
                <span className="live-dot size-2 rounded-full bg-glow" /> {L("Next up", "এরপর")} · {td(kinds[next.kind]?.label)}
              </p>
              <h2 className="mt-2 text-xl leading-snug md:text-2xl">{noticeTitle(next.notice)}</h2>
              <p className="mt-1.5 text-sm text-white/75">
                {examName(next.exam)} · {new Date(next.at).toLocaleString(dateLocale(), { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" })}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild className="h-10 bg-white px-4 text-brand hover:bg-white/90">
                  <Link to={`${base}/${next.notice.slug}`}>
                    {L("View notice", "নোটিশ দেখুন")} <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </Button>
                <Button variant="outline" className="h-10 border-white/25 bg-transparent px-4 text-white hover:bg-white/10 hover:text-white" onClick={() => downloadIcs(next.notice)}>
                  <FontAwesomeIcon icon={faCalendarPlus} /> {L("Add to calendar", "ক্যালেন্ডারে যোগ")}
                </Button>
              </div>
            </div>
            <div className="lg:w-[26rem]">
              <Countdown target={next.at} />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Segmented options={[{ value: "all", label: L("All", "সব") }, ...examFamilies.map((f) => ({ value: f.id, label: L(f.name, f.nameBn) }))]} value={family} onChange={setFamily} />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {user && !isGuest && (
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} className="size-4 accent-[var(--primary)]" />
              {L("My exams only", "শুধু আমার পরীক্ষা")}
            </label>
          )}
          {Object.values(kinds).map((k) => (
            <span key={k.label} className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", k.dot)} /> {td(k.label)}
            </span>
          ))}
        </div>
      </div>

      {view === "list" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-6">
            {Object.keys(byMonth).length ? (
              Object.entries(byMonth).map(([m, list]) => (
                <section key={m}>
                  <div className="mb-3 flex items-center gap-3">
                    <h2 className="text-sm font-semibold">{m}</h2>
                    <span className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">{L(`${list.length} dates`, `${num(list.length)}টি তারিখ`)}</span>
                  </div>
                  <ul className="space-y-2.5">
                    {list.map((e) => (
                      <EventRow key={`${e.notice.slug}-${e.kind}`} e={e} base={base} now={fixedNow} />
                    ))}
                  </ul>
                </section>
              ))
            ) : (
              <EmptyState title={L("Nothing upcoming", "আসন্ন কিছু নেই")} text={L("Try another exam family.", "অন্য পরীক্ষা বেছে দেখুন।")} />
            )}
          </div>
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <MiniMonthView
                month={month}
                setMonth={setMonth}
                cells={cells}
                byDate={byDate}
                selected={selected}
                setSelected={setSelected}
                base={base}
              />
            </div>
          </aside>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl">
          <MiniMonthView
            month={month}
            setMonth={setMonth}
            cells={cells}
            byDate={byDate}
            selected={selected}
            setSelected={setSelected}
            base={base}
            big
          />
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">{L("Always confirm dates on the official website. Times are shown in Bangladesh time.", "তারিখ সবসময় অফিসিয়াল ওয়েবসাইটে যাচাই করুন। সময় বাংলাদেশ সময় অনুযায়ী।")}</p>
    </>
  )

  return inApp ? body : <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">{body}</div>
}
