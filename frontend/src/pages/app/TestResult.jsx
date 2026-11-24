import { useState, useEffect, useMemo } from "react"
import { Link, useLocation } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faRankingStar,
  faChevronDown,
  faCircleCheck,
  faCircleXmark,
  faCircleMinus,
  faRotateRight,
  faArrowLeft,
  faCheck,
  faClock,
  faBrain,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { PageHeader, Panel, Bar, SectionTitle, Pill, accuracyTone } from "@/components/shared"
import { modelTestsApi } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function TestResult() {
  const { state } = useLocation()
  const testId = state?.testId || "bcs-prelim-model-test-1"
  const testTitle = state?.testTitle || "BCS Preliminary Full Model Test"
  const negativeMark = state?.negative !== undefined ? state.negative : 0.5
  const usedSeconds = state?.used || 0
  const questions = state?.questions || []
  const answers = state?.answers || {}

  // Calculate grading
  const { right, wrong, skipped, score, maxMarks, pct, rows, bySubject } = useMemo(() => {
    if (!questions || questions.length === 0) {
      return {
        right: 0,
        wrong: 0,
        skipped: 0,
        score: 0,
        maxMarks: 200,
        pct: 0,
        rows: [],
        bySubject: [],
      }
    }

    const evaluatedRows = questions.map((q, idx) => {
      const qKey = q.id || q.number
      const chosen = answers[qKey]
      const correct = q.answer !== undefined ? q.answer : (q.answer_index !== undefined ? q.answer_index : 0)
      const isSkip = chosen === undefined
      const isOk = !isSkip && chosen === correct
      const isWrong = !isSkip && chosen !== correct

      return {
        q,
        number: idx + 1,
        chosen,
        correct,
        isOk,
        isWrong,
        isSkip,
        subject: q.subject?.name || q.subject_name || q.subject || "General",
        subject_bn: q.subject?.name_bn || q.subject_name_bn || "",
      }
    })

    const r = evaluatedRows.filter((row) => row.isOk).length
    const w = evaluatedRows.filter((row) => row.isWrong).length
    const s = evaluatedRows.filter((row) => row.isSkip).length
    const totalM = state?.totalMarks || questions.length
    const net = Math.max(0, r - w * negativeMark)
    const percentage = Math.round((net / totalM) * 100)

    // Subject breakdown
    const subMap = {}
    evaluatedRows.forEach((row) => {
      const sub = row.subject
      if (!subMap[sub]) {
        subMap[sub] = {
          name: sub,
          name_bn: row.subject_bn,
          right: 0,
          wrong: 0,
          total: 0,
        }
      }
      subMap[sub].total++
      if (row.isOk) subMap[sub].right++
      if (row.isWrong) subMap[sub].wrong++
    })

    return {
      right: r,
      wrong: w,
      skipped: s,
      score: net,
      maxMarks: totalM,
      pct: percentage,
      rows: evaluatedRows,
      bySubject: Object.values(subMap),
    }
  }, [questions, answers, negativeMark, state?.totalMarks])

  // Save to recent attempts history
  useEffect(() => {
    try {
      const record = {
        id: testId,
        title: testTitle,
        exam: "BCS General",
        date: "Today",
        score: Math.round(score * 10) / 10,
        of: maxMarks,
        percentage: pct,
        timestamp: Date.now(),
      }

      const raw = localStorage.getItem("bd3schools:past_tests")
      let list = []
      if (raw) {
        try {
          list = JSON.parse(raw)
        } catch {}
      }
      if (!Array.isArray(list)) list = []
      list = [record, ...list.filter((x) => x.id !== testId || Date.now() - x.timestamp > 300000)].slice(0, 10)
      localStorage.setItem("bd3schools:past_tests", JSON.stringify(list))

      // Also notify backend API asynchronously
      if (testId) {
        modelTestsApi.submit(testId, answers, usedSeconds).catch(() => {})
      }
    } catch {}
  }, [testId, testTitle, score, maxMarks, pct, answers, usedSeconds])

  const timeUsedFormatted = useMemo(() => {
    const m = Math.floor(usedSeconds / 60)
    const s = usedSeconds % 60
    return `${m}m ${s}s`
  }, [usedSeconds])

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-12">
      <PageHeader
        back="/app/test"
        title="Test Result"
        subtitle={`${testTitle} · Real Exam Simulation · Negative marking: -${negativeMark}`}
      />

      {/* Primary Score Panel */}
      <Panel className="p-5 md:p-6 shadow-sm border-primary/20 bg-gradient-to-br from-card via-card to-primary/3">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Net Score</p>
            <p className="text-4xl md:text-5xl font-black tracking-tight text-foreground mt-0.5">
              {score.toFixed(1)}
              <span className="text-xl font-medium text-muted-foreground">/{maxMarks}</span>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Pill tone={pct >= 60 ? "success" : "warning"} className="font-bold">
                {pct}% · {pct >= 60 ? "Above Preliminary Cut-off" : "Needs Revision"}
              </Pill>
              <span className="text-xs text-muted-foreground">
                <FontAwesomeIcon icon={faClock} className="mr-1 text-[10px]" />
                {timeUsedFormatted}
              </span>
            </div>
          </div>

          <div className="grid w-full flex-1 grid-cols-3 gap-2 text-center max-w-sm">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{right}</p>
              <p className="text-[11px] font-semibold text-muted-foreground">Correct (+{right})</p>
            </div>
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3">
              <p className="text-xl font-bold text-destructive">{wrong}</p>
              <p className="text-[11px] font-semibold text-muted-foreground">Wrong (−{(wrong * negativeMark).toFixed(2)})</p>
            </div>
            <div className="rounded-xl border bg-muted/60 p-3">
              <p className="text-xl font-bold text-foreground">{skipped}</p>
              <p className="text-[11px] font-semibold text-muted-foreground">Skipped</p>
            </div>
          </div>
        </div>
      </Panel>

      {/* Merit & Recommendation Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel className="flex items-center gap-3.5 p-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <FontAwesomeIcon icon={faRankingStar} className="text-xl" />
          </div>
          <div>
            <p className="font-bold text-sm">
              {score >= 135
                ? "Simulated Merit: Top 5% · Excellent"
                : score >= 115
                ? "Simulated Merit: Top 15% · Safe Cutoff"
                : "Simulated Merit: Top 40% · Borderline"}
            </p>
            <p className="text-xs text-muted-foreground">
              {score >= 115
                ? "High qualification probability for BPSC BCS Preliminary."
                : "Aim for 120+ by reducing negative deductions in weak areas."}
            </p>
          </div>
        </Panel>

        <Panel className="flex items-center gap-3.5 p-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <FontAwesomeIcon icon={faBrain} className="text-xl" />
          </div>
          <div>
            <p className="font-bold text-sm">
              Negative Penalty: -{(wrong * negativeMark).toFixed(2)} marks
            </p>
            <p className="text-xs text-muted-foreground">
              {wrong > 25
                ? "High negative marking detected. Avoid blind guesses without eliminating 2 options."
                : "Good negative mark control! Keep practicing timed speed drills."}
            </p>
          </div>
        </Panel>
      </div>

      {/* Subject-Wise Performance Breakdown */}
      {bySubject.length > 0 && (
        <section className="space-y-3 pt-2">
          <SectionTitle title="Subject Performance Breakdown" />
          <Panel className="p-4.5 space-y-3.5">
            {bySubject.map((s) => {
              const accuracy = s.total > 0 ? Math.round((s.right / s.total) * 100) : 0
              return (
                <div key={s.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">
                      {s.name_bn || s.name}
                    </span>
                    <span className="tabular-nums font-semibold text-muted-foreground">
                      {s.right}/{s.total} correct ({accuracy}%)
                    </span>
                  </div>
                  <Bar value={accuracy} tone={accuracyTone(accuracy)} />
                </div>
              )
            })}
          </Panel>
        </section>
      )}

      {/* Detailed Question Review */}
      <section className="space-y-3 pt-2">
        <SectionTitle title={`Detailed Question Review (${rows.length} Questions)`} />
        <div className="space-y-3">
          {rows.map(({ q, number, chosen, correct, isOk, isWrong, isSkip }) => (
            <Panel key={q.id || number} className="p-4 border transition-all hover:border-primary/30">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold shadow-xs",
                    isOk
                      ? "bg-emerald-600 text-white"
                      : isWrong
                      ? "bg-destructive text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isOk ? (
                    <FontAwesomeIcon icon={faCircleCheck} />
                  ) : isWrong ? (
                    <FontAwesomeIcon icon={faCircleXmark} />
                  ) : (
                    <FontAwesomeIcon icon={faCircleMinus} />
                  )}
                </span>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <Pill tone="primary" className="text-[10px]">
                      {q.subject?.name_bn || q.subject?.name || q.subject_name || "General"}
                    </Pill>
                    <span className="text-muted-foreground font-semibold">Q{number}</span>
                    {q.topic && (
                      <span className="text-muted-foreground">· {q.topic}</span>
                    )}
                  </div>

                  <p className={cn("text-sm font-semibold text-foreground leading-relaxed", q.lang !== "en" && "bn")}>
                    {q.body}
                  </p>

                  {/* Options Review */}
                  <div className="grid gap-1.5 pt-1 text-xs">
                    {q.options?.map((opt, oIdx) => {
                      const isCorrectOpt = oIdx === correct
                      const isUserChoice = oIdx === chosen

                      let style = "border-border bg-card text-foreground"
                      if (isCorrectOpt) {
                        style = "border-emerald-500/40 bg-emerald-500/10 font-bold text-emerald-700 dark:text-emerald-400"
                      } else if (isUserChoice && !isCorrectOpt) {
                        style = "border-destructive/40 bg-destructive/10 font-bold text-destructive"
                      }

                      return (
                        <div
                          key={oIdx}
                          className={cn("flex items-center justify-between rounded-lg border px-3 py-2", style)}
                        >
                          <span>{opt}</span>
                          {isCorrectOpt && (
                            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                              ✓ Correct Answer
                            </span>
                          )}
                          {isUserChoice && !isCorrectOpt && (
                            <span className="text-[10px] uppercase font-bold text-destructive">
                              ✗ Your Choice
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {isSkip && (
                    <p className="text-xs text-muted-foreground italic pt-1">
                      You skipped this question.
                    </p>
                  )}

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="mt-2 rounded-xl bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground border">
                      <b className="text-foreground">ব্যাখ্যা:</b> {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      {/* Retake and Action Bar */}
      <div className="sticky bottom-4 z-10 flex items-center justify-center gap-3 pt-4">
        <Button asChild variant="outline" className="rounded-full px-6 shadow-sm bg-background">
          <Link to="/app/test">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5 text-xs" />
            Back to Model Tests
          </Link>
        </Button>
        <Button asChild className="rounded-full px-6 font-bold shadow-sm">
          <Link to={`/app/test/run?test=${testId}`}>
            <FontAwesomeIcon icon={faRotateRight} className="mr-1.5 text-xs" />
            Retake Test
          </Link>
        </Button>
      </div>
    </div>
  )
}
