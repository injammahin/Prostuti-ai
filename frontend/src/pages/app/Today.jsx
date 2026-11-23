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
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { HeroCard, Panel, SectionTitle, IconBox, Bar, StatCard, DateChip, Trend } from "@/components/shared"
import Illustration from "@/components/Illustration"
import { SubjectTile, subjectAccent } from "@/components/SubjectIcon"
import { notices } from "@/lib/data"
import { useApp } from "@/lib/app-context"
import { statsApi } from "@/lib/api"
import { useApi } from "@/lib/use-api"
import { daysUntil, keyDate, relDays } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useNoticesVersion } from "@/lib/notices-store"

const modeLabel = {
  drill: ["Subject practice", "বিষয়ভিত্তিক অনুশীলন"],
  past: ["Old exam questions", "বিগত সালের প্রশ্ন"],
  mistakes: ["Fixing mistakes", "ভুল সংশোধন"],
  diagnostic: ["Starting-level test", "প্রাথমিক মূল্যায়ন"],
}

function greeting(L) {
  const h = new Date().getHours()
  return h < 12 ? L("Good morning", "শুভ সকাল") : h < 17 ? L("Good afternoon", "শুভ অপরাহ্ন") : L("Good evening", "শুভ সন্ধ্যা")
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
  const { L, num, fmtDate } = useApp()
  const [hover, setHover] = useState(null)
  const dayLabel = (d, i) => (i === week.length - 1 ? L("Today", "আজ") : fmtDate(d.date, { weekday: "short" }))
  const max = Math.max(1, ...week.map((w) => w.count))
  const change = pctChange(thisWeek, lastWeek)
  return (
    <Panel className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{L("This week", "এই সপ্তাহ")}</h2>
          <p className="text-xs text-muted-foreground">{L("Questions answered per day", "প্রতিদিন উত্তর দেওয়া প্রশ্ন")}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl leading-none font-extrabold">{num(thisWeek)}</p>
          {change !== null && <Trend value={L(`${change}% vs last week`, `গত সপ্তাহের চেয়ে ${num(change)}%`)} />}
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
                    {num(d.count)}
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
              {dayLabel(d, i)}
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
  const noticesVersion = useNoticesVersion()
  const { user, followed, mainExam, isGuest, L, num, fmtDate } = useApp()
  const { data: s, loading, error, reload } = useApi(() => statsApi.get(mainExam), [mainExam], { enabled: !isGuest })

  const firstName = isGuest ? L("there", "বন্ধু") : user?.name?.split(" ")[0]
  const dateStr = fmtDate(new Date(), { weekday: "long", day: "numeric", month: "long" })
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
                {greeting(L)}, {firstName} 👋
              </h1>
              {isGuest ? (
                <p className="mt-2 max-w-md text-sm text-white/80 md:text-base">{L("Create a free account to save your answers, track your progress and fix your mistakes.", "উত্তর সংরক্ষণ, অগ্রগতি দেখা ও ভুল সংশোধনের জন্য একটি ফ্রি অ্যাকাউন্ট খুলুন।")}</p>
              ) : (
                <>
                  <p className="mt-2 max-w-md text-sm text-white/80 md:text-base">
                    {goalDone
                      ? L(`You've reached today's goal of ${goal} questions. Brilliant! 🎉`, `আজকের ${num(goal)}টি প্রশ্নের লক্ষ্য পূরণ হয়েছে। দারুণ! 🎉`)
                      : todayCount === 0
                        ? L(`Your goal today: answer ${goal} questions.`, `আজকের লক্ষ্য: ${num(goal)}টি প্রশ্নের উত্তর দিন।`)
                        : L(`${goal - todayCount} more questions to reach today's goal.`, `আজকের লক্ষ্য পূরণে আর ${num(goal - todayCount)}টি প্রশ্ন বাকি।`)}
                  </p>
                  <div className="mt-4 flex max-w-sm items-center gap-3">
                    <Bar value={Math.min(100, (todayCount / goal) * 100)} className="h-2 bg-white/15" tone="bg-glow" />
                    <span className="text-sm font-bold tabular-nums">
                      {num(todayCount)}/{num(goal)}
                    </span>
                  </div>
                </>
              )}
              <div className="mt-5 flex flex-wrap gap-2.5">
                {isGuest ? (
                  <Button asChild className="btn-shine h-11 bg-white px-5 text-brand hover:bg-white">
                    <Link to="/signup">
                      <FontAwesomeIcon icon={faUserPlus} /> {L("Create free account", "ফ্রি অ্যাকাউন্ট খুলুন")}
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="btn-shine h-11 bg-white px-5 text-brand hover:bg-white">
                    <Link to={startLink}>
                      <FontAwesomeIcon icon={faPlay} /> {todayCount ? L("Keep practising", "অনুশীলন চালিয়ে যান") : L("Start practising", "অনুশীলন শুরু করুন")}
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline" className="h-11 border-white/25 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white">
                  <Link to="/app/test">{L("Take a model test", "মডেল টেস্ট দিন")}</Link>
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
                    <span className="block font-bold">{L(`${examDays} days`, `${num(examDays)} দিন`)}</span>
                    <span className="text-xs text-white/70">{L("to your exam", "পরীক্ষা বাকি")}</span>
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
              {L("Try again", "আবার চেষ্টা করুন")}
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
              <StatCard label={L("Days in a row", "টানা দিন")} value={num(s?.streak.current ?? 0)} unit={L("days", "দিন")} trend={s?.streak.best ? L(`best ${s.streak.best}`, `সেরা ${num(s.streak.best)}`) : undefined} icon={<FontAwesomeIcon icon={faFire} />} tone="warning" />
              <StatCard
                label={L("Answers correct", "সঠিক উত্তর")}
                value={s?.totals.accuracy != null ? `${num(s.totals.accuracy)}%` : "—"}
                trend={s?.totals.accuracy_change ? `${s.totals.accuracy_change < 0 ? "-" : ""}${num(Math.abs(s.totals.accuracy_change))}%` : undefined}
                icon={<FontAwesomeIcon icon={faBullseye} />}
              />
              <StatCard
                label={L("Questions answered", "উত্তর দেওয়া প্রশ্ন")}
                value={num(s?.totals.answered ?? 0)}
                trend={s?.totals.answered_this_week ? L(`${s.totals.answered_this_week} this week`, `এ সপ্তাহে ${num(s.totals.answered_this_week)}`) : undefined}
                icon={<FontAwesomeIcon icon={faCircleCheck} />}
                tone="success"
                spark={weekCounts?.some(Boolean) ? weekCounts : undefined}
                sparkColor="var(--success)"
              />
              <StatCard
                label={L("Expected exam score", "সম্ভাব্য পরীক্ষার নম্বর")}
                value={s?.expected_score ? num(s.expected_score.score) : "—"}
                unit={s?.expected_score ? `/${num(s.expected_score.max)}` : L("after 20 answers", "২০টি উত্তরের পর")}
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
                <h2 className="font-semibold">{L("How well you do in each subject", "বিষয়ভিত্তিক ফলাফল")}</h2>
                <Link to="/app/progress" className="text-xs font-bold text-primary">
                  {L("Details", "বিস্তারিত")}
                </Link>
              </div>
              {practised.length ? (
                <ul className="divide-y divide-border/60">
                  {[...practised]
                    .sort((a, b) => b.accuracy - a.accuracy)
                    .slice(0, 6)
                    .map((x) => (
                      <li key={x.slug} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                        <span className="w-[42%] truncate text-sm">{L(x.name, x.name_bn || x.name)}</span>
                        <Bar value={x.accuracy} className="h-1.5 flex-1" tone={x.accuracy >= 65 ? "bg-primary" : "bg-warning"} />
                        <span className="w-10 text-right text-sm font-semibold tabular-nums">{num(x.accuracy)}%</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">{L("Answer a few questions and your subject scores will show here.", "কয়েকটি প্রশ্নের উত্তর দিলে এখানে বিষয়ভিত্তিক ফলাফল দেখাবে।")}</p>
              )}
            </Panel>
          </div>
        )}

        {/* Continue where you left off */}
        {s?.unfinished.length > 0 && (
          <section>
            <SectionTitle title={L("Continue where you left off", "যেখানে থেমেছিলেন")} />
            <div className="stagger grid gap-4 @2xl:grid-cols-2">
              {s.unfinished.map((p) => (
                <div key={p.id} className="card lift p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    {p.subject_slug ? (
                      <SubjectTile slug={p.subject_slug} size="sm" />
                    ) : (
                      <IconBox tone="primary">
                        <FontAwesomeIcon icon={p.mode === "mistakes" ? faRotate : faListCheck} />
                      </IconBox>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{p.subject ? L(p.subject, p.subject_bn || p.subject) : modeLabel[p.mode] ? L(...modeLabel[p.mode]) : L("Practice", "অনুশীলন")}</p>
                      <p className="text-xs text-muted-foreground">
                        {L(`${p.answered} of ${p.total} answered`, `${num(p.total)}টির মধ্যে ${num(p.answered)}টির উত্তর দেওয়া হয়েছে`)}
                      </p>
                    </div>
                    <span className="text-sm font-extrabold text-primary">{num(p.percent)}%</span>
                  </div>
                  <Bar value={p.percent} className="mt-4 h-1.5" />
                  <Button asChild className="mt-4 h-10 w-full">
                    <Link to={`/app/practice/session?id=${p.id}`}>{L("Continue", "চালিয়ে যান")}</Link>
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
                {L(`${s.mistakes_due} ${s.mistakes_due === 1 ? "mistake" : "mistakes"} ready to retry`, `${num(s.mistakes_due)}টি ভুল আবার চেষ্টা করার জন্য প্রস্তুত`)}
              </p>
              <p className="text-xs text-muted-foreground">{L("Get them right once and they're cleared.", "একবার সঠিক উত্তর দিলেই তালিকা থেকে মুছে যাবে।")}</p>
            </div>
            <span className="text-sm font-semibold text-primary">{L("Retry", "আবার চেষ্টা")} →</span>
          </Link>
        )}

        {/* Recommended practice */}
        {s && weakest.length > 0 && (
          <section>
            <SectionTitle title={L("Practise these next", "এরপর যা অনুশীলন করবেন")} to="/app/practice" linkLabel={L("View all", "সব দেখুন")} />
            <div className="stagger grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-3 @4xl:gap-4">
              {weakest.map((x) => {
                const topic = s.weak_topics.find((w) => w.subject.slug === x.slug)
                const accent = subjectAccent(x.slug)
                const started = x.accuracy !== null
                const label = !started ? L("Start here", "শুরু করুন") : x.accuracy < 65 ? L("Needs practice", "আরও অনুশীলন দরকার") : L("Keep going", "চালিয়ে যান")
                return (
                  <Link
                    key={x.slug}
                    to={`/app/practice/session?mode=drill&subject=${x.slug}&exam=${mainExam}`}
                    className="group relative isolate flex items-center gap-4 overflow-hidden rounded-2xl border bg-card p-4 shadow-[0_1px_2px_rgb(15_40_80/0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_14px_34px_-14px_rgb(15_40_80/0.28)] focus-visible:ring-[3px] focus-visible:ring-primary/30 focus-visible:outline-none md:p-5"
                  >
                    <span aria-hidden className={cn("pointer-events-none absolute -top-10 -right-10 -z-10 size-32 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125", accent.glow)} />
                    <SubjectTile slug={x.slug} size="lg" className="transition-transform duration-300 group-hover:scale-105" />
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-[0.68rem] font-bold tracking-wider uppercase", accent.text)}>{label}</p>
                      <p className="mt-0.5 truncate text-[0.95rem] leading-snug font-semibold">{L(x.name, x.name_bn || x.name)}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {topic
                          ? `${L("Focus", "মনোযোগ দিন")}: ${topic.topic}`
                          : started
                            ? L(`${x.accuracy}% correct · ${x.answered} answered`, `${num(x.accuracy)}% সঠিক · ${num(x.answered)}টি উত্তর`)
                            : x.marks
                              ? L(`${x.marks} marks in the exam`, `পরীক্ষায় ${num(x.marks)} নম্বর`)
                              : L("Not practised yet", "এখনো অনুশীলন করা হয়নি")}
                      </p>
                      {started && (
                        <span className="mt-2.5 block h-1 overflow-hidden rounded-full bg-muted">
                          <span className={cn("block h-full rounded-full", accent.bar)} style={{ width: `${x.accuracy}%` }} />
                        </span>
                      )}
                    </div>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border bg-card text-muted-foreground transition-all duration-300 group-hover:border-transparent group-hover:bg-primary group-hover:text-primary-foreground">
                      <FontAwesomeIcon icon={faArrowRight} className="text-xs transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
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
              <h2 className="font-semibold">{L("Days in a row", "টানা দিন")}</h2>
              <Link to="/app/progress" className="text-xs font-semibold text-primary">
                {L("My results", "আমার ফলাফল")}
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-lg bg-warning/15 text-lg text-warning">
                <FontAwesomeIcon icon={faFire} />
              </span>
              <div>
                <p className="text-2xl leading-none font-semibold">{L(`${s?.streak.current ?? 0} days`, `${num(s?.streak.current ?? 0)} দিন`)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{L(`Best: ${s?.streak.best ?? 0} days`, `সেরা: ${num(s?.streak.best ?? 0)} দিন`)}</p>
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
                    <span className={cn("text-[0.68rem]", today ? "font-semibold text-primary" : "text-muted-foreground")}>{today ? L("Today", "আজ") : fmtDate(d.date, { weekday: "short" }).slice(0, 3)}</span>
                  </div>
                )
              })}
            </div>
            <p className="mt-4 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
              {s?.streak.last7.at(-1)?.active
                ? L("You practised today — streak safe! 🔥", "আজ অনুশীলন করেছেন — ধারাবাহিকতা অটুট! 🔥")
                : L("Answer one question today to keep your streak going.", "ধারাবাহিকতা ধরে রাখতে আজ অন্তত একটি প্রশ্নের উত্তর দিন।")}
            </p>
          </Panel>
        )}

        <section>
          <SectionTitle title={L("Upcoming dates", "আসন্ন তারিখ")} to="/app/calendar" linkLabel={L("View all", "সব দেখুন")} />
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
            <p className="font-semibold">{L("Full model test", "পূর্ণাঙ্গ মডেল টেস্ট")}</p>
            <p className="text-xs text-muted-foreground">{L("200 marks · 2 hours, like the real exam", "২০০ নম্বর · ২ ঘণ্টা, আসল পরীক্ষার মতো")}</p>
          </div>
          <Button asChild variant="outline" size="sm" className="h-9 shrink-0">
            <Link to="/app/test">
              <FontAwesomeIcon icon={faStopwatch} /> {L("Start", "শুরু")}
            </Link>
          </Button>
        </Panel>
      </aside>
    </div>
  )
}
