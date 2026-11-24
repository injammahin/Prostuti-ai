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
import { isBangla } from "@/lib/format"

/* ---------- date helpers ---------- */
const DAY = 86400000
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const today = startOfDay(new Date())
const addDays = (d, n) => new Date(d.getTime() + n * DAY)
const sameDay = (a, b) => a.toDateString() === b.toDateString()
const fmt = (d, o) => d.toLocaleDateString(isBangla() ? "bn-BD" : "en-GB", o)
const toIsoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
// Bangladesh week starts on Saturday
const toBn = (value) => String(value).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d])
/** Text stored as [english, bangla] (generated tasks) or a plain string (tasks the student typed). */
const pick = (text, L) => (Array.isArray(text) ? L(...text) : text)
const weekStart = (d) => addDays(startOfDay(d), -((d.getDay() + 1) % 7))

const kinds = {
  mcq: { icon: faListCheck, tone: "primary", label: ["Practice", "অনুশীলন"], to: "/app/practice" },
  revision: { icon: faRotate, tone: "warning", label: ["Fix mistakes", "ভুল সংশোধন"], to: "/app/notebook" },
  test: { icon: faStopwatch, tone: "chart5", label: ["Model test", "মডেল টেস্ট"], to: "/app/test" },
}

/* Exam-specific daily topics: [title, number of questions, minutes] */
const examTemplates = {
  "bcs-general": [
    [["Bangladesh Affairs: Constitution", "বাংলাদেশ বিষয়াবলি: সংবিধান"], 30, 25],
    [["Ethics & Good Governance", "নৈতিকতা ও সুশাসন"], 20, 15],
    [["International Affairs: UN & Treaties", "আন্তর্জাতিক বিষয়াবলি: জাতিসংঘ ও চুক্তি"], 20, 15],
    [["English: Idioms & Grammar", "ইংরেজি: ইডিয়ম ও ব্যাকরণ"], 25, 20],
    [["Math: Ratio & Algebra", "গণিত: অনুপাত ও বীজগণিত"], 20, 20],
    [["Geography & Environment", "ভূগোল ও পরিবেশ"], 25, 20],
    [["General Science: Human Body", "সাধারণ বিজ্ঞান: মানবদেহ"], 30, 25],
    [["Computer & ICT basics", "কম্পিউটার ও আইসিটির মৌলিক বিষয়"], 20, 15],
    [["Bangla Literature", "বাংলা সাহিত্য"], 25, 20],
    [["Mental Ability: Series & Directions", "মানসিক দক্ষতা: ধারা ও দিক"], 20, 15],
  ],
  ntrca: [
    [["Bangla: Samas, Sandhi & Spelling", "বাংলা: সমাস, সন্ধি ও বানান"], 25, 20],
    [["English: Preposition & Voice", "ইংরেজি: Preposition ও Voice"], 25, 20],
    [["Math: Algebra & Geometry", "গণিত: বীজগণিত ও জ্যামিতি"], 25, 25],
    [["Liberation War 1971", "মুক্তিযুদ্ধ ১৯৭১"], 25, 20],
    [["Teaching methods", "শিক্ষণ পদ্ধতি"], 20, 15],
    [["English: Sentence correction", "ইংরেজি: বাক্য শুদ্ধিকরণ"], 20, 15],
    [["Math: Percentage, Profit & Loss", "গণিত: শতকরা ও লাভ-ক্ষতি"], 20, 20],
    [["World Geography & Organisations", "বিশ্ব ভূগোল ও আন্তর্জাতিক সংস্থা"], 20, 15],
  ],
  "primary-teacher": [
    [["Bangla: Idioms & Spelling", "বাংলা: বাগধারা ও বানান"], 20, 15],
    [["English: Parts of Speech", "ইংরেজি: Parts of Speech"], 20, 15],
    [["Math: Unitary Method", "গণিত: ঐকিক নিয়ম"], 20, 20],
    [["Everyday Science", "দৈনন্দিন বিজ্ঞান"], 20, 15],
    [["Bangla: Authors & Poems", "বাংলা: লেখক ও কবিতা"], 20, 15],
    [["Math: LCM, HCF & Interest", "গণিত: ল.সা.গু, গ.সা.গু ও সুদ"], 20, 20],
    [["Bangladesh History & Rivers", "বাংলাদেশের ইতিহাস ও নদনদী"], 20, 15],
  ],
  "combined-bank": [
    [["English: Sentence completion", "ইংরেজি: বাক্য সম্পূর্ণকরণ"], 20, 18],
    [["Math: Time & Work", "গণিত: সময় ও কাজ"], 25, 25],
    [["Banking & Economy basics", "ব্যাংকিং ও অর্থনীতির মৌলিক বিষয়"], 20, 15],
    [["Computer: Excel & Database", "কম্পিউটার: এক্সেল ও ডেটাবেজ"], 15, 15],
    [["Accounting basics", "হিসাববিজ্ঞানের মৌলিক বিষয়"], 20, 20],
    [["Bangla: Grammar", "বাংলা: ব্যাকরণ"], 20, 15],
    [["Math: Simple & Compound Interest", "গণিত: সরল ও চক্রবৃদ্ধি সুদ"], 20, 20],
    [["Current Affairs", "সাম্প্রতিক বিষয়াবলি"], 20, 15],
  ],
  "bangladesh-bank": [
    [["English: Vocabulary", "ইংরেজি: শব্দভান্ডার"], 25, 20],
    [["Math: Permutation & Probability", "গণিত: বিন্যাস ও সম্ভাবনা"], 25, 25],
    [["Central Banking basics", "কেন্দ্রীয় ব্যাংকিংয়ের মৌলিক বিষয়"], 20, 18],
    [["Computer & ICT", "কম্পিউটার ও আইসিটি"], 15, 15],
    [["Economics: Inflation", "অর্থনীতি: মুদ্রাস্ফীতি"], 20, 20],
    [["Math: Geometry", "গণিত: জ্যামিতি"], 20, 22],
    [["Bangla: Translation", "বাংলা: অনুবাদ"], 20, 15],
    [["Finance & Economy", "অর্থ ও অর্থনীতি"], 20, 18],
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
const WEEK_NAMES = {
  6: ["Sat", "শনি"],
  0: ["Sun", "রবি"],
  1: ["Mon", "সোম"],
  2: ["Tue", "মঙ্গল"],
  3: ["Wed", "বুধ"],
  4: ["Thu", "বৃহঃ"],
  5: ["Fri", "শুক্র"],
}
const HOURS = [
  [1, ["1 hour", "১ ঘণ্টা"], ["Light", "হালকা"]],
  [2, ["2 hours", "২ ঘণ্টা"], ["Steady", "নিয়মিত"]],
  [3, ["3 hours", "৩ ঘণ্টা"], ["Serious", "সিরিয়াস"]],
  [4, ["4+ hours", "৪+ ঘণ্টা"], ["Full-time", "পূর্ণকালীন"]],
]

function PlanSetup({ initial, onDone, onCancel }) {
  const { L } = useApp()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initial)
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const steps = [L("Your exam", "আপনার পরীক্ষা"), L("Exam date", "পরীক্ষার তারিখ"), L("Daily time", "দৈনিক সময়"), L("Study days", "পড়ার দিন")]
  const canNext = [!!form.exam, !!form.targetDate, !!form.dailyHours, form.studyDays.length > 0][step]

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 text-center">
        <IconBox tone="primary" className="mx-auto mb-3 size-14 rounded-2xl text-xl">
          <FontAwesomeIcon icon={faWandMagicSparkles} />
        </IconBox>
        <h1 className="text-[1.5rem] font-bold md:text-[1.8rem]">{L("Make your study routine", "আপনার পড়ার রুটিন তৈরি করুন")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{L("Answer 4 quick questions. We'll make a daily plan for you.", "৪টি ছোট প্রশ্নের উত্তর দিন। আমরা আপনার জন্য প্রতিদিনের পরিকল্পনা তৈরি করে দেব।")}</p>
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
            <h2 className="mb-4 text-lg font-semibold">{L("Which exam are you preparing for?", "কোন পরীক্ষার প্রস্তুতি নিচ্ছেন?")}</h2>
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
                    {L(e.name, e.nameBn || e.name)}
                    {form.exam === e.slug && <FontAwesomeIcon icon={faCheck} />}
                  </button>
                ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="mb-1 text-lg font-semibold">{L("When is your exam?", "আপনার পরীক্ষা কবে?")}</h2>
            <p className="mb-4 text-sm text-muted-foreground">{L("If you don't know the exact date, pick a rough guess. You can change it later.", "সঠিক তারিখ না জানলে আনুমানিক একটি তারিখ দিন। পরে বদলাতে পারবেন।")}</p>
            <Input type="date" className="h-12 text-base" value={form.targetDate} min={toIsoDate(today)} onChange={(e) => set({ targetDate: e.target.value })} />
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                [2, L("In 2 months", "২ মাস পর")],
                [4, L("In 4 months", "৪ মাস পর")],
                [6, L("In 6 months", "৬ মাস পর")],
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
            <h2 className="mb-4 text-lg font-semibold">{L("How much time can you study each day?", "প্রতিদিন কতটুকু সময় পড়তে পারবেন?")}</h2>
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
                  <span className={cn("block text-base font-bold", form.dailyHours === h && "text-primary")}>{L(...label)}</span>
                  <span className="text-xs text-muted-foreground">{L(...hint)}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="mb-1 text-lg font-semibold">{L("Which days can you study?", "কোন কোন দিন পড়তে পারবেন?")}</h2>
            <p className="mb-4 text-sm text-muted-foreground">{L("Tap to turn a day on or off. Days that are off are rest days.", "দিন চালু বা বন্ধ করতে ট্যাপ করুন। বন্ধ দিনগুলো বিশ্রামের দিন।")}</p>
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
                    {L(...WEEK_NAMES[d])}
                    {on && <FontAwesomeIcon icon={faCheck} className="text-[0.65rem]" />}
                  </button>
                )
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{L("Fridays have a weekly model test.", "প্রতি শুক্রবার সাপ্তাহিক মডেল টেস্ট থাকে।")}</p>
          </>
        )}

        <div className="mt-7 flex items-center justify-between gap-2">
          {step > 0 ? (
            <Button variant="ghost" className="rounded-full" onClick={() => setStep(step - 1)}>
              <FontAwesomeIcon icon={faArrowLeft} /> {L("Back", "পেছনে")}
            </Button>
          ) : onCancel ? (
            <Button variant="ghost" className="rounded-full" onClick={onCancel}>
              {L("Cancel", "বাতিল")}
            </Button>
          ) : (
            <span />
          )}
          {step < steps.length - 1 ? (
            <Button className="h-11 rounded-full px-6" disabled={!canNext} onClick={() => setStep(step + 1)}>
              {L("Next", "পরের ধাপ")} <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          ) : (
            <Button className="h-11 rounded-full px-6" disabled={!canNext} onClick={() => onDone({ ...form, created: true })}>
              <FontAwesomeIcon icon={faCheck} /> {L("Create my routine", "আমার রুটিন তৈরি করুন")}
            </Button>
          )}
        </div>
      </Panel>
    </div>
  )
}

export default function Plan() {
  const { mainExam, set: setApp, L } = useApp()
  const activeExamSlug = mainExam || "bcs-general"
  const currentExamObj = exams.find((e) => e.slug === activeExamSlug) || exams[0]

  const [planSettings, setPlanSettings] = useState(() =>
    ({ exam: activeExamSlug, targetDate: "2027-03-15", dailyHours: 3, studyDays: [6, 0, 1, 2, 3, 4, 5], ...load("bd3schools:plan:settings", {}) })
  )
  const [overrides, setOverrides] = useState(() => load("bd3schools:plan:done", {}))
  const [customTasks, setCustomTasks] = useState(() => load("bd3schools:plan:custom", {}))

  const [week, setWeek] = useState(weekStart(today))
  const [selDate, setSelDate] = useState(today)
  const [editing, setEditing] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [newTask, setNewTask] = useState({ kind: "mcq", title: "" })

  useEffect(() => {
    try {
      localStorage.setItem("bd3schools:plan:settings", JSON.stringify(planSettings))
      localStorage.setItem("bd3schools:plan:done", JSON.stringify(overrides))
      localStorage.setItem("bd3schools:plan:custom", JSON.stringify(customTasks))
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
        { id: `${n}-t`, kind: "test", title: ["Weekly model test", "সাপ্তাহিক মডেল টেস্ট"], meta: ["Full exam with a timer", "সময়সহ পূর্ণ পরীক্ষা"], done: past },
        { id: `${n}-r`, kind: "revision", title: ["Retry this week's wrong answers", "এই সপ্তাহের ভুলগুলো আবার চেষ্টা"], meta: ["About 25 minutes", "প্রায় ২৫ মিনিট"], done: past },
      ]
    } else {
      const count = planSettings.dailyHours >= 4 ? 3 : planSettings.dailyHours >= 2 ? 2 : 1
      generated = Array.from({ length: count }, (_, k) => {
        const [title, q, min] = templates[(n * 2 + k) % templates.length]
        return { id: `${n}-${k}`, kind: "mcq", title, meta: [`${q} questions · ${min} min`, `${toBn(q)}টি প্রশ্ন · ${toBn(min)} মিনিট`], done: past && (n + k) % 6 !== 0 }
      })
      if (planSettings.dailyHours >= 3) {
        generated.push({ id: `${n}-r`, kind: "revision", title: ["Retry your wrong answers", "ভুল উত্তরগুলো আবার চেষ্টা"], meta: ["About 15 minutes", "প্রায় ১৫ মিনিট"], done: past })
      }
    }
    return [...custom, ...generated].filter((t) => !overrides[`del_${t.id}`])
  }

  const isDone = (t) => overrides[t.id] ?? t.done
  const toggle = (t) => {
    const next = !isDone(t)
    setOverrides((p) => ({ ...p, [t.id]: next }))
    if (next) toast.success(L("Well done! Task finished.", "দারুণ! কাজটি সম্পন্ন হয়েছে।"))
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
    if (!newTask.title.trim()) return toast.error(L("Please write what you want to study.", "কী পড়তে চান লিখুন।"))
    const iso = toIsoDate(selDate)
    const task = {
      id: `c-${Date.now()}`,
      kind: newTask.kind,
      title: newTask.title.trim(),
      meta: ["Added by you", "আপনার যোগ করা"],
      done: false,
      isCustom: true,
    }
    setCustomTasks((p) => ({ ...p, [iso]: [task, ...(p[iso] || [])] }))
    setNewTask({ kind: "mcq", title: "" })
    setAddOpen(false)
    toast.success(L("Task added.", "কাজটি যোগ হয়েছে।"))
  }

  const saveSettings = (next) => {
    setPlanSettings(next)
    setApp({ mainExam: next.exam })
    setEditing(false)
    setWeek(weekStart(today))
    setSelDate(today)
    toast.success(planSettings.created ? L("Your routine has been updated.", "আপনার রুটিন হালনাগাদ হয়েছে।") : L("Your study routine is ready!", "আপনার পড়ার রুটিন তৈরি!"))
  }

  if (!planSettings.created || editing)
    return <PlanSetup initial={planSettings} onDone={saveSettings} onCancel={planSettings.created ? () => setEditing(false) : null} />

  const planExam = exams.find((e) => e.slug === planSettings.exam) || currentExamObj

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <PageHeader
        title={L("Study routine", "পড়ার রুটিন")}
        subtitle={L("Your plan for each day. Tick a task when you finish it.", "প্রতিদিনের পরিকল্পনা। কাজ শেষ হলে টিক দিন।")}
        action={
          <Button variant="outline" className="h-10 shrink-0 rounded-full" onClick={() => setEditing(true)}>
            <FontAwesomeIcon icon={faPen} /> <span className="hidden sm:inline">{L("Edit my plan", "পরিকল্পনা সম্পাদনা")}</span>
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
              <p className="text-2xl font-bold tabular-nums">{L(`${daysLeft} days left`, `${toBn(daysLeft)} দিন বাকি`)}</p>
              <p className="text-xs text-muted-foreground">
                {L(planExam.name, planExam.nameBn || planExam.name)} · {fmt(examDate, { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t pt-3 text-xs">
            <span className="rounded-full bg-muted px-2.5 py-1 font-medium">{L(`${planSettings.dailyHours >= 4 ? "4+" : planSettings.dailyHours} hr a day`, `দিনে ${planSettings.dailyHours >= 4 ? "৪+" : toBn(planSettings.dailyHours)} ঘণ্টা`)}</span>
            <span className="rounded-full bg-muted px-2.5 py-1 font-medium">{L(`${planSettings.studyDays.length} days a week`, `সপ্তাহে ${toBn(planSettings.studyDays.length)} দিন`)}</span>
            <button onClick={() => setEditing(true)} className="ml-auto font-semibold text-primary hover:underline">
              {L("Edit plan", "পরিকল্পনা বদলান")}
            </button>
          </div>
        </Panel>
        <Panel>
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-sm font-semibold">{L("Today's progress", "আজকের অগ্রগতি")}</p>
            <p className="text-sm text-muted-foreground">
              {L(
                <>
                  <b className="text-foreground">{todayDone}</b> of {todayTasks.length} done
                </>,
                <>
                  {toBn(todayTasks.length)}টির মধ্যে <b className="text-foreground">{toBn(todayDone)}</b>টি সম্পন্ন
                </>
              )}
            </p>
          </div>
          <Bar value={todayTasks.length ? (todayDone / todayTasks.length) * 100 : 0} tone="bg-success" />
          <p className="mt-2 text-xs text-muted-foreground">
            {todayTasks.length && todayDone === todayTasks.length ? L("All done for today 🎉", "আজকের সব কাজ শেষ 🎉") : L("Finish today's tasks to stay on track.", "লক্ষ্যে থাকতে আজকের কাজগুলো শেষ করুন।")}
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
                {L("Today", "আজ")}
              </button>
            )}
            {[
              [faChevronLeft, -7, L("Previous week", "আগের সপ্তাহ")],
              [faChevronRight, 7, L("Next week", "পরের সপ্তাহ")],
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
                <span className="text-base font-bold tabular-nums">{L(d.getDate(), toBn(d.getDate()))}</span>
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
            <h2 className="text-[1.05rem] font-semibold">{isToday ? L("Today's tasks", "আজকের কাজ") : fmt(selDate, { weekday: "long", day: "numeric", month: "long" })}</h2>
            {tasks.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {L(`${doneCount} of ${tasks.length} done`, `${toBn(tasks.length)}টির মধ্যে ${toBn(doneCount)}টি সম্পন্ন`)}
              </p>
            )}
          </div>
          <Button size="sm" variant="ghost" className="rounded-full text-primary" onClick={() => setAddOpen(true)}>
            <FontAwesomeIcon icon={faPlus} /> {L("Add task", "কাজ যোগ করুন")}
          </Button>
        </div>

        {tasks.length === 0 ? (
          <Panel className="flex flex-col items-center py-10 text-center">
            <IconBox tone="muted" className="mb-3 size-12 rounded-full">
              <FontAwesomeIcon icon={faMugHot} />
            </IconBox>
            <p className="font-semibold">{L("Rest day — nothing planned", "বিশ্রামের দিন — কোনো পরিকল্পনা নেই")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{L("Take a rest, or add something you'd like to study.", "বিশ্রাম নিন, অথবা যা পড়তে চান তা যোগ করুন।")}</p>
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
                    aria-label={done ? L("Mark as not done", "অসম্পন্ন হিসেবে চিহ্নিত করুন") : L("Mark as done", "সম্পন্ন হিসেবে চিহ্নিত করুন")}
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
                    <p className={cn("truncate text-sm font-semibold md:text-[0.95rem]", done && "line-through")}>{pick(t.title, L)}</p>
                    <p className="text-xs text-muted-foreground">
                      {L(...k.label)} · {pick(t.meta, L)}
                    </p>
                  </div>
                  {t.isCustom && (
                    <button onClick={() => removeCustom(t)} aria-label={L("Remove task", "কাজটি মুছুন")} className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive">
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    </button>
                  )}
                  {!done && (
                    <Button asChild size="sm" className="h-8 shrink-0 rounded-full px-4">
                      <Link to={k.to}>{L("Start", "শুরু")}</Link>
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
            <DialogTitle>{L("Add a task", "কাজ যোগ করুন")}</DialogTitle>
            <DialogDescription>{L("For", "তারিখ:")} {fmt(selDate, { weekday: "long", day: "numeric", month: "long" })}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">{L("What do you want to study?", "কী পড়তে চান?")}</Label>
              <Input
                id="task-title"
                placeholder={L("e.g. English synonyms", "যেমন: ইংরেজি সমার্থক শব্দ")}
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
            </div>
            <div className="space-y-2">
              <Label>{L("Type", "ধরন")}</Label>
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
                    {L(...k.label)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="flex-row gap-2">
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setAddOpen(false)}>
              {L("Cancel", "বাতিল")}
            </Button>
            <Button className="flex-1 sm:flex-none" onClick={addTask}>
              {L("Add task", "কাজ যোগ করুন")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
