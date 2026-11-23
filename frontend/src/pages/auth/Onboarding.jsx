import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faGraduationCap,
  faBuildingColumns,
  faChalkboardUser,
  faUser,
  faClipboardQuestion,
  faStar,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bar, IconBox } from "@/components/shared"
import { Icon } from "@/components/icon"
import { exams } from "@/lib/data"
import { useApp } from "@/lib/app-context"
import { authApi } from "@/lib/api"
import { cn } from "@/lib/utils"

const educations = [
  { id: "honours", label: "Bachelor's / Honours (4 years)", hint: "Eligible for BCS, Banks & NTRCA College", icon: faGraduationCap, suggest: ["bcs-general", "combined-bank"] },
  { id: "masters", label: "Master's Degree", hint: "Post-graduate candidates", icon: faGraduationCap, suggest: ["bcs-general", "bangladesh-bank"] },
  { id: "degree_pass", label: "Degree (Pass Course)", hint: "Eligible for Primary Teacher & NTRCA School", icon: faChalkboardUser, suggest: ["primary-teacher", "ntrca"] },
  { id: "other", label: "HSC or Diploma", hint: "Higher Secondary or Technical", icon: faUser, suggest: ["primary-teacher"] },
]

const AUTO_NEXT_MS = 350

function Choice({ active, onClick, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "tap flex w-full items-center gap-3 rounded-2xl border bg-card p-4 text-left transition-colors",
        active ? "border-primary bg-secondary/60 ring-1 ring-primary" : "hover:border-primary/40",
        className
      )}
    >
      {children}
      <span className={cn("ml-auto grid size-6 shrink-0 place-items-center rounded-full border text-xs", active && "border-primary bg-primary text-primary-foreground")}>
        {active && <FontAwesomeIcon icon={faCheck} />}
      </span>
    </button>
  )
}

export default function Onboarding() {
  const { set, lang } = useApp()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [furthest, setFurthest] = useState(0) // furthest step reached, so users can go forward again after going back
  const autoNext = useRef(null)
  useEffect(() => () => clearTimeout(autoNext.current), [])
  const goTo = (n) => {
    clearTimeout(autoNext.current)
    setStep(n)
    setFurthest((f) => Math.max(f, n))
    window.scrollTo({ top: 0 })
  }
  const [form, setForm] = useState({
    education: "",
    targets: [],
    main: "",
    date: "2027-03-15",
    hours: 3,
    lang,
  })
  const up = (p) => setForm((f) => ({ ...f, ...p }))

  const steps = [
    {
      title: "What's your education?",
      sub: "We'll suggest exams that fit you.",
      ok: !!form.education,
      body: (
        <div className="space-y-3">
          {educations.map((e) => (
            <Choice
              key={e.id}
              active={form.education === e.id}
              onClick={() => {
                const changed = form.education !== e.id
                up(changed ? { education: e.id, targets: e.suggest, main: e.suggest[0] } : {})
                clearTimeout(autoNext.current)
                autoNext.current = setTimeout(() => goTo(1), AUTO_NEXT_MS)
              }}
            >
              <IconBox tone="primary">
                <FontAwesomeIcon icon={e.icon} />
              </IconBox>
              <span>
                <span className="block font-semibold">{e.label}</span>
                <span className="text-sm text-muted-foreground">{e.hint}</span>
              </span>
            </Choice>
          ))}
        </div>
      ),
    },
    {
      title: "Which exams are you preparing for?",
      sub: "Pick all that apply, then tap ★ on your main target.",
      ok: form.targets.length > 0 && form.main,
      body: (
        <div className="space-y-3">
          {exams.map((e) => {
            const on = form.targets.includes(e.slug)
            return (
              <div key={e.slug} className="relative">
                <Choice
                  active={on}
                  onClick={() => {
                    const targets = on ? form.targets.filter((x) => x !== e.slug) : [...form.targets, e.slug]
                    up({ targets, main: targets.includes(form.main) ? form.main : targets[0] || "" })
                  }}
                  className="pr-24"
                >
                  <IconBox tone={e.color}>
                    <Icon name={e.icon} />
                  </IconBox>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{e.name}</span>
                    <span className="text-sm text-muted-foreground">{e.comingSoon ? "Alerts now · prep soon" : "Full preparation"}</span>
                  </span>
                </Choice>
                {on && (
                  <button
                    onClick={() => up({ main: e.slug })}
                    className={cn(
                      "absolute top-1/2 right-14 grid size-8 -translate-y-1/2 place-items-center rounded-full text-sm",
                      form.main === e.slug ? "bg-warning/20 text-[oklch(0.55_0.13_70)]" : "text-muted-foreground hover:bg-muted"
                    )}
                    aria-label={`Make ${e.name} main target`}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ),
    },
    {
      title: "Plan your preparation",
      sub: "We'll build a daily plan around this. You can change it any time.",
      ok: !!form.date,
      body: (
        <div className="space-y-6">
          <div>
            <label htmlFor="date" className="mb-2 block text-sm font-medium">Expected exam date</label>
            <Input id="date" type="date" value={form.date} onChange={(e) => up({ date: e.target.value })} className="h-12 rounded-xl text-base" />
            <p className="mt-1.5 text-xs text-muted-foreground">Not sure? Pick an estimate — we update it when the official date is announced.</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Hours you can study per day</p>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 6].map((h) => (
                <button
                  key={h}
                  onClick={() => up({ hours: h })}
                  className={cn("h-12 rounded-xl border bg-card font-semibold", form.hours === h && "border-primary bg-primary text-primary-foreground")}
                >
                  {h}{h === 6 ? "+" : ""}h
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">App language</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["bn", "বাংলা"],
                ["en", "English"],
              ].map(([v, l]) => (
                <button key={v} onClick={() => up({ lang: v })} className={cn("h-12 rounded-xl border bg-card font-semibold", form.lang === v && "border-primary bg-primary text-primary-foreground")}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Quick diagnostic test",
      sub: "25 questions, about 15 minutes. It sets your starting level in each subject so your plan fits you.",
      ok: true,
      body: (
        <div className="rounded-2xl border bg-card p-5 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-2xl text-primary">
            <FontAwesomeIcon icon={faClipboardQuestion} />
          </div>
          <p className="mt-4 font-semibold">{exams.find((e) => e.slug === form.main)?.name} diagnostic</p>
          <ul className="mx-auto mt-3 max-w-xs space-y-1.5 text-left text-sm text-muted-foreground">
            <li>• No negative marking</li>
            <li>• Covers every subject in the syllabus</li>
            <li>• You can pause and continue later</li>
          </ul>
        </div>
      ),
    },
  ]

  const s = steps[step]
  const done = (diag) => {
    const mainExam = form.main || "bcs-general"
    set({ followed: form.targets, mainExam, lang: form.lang })
    authApi
      .updateMe({ main_exam: mainExam })
      .then(({ data }) => set({ user: data }))
      .catch(() => {})
    try {
      // Pre-fill the Study routine so users don't answer the same questions twice.
      const hours = Math.min(4, form.hours)
      localStorage.setItem(
        "prostuti:plan:settings",
        JSON.stringify({ exam: mainExam, targetDate: form.date, dailyHours: hours, studyDays: [6, 0, 1, 2, 3, 4, 5], created: true })
      )
    } catch {}
    nav(diag ? "/app/practice/session?mode=diagnostic" : "/app", { replace: true })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="pt-safe sticky top-0 z-10 bg-background">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
          <button
            onClick={() => (step ? goTo(step - 1) : nav("/"))}
            className="-ml-2 grid size-10 place-items-center rounded-full hover:bg-muted"
            aria-label="Previous step"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <Bar value={((step + 1) / steps.length) * 100} className="flex-1" />
          <span className="text-sm text-muted-foreground tabular-nums">
            {step + 1}/{steps.length}
          </span>
          <button
            onClick={() => goTo(step + 1)}
            disabled={step >= steps.length - 1 || step >= furthest || !s.ok}
            className="-mr-2 grid size-10 place-items-center rounded-full hover:bg-muted disabled:pointer-events-none disabled:opacity-0"
            aria-label="Next step"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 pt-4 pb-32">
        <h1 className="text-2xl font-bold tracking-tight">{s.title}</h1>
        <p className="mt-1 mb-6 text-muted-foreground">{s.sub}</p>
        {s.body}
      </main>

      <footer className="pb-safe fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg gap-3 p-4">
          {step === steps.length - 1 ? (
            <>
              <Button variant="outline" className="h-12 flex-1 rounded-full" onClick={() => done(false)}>
                Later
              </Button>
              <Button className="h-12 flex-[2] rounded-full text-base" onClick={() => done(true)}>
                Start diagnostic
              </Button>
            </>
          ) : (
            <Button className="h-12 w-full rounded-full text-base" disabled={!s.ok} onClick={() => goTo(step + 1)}>
              Continue
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}
