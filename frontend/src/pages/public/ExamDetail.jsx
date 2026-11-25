import { useState } from "react"
import { Link, useParams } from "react-router"
import { toast } from "sonner"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faCheck, faArrowRight, faFileLines, faHourglassHalf } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Crumbs, PageHeader, IconBox, Pill, Panel, NoticeCard, Segmented, EmptyState } from "@/components/shared"
import ExamFormat from "@/components/ExamFormat"
import { Icon } from "@/components/icon"
import { exams, notices } from "@/lib/data"
import { td } from "@/lib/format"
import { useApp } from "@/lib/app-context"
import { useSeo } from "@/lib/seo"
import NotFound from "@/pages/NotFound"
import { useNoticesVersion } from "@/lib/notices-store"

const sampleTopics = {
  Bangla: ["ভাষা ও ব্যাকরণ", "প্রাচীন ও মধ্যযুগের সাহিত্য", "আধুনিক যুগের সাহিত্য"],
  Bengali: ["ব্যাকরণ ও ধ্বনিতত্ত্ব", "সমাস, সন্ধি ও কারক", "বাংলা সাহিত্য ও রচয়িতা"],
  English: ["Grammar & usage", "Advanced vocabulary & idioms", "Comprehension & correction"],
  "Bangladesh Affairs": ["History & Liberation War 1971", "Constitution of Bangladesh", "National economy, budget & reserves", "Culture & geography"],
  "International Affairs": ["International organisations (UN, WB, IMF)", "Geopolitics & treaties", "Global economy & trade blocs"],
  "General Mathematics": ["Arithmetic (Unitary, Profit-Loss, Percentage)", "Algebra & Formulas", "Geometry & Trigonometry"],
  "Mathematics": ["Basic arithmetic & averages", "LCM & HCF", "Fractions, prime numbers & geometry"],
  "Quantitative Aptitude & Mathematics": ["Time & Work, Pipes & Cisterns", "Interest (Simple & Compound)", "Speed, Time & Distance", "Permutation & Probability"],
  "Quantitative & Analytical Reasoning": ["Higher algebra & inequalities", "Probability & combinations", "Data sufficiency & logical reasoning"],
  "Computer & ICT": ["Computer architecture & memory", "Networking & protocols (HTTP, TCP/IP)", "Cybersecurity & cryptography", "Spreadsheets & databases"],
  "Banking & Economics": ["Central banking operations & monetary policy", "Commercial banking system & Basel III", "Inflation, GDP & foreign exchange reserves"],
  "General Science": ["Everyday science & physics", "Chemistry & elements", "Biology, human physiology & vitamins"],
  "General Knowledge": ["National affairs & Bangabandhu", "International events & capitals", "Science, sports & awards"],
}

/** The page with each exam's questions and answers. */
const questionPages = { "bcs-general": "/bcs", ntrca: "/ntrca", "primary-teacher": "/primary-teacher", "combined-bank": "/bank-jobs", "bangladesh-bank": "/bank-jobs" }

const pastPapersByExam = {
  "bcs-general": ["46th BCS", "45th BCS", "44th BCS", "43rd BCS", "41st BCS", "40th BCS", "38th BCS", "37th BCS"],
  ntrca: ["18th NTRCA", "17th NTRCA", "16th NTRCA", "15th NTRCA", "14th NTRCA", "13th NTRCA"],
  "primary-teacher": ["2023 Phase-3", "2023 Phase-2", "2023 Phase-1", "2022 Phase-3", "2022 Phase-2", "2019 DPE"],
  "combined-bank": ["2023 Combined 9 Banks", "2022 Combined 8 Banks", "2021 Officer Cash", "2020 Senior Officer", "2019 Officer"],
  "bangladesh-bank": ["2024 BB AD", "2023 BB Officer", "2022 BB AD", "2021 BB Officer", "2020 BB AD"],
}

export default function ExamDetail({ inApp = false }) {
  const noticesVersion = useNoticesVersion()
  const { slug } = useParams()
  const { followed, toggleFollow, user, L, num } = useApp()
  const [tab, setTab] = useState("format")
  const e = exams.find((x) => x.slug === slug)
  useSeo(e && !inApp ? { title: `${e.name} Syllabus & Mark Distribution | ${e.nameBn} সিলেবাস ও নম্বর বণ্টন — bd3schools`, description: `${e.name}: ${e.summary} ${e.nameBn} সিলেবাস ও নম্বর বণ্টন।`.slice(0, 160) } : {})
  if (!e) return <NotFound />
  const on = followed.includes(e.slug)
  const related = notices.filter((n) => n.exam === e.slug)
  const allSubjects = e.stages.flatMap((s) => s.subjects.map((x) => ({ stage: s.type, name: x[0], bn: x[1], marks: x[2] })))

  const body = (
    <>
      {!inApp && <Crumbs items={[[L("Exams", "পরীক্ষা"), "/exams"], [L(e.name, e.nameBn)]]} />}
      <PageHeader back={inApp ? "/app/exams" : "/exams"} title={<>{L(e.name, e.nameBn)} <span className="font-medium text-muted-foreground">({L(e.nameBn, e.name)})</span></>} subtitle={`${td(e.org)} · ${L("Syllabus", "সিলেবাস")}: ${td(e.syllabusVersion)}`} />
      <Panel className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <IconBox tone={e.color} className="size-12 text-lg">
          <Icon name={e.icon} />
        </IconBox>
        <div className="flex-1 text-sm leading-relaxed">
          <p className="text-muted-foreground">{td(e.summary)}</p>
          {!inApp && questionPages[e.slug] && (
            <Link to={questionPages[e.slug]} className="mt-1.5 inline-block font-semibold text-primary hover:underline">
              {L("Questions with answers and explanations", "উত্তর ও ব্যাখ্যাসহ প্রশ্ন")}
            </Link>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10 flex-1 rounded-full sm:flex-none"
            onClick={() => {
              if (!user) return toast(L("Log in to follow exams", "পরীক্ষা ফলো করতে লগ ইন করুন"))
              toggleFollow(e.slug)
            }}
          >
            <FontAwesomeIcon icon={on ? faCheck : faBell} /> {on ? L("Following", "ফলো করছেন") : L("Follow", "ফলো করুন")}
          </Button>
          {!e.comingSoon && (
            <Button asChild className="h-10 flex-1 rounded-full sm:flex-none">
              <Link to={user ? "/app/practice" : "/login"}>
                {L("Practice", "অনুশীলন")} <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </Button>
          )}
        </div>
      </Panel>

      <Segmented
        options={[
          { value: "format", label: L("Format & marks", "ফরম্যাট ও নম্বর") },
          { value: "syllabus", label: L("Syllabus", "সিলেবাস") },
          { value: "past", label: L("Past questions", "বিগত প্রশ্ন") },
          { value: "notices", label: L(`Notices (${related.length})`, `নোটিশ (${num(related.length)})`) },
        ]}
        value={tab}
        onChange={setTab}
        className="mb-4"
      />

      {tab === "format" &&
        (e.stages.length ? (
          <ExamFormat exam={e} />
        ) : (
          <EmptyState icon={<FontAwesomeIcon icon={faHourglassHalf} />} title={L("Full format coming soon", "পূর্ণ ফরম্যাট শিগগিরই আসছে")} text={L("Follow this exam and we'll alert you when preparation opens.", "পরীক্ষাটি ফলো করুন, প্রস্তুতি চালু হলে জানাব।")} />
        ))}

      {tab === "syllabus" &&
        (allSubjects.length ? (
          <Accordion type="multiple" className="rounded-2xl border bg-card px-4">
            {allSubjects.map((s, i) => (
              <AccordionItem key={i} value={`s${i}`}>
                <AccordionTrigger>
                  <span className="flex flex-1 items-center gap-2 text-left">
                    <span>
                      {L(s.name, s.bn)} <span className="bn block text-xs font-normal text-muted-foreground">{L(s.bn, s.name)}</span>
                    </span>
                    <Pill className="ml-auto">{td(s.stage)}</Pill>
                    <span className="w-10 text-right text-sm tabular-nums">{num(s.marks)}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5 text-sm">
                    {(sampleTopics[s.name] || [L("Topics published per official syllabus", "অফিসিয়াল সিলেবাস অনুযায়ী টপিক")]).map((t) => (
                      <li key={t} className="bn flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary" /> {t}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <EmptyState title={L("Syllabus coming soon", "সিলেবাস শিগগিরই আসছে")} />
        ))}

      {tab === "past" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {(pastPapersByExam[e.slug] || ["Recent Paper 1", "Recent Paper 2", "Recent Paper 3"]).map((paper) => (
            <Link
              key={paper}
              to={user ? `/app/practice/session?mode=past&exam=${e.slug}` : "/login"}
              className="tap flex items-center gap-3 rounded-2xl border bg-card p-3.5 hover:border-primary/40"
            >
              <FontAwesomeIcon icon={faFileLines} className="text-primary" />
              <span>
                <span className="block text-sm font-semibold">{paper}</span>
                <span className="text-xs text-muted-foreground">{td("Preliminary MCQ")}</span>
              </span>
            </Link>
          ))}
        </div>
      )}

      {tab === "notices" && (
        <div className="space-y-3">
          {related.length ? related.map((n) => <NoticeCard key={n.slug} n={n} base={inApp ? "/app/notices" : "/notices"} />) : <EmptyState title={L("No notices yet", "এখনো কোনো নোটিশ নেই")} />}
        </div>
      )}
      <p className="mt-6 text-xs text-muted-foreground">
        {L("Format and marks come from public reports. Always confirm against the latest official circular.", "ফরম্যাট ও নম্বর প্রকাশিত তথ্য থেকে নেওয়া। সর্বশেষ অফিসিয়াল বিজ্ঞপ্তির সঙ্গে মিলিয়ে নিন।")}
      </p>
    </>
  )
  return inApp ? body : <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">{body}</div>
}
