import { useEffect, useRef, useState } from "react"
import { onPendingChange } from "@/lib/api"
import { cn } from "@/lib/utils"

/**
 * Slim bar at the very top of the screen while data is loading (like YouTube / GitHub).
 * Waits 150ms before showing so fast requests don't flash.
 */
export function TopLoadingBar() {
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)
  const showTimer = useRef(null)
  const hideTimer = useRef(null)

  useEffect(
    () =>
      onPendingChange((count) => {
        clearTimeout(showTimer.current)
        clearTimeout(hideTimer.current)
        if (count > 0) {
          showTimer.current = setTimeout(() => {
            setVisible(true)
            setActive(true)
          }, 150)
        } else {
          setActive(false)
          hideTimer.current = setTimeout(() => setVisible(false), 300)
        }
      }),
    []
  )

  if (!visible) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]" role="progressbar" aria-label="Loading">
      <div
        className={cn(
          "h-full bg-gradient-to-r from-primary via-sky-400 to-primary shadow-[0_0_8px_var(--primary)] transition-[width,opacity] ease-out",
          active ? "w-[85%] opacity-100 duration-[2500ms]" : "w-full opacity-0 duration-300"
        )}
      />
    </div>
  )
}

/** Shown inside the page area (sidebar and header stay) while a page's code loads. */
export function PageLoader({ className }) {
  return (
    <div className={cn("space-y-5 py-2", className)} aria-busy="true" aria-label="Loading page">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
      <div className="h-40 animate-pulse rounded-3xl bg-muted/80" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted/70" />
        ))}
      </div>
      <div className="h-56 animate-pulse rounded-2xl bg-muted/60" />
    </div>
  )
}
