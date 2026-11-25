import { Link, useLocation } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserPlus, faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"

const perks = [
  ["Save progress, bookmarks and wrong answers", "অগ্রগতি, বুকমার্ক ও ভুল উত্তর সংরক্ষণ"],
  ["Personal study plan and streaks", "নিজস্ব পড়ার রুটিন ও ধারাবাহিকতা"],
  ["Alerts for circulars and deadlines", "সার্কুলার ও শেষ তারিখের অ্যালার্ট"],
  ["AI evaluation of written answers", "লিখিত উত্তরের এআই মূল্যায়ন"],
]

export default function SignupPrompt() {
  const { signup, setSignup, L } = useApp()
  const { pathname, search } = useLocation()
  // Bring the user back to this page once they've signed up or signed in.
  const back = pathname.startsWith("/app") ? { from: pathname + search } : undefined
  const close = () => setSignup({ open: false, reason: "" })
  return (
    <Dialog open={signup.open} onOpenChange={(v) => !v && close()}>
      <DialogContent className="w-[calc(100vw-2.5rem)] max-w-[calc(100vw-2.5rem)] sm:w-full sm:max-w-md overflow-hidden rounded-3xl p-0">
        <div className="hero px-6 pt-6 pb-5">
          <div className="grid size-12 place-items-center rounded-2xl bg-white/15 text-xl">
            <FontAwesomeIcon icon={faUserPlus} />
          </div>
          <DialogHeader className="mt-4 text-left">
            <DialogTitle className="text-xl text-white">{L("Create a free account", "ফ্রি অ্যাকাউন্ট খুলুন")}</DialogTitle>
            <DialogDescription className="text-white/80">
              {L(
                `${signup.reason ? `You need an account to ${signup.reason}.` : "Keep everything you do in one place."} It takes 30 seconds.`,
                `${signup.reason ? "এই সুবিধাটি ব্যবহার করতে একটি অ্যাকাউন্ট প্রয়োজন।" : "আপনার সব প্রস্তুতি এক জায়গায় রাখুন।"} সময় লাগবে মাত্র ৩০ সেকেন্ড।`
              )}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="space-y-4 p-6 pt-5">
          <ul className="space-y-2.5 text-sm">
            {perks.map(([p, pBn]) => (
              <li key={p} className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCircleCheck} className="text-success" /> {L(p, pBn)}
              </li>
            ))}
          </ul>
          <div className="grid gap-2 pt-1">
            <Button asChild className="btn-shine h-12 text-base" onClick={close}>
              <Link to="/signup" state={back}>{L("Create free account", "ফ্রি অ্যাকাউন্ট খুলুন")}</Link>
            </Button>
            <Button asChild variant="ghost" className="h-11" onClick={close}>
              <Link to="/login" state={back}>{L("I already have an account", "আমার অ্যাকাউন্ট আছে")}</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
