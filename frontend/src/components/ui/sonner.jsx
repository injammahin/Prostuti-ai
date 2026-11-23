import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Toaster as Sonner } from "sonner"
import { useApp } from "@/lib/app-context"

const DESKTOP = "(min-width: 768px)"

const Toaster = (props) => {
  const { theme } = useApp()
  // Corner on desktop so toasts never cover page headers; centred on phones where there is no side space.
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP).matches)
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP)
    const onChange = (e) => setIsDesktop(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return (
    <Sonner
      theme={theme}
      position={isDesktop ? "top-right" : "top-center"}
      offset={{ top: 20, right: 20 }}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      }}
      {...props}
    />
  )
}

export { Toaster }
