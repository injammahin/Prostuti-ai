import { useState } from "react"
import { Link } from "react-router"
import { toast } from "sonner"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faCheck, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { PageHeader, Segmented, IconBox, Pill } from "@/components/shared"
import { Icon } from "@/components/icon"
import { exams, examFamilies, notices } from "@/lib/data"
import { td } from "@/lib/format"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"
import { useNoticesVersion } from "@/lib/notices-store"

export default function Exams({ inApp = false }) {
  const noticesVersion = useNoticesVersion()
  const { followed, toggleFollow, user, L, num } = useApp()
  const [family, setFamily] = useState("all")
  const list = exams.filter((e) => family === "all" || e.family === family)
  const base = inApp ? "/app/exams" : "/exams"

  const body = (
    <>
      <PageHeader title={L("Exam catalog", "পরীক্ষার তালিকা")} subtitle={L("Find every government exam that fits you. Follow to get alerts.", "আপনার উপযোগী সরকারি পরীক্ষা খুঁজুন। অ্যালার্ট পেতে ফলো করুন।")} />
      <Segmented options={[{ value: "all", label: L("All", "সব") }, ...examFamilies.map((f) => ({ value: f.id, label: L(f.name, f.nameBn) }))]} value={family} onChange={setFamily} />
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {list.map((e) => {
          const count = notices.filter((n) => n.exam === e.slug).length
          const on = followed.includes(e.slug)
          return (
            <div key={e.slug} className="flex flex-col rounded-2xl border bg-card p-4">
              <Link to={`${base}/${e.slug}`} className="flex items-start gap-3">
                <IconBox tone={e.color}>
                  <Icon name={e.icon} />
                </IconBox>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{L(e.name, e.nameBn)}</p>
                    {e.comingSoon ? <Pill>{L("Prep soon", "শিগগিরই")}</Pill> : <Pill tone="success">{L("Full prep", "পূর্ণ প্রস্তুতি")}</Pill>}
                  </div>
                  <p className="bn text-sm text-muted-foreground">{L(e.nameBn, e.name)} · {td(e.orgShort)}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{td(e.summary)}</p>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="mt-1 text-xs text-muted-foreground" />
              </Link>
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-xs text-muted-foreground">{L(`${count} active notices`, `${num(count)}টি চলমান নোটিশ`)}</span>
                <button
                  onClick={() => {
                    if (!user) return toast(L("Log in to follow exams", "পরীক্ষা ফলো করতে লগ ইন করুন"))
                    toggleFollow(e.slug)
                  }}
                  className={cn(
                    "flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold",
                    on ? "border-primary bg-secondary text-secondary-foreground" : "hover:bg-muted"
                  )}
                  aria-pressed={on}
                >
                  <FontAwesomeIcon icon={on ? faCheck : faBell} /> {on ? L("Following", "ফলো করছেন") : L("Follow", "ফলো করুন")}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
  return inApp ? body : <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">{body}</div>
}
