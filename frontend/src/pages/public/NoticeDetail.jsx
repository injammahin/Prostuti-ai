import { useState } from "react"
import { Link, useParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowUpRightFromSquare,
  faBell,
  faBellSlash,
  faCalendarPlus,
  faCircleCheck,
  faClockRotateLeft,
  faFlag,
  faShareNodes,
  faTriangleExclamation,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { NoticeCard, NoticeTypePill, PageHeader, Panel } from "@/components/shared"
import ReportDialog from "@/components/ReportDialog"
import EligibilityDialog from "@/components/EligibilityDialog"
import { notices, exams } from "@/lib/data"
import { fmtDate, relDays, daysUntil } from "@/lib/format"
import { downloadIcs } from "@/lib/ics"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"
import NotFound from "@/pages/NotFound"
import { useNoticesVersion } from "@/lib/notices-store"
import { PageLoader } from "@/components/Loaders"

export default function NoticeDetail({ inApp = false }) {
  const noticesVersion = useNoticesVersion()
  const { slug } = useParams()
  const { followed, toggleFollow, user } = useApp()
  const [report, setReport] = useState(false)
  const [elig, setElig] = useState(false)
  const n = notices.find((x) => x.slug === slug)
  // Before the latest notices arrive, a brand-new notice isn't in the list yet — wait instead of saying "not found".
  if (!n && noticesVersion === 0) return <PageLoader className="mx-auto max-w-3xl px-4 py-8" />
  if (!n) return <NotFound />
  const exam = exams.find((e) => e.slug === n.exam)
  const following = followed.includes(n.exam)
  const base = inApp ? "/app/notices" : "/notices"
  const related = notices.filter((x) => x.exam === n.exam && x.slug !== n.slug).slice(0, 3)

  const dates = [
    ["Published", n.published],
    ["Apply from", n.applyFrom],
    ["Apply until", n.applyUntil],
    ["Exam date", n.examDate],
  ].filter(([, v]) => v)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: n.title, url })
      else {
        await navigator.clipboard.writeText(url)
        toast.success("Link copied")
      }
    } catch {
      /* cancelled */
    }
  }

  const follow = () => {
    if (!user) return toast("Log in to follow exams and get alerts")
    toggleFollow(n.exam)
    toast.success(following ? `Stopped alerts for ${exam?.name}` : `You'll get alerts for ${exam?.name}`)
  }

  const content = (
    <article>
      <PageHeader back={base} title={<span className="text-lg md:text-2xl">{n.title}</span>} />

      <div className="-mt-2 mb-4 flex flex-wrap items-center gap-2 text-sm">
        <NoticeTypePill type={n.type} />
        <span className="font-medium">{n.org}</span>
        {exam && (
          <Link to={`${inApp ? "/app" : ""}/exams/${exam.slug}`} className="text-primary hover:underline">
            {exam.name}
          </Link>
        )}
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2.5 text-sm text-success">
        <FontAwesomeIcon icon={faCircleCheck} />
        <span>
          Verified against the official source on <b>{fmtDate(n.verifiedAt)}</b>
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <Panel>
            <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Summary</h2>
            <p className="leading-relaxed">{n.summary}</p>
            <p className="mt-3 text-xs text-muted-foreground">Summary written by the bd3schools team. Read the full notice on the official website.</p>
          </Panel>

          <Panel className="p-0 md:p-0">
            <h2 className="px-4 pt-4 text-sm font-semibold text-muted-foreground md:px-5">Key dates</h2>
            <ul className="divide-y">
              {dates.map(([label, iso]) => {
                const days = daysUntil(iso)
                const upcoming = days >= 0
                return (
                  <li key={label} className="flex items-center justify-between gap-3 px-4 py-3 md:px-5">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-right">
                      <span className="font-semibold">{fmtDate(iso)}</span>
                      {upcoming && label !== "Published" && (
                        <span className={cn("block text-xs", days <= 3 ? "text-destructive" : "text-muted-foreground")}>{relDays(iso)}</span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          </Panel>

          {n.changes.length > 0 && (
            <Panel className="border-warning/40 bg-warning/5">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <FontAwesomeIcon icon={faClockRotateLeft} className="text-warning" /> What changed
              </h2>
              <ul className="space-y-2 text-sm">
                {n.changes.map((c, i) => (
                  <li key={i}>
                    <span className="font-medium">{c.field}:</span> <span className="text-muted-foreground line-through">{c.old}</span> →{" "}
                    <span className="font-semibold">{c.new}</span>
                    <span className="block text-xs text-muted-foreground">Updated {fmtDate(c.at)}. Followers were alerted.</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {n.type === "circular" && (
            <Panel className="flex items-center gap-3">
              <FontAwesomeIcon icon={faUserCheck} className="text-xl text-primary" />
              <div className="flex-1">
                <p className="font-semibold">Am I eligible?</p>
                <p className="text-sm text-muted-foreground">Quick check against age and degree.</p>
              </div>
              <Button variant="outline" className="rounded-full" onClick={() => setElig(true)}>
                Check
              </Button>
            </Panel>
          )}
        </div>

        {/* Actions */}
        <aside className="space-y-3 md:sticky md:top-20 md:self-start">
          <Button asChild className="h-11 w-full rounded-full">
            <a href={n.url} target="_blank" rel="noreferrer">
              Official source <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          </Button>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            <Button variant="outline" className="h-11 rounded-full" onClick={follow}>
              <FontAwesomeIcon icon={following ? faBellSlash : faBell} /> {following ? "Following" : "Follow exam"}
            </Button>
            <Button variant="outline" className="h-11 rounded-full" onClick={() => downloadIcs(n)}>
              <FontAwesomeIcon icon={faCalendarPlus} /> Add to calendar
            </Button>
            <Button variant="outline" className="h-11 rounded-full" onClick={share}>
              <FontAwesomeIcon icon={faShareNodes} /> Share
            </Button>
            <Button variant="ghost" className="h-11 rounded-full text-muted-foreground" onClick={() => setReport(true)}>
              <FontAwesomeIcon icon={faFlag} /> Report error
            </Button>
          </div>
          <p className="flex gap-2 rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5" />
            Apply only through the official portal. bd3schools is not affiliated with BPSC or any ministry.
          </p>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-semibold">More for {exam?.name}</h2>
          <div className="space-y-3">
            {related.map((r) => (
              <NoticeCard key={r.slug} n={r} compact base={base} />
            ))}
          </div>
        </section>
      )}

      <ReportDialog open={report} onOpenChange={setReport} target="notice" />
      <EligibilityDialog open={elig} onOpenChange={setElig} notice={n} />
    </article>
  )

  return inApp ? content : <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">{content}</div>
}
