import { useState } from "react"
import { Link, useParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCircleExclamation,
  faTriangleExclamation,
  faThumbsUp,
  faFlag,
  faRotateRight,
  faCircleInfo,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { PageHeader, Panel, Bar, Pill, Ring } from "@/components/shared"
import ReportDialog from "@/components/ReportDialog"
import { evaluationSample as ev, writtenQuestions } from "@/lib/data"
import { cn } from "@/lib/utils"

const modelAnswer = `ভূমিকা: প্রবাসী আয় বা রেমিট্যান্স বাংলাদেশের অর্থনীতির অন্যতম প্রধান চালিকাশক্তি।

১. বৈদেশিক মুদ্রার রিজার্ভ: রেমিট্যান্স রিজার্ভ শক্তিশালী করে আমদানি ব্যয় মেটাতে সাহায্য করে।
২. দারিদ্র্য হ্রাস ও গ্রামীণ উন্নয়ন: প্রবাসী পরিবারের আয় বাড়ে, শিক্ষা ও স্বাস্থ্যে ব্যয় বাড়ে।
৩. বিনিয়োগ ও কর্মসংস্থান: ক্ষুদ্র ব্যবসা ও আবাসনে বিনিয়োগ বাড়ে।
৪. চ্যালেঞ্জ: হুন্ডি, দক্ষতার ঘাটতি, নির্দিষ্ট দেশের ওপর নির্ভরতা।
৫. সরকারি উদ্যোগ: বৈধ পথে অর্থ পাঠাতে প্রণোদনা, দক্ষ জনশক্তি রপ্তানি।

উপসংহার: দক্ষ শ্রমিক রপ্তানি ও বৈধ চ্যানেল নিশ্চিত করলে রেমিট্যান্স টেকসই উন্নয়নে আরও বড় ভূমিকা রাখবে।`

export default function WrittenResult() {
  const { id } = useParams()
  const w = writtenQuestions.find((x) => x.id === id) || writtenQuestions[0]
  const [report, setReport] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const pct = Math.round((ev.score / ev.outOf) * 100)

  return (
    <>
      <PageHeader back="/app/written" title="AI evaluation" />

      <Panel className="mb-4">
        <p className={cn("text-sm text-muted-foreground", w.lang !== "en" && "bn")}>{w.title}</p>
        <div className="mt-4 flex items-center gap-5">
          <Ring value={pct} size={96} stroke={9} label={<span className="text-xl font-bold">{ev.score}</span>} />
          <div>
            <p className="text-3xl font-bold tracking-tight">
              {ev.score}
              <span className="text-base font-medium text-muted-foreground"> / {ev.outOf}</span>
            </p>
            <Pill tone="success" className="mt-1">Confidence: {ev.confidence}</Pill>
            <p className="mt-2 text-sm text-muted-foreground">Good structure. Add data and cover reserves to reach 16+.</p>
          </div>
        </div>
      </Panel>

      <div className="mb-4 flex gap-2.5 rounded-xl bg-info/8 p-3 text-xs leading-relaxed text-foreground/80">
        <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5 text-info" />
        AI feedback is practice guidance, not an official grade.
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-3 font-semibold">Rubric breakdown</h2>
          <div className="space-y-3">
            {ev.criteria.map((c) => {
              const p = (c.score / c.of) * 100
              return (
                <div key={c.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{c.name}</span>
                    <span className="font-semibold tabular-nums">
                      {c.score}/{c.of}
                    </span>
                  </div>
                  <Bar value={p} tone={p >= 75 ? "bg-success" : p >= 50 ? "bg-primary" : "bg-warning"} />
                </div>
              )
            })}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <FontAwesomeIcon icon={faCircleExclamation} className="text-warning" /> Missed points
            </h2>
            <ul className="bn space-y-2 text-[0.95rem]">
              {ev.missed.map((m) => (
                <li key={m} className="flex gap-2">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-warning" /> {m}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="border-destructive/30">
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-destructive" /> Check this
            </h2>
            {ev.flagged.map((f) => (
              <div key={f.text} className="bn text-[0.95rem]">
                <p className="font-medium">{f.text}</p>
                <p className="text-muted-foreground">{f.note}</p>
              </div>
            ))}
          </Panel>
          <Panel>
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <FontAwesomeIcon icon={faThumbsUp} className="text-success" /> What went well
            </h2>
            <ul className="bn space-y-1.5 text-[0.95rem]">
              {ev.strengths.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <Panel className="mt-4 p-0 md:p-0">
        <button onClick={() => setShowModel(!showModel)} className="flex w-full items-center justify-between p-4 text-left md:p-5" aria-expanded={showModel}>
          <span className="font-semibold">Improved model answer</span>
          <FontAwesomeIcon icon={faChevronDown} className={cn("text-sm text-muted-foreground transition-transform", showModel && "rotate-180")} />
        </button>
        {showModel && <p className="bn border-t p-4 text-[0.95rem] leading-relaxed whitespace-pre-line md:p-5">{modelAnswer}</p>}
      </Panel>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Button asChild className="h-12 rounded-full">
          <Link to={`/app/written/${w.id}`}>
            <FontAwesomeIcon icon={faRotateRight} /> Rewrite
          </Link>
        </Button>
        <Button variant="ghost" className="h-12 rounded-full text-muted-foreground" onClick={() => setReport(true)}>
          <FontAwesomeIcon icon={faFlag} /> Report this feedback
        </Button>
      </div>

      <p className="mt-6 text-center text-[0.7rem] text-muted-foreground">
        Model {ev.model} · prompt {ev.promptVersion} · rubric {ev.rubricVersion}
      </p>
      <ReportDialog open={report} onOpenChange={setReport} target="evaluation" />
    </>
  )
}
