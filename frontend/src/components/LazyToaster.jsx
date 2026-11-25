import { useEffect, useState } from "react"
import { useLazy } from "@/components/use-lazy"

const load = () => import("@/components/ui/sonner").then((module) => ({ default: module.Toaster }))
const usesToastsAtOnce = () => /^\/(app|login|signup|onboarding)(\/|$)/.test(window.location.pathname)

/**
 * The toast area: loaded at once in the app, and on first use of a public page (a toast follows a tap).
 * Toasts fired before it is there are not lost: sonner keeps them and shows them when it arrives.
 */
export default function LazyToaster() {
  const [wanted, setWanted] = useState(usesToastsAtOnce)
  const Toaster = useLazy(load, wanted, () => setWanted(false))

  useEffect(() => {
    if (wanted) return
    const want = () => setWanted(true)
    const events = ["pointerdown", "keydown"]
    events.forEach((event) => window.addEventListener(event, want, { passive: true }))
    const timer = setTimeout(want, 6000)
    return () => {
      events.forEach((event) => window.removeEventListener(event, want))
      clearTimeout(timer)
    }
  }, [wanted])

  return Toaster && <Toaster />
}
