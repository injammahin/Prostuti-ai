/** Star and page shapes of the bd3schools mark (48×48), shared with the favicon and admin logo. */
export const STAR = "M24 7.8 25.15 10.82 28.37 10.98 25.85 13 26.7 16.12 24 14.35 21.3 16.12 22.15 13 19.63 10.98 22.85 10.82Z"
export const LEFT_PAGE = "M9 21.6C13.6 19.2 18.9 19.3 23.2 22.4V36.6C18.9 33.8 13.6 33.6 9 35.6Z"
export const RIGHT_PAGE = "M39 21.6C34.4 19.2 29.1 19.3 24.8 22.4V36.6C29.1 33.8 34.4 33.6 39 35.6Z"

/**
 * bd3schools logo mark: an open book with a star rising above it.
 * variant "tile" = blue rounded tile (default, works on light and dark backgrounds)
 * variant "bare" = book + star only (for brand-coloured backgrounds)
 */
export default function BrandMark({ variant = "tile", className = "size-9", round = false }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      {variant === "tile" && (round ? <circle cx="24" cy="24" r="24" fill="#1d6ca8" /> : <rect width="48" height="48" rx="12" fill="#1d6ca8" />)}
      <path d={STAR} fill="#f59e0b" />
      <path d={LEFT_PAGE} fill="#ffffff" />
      <path d={RIGHT_PAGE} fill="#9fd3f7" />
    </svg>
  )
}
