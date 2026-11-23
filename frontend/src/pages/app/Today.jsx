import { useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFire,
  faListCheck,
  faStopwatch,
  faRotate,
  faCheck,
  faBullseye,
  faArrowTrendUp,
  faPlay,
  faTrophy,
  faCircleCheck,
  faCalendarDay,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { HeroCard, Panel, SectionTitle, IconBox, Bar, StatCard, DateChip, Trend } from "@/components/shared"
import Illustration from "@/components/Illustration"
import { notices } from "@/lib/data"
import { useApp } from "@/lib/app-context"
import { statsApi } from "@/lib/api"
import { useApi } from "@/lib/use-api"
import { daysUntil, keyDate, relDays } from "@/lib/format"
import { cn } from "@/lib/utils"

const modeLabel = { drill: "Subject practice", past: "Old exam questions", mistakes: "Fixing mistakes", diagnostic: "Starting-level test" }

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
}

function examDateFromRoutine() {
  try {
    return JSON.parse(localStorage.getItem("prostuti:plan:settings"))?.targetDate || null
  } catch {
    return null
  }
}

const pctChange = (now, before) => (before ? Math.round(((now - before) / before) * 100) : null)

function WeekChart({ week, thisWeek, lastWeek }) {
  const [hover, setHover] = useState(null)
  const max = Math.max(1, ...week.map((w) => w.count))
  const change = pctChange(thisWeek, lastWeek)
  return (
    <Panel className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">This week</h2>
          <p className="text-xs text-muted-foreground">Questions answered per day</p>
        </div>
        <div className="text-right">
          <p className="text-2xl leading-none font-extrabold">{thisWeek}</p>
          {change !== null && <Trend value={`${change}% vs last week`} />}
        </div>
      </div>
      <div className="relative mt-5 flex min-h-44 flex-1 flex-col" role="img" aria-label={`Questions per day: ${week.map((w) => `${w.label} ${w.count}`).join(", ")}`}>
        <div className="pointer-events-none absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between">
          {[0, 1, 2, 3].map((g) => (
            <span key={g} className="border-t border-dashed border-border" />
          ))}
        </div>
        <div className="relative flex flex-1 items-end justify-around gap-2">
          {week.map((d, i) => {
            const today = i === week.length - 1
            return (
              <div key={d.date} className="relative flex h-full flex-1 flex-col items-center justify-end" onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
                {hover === i && (
                  <span className="absolute z-10 rounded-md bg-foreground px-2 py-1 text-[0.7rem] font-semibold whitespace-nowrap text-background" style={{ bottom: `calc(${(d.count / max) * 100}% + 6px)` }}>
                    {d.count}
                  </span>
                )}
                <div
                  className={cn("w-full max-w-7 origin-bottom rounded-md transition-colors [animation:grow-y_.7s_cubic-bezier(.2,.7,.2,1)_backwards]", today ? "bg-primary" : hover === i ? "bg-primary/50" : "bg-primary/20")}
                  style={{ height: `${Math.max(d.count ? 6 : 2, (d.count / max) * 100)}%`, animationDelay: `${i * 40}ms` }}
                />
              </div>
            )
          })}
        </div>
        <div className="mt-2 flex justify-around gap-2">
          {week.map((d, i) => (
            <span key={d.date} className={cn("flex-1 text-center text-[0.7rem]", i === week.length - 1 ? "font-semibold text-primary" : "text-muted-foreground")}>
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </Panel>
  )
}

function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted", className)} />
}

export default function Today() {
  const { user, followed, mainExam, isGuest } = useApp()
  const { data: s, loading, error, reload } = useApi(() => statsApi.get(mainExam), [mainExam], { enabled: !isGuest })

  const firstName = isGuest ? "there" : user?.name?.split(" ")[0]
  const dateStr = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
  const examDate = examDateFromRoutine()
  const examDays = examDate ? daysUntil(examDate) : null
  const myNotices = notices.filter((n) => followed.includes(n.exam)).slice(0, 4)

  const todayCount = s?.today.answered ?? 0
  const goal = s?.today.goal ?? 20
  const goalDone = todayCount >= goal
  const practised = s?.subjects.filter((x) => x.accuracy !== null) ?? []
  const weakest = [...(s?.subjects ?? [])].sort((a, b) => (a.accuracy ?? -1) - (b.accuracy ?? -1)).slice(0, 3)
  const startLink = weakest[0] ? `/app/practice/session?mode=drill&subject=${weakest[0].slug}&exam=${mainExam}` : "/app/practice"
  const weekCounts = s?.week.map((w) => w.count)

  return (
    <div className="grid gap-6 min-[1440px]:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="@container min-w-0 space-y-6">
        {/* Hero */}
        <HeroCard className="pb-6 md:pb-7">
          <div className="flex items-center gap-6">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white/70">{dateStr}</p>
              <h1 className="mt-1 text-[1.6rem] leading-tight md:text-[2.1rem]">
                {greeting()}, {firstName} 👋
              </h1>
              {isGuest ? (
                <p className="mt-2 max-w-md text-sm text-white/80 md:text-base">Create a free account to save your answers, track your progress and fix your mistakes.</p>
              ) : (
                <>
                  <p className="mt-2 max-w-md text-sm text-white/80 md:text-base">
                    {goalDone ? `You've reached today's goal of ${goal} questions. Brilliant! 🎉` : todayCount === 0 ? `Your goal today: answer ${goal} questions.` : `${goal - todayCount} more questions to reach today's goal.`}
                  </p>
                  <div className="mt-4 flex max-w-sm items-center gap-3">
                    <Bar value={Math.min(100, (todayCount / goal) * 100)} className="h-2 bg-white/15" tone="bg-glow" />
                    <span className="text-sm font-bold tabular-nums">
                      {todayCount}/{goal}
                    </span>
                  </div>
                </>
              )}
              <div className="mt-5 flex flex-wrap gap-2.5">
                {isGuest ? (
                  <Button asChild className="btn-shine h-11 bg-white px-5 text-brand hover:bg-white">
                    <Link to="/signup">
                      <FontAwesomeIcon icon={faUserPlus} /> Create free account
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="btn-shine h-11 bg-white px-5 text-brand hover:bg-white">
                    <Link to={startLink}>
                      <FontAwesomeIcon icon={faPlay} /> {todayCount ? "Keep practising" : "Start practising"}
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline" className="h-11 border-white/25 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white">
                  <Link to="/app/test">Take a model test</Link>
                </Button>
              </div>
            </div>
            {examDays !== null && examDays >= 0 && (
              <div className="hidden shrink-0 @5xl:flex">
                <div className="flex w-44 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <span className="grid size-9 place-items-center rounded-xl bg-white/15">
                    <FontAwesomeIcon icon={faCalendarDay} />
                  </span>
                  <span>
                    <span className="block font-bold">{examDays} days</span>
                    <span className="text-xs text-white/70">to your exam</span>
                  </span>
                </div>
              </div>
            )}
            <Illustration name="think" className="hidden aspect-square w-40 shrink-0 @2xl:grid @4xl:w-48" />
          </div>
        </HeroCard>

        {error && (
          <Panel className="flex items-center justify-between gap-3 text-sm">
            <span className="text-destructive">{error.message}</span>
            <Button size="sm" variant="outline" onClick={reload}>
              Try again
            </Button>
          </Panel>
        )}

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-4 @3xl:gap-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          !isGuest && (
            <div className="stagger grid grid-cols-2 gap-3 @3xl:grid-cols-4 @3xl:gap-4">
              <StatCard label="Days in a row" value={s?.streak.current ?? 0} unit="days" trend={s?.streak.best ? `best ${s.streak.best}` : undefined} icon={<FontAwesomeIcon icon={faFire} />} tone="warning" />
              <StatCard
                label="Answers correct"
                value={s?.totals.accuracy != null ? `${s.totals.accuracy}%` : "—"}
                trend={s?.totals.accuracy_change ? `${s.totals.accuracy_change}%` : undefined}
                icon={<FontAwesomeIcon icon={faBullseye} />}
              />
              <StatCard
                label="Questions answered"
                value={(s?.totals.answered ?? 0).toLocaleString()}
                trend={s?.totals.answered_this_week ? `${s.totals.answered_this_week} this week` : undefined}
                icon={<FontAwesomeIcon icon={faCircleCheck} />}
                tone="success"
                spark={weekCounts?.some(Boolean) ? weekCounts : undefined}
                sparkColor="var(--success)"
              />
              <StatCard
                label="Expected exam score"
                value={s?.expected_score ? s.expected_score.score : "—"}
                unit={s?.expected_score ? `/${s.expected_score.max}` : "after 20 answers"}
                icon={<FontAwesomeIcon icon={faArrowTrendUp} />}
                tone="info"
              />
            </div>
          )
        )}

        {/* Analytics row */}
        {s && (
          <div className="grid gap-4 @3xl:grid-cols-[1.35fr_1fr]">
            <WeekChart week={s.week} thisWeek={s.totals.answered_this_week} lastWeek={s.totals.answered_last_week} />
            <Panel>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">How well you do in each subject</h2>
                <Link to="/app/progress" className="text-xs font-bold text-primary">
                  Details
                </Link>
              </div>
              {practised.length ? (
                <ul className="divide-y divide-border/60">
                  {[...practised]
                    .sort((a, b) => b.accuracy - a.accuracy)
                    .slice(0, 6)
                    .map((x) => (
                      <li key={x.slug} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                        <span className="w-[42%] truncate text-sm">{x.name}</span>
                        <Bar value={x.accuracy} className="h-1.5 flex-1" tone={x.accuracy >= 65 ? "bg-primary" : "bg-warning"} />
                        <span className="w-10 text-right text-sm font-semibold tabular-nums">{x.accuracy}%</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">Answer a few questions and your subject scores will show here.</p>
              )}
            </Panel>
          </div>
        )}

        {/* Continue where you left off */}
        {s?.unfinished.length > 0 && (
          <section>
            <SectionTitle title="Continue where you left off" />
            <div className="stagger grid gap-4 @2xl:grid-cols-2">
              {s.unfinished.map((p) => (
                <div key={p.id} className="card lift p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <IconBox tone="primary">
                      <FontAwesomeIcon icon={p.mode === "mistakes" ? faRotate : faListCheck} />
                    </IconBox>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{p.subject || modeLabel[p.mode] || "Practice"}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.answered} of {p.total} answered
                      </p>
                    </div>
                    <span className="text-sm font-extrabold text-primary">{p.percent}%</span>
                  </div>
                  <Bar value={p.percent} className="mt-4 h-1.5" />
                  <Button asChild className="mt-4 h-10 w-full">
                    <Link to={`/app/practice/session?id=${p.id}`}>Continue</Link>
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mistakes to fix */}
        {s?.mistakes_due > 0 && (
          <Link to="/app/notebook" className="card lift flex items-center gap-4 p-4">
            <IconBox tone="warning" className="size-11">
              <FontAwesomeIcon icon={faRotate} />
            </IconBox>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                {s.mistakes_due} {s.mistakes_due === 1 ? "mistake" : "mistakes"} ready to retry
              </p>
              <p className="text-xs text-muted-foreground">Get them right once and they're cleared.</p>
            </div>
            <span className="text-sm font-semibold text-primary">Retry →</span>
          </Link>
        )}

        {/* Recommended practice */}
        {s && weakest.length > 0 && (
          <section>
            <SectionTitle title="Practise these next" to="/app/practice" />
            <div className="stagger grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-3">
              {weakest.map((x) => {
                const topic = s.weak_topics.find((w) => w.subject.slug === x.slug)
                return (
                  <div key={x.slug} className="card lift flex flex-col overflow-hidden">
                    {x.image && <img src={x.image} alt="" loading="lazy" className="aspect-[16/7] w-full object-cover" />}
                    <div className="flex flex-1 flex-col p-4">
                      <p className="truncate font-bold">{x.name}</p>
                      <p className="text-xs text-muted-foreground">{x.accuracy === null ? "Not practised yet" : `${x.accuracy}% correct · ${x.answered} answered`}</p>
                      {topic && <p className="mt-2 text-xs text-muted-foreground">Focus on: {topic.topic}</p>}
                      <div className="mt-auto pt-4">
                        <Button asChild className="h-10 w-full">
                          <Link to={`/app/practice/session?mode=drill&subject=${x.slug}&exam=${mainExam}`}>Practise now</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {/* Right rail */}
      <aside className="grid min-w-0 content-start gap-6 md:max-[1439px]:grid-cols-2">
        {!isGuest && (
          <Panel>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Days in a row</h2>
              <Link to="/app/progress" className="text-xs font-semibold text-primary">
                My results
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-lg bg-warning/15 text-lg text-warning">
                <FontAwesomeIcon icon={faFire} />
              </span>
              <div>
                <p className="text-2xl leading-none font-semibold">{s?.streak.current ?? 0} days</p>
                <p className="mt-1 text-xs text-muted-foreground">Best: {s?.streak.best ?? 0} days</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-7 gap-1.5">
              {(s?.streak.last7 ?? []).map((d) => {
                const today = d.label === "Today"
                return (
                  <div key={d.date} className="flex flex-col items-center gap-1.5">
                    <span
                      className={cn(
                        "grid aspect-square w-full max-w-9 place-items-center rounded-full text-[0.7rem]",
                        d.active ? "bg-primary text-primary-foreground" : today ? "border-2 border-dashed border-primary/40 text-primary" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {d.active ? <FontAwesomeIcon icon={faCheck} /> : "•"}
                    </span>
                    <span className={cn("text-[0.68rem]", today ? "font-semibold text-primary" : "text-muted-foreground")}>{today ? "Today" : d.label.slice(0, 2)}</span>
                  </div>
                )
              })}
            </div>
            <p className="mt-4 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
              {s?.streak.last7.at(-1)?.active ? "You practised today — streak safe! 🔥" : "Answer one question today to keep your streak going."}
            </p>
          </Panel>
        )}

        <section>
          <SectionTitle title="Upcoming dates" to="/app/calendar" />
          <div className="card divide-y divide-border/70 overflow-hidden">
            {myNotices.map((n) => {
              const k = keyDate(n)
              return (
                <Link key={n.slug} to={`/app/notices/${n.slug}`} className="group flex items-center gap-3 p-3 transition-colors hover:bg-muted/40">
                  <DateChip iso={k.date} label={k.label === "Apply by" ? "Apply" : k.label === "Exam" ? "Exam" : "Pub"} />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm leading-snug font-bold group-hover:text-primary">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{relDays(k.date)}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <Panel className="flex items-center gap-4">
          <IconBox tone="warning" className="size-11">
            <FontAwesomeIcon icon={faTrophy} />
          </IconBox>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Full model test</p>
            <p className="text-xs text-muted-foreground">200 marks · 2 hours, like the real exam</p>
          </div>
          <Button asChild variant="outline" size="sm" className="h-9 shrink-0">
            <Link to="/app/test">
              <FontAwesomeIcon icon={faStopwatch} /> Start
            </Link>
          </Button>
        </Panel>
      </aside>
    </div>
  )
}
