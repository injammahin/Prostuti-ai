import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faLink } from "@fortawesome/free-solid-svg-icons"
import { faFacebook, faTelegram, faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { useApp } from "@/lib/app-context"
import { copyText } from "@/lib/page-actions"
import { cn } from "@/lib/utils"

/** Share a public page on Facebook or WhatsApp, or copy its link. */
export default function ShareButtons({ path, title = "", className }) {
  const { L } = useApp()
  const [copied, setCopied] = useState(false)
  const url = window.location.origin + path
  const cls = "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
  const copy = () =>
    copyText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })

  return (
    <div className={cn("no-print flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground">{L("Share", "শেয়ার করুন")}</span>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener" className={cls}>
        <FontAwesomeIcon icon={faFacebook} className="text-[#0866ff]" /> Facebook
      </a>
      <a href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`.trim())}`} target="_blank" rel="noopener" className={cls}>
        <FontAwesomeIcon icon={faWhatsapp} className="text-[#1fa855]" /> WhatsApp
      </a>
      <a href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener" className={cls}>
        <FontAwesomeIcon icon={faTelegram} className="text-[#229ed9]" /> Telegram
      </a>
      <button type="button" onClick={copy} className={cls}>
        <FontAwesomeIcon icon={copied ? faCheck : faLink} className={copied ? "text-success" : ""} /> {copied ? L("Copied", "কপি হয়েছে") : L("Copy link", "লিংক কপি")}
      </button>
    </div>
  )
}
