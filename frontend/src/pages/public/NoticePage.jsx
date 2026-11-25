import { useParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faBellSlash, faCalendarPlus, faUserCheck } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { toast } from "sonner"
import EligibilityDialog from "@/components/EligibilityDialog"
import { Button } from "@/components/ui/button"
import { exams, notices } from "@/lib/data"
import { examName } from "@/lib/format"
import { downloadIcs } from "@/lib/ics"
import { useApp } from "@/lib/app-context"
import { useNoticesVersion } from "@/lib/notices-store"
import ServerPage from "@/pages/public/ServerPage"

/** A notice: Laravel's page, with what a visitor can do about it. */
export default function NoticePage() {
  const { slug } = useParams()
  useNoticesVersion()
  const { followed, toggleFollow, user, L } = useApp()
  const [eligibility, setEligibility] = useState(false)
  const n = notices.find((x) => x.slug === slug)
  const exam = exams.find((e) => e.slug === n?.exam)
  const following = !!exam && followed.includes(exam.slug)

  const follow = () => {
    if (!user) return toast(L("Log in to follow exams and get alerts", "পরীক্ষা ফলো করতে ও অ্যালার্ট পেতে লগ ইন করুন"))
    toggleFollow(exam.slug)
    toast.success(following ? L(`Stopped alerts for ${exam.name}`, `${examName(exam)}: অ্যালার্ট বন্ধ হয়েছে`) : L(`You'll get alerts for ${exam.name}`, `${examName(exam)}: অ্যালার্ট পাবেন`))
  }

  return (
    <ServerPage lang="en">
      {n && (
        <div className="no-print mx-auto flex max-w-4xl flex-wrap gap-2 px-4 pb-8">
          {exam && (
            <Button variant="outline" className="h-11 rounded-full" onClick={follow}>
              <FontAwesomeIcon icon={following ? faBellSlash : faBell} /> {following ? L("Following", "ফলো করছেন") : L("Follow exam", "ফলো করুন")}
            </Button>
          )}
          {(n.examDate || n.applyUntil) && (
            <Button variant="outline" className="h-11 rounded-full" onClick={() => downloadIcs(n)}>
              <FontAwesomeIcon icon={faCalendarPlus} /> {L("Add to calendar", "ক্যালেন্ডারে যোগ")}
            </Button>
          )}
          {n.type === "circular" && (
            <Button variant="outline" className="h-11 rounded-full" onClick={() => setEligibility(true)}>
              <FontAwesomeIcon icon={faUserCheck} /> {L("Am I eligible?", "আমি কি আবেদন করতে পারব?")}
            </Button>
          )}
          <EligibilityDialog open={eligibility} onOpenChange={setEligibility} notice={n} />
        </div>
      )}
    </ServerPage>
  )
}
