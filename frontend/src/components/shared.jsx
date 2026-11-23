import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowUpRightFromSquare,
  faCircleCheck,
  faChevronRight,
  faClockRotateLeft,
  faArrowLeft,
  faArrowTrendUp,
  faArrowTrendDown,
} from "@fortawesome/free-solid-svg-icons"
import { cn } from "@/lib/utils"
import BrandMark from "@/components/BrandMark"
import { exams, noticeTypes } from "@/lib/data"
import { fmtDate, keyDate, relDays, daysUntil } from "@/lib/format"

export const tones = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/15 text-[color-mix(in_oklab,var(--warning)_70%,black)] dark:text-warning",
  info: "bg-info/10 text-info",
  medical: "bg-medical/10 text-medical",
  destructive: "bg-destructive/10 text-destructive",
  chart5: "bg-chart-5/12 text-chart-5",
  muted: "bg-muted text-muted-foreground",
  white: "bg-white/15 text-white",
}

export function Logo({ className, compact = false, light = false }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)} aria-label="Prostuti home">
      <BrandMark
        variant={light ? "bare" : "tile"}
        className={cn("shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5", light ? "size-10" : "size-9")}
      />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={cn("text-[1.25rem] font-extrabold tracking-[-0.03em]", light ? "text-white" : "text-brand dark:text-foreground")}>Prostuti</span>
          <span className={cn("bn mt-1.5 text-[0.72rem] leading-none font-semibold", light ? "text-white/70" : "text-muted-foreground")}>
            প্রস্তুতি
          </span>
        </span>
      )}
    </Link>
  )
}

export function Pill({ tone = "muted", className, children }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", tones[tone], className)}>
      {children}
    </span>
  )
}

export function Trend({ value, className, light }) {
  const up = !String(value).startsWith("-")
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold",
        light ? "text-glow" : up ? "text-success" : "text-destructive",
        className
      )}
    >
      {up && /^\d/.test(String(value)) ? "+" : ""}
      {value}
      <FontAwesomeIcon icon={up ? faArrowTrendUp : faArrowTrendDown} className="text-[0.7rem]" />
    </span>
  )
}

export function IconBox({ tone = "primary", className, children }) {
  return <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl text-base", tones[tone], className)}>{children}</span>
}

export function PageHeader({ title, subtitle, back, action, className }) {
  return (
    <div className={cn("mb-5 flex items-start gap-3 md:mb-7", className)}>
      {back && (
        <Link to={back} className="card -ml-1 grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground" aria-label="Back">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="text-[1.35rem] leading-tight font-bold md:text-[1.7rem]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function SectionTitle({ title, to, linkLabel = "View all", className, action }) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-2", className)}>
      <h2 className="text-[1.05rem] font-bold">{title}</h2>
      {to && (
        <Link to={to} className="group flex items-center gap-1.5 text-sm font-semibold text-primary">
          {linkLabel} <FontAwesomeIcon icon={faChevronRight} className="text-[0.6rem] transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
      {action}
    </div>
  )
}

export function Panel({ className, children, ...rest }) {
  return (
    <div className={cn("card p-4 md:p-5", className)} {...rest}>
      {children}
    </div>
  )
}

/** Brand banner surface. */
export function HeroCard({ className, children }) {
  return <div className={cn("hero rounded-3xl p-5 md:p-7", className)}>{children}</div>
}
export function Bar({ value, className, tone = "bg-primary", animate = true }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full", animate && "grow-x", tone)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

export function Ring({ value, size = 64, stroke = 7, label, className, color = "stroke-primary", track = "stroke-muted" }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className={cn("relative grid shrink-0 place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className={cn("fill-none", track)} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          className={cn("ring-draw fill-none", color)}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          style={{ "--c": c }}
        />
      </svg>
      <span className="absolute text-sm font-bold">{label ?? `${value}%`}</span>
    </div>
  )
}

/** Tiny single-series trend line. */
export function Sparkline({ data, className, color = "var(--primary)" }) {
  const w = 100
  const h = 28
  const min = Math.min(...data)
  const max = Math.max(...data)
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / (max - min || 1)) * (h - 6)])
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")
  const id = `sp${data.join("")}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-7 w-full", className)} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".18" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export function StatCard({ label, value, unit, trend, icon, tone = "primary", spark, sparkColor, className }) {
  return (
    <div className={cn("card lift flex flex-col gap-2.5 p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {icon && <IconBox tone={tone} className="size-8 rounded-lg text-sm">{icon}</IconBox>}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-1.5">
        <span className="text-[1.55rem] leading-none font-semibold tracking-tight">{value}</span>
        {unit && <span className="text-xs font-medium text-muted-foreground">{unit}</span>}
        {trend && <Trend value={trend} className="ml-auto" />}
      </div>
      {spark && <Sparkline data={spark} color={sparkColor} />}
    </div>
  )
}

/** Activity heatmap: weeks × 7 days. */
export function Heatmap({ weeks = 14, seed = 7, className }) {
  const shades = ["bg-muted", "bg-primary/20", "bg-primary/45", "bg-primary/70", "bg-primary"]
  let s = seed
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const cells = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      if (w === weeks - 1 && d > 3) return -1
      const r = rnd()
      const bias = w / weeks
      return r < 0.18 ? 0 : Math.min(4, Math.floor(r * 3 + bias * 2))
    })
  )
  return (
    <div className={cn("flex gap-1", className)} role="img" aria-label="Daily practice activity">
      {cells.map((col, i) => (
        <div key={i} className="flex flex-1 flex-col gap-1">
          {col.map((v, j) => (
            <span key={j} className={cn("aspect-square w-full rounded-[4px]", v < 0 ? "bg-transparent" : shades[v])} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function accuracyTone(a) {
  if (a >= 70) return "bg-success"
  if (a >= 55) return "bg-warning"
  return "bg-destructive"
}

export function NoticeTypePill({ type }) {
  const t = noticeTypes[type] || noticeTypes.other
  return <Pill tone={t.tone}>{t.label}</Pill>
}

export function DateChip({ iso, label }) {
  const n = daysUntil(iso)
  const urgent = n !== null && n >= 0 && n <= 3
  const d = new Date(iso + "T00:00:00")
  return (
    <div
      className={cn(
        "flex w-[3.6rem] shrink-0 flex-col items-center justify-center rounded-xl py-2 text-center",
        urgent ? "bg-destructive/10 text-destructive" : "bg-secondary text-secondary-foreground"
      )}
    >
      <span className="text-[0.6rem] font-bold tracking-wide uppercase opacity-80">{label}</span>
      <span className="text-xl leading-tight font-extrabold">{d.getDate()}</span>
      <span className="text-[0.65rem] font-semibold opacity-80">{d.toLocaleString("en", { month: "short" })}</span>
    </div>
  )
}

export function NoticeCard({ n, compact = false, base = "/notices" }) {
  const k = keyDate(n)
  const exam = exams.find((e) => e.slug === n.exam)
  const days = daysUntil(k.date)
  return (
    <Link to={`${base}/${n.slug}`} className="card lift group flex gap-3.5 p-3.5 md:p-4">
      <DateChip iso={k.date} label={k.label === "Published" ? "Pub" : k.label === "Apply by" ? "Apply" : "Exam"} />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          <NoticeTypePill type={n.type} />
          {n.isNew && (
            <Pill tone="success">
              <span className="live-dot size-1.5 rounded-full bg-success" /> New
            </Pill>
          )}
          {n.changes?.length > 0 && (
            <Pill tone="warning">
              <FontAwesomeIcon icon={faClockRotateLeft} /> Updated
            </Pill>
          )}
        </div>
        <h3 className="line-clamp-2 text-[0.95rem] leading-snug font-bold transition-colors group-hover:text-primary">{n.title}</h3>
        {!compact && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.summary}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/80">{n.org}</span>
          {exam && <span>{exam.name}</span>}
          {k.label !== "Published" && days >= 0 && (
            <span className={cn(days <= 3 && "font-semibold text-destructive")}>
              {k.label} {relDays(k.date).toLowerCase()}
            </span>
          )}
          <span className="flex items-center gap-1 font-medium text-success">
            <FontAwesomeIcon icon={faCircleCheck} /> Verified {fmtDate(n.verifiedAt, false)}
          </span>
        </div>
      </div>
      <FontAwesomeIcon icon={faChevronRight} className="mt-1 hidden text-xs text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
    </Link>
  )
}

export function OfficialLink({ url, className }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className={cn("inline-flex items-center gap-1.5 font-semibold text-primary hover:underline", className)}>
      Official source <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
    </a>
  )
}

export function EmptyState({ icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card/50 px-6 py-10 text-center">
      {icon && <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-secondary text-lg text-primary">{icon}</div>}
      <p className="font-semibold">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Segmented({ options, value, onChange, className }) {
  return (
    <div className={cn("no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0", className)} role="tablist">
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value
        const l = typeof o === "string" ? o : o.label
        const active = v === value
        return (
          <button
            key={v}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(v)}
            className={cn(
              "h-9 shrink-0 rounded-full px-4 text-sm font-semibold transition-all",
              active ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
          >
            {l}
          </button>
        )
      })}
    </div>
  )
}
