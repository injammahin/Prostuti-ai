import { useState } from "react"
import { cn } from "@/lib/utils"
import StudentArt from "@/components/StudentArt"

/**
 * Optional illustrations in /public/illustrations (white backgrounds).
 * Until a file exists, an original SVG student illustration is shown.
 */
export const ILLUSTRATIONS = {
  desk: "/illustrations/study-desk.webp",
  think: "/illustrations/study-think.webp",
  write: "/illustrations/study-write.webp",
}
const art = {
  desk: { shirt: "#1d6b55", sleeve: "#175a47" },
  think: { shirt: "#c65a47", sleeve: "#a94a3a" },
  write: { shirt: "#2f4fa2", sleeve: "#27438b" },
}

export default function Illustration({ name = "desk", className, circle = true, alt = "", priority = false }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={cn("relative grid place-items-center", className)} aria-hidden={!alt}>
      {circle && <div className="absolute inset-[5%] rounded-full bg-white shadow-[0_20px_50px_-20px_rgb(0_0_0/0.35)]" />}
      {failed ? (
        <StudentArt {...art[name]} className="relative w-[86%]" />
      ) : (
        <img src={ILLUSTRATIONS[name]} srcSet={name === "desk" ? "/illustrations/study-desk-480.webp 480w, /illustrations/study-desk.webp 900w" : undefined} sizes={name === "desk" ? "(min-width: 448px) 424px, 92vw" : undefined} alt={alt} width="900" height="900" decoding="async" fetchPriority={priority ? "high" : undefined} loading={priority ? undefined : "lazy"} onError={() => setFailed(true)} className={cn("relative object-contain mix-blend-multiply [filter:brightness(1.04)_contrast(1.06)]", circle ? "w-[82%] [clip-path:circle(54%_at_50%_50%)]" : "w-full")} />
      )}
    </div>
  )
}
