import { useState } from "react"

/** Single-series line chart with crosshair tooltip. Responsive via viewBox. */
export default function TrendChart({ data, max = 200, height = 180, unit = "" }) {
  const [hover, setHover] = useState(null)
  const W = 600
  const H = height
  const pad = { l: 34, r: 12, t: 14, b: 26 }
  const lo = Math.floor(Math.min(...data.map((d) => d.score)) / 20) * 20 - 20
  const hi = Math.min(max, Math.ceil(Math.max(...data.map((d) => d.score)) / 20) * 20 + 10)
  const x = (i) => pad.l + (i * (W - pad.l - pad.r)) / (data.length - 1)
  const y = (v) => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b)
  const path = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.score)}`).join(" ")
  const area = `${path} L${x(data.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`
  const ticks = [lo, Math.round((lo + hi) / 2), hi]

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (data.length - 1))
    setHover(Math.max(0, Math.min(data.length - 1, i)))
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-pan-y"
        role="img"
        aria-label={`Score trend from ${data[0].score} to ${data[data.length - 1].score}`}
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="stroke-border" strokeWidth="1" />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">
              {t}
            </text>
          </g>
        ))}
        <path d={area} className="fill-primary/10" />
        <path d={path} className="fill-none stroke-primary" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="fill-muted-foreground text-[11px]">
            {i + 1}
          </text>
        ))}
        {/* direct label on the latest point */}
        <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].score)} r="5" className="fill-primary stroke-card" strokeWidth="2" />
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} className="stroke-muted-foreground/40" strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(data[hover].score)} r="5" className="fill-primary stroke-card" strokeWidth="2" />
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border bg-popover px-2.5 py-1.5 text-xs shadow-md"
          style={{ left: `${(x(hover) / W) * 100}%` }}
        >
          <p className="text-muted-foreground">{data[hover].label}</p>
          <p className="font-semibold">
            {data[hover].score}
            {unit}
          </p>
        </div>
      )}
    </div>
  )
}
