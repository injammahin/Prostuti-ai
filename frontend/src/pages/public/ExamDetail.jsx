import { useState } from "react"
import { Link, useParams } from "react-router"
import { toast } from "sonner"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faCheck, faClock, faMinus, faArrowRight, faFileLines, faHourglassHalf } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PageHeader, IconBox, Pill, Panel, NoticeCard, Segmented, EmptyState } from "@/components/shared"
import { Icon } from "@/components/icon"
import { exams, notices } from "@/lib/data"
import { useApp } from "@/lib/app-context"
import NotFound from "@/pages/NotFound"

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

const pastPapersByExam = {
  "bcs-general": ["46th BCS", "45th BCS", "44th BCS", "43rd BCS", "41st BCS", "40th BCS", "38th BCS", "37th BCS"],
  ntrca: ["18th NTRCA", "17th NTRCA", "16th NTRCA", "15th NTRCA", "14th NTRCA", "13th NTRCA"],
  "primary-teacher": ["2023 Phase-3", "2023 Phase-2", "2023 Phase-1", "2022 Phase-3", "2022 Phase-2", "2019 DPE"],
  "combined-bank": ["2023 Combined 9 Banks", "2022 Combined 8 Banks", "2021 Officer Cash", "2020 Senior Officer", "2019 Officer"],
  "bangladesh-bank": ["2024 BB AD", "2023 BB Officer", "2022 BB AD", "2021 BB Officer", "2020 BB AD"],
}

export default function ExamDetail({ inApp = false }) {
  const { slug } = useParams()
  const { followed, toggleFollow, user } = useApp()
  const [tab, setTab] = useState("format")
  const e = exams.find((x) => x.slug === slug)
  if (!e) return <NotFound />
  const on = followed.includes(e.slug)
  const related = notices.filter((n) => n.exam === e.slug)
  const allSubjects = e.stages.flatMap((s) => s.subjects.map((x) => ({ stage: s.type, name: x[0], bn: x[1], marks: x[2] })))

  const body = (
    <>
      <PageHeader back={inApp ? "/app/exams" : "/exams"} title={e.name} subtitle={`${e.org} · Syllabus: ${e.syllabusVersion}`} />
      <Panel className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <IconBox tone={e.color} className="size-12 text-lg">
          <Icon name={e.icon} />
        </IconBox>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{e.summary}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10 flex-1 rounded-full sm:flex-none"
            onClick={() => {
              if (!user) return toast("Log in to follow exams")
              toggleFollow(e.slug)
            }}
          >
            <FontAwesomeIcon icon={on ? faCheck : faBell} /> {on ? "Following" : "Follow"}
          </Button>
          {!e.comingSoon && (
            <Button asChild className="h-10 flex-1 rounded-full sm:flex-none">
              <Link to={user ? "/app/practice" : "/login"}>
                Practice <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </Button>
          )}
        </div>
      </Panel>

      <Segmented
        options={[
          { value: "format", label: "Format & marks" },
          { value: "syllabus", label: "Syllabus" },
          { value: "past", label: "Past questions" },
          { value: "notices", label: `Notices (${related.length})` },
        ]}
        value={tab}
        onChange={setTab}
        className="mb-4"
      />

      {tab === "format" &&
        (e.stages.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {e.stages.map((s) => (
              <Panel key={s.type} className="p-0 md:p-0">
                <div className="flex items-center justify-between border-b p-4">
                  <div>
                    <p className="font-semibold">{s.type}</p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span><FontAwesomeIcon icon={faClock} /> {s.duration}</span>
                      <span><FontAwesomeIcon icon={faMinus} /> Negative: {s.negative}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">{s.marks}</p>
                </div>
                {s.subjects.length > 0 ? (
                  <table className="w-full text-sm">
                    <tbody>
                      {s.subjects.map(([en, bn, m]) => (
                        <tr key={en} className="border-b last:border-0">
                          <td className="px-4 py-2.5">
                            {en} <span className="bn block text-xs text-muted-foreground">{bn}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold tabular-nums">{m}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-4 text-sm text-muted-foreground">Pass mark: {s.pass}</p>
                )}
              </Panel>
            ))}
          </div>
        ) : (
          <EmptyState icon={<FontAwesomeIcon icon={faHourglassHalf} />} title="Full format coming soon" text="Follow this exam and we'll alert you when preparation opens." />
        ))}

      {tab === "syllabus" &&
        (allSubjects.length ? (
          <Accordion type="multiple" className="rounded-2xl border bg-card px-4">
            {allSubjects.map((s, i) => (
              <AccordionItem key={i} value={`s${i}`}>
                <AccordionTrigger>
                  <span className="flex flex-1 items-center gap-2 text-left">
                    <span>
                      {s.name} <span className="bn block text-xs font-normal text-muted-foreground">{s.bn}</span>
                    </span>
                    <Pill className="ml-auto">{s.stage}</Pill>
                    <span className="w-10 text-right text-sm tabular-nums">{s.marks}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5 text-sm">
                    {(sampleTopics[s.name] || ["Topics published per official syllabus"]).map((t) => (
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
          <EmptyState title="Syllabus coming soon" />
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
                <span className="text-xs text-muted-foreground">Preliminary MCQ</span>
              </span>
            </Link>
          ))}
        </div>
      )}

      {tab === "notices" && (
        <div className="space-y-3">
          {related.length ? related.map((n) => <NoticeCard key={n.slug} n={n} base={inApp ? "/app/notices" : "/notices"} />) : <EmptyState title="No notices yet" />}
        </div>
      )}
      <p className="mt-6 text-xs text-muted-foreground">
        Format and marks come from public reports. Always confirm against the latest official circular.
      </p>
    </>
  )
  return inApp ? body : <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">{body}</div>
}
