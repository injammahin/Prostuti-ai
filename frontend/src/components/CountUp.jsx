import { useEffect, useRef, useState } from "react"
import { useApp } from "@/lib/app-context"

/** Counts from 0 up to `value` the first time it scrolls into view. Digits follow the app language. */
export default function CountUp({ value, duration = 1600, suffix = "" }) {
  const { num } = useApp()
  const ref = useRef(null)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value)
      return
    }
    let frame
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const step = (now) => {
        const p = Math.min(1, Math.max(0, (now - start) / duration))
        setShown(Math.round(value * (1 - (1 - p) ** 3))) // fast start, gentle finish
        if (p < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    })
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{num(value) + suffix}</span>
      <span aria-hidden>{num(shown) + suffix}</span>
    </span>
  )
}
