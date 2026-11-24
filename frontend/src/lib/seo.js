import { useEffect } from "react"

const SITE = "bd3schools"

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!content) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    el.dataset.seo = "1"
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement("link")
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * Sets the page title, description, share preview (Open Graph) and optional
 * structured data for search engines; puts the site defaults back on leave.
 */
export function useSeo({ title, description, image, type = "website", keywords, author, jsonLd } = {}) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : ""
  useEffect(() => {
    if (!title) return
    const prevTitle = document.title
    const descEl = document.head.querySelector('meta[name="description"]')
    const prevDesc = descEl?.getAttribute("content")
    const url = window.location.origin + window.location.pathname
    const fullTitle = title.includes(SITE) ? title : `${title} | ${SITE}`
    const fullImage = image ? (image.startsWith("http") ? image : `${window.location.origin}${image.startsWith("/") ? "" : "/"}${image}`) : `${window.location.origin}/icon-512.png`

    document.title = fullTitle
    setMeta("name", "description", description)
    if (keywords) setMeta("name", "keywords", keywords)
    if (author) setMeta("name", "author", author)
    setMeta("property", "og:title", fullTitle)
    setMeta("property", "og:description", description)
    setMeta("property", "og:type", type)
    setMeta("property", "og:url", url)
    setMeta("property", "og:site_name", SITE)
    setMeta("property", "og:image", fullImage)
    setMeta("name", "twitter:card", "summary_large_image")
    setMeta("name", "twitter:title", fullTitle)
    setMeta("name", "twitter:description", description)
    setMeta("name", "twitter:image", fullImage)
    setLink("canonical", url)

    let script
    if (ld) {
      script = document.createElement("script")
      script.type = "application/ld+json"
      script.text = ld
      document.head.appendChild(script)
    }

    return () => {
      document.title = prevTitle
      if (prevDesc) setMeta("name", "description", prevDesc)
      document.head.querySelectorAll('meta[data-seo="1"]').forEach((el) => el.remove())
      document.head.querySelector('link[rel="canonical"]')?.remove()
      script?.remove()
    }
  }, [title, description, image, type, keywords, author, ld])
}
