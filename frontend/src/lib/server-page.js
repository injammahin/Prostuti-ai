/**
 * What Laravel already put into the page: its content (shown until React's version is ready) and the data behind it.
 * Read once, before React takes over.
 */
function read() {
  const main = document.getElementById("root")?.querySelector("main")
  const element = document.getElementById("server-data")
  try {
    const { path, data } = JSON.parse(element?.textContent ?? "null") ?? {}
    return {
      path,
      data: data ?? {},
      content: main?.firstElementChild ? main : null,
      title: document.title,
      description: document.head.querySelector('meta[name="description"]')?.content,
    }
  } catch {
    return { data: {}, content: null }
  }
}

export const serverPage = read()

/** The address of a page's content. A notice list is a page of its own per section and number; other queries don't matter. */
export function pageAddress({ pathname, search } = window.location) {
  const path = pathname.replace(/\/+$/, "") || "/"
  if (path !== "/notices") return path
  const query = new URLSearchParams(search)
  const kept = new URLSearchParams()
  if (query.get("category")) kept.set("category", query.get("category"))
  if (Number(query.get("page")) > 1) kept.set("page", query.get("page"))
  return kept.size ? `${path}?${kept}` : path
}

/** The server's content (the element itself, so nothing is parsed again). Null on any other page. */
export function firstPageContent() {
  return serverPage.content && pageAddress() === serverPage.path ? serverPage.content : null
}

/** Once the visitor has seen the page React made from it, only pages that are the server's content still use it. */
let used = false
export function firstPageWaiting() {
  return used ? null : firstPageContent()
}
export function firstPageDone() {
  used = true
}
