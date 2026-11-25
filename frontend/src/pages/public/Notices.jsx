import { useMemo, useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faBell, faCalendarDays, faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NoticeCard, PageHeader, Segmented, EmptyState } from "@/components/shared"
import { notices, exams, noticeTypes } from "@/lib/data"
import { examName } from "@/lib/format"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"
import { useNoticesVersion } from "@/lib/notices-store"
import { useSeo } from "@/lib/seo"

const typeFilters = [
  { value: "all", label: "All", bn: "সব" },
  { value: "circular", label: "Circulars", bn: "বিজ্ঞপ্তি" },
  { value: "schedule", label: "Exam dates", bn: "পরীক্ষার তারিখ" },
  { value: "admit", label: "Admit cards", bn: "প্রবেশপত্র" },
  { value: "result", label: "Results", bn: "ফলাফল" },
  { value: "deadline", label: "Deadlines", bn: "শেষ তারিখ" },
  { value: "syllabus", label: "Syllabus", bn: "সিলেবাস" },
]

export default function Notices({ inApp = false }) {
  const noticesVersion = useNoticesVersion()
  const { followed, mainExam, user, L, num } = useApp()
  const [type, setType] = useState("all")
  const [exam, setExam] = useState(inApp ? mainExam : "all")
  const [mine, setMine] = useState(false)
  const [q, setQ] = useState("")

  useSeo({
    title: "Job Notices & Exam Dates | সরকারি চাকরির নিয়োগ বিজ্ঞপ্তি ও পরীক্ষার সময়সূচী — bd3schools",
    description: "বিসিএস (BCS), প্রাথমিক শিক্ষক, ব্যাংক এবং এনটিআরসিএ (NTRCA) পরীক্ষার লেটেস্ট সার্কুলার, পরীক্ষার তারিখ, এডমিট কার্ড ও ফলাফল সরাসরি অফিশিয়াল রেফারেন্সসহ।",
    keywords: "bcs circular, bcs exam date, bcs admit card, bcs result, govt job circular bangladesh, primary teacher circular, ntrca circular, bank job circular, bd3schools notices",
  })

  const list = useMemo(
    () =>
      notices.filter(
        (n) =>
          (type === "all" || n.type === type) &&
          (exam === "all" || n.exam === exam) &&
          (!mine || followed.includes(n.exam)) &&
          (!q || [n.title, n.title_bn, n.org, n.summary, n.summary_bn].join(" ").toLowerCase().includes(q.toLowerCase()))
      ),
    [type, exam, mine, q, followed, noticesVersion]
  )

  const body = (
    <>
      <div className="space-y-3">
        <div className="relative">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={L("Search circulars, organisations…", "বিজ্ঞপ্তি বা প্রতিষ্ঠান খুঁজুন…")}
            className="h-11 rounded-full bg-card pl-10 text-base md:text-sm"
            aria-label="Search notices"
          />
          {q && (
            <button onClick={() => setQ("")} className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" aria-label="Clear search">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
        <Segmented options={typeFilters.map((f) => ({ value: f.value, label: L(f.label, f.bn) }))} value={type} onChange={setType} />
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            className="h-9 rounded-full border bg-card px-3 text-sm"
            aria-label="Filter by exam"
          >
            <option value="all">{L("All exams", "সব পরীক্ষা")}</option>
            {exams.map((e) => (
              <option key={e.slug} value={e.slug}>
                {examName(e)}
              </option>
            ))}
          </select>
          {user && (
            <button
              onClick={() => setMine(!mine)}
              className={cn(
                "h-9 rounded-full border px-3 text-sm font-medium",
                mine ? "border-primary bg-secondary text-secondary-foreground" : "bg-card text-muted-foreground"
              )}
              aria-pressed={mine}
            >
              <FontAwesomeIcon icon={faBell} className="mr-1.5" />
              {L("My exams", "আমার পরীক্ষা")}
            </button>
          )}
          <span className="ml-auto text-xs text-muted-foreground">{L(`${list.length} notices`, `${num(list.length)}টি নোটিশ`)}</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {list.length ? (
          list.map((n) => <NoticeCard key={n.slug} n={n} base={inApp ? "/app/notices" : "/notices"} />)
        ) : (
          <EmptyState icon={<FontAwesomeIcon icon={faMagnifyingGlass} />} title={L("No notices match", "কোনো নোটিশ পাওয়া যায়নি")} text={L("Try a different filter or search term.", "অন্য ফিল্টার বা শব্দ দিয়ে চেষ্টা করুন।")} />
        )}
      </div>

      <p className="mt-6 flex gap-2 rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
        <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5" />
        {L(
          "Summaries are written by our team. Always confirm on the official website and apply only through the official portal. bd3schools is not affiliated with BPSC or any ministry.",
          "সারসংক্ষেপ আমাদের টিমের লেখা। সবসময় অফিসিয়াল ওয়েবসাইটে যাচাই করুন এবং শুধু অফিসিয়াল পোর্টালেই আবেদন করুন। bd3schools বিপিএসসি বা কোনো মন্ত্রণালয়ের সঙ্গে যুক্ত নয়।"
        )}
      </p>
    </>
  )

  if (inApp) {
    return (
      <>
        <PageHeader
          title={L("Notice board", "নোটিশ বোর্ড")}
          subtitle={L("Verified circulars, dates and results", "যাচাইকৃত বিজ্ঞপ্তি, তারিখ ও ফলাফল")}
          action={
            <Button asChild variant="outline" size="sm" className="h-9 rounded-full">
              <Link to="/app/calendar">
                <FontAwesomeIcon icon={faCalendarDays} /> <span className="hidden sm:inline">{L("Calendar", "ক্যালেন্ডার")}</span>
              </Link>
            </Button>
          }
        />
        {body}
      </>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      <PageHeader
        title={L("Govt job notice board", "সরকারি চাকরির নোটিশ বোর্ড")}
        subtitle={L(
          `Circulars, deadlines, admit cards and results — ${Object.keys(noticeTypes).length - 1} notice types, all verified.`,
          "বিজ্ঞপ্তি, শেষ তারিখ, প্রবেশপত্র ও ফলাফল — সব যাচাই করা।"
        )}
        action={
          <Button asChild variant="outline" size="sm" className="h-9 rounded-full">
            <Link to="/calendar">
              <FontAwesomeIcon icon={faCalendarDays} /> <span className="hidden sm:inline">{L("Calendar", "ক্যালেন্ডার")}</span>
            </Link>
          </Button>
        }
      />
      {!user && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-secondary p-3.5 text-sm text-secondary-foreground">
          <FontAwesomeIcon icon={faBell} className="text-lg" />
          <p className="flex-1">{L("Get free alerts before deadlines close.", "শেষ তারিখের আগেই ফ্রি অ্যালার্ট পান।")}</p>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/login">{L("Turn on", "চালু করুন")}</Link>
          </Button>
        </div>
      )}
      {body}
    </div>
  )
}
