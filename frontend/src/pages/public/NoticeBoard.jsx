import { useMemo, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons"
import { EmptyState, NoticeCard } from "@/components/shared"
import { Input } from "@/components/ui/input"
import { notices } from "@/lib/data"
import { useApp } from "@/lib/app-context"
import { useNoticesVersion } from "@/lib/notices-store"
import ServerPage from "@/pages/public/ServerPage"

/** The public notice board: Laravel's list, with a search through the newest notices. */
export default function NoticeBoard() {
  const { L } = useApp()
  const version = useNoticesVersion()
  const [q, setQ] = useState("")
  const found = useMemo(() => {
    const words = q.trim().toLowerCase()
    return words ? notices.filter((n) => [n.title, n.title_bn, n.org, n.post, n.summary, n.summary_bn].join(" ").toLowerCase().includes(words)) : null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, version])

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <div className="relative">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("Search circulars, organisations…", "বিজ্ঞপ্তি বা প্রতিষ্ঠান খুঁজুন…")} className="h-11 rounded-full bg-card pl-10 text-base md:text-sm" aria-label="Search notices" />
          {q && (
            <button onClick={() => setQ("")} className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" aria-label="Clear search">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
      </div>
      {found ? (
        <div className="mx-auto max-w-3xl space-y-3 px-4 py-6">
          {found.length ? found.map((n) => <NoticeCard key={n.slug} n={n} />) : <EmptyState icon={<FontAwesomeIcon icon={faMagnifyingGlass} />} title={L("No notices match", "কোনো নোটিশ পাওয়া যায়নি")} />}
        </div>
      ) : (
        <ServerPage lang="en" />
      )}
    </>
  )
}
