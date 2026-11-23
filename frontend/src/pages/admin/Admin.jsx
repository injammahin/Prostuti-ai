import { useState } from "react"
import { Link, NavLink, Route, Routes } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGauge,
  faCircleQuestion,
  faBullhorn,
  faInbox,
  faLayerGroup,
  faUsers,
  faArrowLeft,
  faFileCsv,
  faPlus,
  faWandMagicSparkles,
  faCheck,
  faXmark,
  faEye,
  faCopy,
  faMagnifyingGlass,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo, Panel, Pill, PageHeader, Segmented, NoticeTypePill } from "@/components/shared"
import { questions, notices, exams } from "@/lib/data"
import { fmtDate } from "@/lib/format"
import { cn } from "@/lib/utils"

const nav = [
  ["", "Overview", faGauge],
  ["questions", "Questions", faCircleQuestion],
  ["notices", "Notices", faBullhorn],
  ["queues", "Review queues", faInbox],
  ["exams", "Exams", faLayerGroup],
  ["users", "Users", faUsers],
]

const statusTone = { published: "success", review: "warning", draft: "muted", verified: "info" }

function Table({ head, children }) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  )
}

function Overview() {
  const metrics = [
    ["Weekly active users", "8,412", "+6.2%"],
    ["Registered users", "31,240", "+1,120 this week"],
    ["Alert followers", "15,870", "push on"],
    ["AI cost / user", "৳4.10", "this month"],
    ["Open disputes", "23", "12 evaluations"],
    ["Notice date errors", "0", "last 30 days"],
  ]
  return (
    <>
      <PageHeader title="Overview" subtitle="Last 7 days" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {metrics.map(([l, v, d]) => (
          <Panel key={l} className="p-3.5 md:p-4">
            <p className="text-xs text-muted-foreground">{l}</p>
            <p className="mt-1 text-2xl font-bold">{v}</p>
            <p className="text-xs text-muted-foreground">{d}</p>
          </Panel>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ["Reported questions", 14, "queues"],
          ["Low-confidence evaluations", 9, "queues"],
          ["Notices awaiting verification", 3, "notices"],
        ].map(([l, n, to]) => (
          <Link key={l} to={`/admin/${to}`} className="tap flex items-center justify-between rounded-2xl border bg-card p-4 hover:border-primary/40">
            <span className="text-sm font-medium">{l}</span>
            <span className="grid size-8 place-items-center rounded-full bg-warning/15 text-sm font-bold">{n}</span>
          </Link>
        ))}
      </div>
    </>
  )
}

function Questions() {
  const [status, setStatus] = useState("all")
  const rows = questions.map((q, i) => ({ ...q, status: ["published", "published", "review", "published", "draft", "published", "review", "published"][i], exams: i % 3 === 0 ? 3 : 1 }))
  const list = rows.filter((r) => status === "all" || r.status === status)
  return (
    <>
      <PageHeader
        title="Question bank"
        subtitle="Comprehensive verified bank for top 5 government exams"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 rounded-full" onClick={() => toast("Upload a CSV file to import questions")}>
              <FontAwesomeIcon icon={faFileCsv} /> <span className="hidden sm:inline">Import CSV</span>
            </Button>
            <Button size="sm" className="h-9 rounded-full">
              <FontAwesomeIcon icon={faPlus} /> <span className="hidden sm:inline">New</span>
            </Button>
          </div>
        }
      />
      <div className="mb-3 flex items-center gap-2 rounded-xl bg-secondary/60 p-3 text-sm">
        <FontAwesomeIcon icon={faWandMagicSparkles} className="text-primary" />
        <span className="flex-1">AI drafted 24 MCQ suggestions. An editor must approve every one.</span>
        <Button size="sm" variant="outline" className="rounded-full">Review</Button>
      </div>
      <Segmented options={["all", "draft", "review", "published"].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }))} value={status} onChange={setStatus} className="mb-3" />
      <Table head={["Question", "Subject", "Source", "Exams", "Status", ""]}>
        {list.map((q) => (
          <tr key={q.id}>
            <td className={cn("max-w-xs truncate px-4 py-3", q.lang !== "en" && "bn")}>{q.body}</td>
            <td className="px-4 py-3 whitespace-nowrap">{q.subject}</td>
            <td className="px-4 py-3">{q.source}</td>
            <td className="px-4 py-3">{q.exams}</td>
            <td className="px-4 py-3"><Pill tone={statusTone[q.status]}>{q.status}</Pill></td>
            <td className="px-4 py-3 text-right">
              <button className="text-muted-foreground hover:text-foreground" aria-label="Open"><FontAwesomeIcon icon={faEye} /></button>
            </td>
          </tr>
        ))}
      </Table>
    </>
  )
}

function Notices() {
  const drafts = [
    { title: "BPSC: 49th BCS final result (watcher)", org: "BPSC", src: "bpsc.gov.bd", detected: "12 min ago" },
    { title: "Sonali Bank Senior Officer circular", org: "BSCS", src: "erecruitment.bb.org.bd", detected: "1h ago" },
    { title: "NTRCA: written exam date", org: "NTRCA", src: "ntrca.gov.bd", detected: "3h ago" },
  ]
  return (
    <>
      <PageHeader title="Notices" subtitle="Draft → verify against official source → publish" action={<Button size="sm" className="h-9 rounded-full"><FontAwesomeIcon icon={faPlus} /> New</Button>} />
      <h2 className="mb-2 font-semibold">Awaiting verification</h2>
      <div className="mb-6 space-y-2.5">
        {drafts.map((d) => (
          <Panel key={d.title} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{d.title}</p>
              <p className="text-xs text-muted-foreground">Page change detected on {d.src} · {d.detected}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full">Open source</Button>
              <Button size="sm" className="rounded-full" onClick={() => toast.success("Verified and published")}>
                <FontAwesomeIcon icon={faCircleCheck} /> Verify & publish
              </Button>
            </div>
          </Panel>
        ))}
      </div>
      <h2 className="mb-2 font-semibold">Published</h2>
      <Table head={["Title", "Type", "Key date", "Verified", "Changes"]}>
        {notices.map((n) => (
          <tr key={n.slug}>
            <td className="max-w-xs truncate px-4 py-3">{n.title}</td>
            <td className="px-4 py-3"><NoticeTypePill type={n.type} /></td>
            <td className="px-4 py-3 whitespace-nowrap">{fmtDate(n.applyUntil || n.examDate || n.published)}</td>
            <td className="px-4 py-3 whitespace-nowrap">{fmtDate(n.verifiedAt)}</td>
            <td className="px-4 py-3">{n.changes.length}</td>
          </tr>
        ))}
      </Table>
    </>
  )
}

function Queues() {
  const [tab, setTab] = useState("reports")
  const reports = [
    { q: "ILO-এর সদর দপ্তর কোথায়?", reason: "Wrong answer key", by: "user #4412", when: "2h" },
    { q: "Under Basel III, what is minimum CRAR?", reason: "Check explanation text", by: "user #981", when: "5h" },
    { q: "পদ্মানদীর মাঝি উপন্যাসের রচয়িতা কে?", reason: "Typo in source", by: "user #7720", when: "1d" },
  ]
  const evals = [
    { q: "Remittance & economy", score: "13.5/20", conf: "Low", reason: "OCR quality" },
    { q: "Bay of Bengal geopolitics", score: "9/15", conf: "Low", reason: "User dispute" },
  ]
  return (
    <>
      <PageHeader title="Review queues" />
      <Segmented options={[{ value: "reports", label: "Reported questions" }, { value: "evals", label: "Low-confidence AI" }]} value={tab} onChange={setTab} className="mb-4" />
      <div className="space-y-2.5">
        {(tab === "reports" ? reports : evals).map((r, i) => (
          <Panel key={i} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="bn truncate font-semibold">{r.q}</p>
              <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {r.reason} {r.by && `· ${r.by} · ${r.when} ago`} {r.score && `· AI ${r.score}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => toast("Dismissed")}><FontAwesomeIcon icon={faXmark} /> Dismiss</Button>
              <Button size="sm" className="rounded-full" onClick={() => toast.success("Resolved; reporter notified")}><FontAwesomeIcon icon={faCheck} /> {tab === "evals" ? "Re-grade" : "Fix"}</Button>
            </div>
          </Panel>
        ))}
      </div>
    </>
  )
}

function Exams() {
  return (
    <>
      <PageHeader title="Exam templates" subtitle="Every exam is data. Clone a template to add a new one." />
      <div className="grid gap-3 md:grid-cols-2">
        {exams.map((e) => (
          <Panel key={e.slug} className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{e.name}</p>
              <p className="text-xs text-muted-foreground">Tier {e.tier} · syllabus {e.syllabusVersion} · {e.stages.length} stages</p>
            </div>
            <Pill tone={e.comingSoon ? "muted" : "success"}>{e.comingSoon ? "Draft" : "Live"}</Pill>
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => toast.success(`Cloned ${e.name}`)}>
              <FontAwesomeIcon icon={faCopy} /> Clone
            </Button>
          </Panel>
        ))}
      </div>
    </>
  )
}

function Users() {
  return (
    <>
      <PageHeader title="Users & roles" />
      <div className="relative mb-3">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground" />
        <Input placeholder="Search users by phone or name" className="h-10 pl-9" />
      </div>
      <Table head={["User", "Main exam", "Joined", "Role"]}>
        {[
          ["Mahin Rahman", "BCS General", "2 Nov 2026", "user"],
          ["Sadia Karim", "Bangladesh Bank", "1 Oct 2026", "content editor"],
          ["Tanvir Ahmed", "Combined Bank", "1 Oct 2026", "notice editor"],
          ["Farhana Akter", "NTRCA", "19 Nov 2026", "user"],
        ].map((r) => (
          <tr key={r[0]}>
            {r.map((c, i) => (
              <td key={i} className="px-4 py-3 whitespace-nowrap">{i === 3 ? <Pill>{c}</Pill> : c}</td>
            ))}
          </tr>
        ))}
      </Table>
    </>
  )
}

export default function Admin() {
  return (
    <div className="portal min-h-dvh lg:pl-60">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-16 items-center gap-2 px-5">
          <Logo />
          <Pill tone="warning">Admin</Pill>
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {nav.map(([to, l, ic]) => (
            <NavLink
              key={to}
              to={`/admin${to && "/" + to}`}
              end={!to}
              className={({ isActive }) => cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted", isActive && "bg-secondary text-secondary-foreground")}
            >
              <FontAwesomeIcon icon={ic} fixedWidth /> {l}
            </NavLink>
          ))}
        </nav>
        <Link to="/app" className="m-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to app
        </Link>
      </aside>

      <header className="pt-safe sticky top-0 z-20 border-b bg-background/90 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center gap-2 px-4">
          <Link to="/app" className="-ml-2 grid size-10 place-items-center rounded-full hover:bg-muted" aria-label="Back to app">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <p className="font-semibold">Admin</p>
          
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
          {nav.map(([to, l]) => (
            <NavLink
              key={to}
              to={`/admin${to && "/" + to}`}
              end={!to}
              className={({ isActive }) => cn("shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground", isActive && "bg-primary text-primary-foreground")}
            >
              {l}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-5 md:px-6 md:py-8">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="questions" element={<Questions />} />
          <Route path="notices" element={<Notices />} />
          <Route path="queues" element={<Queues />} />
          <Route path="exams" element={<Exams />} />
          <Route path="users" element={<Users />} />
        </Routes>
      </main>
    </div>
  )
}
