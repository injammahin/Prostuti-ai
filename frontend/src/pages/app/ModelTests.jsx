import { useState, useEffect } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faClock,
  faMinus,
  faTrophy,
  faUsers,
  faPlay,
  faLandmark,
  faUserGraduate,
  faChalkboardUser,
  faBuildingColumns,
  faCalculator,
  faFlask,
  faArrowRight,
  faBookOpen,
  faCircleCheck,
  faCircleInfo,
  faBolt,
  faCheck,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader, HeroCard, Pill, IconBox } from "@/components/shared"
import { useApp } from "@/lib/app-context"
import { modelTestsList, exams } from "@/lib/data"
import { cn } from "@/lib/utils"

const iconMap = {
  landmark: faLandmark,
  "user-graduate": faUserGraduate,
  "chalkboard-user": faChalkboardUser,
  "building-columns": faBuildingColumns,
  calculator: faCalculator,
  flask: faFlask,
}

const syllabusMap = {
  "bcs-prelim-full": {
    examName: "BCS General Preliminary",
    syllabus: [
      { name: "Bangla Literature & Grammar", marks: 35 },
      { name: "English Language & Literature", marks: 35 },
      { name: "Bangladesh Affairs", marks: 30 },
      { name: "International Affairs", marks: 20 },
      { name: "Mathematical Reasoning", marks: 15 },
      { name: "Mental Ability", marks: 15 },
      { name: "General Science", marks: 15 },
      { name: "Computer & ICT", marks: 15 },
      { name: "Geography & Disaster", marks: 10 },
      { name: "Ethics & Good Governance", marks: 10 },
    ],
    difficulty: "Challenging",
    cutoff: "~112 - 118",
    attempts: "14,290",
  },
  "ntrca-prelim-full": {
    examName: "19th NTRCA Teacher Registration",
    syllabus: [
      { name: "Bengali Language & Grammar", marks: 25 },
      { name: "English Language & Grammar", marks: 25 },
      { name: "General Mathematics", marks: 25 },
      { name: "General Knowledge (BD & Intl)", marks: 25 },
    ],
    difficulty: "Standard",
    cutoff: "40 (Qualifying)",
    attempts: "8,940",
  },
  "primary-teacher-full": {
    examName: "Primary Assistant Teacher",
    syllabus: [
      { name: "Bangla", marks: 20 },
      { name: "English", marks: 20 },
      { name: "Mathematics", marks: 20 },
      { name: "General Knowledge & Science", marks: 20 },
    ],
    difficulty: "Standard",
    cutoff: "~58 - 64",
    attempts: "11,810",
  },
  "combined-bank-full": {
    examName: "Combined 9 Banks Senior Officer",
    syllabus: [
      { name: "English", marks: 20 },
      { name: "Bangla", marks: 20 },
      { name: "Quantitative Mathematics", marks: 30 },
      { name: "General Knowledge", marks: 20 },
      { name: "Computer & ICT", marks: 10 },
    ],
    difficulty: "Challenging",
    cutoff: "~65 - 70",
    attempts: "7,450",
  },
  "bangladesh-bank-full": {
    examName: "Bangladesh Bank Assistant Director (General)",
    syllabus: [
      { name: "Advanced English", marks: 25 },
      { name: "Quantitative & Analytical Math", marks: 30 },
      { name: "Bangla Comprehension & Grammar", marks: 15 },
      { name: "Banking & Financial Systems", marks: 15 },
      { name: "ICT & Computing", marks: 15 },
    ],
    difficulty: "Challenging",
    cutoff: "~68 - 72",
    attempts: "6,120",
  },
  "mini-bank-math": {
    examName: "Combined Bank Speed Drill",
    syllabus: [
      { name: "Time, Speed & Distance", marks: 8 },
      { name: "Pipes & Cisterns", marks: 6 },
      { name: "Profit, Loss & Interest", marks: 8 },
      { name: "Algebra & Number Systems", marks: 8 },
    ],
    difficulty: "Challenging",
    cutoff: "~22 / 30",
    attempts: "4,320",
  },
  "mini-primary-bangla": {
    examName: "Primary Assistant Teacher Mini",
    syllabus: [
      { name: "Bangla Grammar & Sandhi", marks: 20 },
      { name: "Arithmetic & Geometry", marks: 20 },
    ],
    difficulty: "Easy",
    cutoff: "~32 / 40",
    attempts: "5,190",
  },
  "mini-ntrca-gk": {
    examName: "19th NTRCA Speed Practice",
    syllabus: [
      { name: "Bangladesh Affairs", marks: 20 },
      { name: "International & Current Events", marks: 15 },
      { name: "Elementary Mathematics", marks: 15 },
    ],
    difficulty: "Standard",
    cutoff: "~38 / 50",
    attempts: "3,880",
  },
  "mini-bcs-science": {
    examName: "BCS General Science & ICT",
    syllabus: [
      { name: "General Science (Physics/Chem/Bio)", marks: 15 },
      { name: "Computer & Information Tech", marks: 15 },
    ],
    difficulty: "Standard",
    cutoff: "~22 / 30",
    attempts: "6,740",
  },
}

const history = [
  {
    title: "BCS Preliminary Full Model Test #7",
    exam: "BCS General",
    date: "18 Nov",
    score: 124.5,
    of: 200,
    percentage: 62.2,
    rank: "1,204 / 8,930",
    percentile: "86.5%",
    status: "Passed cut-off",
  },
  {
    title: "Combined Bank Quantitative Math Drill",
    exam: "Combined Banks",
    date: "15 Nov",
    score: 24.5,
    of: 30,
    percentage: 81.6,
    rank: "312 / 4,110",
    percentile: "92.4%",
    status: "Excellent",
  },
  {
    title: "19th NTRCA Full Model Test #2",
    exam: "NTRCA",
    date: "11 Nov",
    score: 68.5,
    of: 100,
    percentage: 68.5,
    rank: "580 / 6,410",
    percentile: "90.9%",
    status: "Qualified",
  },
  {
    title: "Primary Assistant Teacher Quick Test",
    exam: "Primary",
    date: "8 Nov",
    score: 32,
    of: 40,
    percentage: 80.0,
    rank: "410 / 5,200",
    percentile: "92.1%",
    status: "Qualified",
  },
]

export default function ModelTests() {
  const { mainExam } = useApp()
  const [selectedExam, setSelectedExam] = useState("all")
  const [activeModalTest, setActiveModalTest] = useState(null)
  const [isRegisteredLive, setIsRegisteredLive] = useState(false)

  // Countdown timer for live national mock
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 3, mins: 14, secs: 50 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 }
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleRegisterLive = () => {
    setIsRegisteredLive((prev) => {
      const next = !prev
      if (next) {
        toast.success("You have joined Friday's live test!", {
          description: "We will remind you 15 minutes before 8:00 PM.",
        })
      } else {
        toast.info("Registration cancelled.")
      }
      return next
    })
  }

  // Filter tests
  const filtered = modelTestsList.filter((t) => selectedExam === "all" || t.exam === selectedExam)

  // Prioritize user's main target exam
  const sorted = [...filtered].sort((a, b) => (b.exam === mainExam) - (a.exam === mainExam))

  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader title="Model tests" subtitle="Full exams with a timer, just like the real one." className="mb-0 md:mb-0" />

      {/* Live weekly test */}
      <HeroCard className="p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[0.7rem] font-semibold">
              <span className="size-1.5 animate-pulse rounded-full bg-glow" />
              Free live test · Friday 8:00 PM
            </span>
            <h2 className="mt-2 text-lg font-bold md:text-2xl">Weekly model test</h2>
            <p className="mt-0.5 text-sm text-white/80">
              Starts in{" "}
              <b className="font-semibold text-white tabular-nums">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m
              </b>{" "}
              · 9,412 joined
            </p>
          </div>
          <Button
            onClick={handleRegisterLive}
            className={cn(
              "h-10 shrink-0 rounded-full px-5 font-semibold",
              isRegisteredLive ? "border border-white/30 bg-white/15 text-white hover:bg-white/25" : "bg-white text-primary hover:bg-white/90"
            )}
          >
            <FontAwesomeIcon icon={isRegisteredLive ? faCheck : faBolt} />
            {isRegisteredLive ? "You're in" : "Join free"}
          </Button>
        </div>
      </HeroCard>

      {/* Exam filter */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {[{ slug: "all", name: "All exams" }, ...exams].map((ex) => (
          <button
            key={ex.slug}
            onClick={() => setSelectedExam(ex.slug)}
            className={cn(
              "h-9 shrink-0 rounded-full px-4 text-xs font-semibold whitespace-nowrap transition-colors",
              selectedExam === ex.slug ? "bg-primary text-primary-foreground" : "border bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* Tests */}
      <div className="grid gap-3 md:grid-cols-2 md:gap-4 2xl:grid-cols-3">
        {sorted.map((t) => {
          const icon = iconMap[t.icon] || faLandmark
          const meta = syllabusMap[t.id] || { syllabus: [] }
          const examName = exams.find((e) => e.slug === t.exam)?.name || t.exam
          const isUserMain = t.exam === mainExam
          return (
            <div key={t.id} className="card flex flex-col p-4">
              <div className="flex items-start gap-3">
                <IconBox tone={t.tone} className="size-10 rounded-xl">
                  <FontAwesomeIcon icon={icon} />
                </IconBox>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] font-semibold text-muted-foreground">
                    {examName}
                    {isUserMain && <span className="ml-1.5 rounded bg-secondary px-1.5 py-px text-primary">Your exam</span>}
                  </p>
                  <h3 className="mt-0.5 leading-snug font-semibold">{t.title}</h3>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                <span className="rounded-full bg-muted px-2.5 py-1">
                  <FontAwesomeIcon icon={faClock} className="mr-1 text-muted-foreground" />
                  {t.time}
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1">{t.marks} marks</span>
                <span className="rounded-full bg-muted px-2.5 py-1">−{t.negative} for a wrong answer</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button asChild className="h-10 flex-1 rounded-full font-semibold">
                  <Link to={`/app/test/run?test=${t.id}`}>
                    <FontAwesomeIcon icon={faPlay} className="text-xs" /> Start test
                  </Link>
                </Button>
                {meta.syllabus.length > 0 && (
                  <Button variant="outline" className="h-10 rounded-full px-4" onClick={() => setActiveModalTest({ ...t, meta })}>
                    What's inside
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Past attempts */}
      <section className="space-y-3 pt-1">
        <h2 className="text-[1.05rem] font-semibold">Your past tests</h2>
        <div className="card divide-y overflow-hidden">
          {history.map((h) => (
            <Link key={h.title} to="/app/test/result" className="flex items-center gap-3 p-3.5 transition-colors hover:bg-muted/40 md:p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{h.title}</p>
                <p className="text-xs text-muted-foreground">
                  {h.exam} · {h.date}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold tabular-nums">
                  {h.score}
                  <span className="text-xs font-normal text-muted-foreground">/{h.of}</span>
                </p>
                <p className="text-[0.7rem] font-medium text-success">{Math.round(h.percentage)}%</p>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* Syllabus Modal */}
      {activeModalTest && (
        <Dialog open={!!activeModalTest} onOpenChange={() => setActiveModalTest(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Pill tone="primary" className="text-[10px] uppercase font-bold">
                  {activeModalTest.exam}
                </Pill>
                <span className="text-xs text-muted-foreground">Official format</span>
              </div>
              <DialogTitle className="text-lg">{activeModalTest.title}</DialogTitle>
              <DialogDescription className="text-xs">
                {activeModalTest.summary}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-secondary/50 p-3 text-center border">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total marks</p>
                  <p className="text-base font-bold text-foreground">{activeModalTest.marks}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Duration</p>
                  <p className="text-base font-bold text-foreground">{activeModalTest.time}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Negative</p>
                  <p className="text-base font-bold text-destructive">-{activeModalTest.negative}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Marks for each subject
                </h4>
                <div className="divide-y rounded-xl border bg-card">
                  {activeModalTest.meta?.syllabus.map((s) => (
                    <div key={s.name} className="flex items-center justify-between px-3 py-2 text-xs">
                      <span className="font-medium text-foreground">{s.name}</span>
                      <span className="font-semibold text-primary">{s.marks} marks</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground border">
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5 text-primary" />
                  <span>
                    The timer starts as soon as you begin. You can go back and change answers before you submit.
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" size="sm" onClick={() => setActiveModalTest(null)} className="rounded-full">
                Close
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full font-semibold gap-1.5"
                onClick={() => setActiveModalTest(null)}
              >
                <Link to={`/app/test/run?test=${activeModalTest.id}`}>
                  <FontAwesomeIcon icon={faPlay} className="text-xs" />
                  Start test
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
