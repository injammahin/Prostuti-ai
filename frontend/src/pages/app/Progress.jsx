import { useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck, faListCheck, faFire, faArrowRight, faThumbsUp, faSeedling, faPlay } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { PageHeader, HeroCard, Panel, Bar, Ring, IconBox, EmptyState } from "@/components/shared"
import { useApp } from "@/lib/app-context"
import { SubjectTile } from "@/components/SubjectIcon"
import { catalogApi, statsApi } from "@/lib/api"
import { useApi } from "@/lib/use-api"
import { cn } from "@/lib/utils"

/** One bar per finished practice, percent correct written on top. */
function ScoreBars({ sessions }) {
  const { L, num } = useApp()
  return (
    <div>
      <div className="relative h-44 md:h-48">
        <div className="absolute inset-x-0 border-t-2 border-dashed border-success/50" style={{ bottom: "65%" }}>
          <span className="absolute -top-5 right-0 rounded bg-card px-1 text-[0.65rem] font-semibold text-success">{L("Good: 65%+", "ভালো: ৬৫%+")}</span>
        </div>
        <div className="relative flex h-full items-end gap-2 sm:gap-3 md:gap-5">
          {sessions.map((d, i) => {
            const last = i === sessions.length - 1
            return (
              <div key={d.id} className="flex h-full flex-1 flex-col items-center justify-end">
                <span className={cn("mb-1 text-xs font-semibold tabular-nums", last ? "text-primary" : "text-muted-foreground")}>{num(d.percent)}%</span>
                <div
                  className={cn("grow-y w-full max-w-12 rounded-t-lg transition-colors", last ? "bg-primary" : "bg-primary/25 hover:bg-primary/40")}
                  style={{ height: `${Math.max(2, d.percent)}%` }}
                  title={L(`${d.subject || "Practice"}: ${d.correct} of ${d.total} correct`, `${d.subject_bn || d.subject || "অনুশীলন"}: ${num(d.total)}টির মধ্যে ${num(d.correct)}টি সঠিক`)}
                />
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-2 flex gap-2 border-t pt-2 sm:gap-3 md:gap-5">
        {sessions.map((d, i) => (
          <span key={d.id} className="min-w-0 flex-1 truncate text-center text-[0.68rem] text-muted-foreground" title={d.subject || "Practice"}>
            {i === sessions.length - 1 ? L("Latest", "সর্বশেষ") : L(d.subject?.split(" ")[0] || "Mixed", (d.subject_bn || d.subject)?.split(" ")[0] || "মিশ্র")}
          </span>
        ))}
      </div>
    </div>
  )
}

function SubjectRow({ s, exam }) {
  const { L, num } = useApp()
  const good = s.accuracy !== null && s.accuracy >= 65
  return (
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <SubjectTile slug={s.slug} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-semibold">{L(s.name, s.name_bn || s.name)}</p>
          <span className={cn("shrink-0 text-xs font-semibold", s.accuracy === null ? "text-muted-foreground" : good ? "text-success" : "text-amber-600")}>
            {s.accuracy === null ? L("Not started", "শুরু হয়নি") : L(`${s.accuracy}% correct`, `${num(s.accuracy)}% সঠিক`)}
          </span>
        </div>
        <Bar value={s.accuracy ?? 0} className="h-1.5" tone={good ? "bg-success" : "bg-warning"} />
      </div>
      <Button asChild size="sm" variant={good ? "outline" : "default"} className="h-8 shrink-0 rounded-full px-3.5">
        <Link to={`/app/practice/session?mode=drill&subject=${s.slug}&exam=${exam}`}>{L("Practise", "অনুশীলন")}</Link>
      </Button>
    </li>
  )
}

export default function Progress() {
  const { mainExam, L, num } = useApp()
  const [selectedExam, setSelectedExam] = useState(mainExam || "bcs-general")
  const { data: catalog } = useApi(() => catalogApi.get(), [])
  const { data: s, loading, error, reload } = useApi(() => statsApi.get(selectedExam), [selectedExam])

  const subjects = s?.subjects ?? []
  const weak = subjects.filter((x) => x.accuracy !== null && x.accuracy < 65).sort((a, b) => a.accuracy - b.accuracy)
  const strong = subjects.filter((x) => x.accuracy !== null && x.accuracy >= 65).sort((a, b) => b.accuracy - a.accuracy)
  const notStarted = subjects.filter((x) => x.accuracy === null)
  const accuracy = s?.totals.accuracy
  const hasData = (s?.totals.answered ?? 0) > 0

  return (
    <div className="space-y-6">
      <PageHeader title={L("My results", "আমার ফলাফল")} subtitle={L("A simple look at how you are doing and what to practise next.", "আপনি কেমন করছেন এবং এরপর কী অনুশীলন করবেন — সহজভাবে।")} />

      {/* Exam filter */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {(catalog?.exams ?? []).map((e) => (
          <button
            key={e.slug}
            onClick={() => setSelectedExam(e.slug)}
            className={cn(
              "h-9 shrink-0 rounded-full px-4 text-xs font-semibold whitespace-nowrap transition-colors",
              selectedExam === e.slug ? "bg-primary text-primary-foreground" : "border bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            {L(e.name, e.name_bn || e.name)}
          </button>
        ))}
      </div>

      {error && (
        <Panel className="flex items-center justify-between gap-3 text-sm">
          <span className="text-destructive">{error.message}</span>
          <Button size="sm" variant="outline" onClick={reload}>
            {L("Try again", "আবার চেষ্টা করুন")}
          </Button>
        </Panel>
      )}

      {loading && <div className="h-48 animate-pulse rounded-3xl bg-muted" />}

      {!loading && s && !hasData && (
        <EmptyState
          icon={<FontAwesomeIcon icon={faListCheck} />}
          title={L("No results yet", "এখনো কোনো ফলাফল নেই")}
          text={L("Answer some practice questions and your results will appear here — scores, strong subjects and what to improve.", "কিছু প্রশ্নের উত্তর দিলে এখানে আপনার ফলাফল দেখাবে — নম্বর, ভালো বিষয় এবং কোথায় উন্নতি দরকার।")}
          action={
            <Button asChild className="rounded-full">
              <Link to="/app/practice">
                <FontAwesomeIcon icon={faPlay} /> {L("Start practising", "অনুশীলন শুরু করুন")}
              </Link>
            </Button>
          }
        />
      )}

      {!loading && s && hasData && (
        <>
          {/* Summary */}
          <HeroCard>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Ring
                value={accuracy}
                size={104}
                stroke={9}
                color="stroke-white"
                track="stroke-white/20"
                label={
                  <span className="text-center leading-tight">
                    <span className="block text-2xl font-bold">{num(accuracy)}%</span>
                    <span className="text-[0.65rem] text-white/75">{L("correct", "সঠিক")}</span>
                  </span>
                }
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold md:text-2xl">{accuracy >= 65 ? L("You're doing well! 👏", "আপনি ভালো করছেন! 👏") : L("You're improving, keep going! 💪", "আপনি উন্নতি করছেন, চালিয়ে যান! 💪")}</h2>
                <p className="mt-1.5 max-w-2xl text-sm text-white/85 md:text-base">
                  {L(
                    <>
                      You get about <b>{Math.round(accuracy / 10)} out of 10</b> answers right.
                    </>,
                    <>
                      আপনি প্রতি ১০টির মধ্যে প্রায় <b>{num(Math.round(accuracy / 10))}টি</b> সঠিক উত্তর দেন।
                    </>
                  )}{" "}
                  {s.expected_score
                    ? L(
                        <>
                          If the exam were today, your expected score would be about{" "}
                          <b>
                            {s.expected_score.score} out of {s.expected_score.max}
                          </b>{" "}
                          (after negative marking).
                        </>,
                        <>
                          আজ পরীক্ষা হলে নেগেটিভ মার্কিং বাদে আপনার সম্ভাব্য নম্বর প্রায়{" "}
                          <b>
                            {num(s.expected_score.max)}-এর মধ্যে {num(s.expected_score.score)}
                          </b>
                          ।
                        </>
                      )
                    : L("Answer at least 20 questions to see your expected exam score.", "সম্ভাব্য পরীক্ষার নম্বর দেখতে অন্তত ২০টি প্রশ্নের উত্তর দিন।")}
                </p>
                {weak.length > 0 && (
                  <Button asChild className="mt-4 h-10 bg-white px-5 text-brand hover:bg-white/90">
                    <a href="#improve">
                      {L("Practise weak subjects", "দুর্বল বিষয় অনুশীলন করুন")} <FontAwesomeIcon icon={faArrowRight} />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </HeroCard>

          {/* Three simple numbers */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[
              [faCircleCheck, num(s.totals.answered), L("Questions answered", "উত্তর দেওয়া প্রশ্ন"), "success"],
              [faListCheck, num(s.sessions_finished), L("Practices finished", "সম্পন্ন অনুশীলন"), "info"],
              [faFire, num(s.streak.current), L("Days in a row", "টানা দিন"), "warning"],
            ].map(([icon, value, label, tone]) => (
              <Panel key={label} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
                <IconBox tone={tone} className="size-11 rounded-xl">
                  <FontAwesomeIcon icon={icon} />
                </IconBox>
                <div>
                  <p className="text-xl font-bold tabular-nums md:text-2xl">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </Panel>
            ))}
          </div>

          {/* Recent scores */}
          {s.recent_sessions.length > 0 && (
            <Panel>
              <h2 className="font-semibold">{L("Your recent practice scores", "সাম্প্রতিক অনুশীলনের ফলাফল")}</h2>
              <p className="mb-4 text-xs text-muted-foreground">
                {L("Each bar is one finished practice.", "প্রতিটি দণ্ড একটি সম্পন্ন অনুশীলন।")}
                {s.recent_sessions.length > 1 &&
                  L(
                    ` You went from ${s.recent_sessions[0].percent}% to ${s.recent_sessions.at(-1).percent}% correct.`,
                    ` আপনার সঠিক উত্তর ${num(s.recent_sessions[0].percent)}% থেকে ${num(s.recent_sessions.at(-1).percent)}% হয়েছে।`
                  )}
              </p>
              <ScoreBars sessions={s.recent_sessions} />
            </Panel>
          )}

          {/* Subjects */}
          <div id="improve" className="grid scroll-mt-24 gap-4 lg:grid-cols-2">
            <Panel>
              <div className="mb-4 flex items-center gap-2.5">
                <IconBox tone="warning" className="size-9 rounded-lg">
                  <FontAwesomeIcon icon={faSeedling} />
                </IconBox>
                <div>
                  <h2 className="font-semibold">{L("Needs more practice", "আরও অনুশীলন দরকার")}</h2>
                  <p className="text-xs text-muted-foreground">{L("Less than 65% correct", "৬৫%-এর কম সঠিক")}</p>
                </div>
              </div>
              {weak.length ? (
                <ul className="divide-y divide-border/60">
                  {weak.map((x) => (
                    <SubjectRow key={x.slug} s={x} exam={selectedExam} />
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">{L("Great — no weak subjects right now!", "দারুণ — এই মুহূর্তে কোনো দুর্বল বিষয় নেই!")}</p>
              )}

              {s.weak_topics.length > 0 && (
                <div className="mt-5 rounded-xl bg-muted/60 p-3.5">
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">{L("Topics you often get wrong", "যে টপিকগুলোতে প্রায়ই ভুল হয়")}</p>
                  <ul className="space-y-1.5">
                    {s.weak_topics.map((t) => (
                      <li key={`${t.subject.slug}-${t.topic}`} className="flex items-center justify-between gap-2 text-sm">
                        <span className="min-w-0 truncate">
                          {t.topic} <span className="text-xs text-muted-foreground">· {num(t.accuracy)}%</span>
                        </span>
                        <Link to={`/app/practice/session?mode=drill&subject=${t.subject.slug}&exam=${selectedExam}`} className="shrink-0 text-xs font-semibold text-primary">
                          {L("Practise", "অনুশীলন")} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Panel>

            <Panel>
              <div className="mb-4 flex items-center gap-2.5">
                <IconBox tone="success" className="size-9 rounded-lg">
                  <FontAwesomeIcon icon={faThumbsUp} />
                </IconBox>
                <div>
                  <h2 className="font-semibold">{L("Doing well", "ভালো করছেন")}</h2>
                  <p className="text-xs text-muted-foreground">{L("65% correct or more", "৬৫% বা বেশি সঠিক")}</p>
                </div>
              </div>
              {strong.length ? (
                <ul className="divide-y divide-border/60">
                  {strong.map((x) => (
                    <SubjectRow key={x.slug} s={x} exam={selectedExam} />
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">{L("Keep practising — your strong subjects will show here.", "অনুশীলন চালিয়ে যান — আপনার ভালো বিষয়গুলো এখানে দেখাবে।")}</p>
              )}
            </Panel>
          </div>

          {notStarted.length > 0 && (
            <Panel>
              <h2 className="mb-4 font-semibold">{L("Not started yet", "এখনো শুরু হয়নি")}</h2>
              <ul className="grid gap-x-8 divide-y divide-border/60 md:grid-cols-2 md:divide-y-0">
                {notStarted.map((x) => (
                  <SubjectRow key={x.slug} s={x} exam={selectedExam} />
                ))}
              </ul>
            </Panel>
          )}
        </>
      )}
    </div>
  )
}
