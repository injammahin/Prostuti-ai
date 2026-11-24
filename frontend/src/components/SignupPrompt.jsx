import { Link, useLocation } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserPlus, faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"

const perks = ["Save progress, bookmarks and wrong answers", "Personal study plan and streaks", "Alerts for circulars and deadlines", "AI evaluation of written answers"]

export default function SignupPrompt() {
  const { signup, setSignup } = useApp()
  const { pathname, search } = useLocation()
  // Bring the user back to this page once they've signed up or signed in.
  const back = pathname.startsWith("/app") ? { from: pathname + search } : undefined
  const close = () => setSignup({ open: false, reason: "" })
  return (
    <Dialog open={signup.open} onOpenChange={(v) => !v && close()}>
      <DialogContent className="max-w-[calc(100%-2rem)] overflow-hidden rounded-3xl p-0 sm:max-w-md">
        <div className="hero px-6 pt-6 pb-5">
          <div className="grid size-12 place-items-center rounded-2xl bg-white/15 text-xl">
            <FontAwesomeIcon icon={faUserPlus} />
          </div>
          <DialogHeader className="mt-4 text-left">
            <DialogTitle className="text-xl text-white">Create a free account</DialogTitle>
            <DialogDescription className="text-white/80">
              {signup.reason ? `You need an account to ${signup.reason}.` : "Keep everything you do in one place."} It takes 30 seconds.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="space-y-4 p-6 pt-5">
          <ul className="space-y-2.5 text-sm">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCircleCheck} className="text-success" /> {p}
              </li>
            ))}
          </ul>
          <div className="grid gap-2 pt-1">
            <Button asChild className="btn-shine h-12 text-base" onClick={close}>
              <Link to="/signup" state={back}>Create free account</Link>
            </Button>
            <Button asChild variant="ghost" className="h-11" onClick={close}>
              <Link to="/login" state={back}>I already have an account</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
