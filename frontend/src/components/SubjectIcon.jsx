import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"

// Prostuti subject icons (line style, drawn in currentColor so they take the tile's accent colour).
const svgs = import.meta.glob("@/assets/subject-icons/*.svg", { query: "?raw", import: "default", eager: true })

const byFile = Object.fromEntries(
  Object.entries(svgs).map(([path, markup]) => [
    path.split("/").pop().replace(".svg", ""),
    // Let CSS size the icon instead of the fixed 48×48 in the file.
    markup.replace(/\s(width|height)="\d+"/g, ""),
  ])
)

/** Subject slug (from the API) → icon file name. */
const FILE_FOR_SUBJECT = {
  bangla: "bangla",
  english: "english",
  math: "mathematics-reasoning",
  "bd-affairs": "bangladesh-affairs",
  "intl-affairs": "international-affairs",
  ict: "computer-ict",
  science: "general-science",
  mental: "mental-ability",
  geography: "geography-environment",
  ethics: "ethics-governance",
}

/** Font Awesome icon used when a subject has no Prostuti icon yet. */
const FALLBACK_ICON = { banking: "building-columns" }

/** A calm accent colour per subject — the same everywhere the subject appears. */
const ACCENTS = {
  bangla: { tile: "bg-rose-50 text-rose-600", text: "text-rose-600", bar: "bg-rose-500", glow: "bg-rose-200/50" },
  english: { tile: "bg-sky-50 text-sky-600", text: "text-sky-600", bar: "bg-sky-500", glow: "bg-sky-200/50" },
  math: { tile: "bg-violet-50 text-violet-600", text: "text-violet-600", bar: "bg-violet-500", glow: "bg-violet-200/50" },
  "bd-affairs": { tile: "bg-emerald-50 text-emerald-600", text: "text-emerald-600", bar: "bg-emerald-500", glow: "bg-emerald-200/50" },
  "intl-affairs": { tile: "bg-blue-50 text-blue-600", text: "text-blue-600", bar: "bg-blue-500", glow: "bg-blue-200/50" },
  ict: { tile: "bg-indigo-50 text-indigo-600", text: "text-indigo-600", bar: "bg-indigo-500", glow: "bg-indigo-200/50" },
  science: { tile: "bg-teal-50 text-teal-600", text: "text-teal-600", bar: "bg-teal-500", glow: "bg-teal-200/50" },
  mental: { tile: "bg-amber-50 text-amber-600", text: "text-amber-600", bar: "bg-amber-500", glow: "bg-amber-200/50" },
  banking: { tile: "bg-cyan-50 text-cyan-700", text: "text-cyan-700", bar: "bg-cyan-600", glow: "bg-cyan-200/50" },
  geography: { tile: "bg-lime-50 text-lime-700", text: "text-lime-700", bar: "bg-lime-600", glow: "bg-lime-200/50" },
  ethics: { tile: "bg-fuchsia-50 text-fuchsia-600", text: "text-fuchsia-600", bar: "bg-fuchsia-500", glow: "bg-fuchsia-200/50" },
  default: { tile: "bg-secondary text-primary", text: "text-primary", bar: "bg-primary", glow: "bg-primary/15" },
}

export const subjectAccent = (slug) => ACCENTS[slug] || ACCENTS.default

/**
 * The subject's own icon; falls back to a Font Awesome icon.
 * The SVG files ship with the app (checked: plain paths, no scripts), so inlining them is safe.
 */
export function SubjectIcon({ slug, fallback, className }) {
  const markup = byFile[FILE_FOR_SUBJECT[slug]]
  if (!markup) return <Icon name={fallback || FALLBACK_ICON[slug] || "book"} className={className} />
  return <span aria-hidden className={cn("inline-block size-[1em] [&>svg]:size-full", className)} dangerouslySetInnerHTML={{ __html: markup }} />
}

/** Rounded, softly coloured square holding the subject icon. Sizes: sm (rows), md (dialogs), lg (cards). */
export function SubjectTile({ slug, fallback, size = "md", className }) {
  const sizes = {
    sm: ["size-11 rounded-xl", "size-6"],
    md: ["size-12 rounded-xl", "size-6.5"],
    lg: ["size-14 rounded-2xl md:size-16", "size-7 md:size-8"],
  }[size]
  return (
    <span className={cn("grid shrink-0 place-items-center", sizes[0], subjectAccent(slug).tile, className)}>
      <SubjectIcon slug={slug} fallback={fallback} className={sizes[1]} />
    </span>
  )
}
