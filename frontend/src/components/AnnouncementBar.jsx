import { useEffect, useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBullhorn, faXmark, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { siteApi } from "@/lib/api"
import { cn } from "@/lib/utils"

// Load the settings once per page load and share them between layouts.
let settingsPromise = null
const loadSettings = () => (settingsPromise ||= siteApi.settings().catch(() => null))

const tones = {
  info: "bg-primary text-primary-foreground",
  success: "bg-success text-white",
  warning: "bg-amber-500 text-white",
}

const dismissKey = (text) => `bd3schools:announcement-dismissed:${text}`

/** The message the admin sets in Site settings, shown above the page until the visitor closes it. */
export default function AnnouncementBar({ className }) {
  const [announcement, setAnnouncement] = useState(null)

  useEffect(() => {
    let cancelled = false
    loadSettings().then((settings) => {
      const a = settings?.announcement
      if (cancelled || !a) return
      try {
        if (sessionStorage.getItem(dismissKey(a.text))) return
      } catch {
        /* storage unavailable */
      }
      setAnnouncement(a)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!announcement) return null

  const close = () => {
    try {
      sessionStorage.setItem(dismissKey(announcement.text), "1")
    } catch {
      /* storage unavailable */
    }
    setAnnouncement(null)
  }

  const internal = announcement.link?.startsWith("/")
  const content = (
    <>
      <FontAwesomeIcon icon={faBullhorn} className="shrink-0 text-xs opacity-80" />
      <span className="min-w-0">{announcement.text}</span>
      {announcement.link && <FontAwesomeIcon icon={faArrowRight} className="shrink-0 text-[0.65rem] transition-transform group-hover:translate-x-0.5" />}
    </>
  )

  return (
    <div className={cn("relative z-50 px-10 py-2 text-center text-[0.8rem] font-medium md:text-sm", tones[announcement.tone] || tones.info, className)} role="status">
      {announcement.link ? (
        internal ? (
          <Link to={announcement.link} className="group inline-flex items-center justify-center gap-2 underline-offset-2 hover:underline">
            {content}
          </Link>
        ) : (
          <a href={announcement.link} target="_blank" rel="noreferrer" className="group inline-flex items-center justify-center gap-2 underline-offset-2 hover:underline">
            {content}
          </a>
        )
      ) : (
        <span className="inline-flex items-center justify-center gap-2">{content}</span>
      )}
      <button onClick={close} aria-label="Close announcement" className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full opacity-80 hover:bg-white/15 hover:opacity-100">
        <FontAwesomeIcon icon={faXmark} className="text-xs" />
      </button>
    </div>
  )
}
