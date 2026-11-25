import { useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faCheckDouble, faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { EmptyState, NoticeCard, PageHeader, Panel, SectionTitle, Segmented } from "@/components/shared"
import { exams, notices } from "@/lib/data"
import { td } from "@/lib/format"
import { useApp } from "@/lib/app-context"
import { useNoticesVersion } from "@/lib/notices-store"

const READ_KEY = "bd3schools:alerts-read"

function loadRead() {
  try {
    const slugs = JSON.parse(localStorage.getItem(READ_KEY))
    return Array.isArray(slugs) ? slugs : []
  } catch {
    return []
  }
}

/** Notices of the exams the student follows, with a read/unread mark kept on this device. */
export default function Alerts() {
  useNoticesVersion()
  const { followed, toggleFollow, mainExam, L, num } = useApp()
  const [read, setRead] = useState(loadRead)
  const [show, setShow] = useState("all")

  const saveRead = (slugs) => {
    setRead(slugs)
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(slugs))
    } catch {
      /* storage unavailable */
    }
  }

  // The chosen exam first, then the other exams the student follows.
  const mine = [...notices.filter((n) => n.exam === mainExam), ...notices.filter((n) => n.exam !== mainExam && followed.includes(n.exam))]
  const unread = mine.filter((n) => !read.includes(n.slug))
  const list = show === "unread" ? unread : mine

  return (
    <>
      <PageHeader
        title={L("Notifications", "নোটিফিকেশন")}
        subtitle={L("New notices for the exams you follow", "আপনার ফলো করা পরীক্ষার নতুন নোটিশ")}
        action={
          unread.length > 0 && (
            <Button variant="outline" size="sm" className="h-9 rounded-full" onClick={() => saveRead([...new Set([...read, ...mine.map((n) => n.slug)])])}>
              <FontAwesomeIcon icon={faCheckDouble} /> {L("Mark all as read", "সব পড়া হয়েছে")}
            </Button>
          )
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <Segmented
            options={[
              { value: "all", label: `${L("All", "সব")} (${num(mine.length)})` },
              { value: "unread", label: `${L("Unread", "অপঠিত")} (${num(unread.length)})` },
            ]}
            value={show}
            onChange={setShow}
            className="mb-4"
          />
          <div className="space-y-3">
            {list.length ? (
              list.map((n) => (
                <div key={n.slug} className="relative" onClickCapture={() => !read.includes(n.slug) && saveRead([...read, n.slug])}>
                  {!read.includes(n.slug) && <span className="absolute -top-1 -left-1 z-10 size-3 rounded-full bg-primary ring-2 ring-background" aria-label={L("Unread", "অপঠিত")} />}
                  <NoticeCard n={n} base="/app/notices" />
                </div>
              ))
            ) : (
              <EmptyState
                icon={<FontAwesomeIcon icon={faBell} />}
                title={L("Nothing new", "নতুন কিছু নেই")}
                text={L("New notices for the exams you follow will show up here.", "আপনার ফলো করা পরীক্ষার নতুন নোটিশ এখানে দেখা যাবে।")}
              />
            )}
          </div>
        </div>

        <aside>
          <SectionTitle title={L("Exams you follow", "যেসব পরীক্ষা ফলো করছেন")} />
          <Panel className="divide-y p-0 md:p-0">
            {exams.map((e) => {
              const on = followed.includes(e.slug)
              return (
                <label key={e.slug} className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{L(e.name, e.nameBn)}</span>
                    <span className="text-xs text-muted-foreground">{td(e.orgShort)}</span>
                  </span>
                  <Switch
                    checked={on}
                    onCheckedChange={() => {
                      toggleFollow(e.slug)
                      toast.success(on ? L(`Stopped following ${e.name}`, `${e.nameBn}: ফলো বন্ধ হয়েছে`) : L(`Following ${e.name}`, `${e.nameBn}: ফলো করছেন`))
                    }}
                  />
                </label>
              )
            })}
          </Panel>
          <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted-foreground">
            <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5" />
            {L("Always confirm dates on the official website before you apply or travel.", "আবেদন বা যাত্রার আগে অফিসিয়াল ওয়েবসাইটে তারিখ মিলিয়ে নিন।")}
          </p>
        </aside>
      </div>
    </>
  )
}
