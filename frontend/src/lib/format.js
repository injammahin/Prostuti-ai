import { TODAY } from "@/lib/data"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function fmtDate(iso, withYear = true) {
  if (!iso) return "—"
  const d = new Date(iso + "T00:00:00")
  return `${d.getDate()} ${MONTHS[d.getMonth()]}${withYear ? " " + d.getFullYear() : ""}`
}

export function daysUntil(iso) {
  if (!iso) return null
  const d = new Date(iso + "T00:00:00")
  const t = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate())
  return Math.round((d - t) / 86400000)
}

export function relDays(iso) {
  const n = daysUntil(iso)
  if (n === null) return ""
  if (n === 0) return "Today"
  if (n === 1) return "Tomorrow"
  if (n === -1) return "Yesterday"
  if (n > 0) return `In ${n} days`
  return `${-n} days ago`
}

/** Key date for a notice: what users care about next. */
export function keyDate(n) {
  if (n.applyUntil && daysUntil(n.applyUntil) >= 0) return { label: "Apply by", date: n.applyUntil }
  if (n.examDate && daysUntil(n.examDate) >= 0) return { label: "Exam", date: n.examDate }
  return { label: "Published", date: n.published }
}

const bnDigits = "০১২৩৪৫৬৭৮৯"
export const toBn = (v) => String(v).replace(/\d/g, (d) => bnDigits[d])
