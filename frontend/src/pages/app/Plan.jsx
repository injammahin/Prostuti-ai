import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faListCheck,
  faRotate,
  faStopwatch,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faPlus,
  faTrash,
  faMugHot,
  faCalendarDay,
  faPen,
  faArrowLeft,
  faArrowRight,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader, Panel, IconBox, Bar } from "@/components/shared"
import { exams } from "@/lib/data"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

/* ---------- date helpers ---------- */
const DAY = 86400000
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const today = startOfDay(new Date())
const addDays = (d, n) => new Date(d.getTime() + n * DAY)
const sameDay = (a, b) => a.toDateString() === b.toDateString()
const fmt = (d, o) => d.toLocaleDateString("en-GB", o)
const toIsoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
// Bangladesh week starts on Saturday
const weekStart = (d) => addDays(startOfDay(d), -((d.getDay() + 1) % 7))

const kinds = {
  mcq: { icon: faListCheck, tone: "primary", label: "Practice", to: "/app/practice" },
  revision: { icon: faRotate, tone: "warning", label: "Fix mistakes", to: "/app/notebook" },
  test: { icon: faStopwatch, tone: "chart5", label: "Model test", to: "/app/test" },
}

/* Exam-specific daily topics: [title, number of questions, minutes] */
const examTemplates = {
  "bcs-general": [
    ["Bangladesh Affairs: Constitution", 30, 25],
    ["Ethics & Good Governance", 20, 15],
    ["International Affairs: UN & Treaties", 20, 15],
    ["English: Idioms & Grammar", 25, 20],
    ["Math: Ratio & Algebra", 20, 20],
    ["Geography & Environment", 25, 20],
    ["General Science: Human Body", 30, 25],
    ["Computer & ICT basics", 20, 15],
    ["Bangla Literature", 25, 20],
    ["Mental Ability: Series & Directions", 20, 15],
  ],
  ntrca: [
    ["Bangla: Samas, Sandhi & Spelling", 25, 20],
    ["English: Preposition & Voice", 25, 20],
    ["Math: Algebra & Geometry", 25, 25],
    ["Liberation War 1971", 25, 20],
    ["Teaching methods", 20, 15],
    ["English: Sentence correction", 20, 15],
    ["Math: Percentage, Profit & Loss", 20, 20],
    ["World Geography & Organisations", 20, 15],
  ],
  "primary-teacher": [
    ["Bangla: Idioms & Spelling", 20, 15],
    ["English: Parts of Speech", 20, 15],
    ["Math: Unitary Method", 20, 20],
    ["Everyday Science", 20, 15],
    ["Bangla: Authors & Poems", 20, 15],
    ["Math: LCM, HCF & Interest", 20, 20],
    ["Bangladesh History & Rivers", 20, 15],
  ],
  "combined-bank": [
    ["English: Sentence completion", 20, 18],
    ["Math: Time & Work", 25, 25],
    ["Banking & Economy basics", 20, 15],
    ["Computer: Excel & Database", 15, 15],
    ["Accounting basics", 20, 20],
    ["Bangla: Grammar", 20, 15],
    ["Math: Simple & Compound Interest", 20, 20],
    ["Current Affairs", 20, 15],
  ],
  "bangladesh-bank": [
    ["English: Vocabulary", 25, 20],
    ["Math: Permutation & Probability", 25, 25],
    ["Central Banking basics", 20, 18],
    ["Computer & ICT", 15, 15],
    ["Economics: Inflation", 20, 20],
    ["Math: Geometry", 20, 22],
    ["Bangla: Translation", 20, 15],
    ["Finance & Economy", 20, 18],
  ],
}

const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback
  } catch {
    return fallback
  }
}

const WEEK = [6, 0, 1, 2, 3, 4, 5] // Sat → Fri
const WEEK_NAMES = { 6: "Sat", 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri" }
const HOURS = [
  [1, "1 hour", "Light"],
  [2, "2 hours", "Steady"],
  [3, "3 hours", "Serious"],
  [4, "4+ hours", "Full-time"],
]

function PlanSetup({ initial, onDone, onCancel }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initial)
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const steps = ["Your exam", "Exam date", "Daily time", "Study days"]
  const canNext = [!!form.exam, !!form.targetDate, !!form.dailyHours, form.studyDays.length > 0][step]

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 text-center">
        <IconBox tone="primary" className="mx-auto mb-3 size-14 rounded-2xl text-xl">
          <FontAwesomeIcon icon={faWandMagicSparkles} />
        </IconBox>
        <h1 className="text-[1.5rem] font-bold md:text-[1.8rem]">Make your study routine</h1>
        <p className="mt-1 text-sm text-muted-foreground">Answer 4 quick questions. We'll make a daily plan for you.</p>
      </div>

      {/* step indicator */}
      <div className="mb-5 flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={cn("h-1.5 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-muted")} />
            <p className={cn("mt-1.5 hidden text-xs sm:block", i === step ? "font-semibold text-primary" : "text-muted-foreground")}>{label}</p>
          </div>
        ))}
      </div>

      <Panel className="p-5 md:p-7">
        {step === 0 && (
          <>
            <h2 className="mb-4 text-lg font-semibold">Which exam are you preparing for?</h2>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {exams
                .filter((e) => !e.comingSoon)
                .map((e) => (
                  <button
                    key={e.slug}
                    type="button"
                    onClick={() => set({ exam: e.slug })}
                    className={cn(
                      "flex items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition-colors",
                      form.exam === e.slug ? "border-primary bg-secondary text-primary" : "border-border hover:border-primary/40"
                    )}
                  >
                    {e.name}
                    {form.exam === e.slug && <FontAwesomeIcon icon={faCheck} />}
                  </button>
                ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="mb-1 text-lg font-semibold">When is your exam?</h2>
            <p className="mb-4 text-sm text-muted-foreground">If you don't know the exact date, pick a rough guess. You can change it later.</p>
            <Input type="date" className="h-12 text-base" value={form.targetDate} min={toIsoDate(today)} onChange={(e) => set({ targetDate: e.target.value })} />
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                [2, "In 2 months"],
                [4, "In 4 months"],
                [6, "In 6 months"],
              ].map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => set({ targetDate: toIsoDate(new Date(today.getFullYear(), today.getMonth() + m, today.getDate())) })}
                  className="rounded-full border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground"
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="mb-4 text-lg font-semibold">How much time can you study each day?</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {HOURS.map(([h, label, hint]) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => set({ dailyHours: h })}
                  className={cn(
                    "rounded-xl border-2 px-4 py-4 text-left transition-colors",
                    form.dailyHours === h ? "border-primary bg-secondary" : "border-border hover:border-primary/40"
                  )}
                >
                  <span className={cn("block text-base font-bold", form.dailyHours === h && "text-primary")}>{label}</span>
                  <span className="text-xs text-muted-foreground">{hint}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="mb-1 text-lg font-semibold">Which days can you study?</h2>
            <p className="mb-4 text-sm text-muted-foreground">Tap to turn a day on or off. Days that are off are rest days.</p>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {WEEK.map((d) => {
                const on = form.studyDays.includes(d)
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set({ studyDays: on ? form.studyDays.filter((x) => x !== d) : [...form.studyDays, d] })}
                    className={cn(
                      "flex h-16 flex-col items-center justify-center gap-1 rounded-xl border-2 text-xs font-semibold transition-colors",
                      on ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {WEEK_NAMES[d]}
                    {on && <FontAwesomeIcon icon={faCheck} className="text-[0.65rem]" />}
                  </button>
                )
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Fridays have a weekly model test.</p>
          </>
        )}

        <div className="mt-7 flex items-center justify-between gap-2">
          {step > 0 ? (
            <Button variant="ghost" className="rounded-full" onClick={() => setStep(step - 1)}>
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </Button>
          ) : onCancel ? (
            <Button variant="ghost" className="rounded-full" onClick={onCancel}>
              Cancel
            </Button>
          ) : (
            <span />
          )}
          {step < steps.length - 1 ? (
            <Button className="h-11 rounded-full px-6" disabled={!canNext} onClick={() => setStep(step + 1)}>
              Next <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          ) : (
            <Button className="h-11 rounded-full px-6" disabled={!canNext} onClick={() => onDone({ ...form, created: true })}>
              <FontAwesomeIcon icon={faCheck} /> Create my routine
            </Button>
          )}
        </div>
      </Panel>
    </div>
  )
}

export default function Plan() {
  const { mainExam, set: setApp } = useApp()
  const activeExamSlug = mainExam || "bcs-general"
  const currentExamObj = exams.find((e) => e.slug === activeExamSlug) || exams[0]

  const [planSettings, setPlanSettings] = useState(() =>
    ({ exam: activeExamSlug, targetDate: "2027-03-15", dailyHours: 3, studyDays: [6, 0, 1, 2, 3, 4, 5], ...load("prostuti:plan:settings", {}) })
  )
  const [overrides, setOverrides] = useState(() => load("prostuti:plan:done", {}))
  const [customTasks, setCustomTasks] = useState(() => load("prostuti:plan:custom", {}))

  const [week, setWeek] = useState(weekStart(today))
  const [selDate, setSelDate] = useState(today)
  const [editing, setEditing] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [newTask, setNewTask] = useState({ kind: "mcq", title: "" })

  useEffect(() => {
    try {
      localStorage.setItem("prostuti:plan:settings", JSON.stringify(planSettings))
      localStorage.setItem("prostuti:plan:done", JSON.stringify(overrides))
      localStorage.setItem("prostuti:plan:custom", JSON.stringify(customTasks))
    } catch {}
  }, [planSettings, overrides, customTasks])

  const examDate = useMemo(() => new Date(planSettings.targetDate + "T00:00:00"), [planSettings.targetDate])
  const daysLeft = Math.max(0, Math.round((examDate - today) / DAY))

  const getTasksFor = (date) => {
    const custom = customTasks[toIsoDate(date)] || []
    if (date > examDate || !planSettings.studyDays.includes(date.getDay())) return custom
    const n = Math.floor(date.getTime() / DAY)
    const past = date < today
    const templates = examTemplates[planSettings.exam] || examTemplates[activeExamSlug] || examTemplates["bcs-general"]

    let generated
    if (date.getDay() === 5) {
      generated = [
        { id: `${n}-t`, kind: "test", title: "Weekly model test", meta: "Full exam with a timer", done: past },
        { id: `${n}-r`, kind: "revision", title: "Retry this week's wrong answers", meta: "About 25 minutes", done: past },
      ]
    } else {
      const count = planSettings.dailyHours >= 4 ? 3 : planSettings.dailyHours >= 2 ? 2 : 1
      generated = Array.from({ length: count }, (_, k) => {
        const [title, q, min] = templates[(n * 2 + k) % templates.length]
        return { id: `${n}-${k}`, kind: "mcq", title, meta: `${q} questions · ${min} min`, done: past && (n + k) % 6 !== 0 }
      })
      if (planSettings.dailyHours >= 3) {
        generated.push({ id: `${n}-r`, kind: "revision", title: "Retry your wrong answers", meta: "About 15 minutes", done: past })
      }
    }
    return [...custom, ...generated].filter((t) => !overrides[`del_${t.id}`])
  }

  const isDone = (t) => overrides[t.id] ?? t.done
  const toggle = (t) => {
    const next = !isDone(t)
    setOverrides((p) => ({ ...p, [t.id]: next }))
    if (next) toast.success("Well done! Task finished.")
  }
  const removeCustom = (t) => {
    const iso = toIsoDate(selDate)
    setCustomTasks((p) => ({ ...p, [iso]: (p[iso] || []).filter((x) => x.id !== t.id) }))
  }

  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i))
  const tasks = getTasksFor(selDate)
  const doneCount = tasks.filter(isDone).length
  const todayTasks = getTasksFor(today)
  const todayDone = todayTasks.filter(isDone).length
  const isToday = sameDay(selDate, today)

  const addTask = () => {
    if (!newTask.title.trim()) return toast.error("Please write what you want to study.")
    const iso = toIsoDate(selDate)
    const task = {
      id: `c-${Date.now()}`,
      kind: newTask.kind,
      title: newTask.title.trim(),
      meta: "Added by you",
      done: false,
      isCustom: true,
    }
    setCustomTasks((p) => ({ ...p, [iso]: [task, ...(p[iso] || [])] }))
    setNewTask({ kind: "mcq", title: "" })
    setAddOpen(false)
    toast.success("Task added.")
  }

  const saveSettings = (next) => {
    setPlanSettings(next)
    setApp({ mainExam: next.exam })
    setEditing(false)
    setWeek(weekStart(today))
    setSelDate(today)
    toast.success(planSettings.created ? "Your routine has been updated." : "Your study routine is ready!")
  }

  if (!planSettings.created || editing)
    return <PlanSetup initial={planSettings} onDone={saveSettings} onCancel={planSettings.created ? () => setEditing(false) : null} />

  const planExam = exams.find((e) => e.slug === planSettings.exam) || currentExamObj

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <PageHeader
        title="Study routine"
        subtitle="Your plan for each day. Tick a task when you finish it."
        action={
          <Button variant="outline" className="h-10 shrink-0 rounded-full" onClick={() => setEditing(true)}>
            <FontAwesomeIcon icon={faPen} /> <span className="hidden sm:inline">Edit my plan</span>
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel>
          <div className="flex items-start gap-4">
            <IconBox tone="primary" className="size-12 rounded-xl">
              <FontAwesomeIcon icon={faCalendarDay} />
            </IconBox>
            <div className="min-w-0 flex-1">
              <p className="text-2xl font-bold tabular-nums">{daysLeft} days left</p>
              <p className="text-xs text-muted-foreground">
                {planExam.name} · {fmt(examDate, { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t pt-3 text-xs">
            <span className="rounded-full bg-muted px-2.5 py-1 font-medium">{planSettings.dailyHours >= 4 ? "4+" : planSettings.dailyHours} hr a day</span>
            <span className="rounded-full bg-muted px-2.5 py-1 font-medium">{planSettings.studyDays.length} days a week</span>
            <button onClick={() => setEditing(true)} className="ml-auto font-semibold text-primary hover:underline">
              Edit plan
            </button>
          </div>
        </Panel>
        <Panel>
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-sm font-semibold">Today's progress</p>
            <p className="text-sm text-muted-foreground">
              <b className="text-foreground">{todayDone}</b> of {todayTasks.length} done
            </p>
          </div>
          <Bar value={todayTasks.length ? (todayDone / todayTasks.length) * 100 : 0} tone="bg-success" />
          <p className="mt-2 text-xs text-muted-foreground">
            {todayTasks.length && todayDone === todayTasks.length ? "All done for today 🎉" : "Finish today's tasks to stay on track."}
          </p>
        </Panel>
      </div>

      {/* Week strip */}
      <Panel className="p-3 md:p-4">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-sm font-semibold">
            {fmt(days[0], { day: "numeric", month: "short" })} – {fmt(days[6], { day: "numeric", month: "short" })}
          </p>
          <div className="flex items-center gap-1">
            {!sameDay(week, weekStart(today)) && (
              <button
                onClick={() => (setWeek(weekStart(today)), setSelDate(today))}
                className="mr-1 rounded-full px-3 py-1 text-xs font-semibold text-primary hover:bg-secondary"
              >
                Today
              </button>
            )}
            {[
              [faChevronLeft, -7, "Previous week"],
              [faChevronRight, 7, "Next week"],
            ].map(([icon, n, label]) => (
              <button
                key={label}
                aria-label={label}
                onClick={() => {
                  setWeek(addDays(week, n))
                  setSelDate(addDays(selDate, n))
                }}
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <FontAwesomeIcon icon={icon} className="text-xs" />
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {days.map((d) => {
            const list = getTasksFor(d)
            const allDone = list.length > 0 && list.every(isDone)
            const sel = sameDay(d, selDate)
            const tdy = sameDay(d, today)
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelDate(d)}
                aria-pressed={sel}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl py-2.5 transition-colors",
                  sel ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted",
                  !sel && tdy && "ring-2 ring-primary/30"
                )}
              >
                <span className={cn("text-[0.68rem] font-medium", sel ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {fmt(d, { weekday: "short" })}
                </span>
                <span className="text-base font-bold tabular-nums">{d.getDate()}</span>
                <span className="grid h-3 place-items-center">
                  {allDone ? (
                    <FontAwesomeIcon icon={faCheck} className={cn("text-[0.6rem]", sel ? "text-primary-foreground" : "text-success")} />
                  ) : list.length ? (
                    <span className={cn("size-1.5 rounded-full", sel ? "bg-primary-foreground/70" : "bg-primary/50")} />
                  ) : null}
                </span>
              </button>
            )
          })}
        </div>
      </Panel>

      {/* Day tasks */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[1.05rem] font-semibold">{isToday ? "Today's tasks" : fmt(selDate, { weekday: "long", day: "numeric", month: "long" })}</h2>
            {tasks.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {doneCount} of {tasks.length} done
              </p>
            )}
          </div>
          <Button size="sm" variant="ghost" className="rounded-full text-primary" onClick={() => setAddOpen(true)}>
            <FontAwesomeIcon icon={faPlus} /> Add task
          </Button>
        </div>

        {tasks.length === 0 ? (
          <Panel className="flex flex-col items-center py-10 text-center">
            <IconBox tone="muted" className="mb-3 size-12 rounded-full">
              <FontAwesomeIcon icon={faMugHot} />
            </IconBox>
            <p className="font-semibold">Rest day — nothing planned</p>
            <p className="mt-1 text-sm text-muted-foreground">Take a rest, or add something you'd like to study.</p>
          </Panel>
        ) : (
          <ul className="space-y-2.5">
            {tasks.map((t) => {
              const k = kinds[t.kind] || kinds.mcq
              const done = isDone(t)
              return (
                <li key={t.id} className={cn("card flex items-center gap-3 p-3 transition-opacity md:p-4", done && "opacity-60")}>
                  <button
                    onClick={() => toggle(t)}
                    aria-label={done ? "Mark as not done" : "Mark as done"}
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full border-2 text-xs transition-all",
                      done ? "border-success bg-success text-white" : "border-input hover:border-primary"
                    )}
                  >
                    {done && <FontAwesomeIcon icon={faCheck} />}
                  </button>
                  <IconBox tone={k.tone} className="hidden size-10 rounded-lg sm:grid">
                    <FontAwesomeIcon icon={k.icon} />
                  </IconBox>
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-sm font-semibold md:text-[0.95rem]", done && "line-through")}>{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {k.label} · {t.meta}
                    </p>
                  </div>
                  {t.isCustom && (
                    <button onClick={() => removeCustom(t)} aria-label="Remove task" className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive">
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    </button>
                  )}
                  {!done && (
                    <Button asChild size="sm" className="h-8 shrink-0 rounded-full px-4">
                      <Link to={k.to}>Start</Link>
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Add task */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a task</DialogTitle>
            <DialogDescription>For {fmt(selDate, { weekday: "long", day: "numeric", month: "long" })}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">What do you want to study?</Label>
              <Input
                id="task-title"
                placeholder="e.g. English synonyms"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(kinds).map(([id, k]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setNewTask({ ...newTask, kind: id })}
                    className={cn(
                      "flex h-16 flex-col items-center justify-center gap-1 rounded-lg border text-xs font-semibold transition-colors",
                      newTask.kind === id ? "border-primary bg-secondary text-primary" : "text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    <FontAwesomeIcon icon={k.icon} />
                    {k.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="flex-row gap-2">
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1 sm:flex-none" onClick={addTask}>
              Add task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
