/**
 * What Laravel already put into the page: its content (shown until React's version is ready) and the data behind it.
 * Read once, before React takes over.
 */
function read() {
  const root = document.getElementById("root")
  const element = document.getElementById("server-data")
  try {
    const { path, data } = JSON.parse(element?.textContent ?? "null") ?? {}
    return { path, data: data ?? {}, html: root?.querySelector("main")?.innerHTML ?? "" }
  } catch {
    return { data: {}, html: "" }
  }
}

export const serverPage = read()

/** The server's content, while the code of the first page loads. Null on any later page. */
let used = false
export function firstPageHtml() {
  if (used || !serverPage.html || window.location.pathname !== serverPage.path) return null
  return serverPage.html
}
export function firstPageDone() {
  used = true
}
