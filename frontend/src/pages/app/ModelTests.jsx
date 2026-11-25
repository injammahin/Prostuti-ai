import { useState, useEffect, useMemo } from "react"
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
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EmptyState, PageHeader, HeroCard, Pill, IconBox } from "@/components/shared"
import { useApp } from "@/lib/app-context"
import { useApi } from "@/lib/use-api"
import { modelTestsApi } from "@/lib/api"
import { exams } from "@/lib/data"
import { examOfTest, testsForExam } from "@/lib/exam-tests"
import { examName } from "@/lib/format"
import { cn } from "@/lib/utils"

const iconMap = {
  "bcs-general": faLandmark,
  primary: faChalkboardUser,
  bank: faBuildingColumns,
  ntrca: faUserGraduate,
  math: faCalculator,
}

export default function ModelTests() {
  const { L, num, mainExam } = useApp()
  const examInfo = exams.find((e) => e.slug === mainExam) || exams[0]
  const { data, loading, error, reload } = useApi(() => modelTestsApi.list(), [], { key: "model-tests-list" })

  const [activeModalTest, setActiveModalTest] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bd3schools:past_tests")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed)
        }
      }
    } catch {}
  }, [])

  const allTests = useMemo(() => data?.model_tests ?? [], [data])

  const tests = useMemo(() => testsForExam(allTests, mainExam), [allTests, mainExam])
  const bcsFeatured = tests.find((t) => t.type === "full") || tests[0]
  const examHistory = history.filter((h) => (h.examSlug || "bcs-general") === mainExam)

  return (
    <div className="space-y-6">
      <PageHeader
        title={L("Model tests", "মডেল টেস্ট")}
        subtitle={L(
          `Model tests for ${examInfo.name}, with the real time limit and negative marking.`,
          `${examInfo.nameBn}: আসল সময় ও নেগেটিভ মার্কিংসহ মডেল টেস্ট।`
        )}
      />

      {/* Featured Model Test */}
      {bcsFeatured && (
        <HeroCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                  <span className="size-1.5 rounded-full bg-glow" />
                  {L(`${bcsFeatured.questions_count} questions`, `${num(bcsFeatured.questions_count)}টি প্রশ্ন`)}
                </span>
                <span className="text-xs text-white/80">
                  {L(examInfo.name, examInfo.nameBn)}
                </span>
              </div>
              <h2 className="text-xl font-bold md:text-2xl">{L(bcsFeatured.title, bcsFeatured.title_bn)}</h2>
              <p className="text-sm text-white/85">
                {bcsFeatured.duration} · {num(bcsFeatured.marks)} {L("marks", "নম্বর")} · -{bcsFeatured.negative} {L("for a wrong answer", "ভুল উত্তরের জন্য")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                onClick={() => setActiveModalTest(bcsFeatured)}
              >
                {L("What's inside", "সিলেবাস দেখুন")}
              </Button>
              <Button
                asChild
                className="rounded-full bg-white font-semibold text-primary hover:bg-white/90"
              >
                <Link to={`/app/model-test/run?test=${bcsFeatured.id}`}>
                  <FontAwesomeIcon icon={faPlay} className="text-xs mr-1.5" />
                  {L("Start test", "টেস্ট শুরু করুন")}
                </Link>
              </Button>
            </div>
          </div>
        </HeroCard>
      )}

      {!loading && tests.length === 0 && (
        <EmptyState
          icon={<FontAwesomeIcon icon={faBookOpen} />}
          title={error ? L("Couldn't load the model tests", "মডেল টেস্ট লোড করা যায়নি") : L("No model test for this exam yet", "এই পরীক্ষার মডেল টেস্ট এখনো নেই")}
          text={L("Meanwhile, sit a full BCS paper as a timed exam.", "এর মধ্যে সময় ধরে বিসিএসের পুরো প্রশ্নপত্রে পরীক্ষা দিতে পারেন।")}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {error && (
                <Button variant="outline" className="rounded-full" onClick={reload}>
                  {L("Try again", "আবার চেষ্টা করুন")}
                </Button>
              )}
              <Button asChild className="rounded-full">
                <Link to="/app/bcs-papers">{L("BCS papers", "বিসিএস প্রশ্নপত্র")}</Link>
              </Button>
            </div>
          }
        />
      )}

      {/* Tests Grid */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => {
          const icon = iconMap[test.exam] || faLandmark
          return (
            <div
              key={test.id}
              className="card flex flex-col justify-between p-4.5 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div>
                {/* Badges Bar matching user's reference */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 font-medium">
                    <FontAwesomeIcon icon={faClock} className="text-[10px] text-muted-foreground" />
                    {test.duration}
                  </span>
                  <span className="rounded bg-secondary px-2 py-0.5 font-medium">
                    {num(test.marks)} {L("marks", "নম্বর")}
                  </span>
                  <span className="rounded bg-secondary px-2 py-0.5 font-medium text-destructive">
                    -{test.negative} {L("for a wrong answer", "ভুল উত্তরের জন্য")}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      {examName(exams.find((e) => e.slug === examOfTest(test.id, test.exam)))}
                    </p>
                    <h3 className="text-sm font-bold leading-snug line-clamp-2 mt-0.5">
                      {L(test.title, test.title_bn)}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Action Buttons matching screenshot */}
              <div className="mt-5 flex items-center justify-between gap-2 border-t pt-3">
                <Button
                  asChild
                  size="sm"
                  className="flex-1 rounded-full font-semibold gap-1.5"
                >
                  <Link to={`/app/model-test/run?test=${test.id}`}>
                    <FontAwesomeIcon icon={faPlay} className="text-[10px]" />
                    {L("Start test", "পরীক্ষা শুরু")}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setActiveModalTest(test)}
                >
                  {L("What's inside", "সিলেবাস")}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Past attempts table matching reference */}
      {examHistory.length > 0 && (
        <section className="space-y-3 pt-2">
          <h2 className="text-[1.05rem] font-bold">{L("Your past tests", "আপনার পূর্ববর্তী টেস্ট")}</h2>
          <div className="card divide-y overflow-hidden">
            {examHistory.map((h, idx) => (
              <div
                key={h.id + idx}
                className="flex items-center gap-3 p-3.5 transition-colors hover:bg-muted/40 md:p-4"
              >
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
                  <p className="text-[0.7rem] font-bold text-success">{Math.round(h.percentage)}%</p>
                </div>
                <Button asChild variant="ghost" size="icon" className="size-8 rounded-full">
                  <Link to={`/app/model-test/result?test=${h.id}`}>
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs text-muted-foreground" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Syllabus Modal */}
      {activeModalTest && (
        <Dialog open={!!activeModalTest} onOpenChange={() => setActiveModalTest(null)}>
          <DialogContent className="w-[calc(100vw-2.5rem)] max-w-[calc(100vw-2.5rem)] sm:w-full sm:max-w-md rounded-2xl p-5 sm:p-6 max-h-[85dvh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Pill tone="primary" className="text-[10px] uppercase font-bold">
                  {activeModalTest.exam}
                </Pill>
                <span className="text-xs text-muted-foreground">Standard Syllabus</span>
              </div>
              <DialogTitle className="text-lg font-bold">
                {L(activeModalTest.title, activeModalTest.title_bn)}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {L(
                  "Real exam simulation with official marks distribution, real time limit, and negative marking.",
                  "আসল পরীক্ষার সময়সীমা ও নেগেটিভ মার্কিংসহ নির্ভুল সিলেবাস বণ্টন।"
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-secondary/60 p-3 text-center border">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total marks</p>
                  <p className="text-base font-bold text-foreground">{activeModalTest.marks}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Duration</p>
                  <p className="text-base font-bold text-foreground">{activeModalTest.duration}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Negative</p>
                  <p className="text-base font-bold text-destructive">-{activeModalTest.negative}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Marks for each subject ({activeModalTest.syllabus?.length || 0} subjects)
                </h4>
                <div className="max-h-56 divide-y rounded-xl border bg-card overflow-y-auto">
                  {activeModalTest.syllabus?.map((s) => (
                    <div key={s.name} className="flex items-center justify-between px-3.5 py-2 text-xs">
                      <span className="font-medium text-foreground">{s.name_bn || s.name}</span>
                      <span className="font-semibold text-primary">{s.marks || s.count} marks</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground border">
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5 text-primary" />
                  <span>
                    The timer starts as soon as you begin. You can jump between questions and review or change answers anytime before submitting.
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
                <Link to={`/app/model-test/run?test=${activeModalTest.id}`}>
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
