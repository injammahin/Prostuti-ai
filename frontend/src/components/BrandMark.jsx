/**
 * Prostuti logo mark: open book with a rising arrow.
 * variant "tile"  = deep green rounded tile (default, for light backgrounds)
 * variant "bare"  = book + arrow only (for dark/brand backgrounds)
 * variant "white" = white tile with green arrow (app icon on brand bg)
 */
export default function BrandMark({ variant = "tile", className = "size-9", round = false }) {
  const tile = variant === "tile" ? "var(--brand)" : variant === "white" ? "#ffffff" : "none"
  const page = variant === "white" ? "var(--brand)" : "#ffffff"
  const arrow = variant === "white" ? "var(--primary)" : "var(--glow)"
  const gap = variant === "white" ? "#ffffff" : "var(--brand)"
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      {tile !== "none" && (round ? <circle cx="24" cy="24" r="24" fill={tile} /> : <rect width="48" height="48" rx="12" fill={tile} />)}
      {/* pages */}
      <path d="M8.5 19.2c4.6-1.3 9.4-1.1 13.6.6v15.6c-4.3-1.6-9-1.8-13.6-.4Z" fill={page} />
      <path d="M39.5 19.2c-4.6-1.3-9.4-1.1-13.6.6v15.6c4.3-1.6 9-1.8 13.6-.4Z" fill={page} />
      {/* arrow with knock-out outline */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 35V10.5M18.6 15.6 24 10.2l5.4 5.4" stroke={gap} strokeWidth="7" />
        <path d="M24 35V10.5M18.6 15.6 24 10.2l5.4 5.4" stroke={arrow} strokeWidth="3.6" />
      </g>
    </svg>
  )
}
