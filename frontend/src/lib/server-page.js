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

/** The server's content (the element itself, so nothing is parsed again). Null on any other page. */
export function firstPageContent() {
  return serverPage.content && window.location.pathname === serverPage.path ? serverPage.content : null
}

/** Once the visitor has seen the page React made from it, only pages that are the server's content still use it. */
let used = false
export function firstPageWaiting() {
  return used ? null : firstPageContent()
}
export function firstPageDone() {
  used = true
}
