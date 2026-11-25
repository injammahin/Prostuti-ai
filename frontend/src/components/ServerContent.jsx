import { useLayoutEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { useApp } from "@/lib/app-context"

/** Content made by Laravel: either the element that came with the page or HTML from the API. */
export default function ServerContent({ element, html }) {
  const ref = useRef(null)
  const navigate = useNavigate()
  const { user, loginGuest } = useApp()

  // The nodes are moved, not copied (a page can have 200 questions), and given back for the next time.
  useLayoutEffect(() => {
    const holder = ref.current
    if (!element || !holder) return
    holder.replaceChildren(...element.childNodes)
    return () => element.replaceChildren(...holder.childNodes)
  }, [element])

  const onClick = (event) => {
    if (event.target.closest("[data-print]")) return window.print()
    const link = event.target.closest("a[href]")
    if (!link || link.target || link.hasAttribute("download") || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const href = link.getAttribute("href")
    // Pages of the website open without a reload; files and other sites as usual.
    if (!href.startsWith("/") || href.startsWith("//") || /^\/(api|admin|downloads|storage)(\/|$)/.test(href)) return
    event.preventDefault()
    if (href.startsWith("/app") && !user) loginGuest()
    navigate(href)
  }

  return element ? <div ref={ref} onClick={onClick} /> : <div onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
}
