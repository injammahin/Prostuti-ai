/**
 * Stands in for @fortawesome/react-fontawesome (see the alias in vite.config.js): the same <svg> and the same
 * base style, without the 100 KB Font Awesome engine. Supports what this site uses: icon, className, fixedWidth
 * and ordinary svg attributes. Other Font Awesome props (spin, size, rotation…): use Tailwind classes instead.
 */
const css =
  ".svg-inline--fa{box-sizing:content-box;display:var(--fa-display,inline-block);height:1em;overflow:visible;vertical-align:-.125em;width:var(--fa-width,1.25em)}.fa-fw{--fa-width:1.25em}"

// First in <head>, as Font Awesome does it, so the site's own styles come after it.
if (!document.getElementById("fa-base")) {
  const style = document.createElement("style")
  style.id = "fa-base"
  style.textContent = css
  document.head.prepend(style)
}

export function FontAwesomeIcon({ icon, className, fixedWidth, ...rest }) {
  if (!icon) return null
  const [width, height, , , path] = icon.icon
  return (
    <svg
      data-prefix={icon.prefix}
      data-icon={icon.iconName}
      className={["svg-inline--fa", `fa-${icon.iconName}`, className, fixedWidth && "fa-fw"].filter(Boolean).join(" ")}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden={rest["aria-label"] ? "false" : "true"}
      {...rest}
    >
      <path fill="currentColor" d={path} />
    </svg>
  )
}
