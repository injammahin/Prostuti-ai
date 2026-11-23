import { TODAY } from "@/lib/data"

/** The app language, kept in sync by AppProvider on every render so helpers can follow it. */
let currentLang = "en"
export function setFormatLanguage(lang) {
  currentLang = lang
}
export const isBangla = () => currentLang === "bn"
const toBnDigits = (text) => String(text).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d])
export const localDigits = (value) => (isBangla() ? toBnDigits(value) : String(value))

export function fmtDate(iso, withYear = true) {
  if (!iso) return "—"
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString(isBangla() ? "bn-BD" : "en-GB", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) })
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
  if (isBangla()) {
    if (n === 0) return "আজ"
    if (n === 1) return "আগামীকাল"
    if (n === -1) return "গতকাল"
    return n > 0 ? `${toBnDigits(n)} দিন পর` : `${toBnDigits(-n)} দিন আগে`
  }
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
