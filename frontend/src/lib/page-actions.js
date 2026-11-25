import { reportsApi } from "@/lib/api"

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Older phones and in-app browsers
    const field = document.createElement("textarea")
    field.value = text
    field.style.position = "fixed"
    field.style.opacity = "0"
    document.body.append(field)
    field.select()
    document.execCommand("copy")
    field.remove()
  }
}

/** A link to a question opens its explanation too. */
export function openTarget(hash) {
  const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)))
  if (!target) return
  target.querySelector("details")?.setAttribute("open", "")
  target.scrollIntoView()
}

/** "Report a wrong answer" brings the question's number along. */
export function preparePage() {
  const id = new URLSearchParams(window.location.search).get("question")
  const note = document.querySelector("[data-report-question]")
  if (!note) return
  note.hidden = !/^\d+$/.test(id ?? "")
  if (!note.hidden) note.querySelector("b").textContent = id
}

async function sendReport(form) {
  const result = form.querySelector("[data-report-result]")
  const button = form.querySelector("button[type=submit]")
  const fields = new FormData(form)
  const id = new URLSearchParams(window.location.search).get("question")
  const isQuestion = /^\d+$/.test(id ?? "")
  const email = fields.get("email")
  button.disabled = true
  try {
    await reportsApi.send({
      target: isQuestion ? "question" : "page",
      targetRef: isQuestion ? id : "contact",
      reason: fields.get("reason"),
      note: `${fields.get("note").trim()}${email ? `\n\nEmail: ${email}` : ""}`,
    })
    form.reset()
    result.className = "text-sm font-semibold text-success"
    result.textContent = "ধন্যবাদ! আপনার বার্তা আমরা পেয়েছি। (Thank you, we received your message.)"
  } catch {
    result.className = "text-sm font-semibold text-destructive"
    result.textContent = "পাঠানো যায়নি। একটু পরে আবার চেষ্টা করুন। (Could not be sent. Please try again.)"
  } finally {
    button.disabled = false
  }
}

function toggleAll(button) {
  const details = [...document.querySelectorAll("details.qa-why")]
  const open = !details.every((item) => item.open)
  details.forEach((item) => (item.open = open))
  button.dataset.closed ??= button.textContent
  button.textContent = open ? button.dataset.openDetails : button.dataset.closed
}

/** Buttons in the content Laravel writes. They work before and after React starts. */
export function listenForPageActions() {
  document.addEventListener("click", (event) => {
    const all = event.target.closest?.("[data-open-details]")
    if (all) toggleAll(all)

    const copy = event.target.closest?.("[data-copy]")
    if (!copy) return
    copyText(copy.dataset.copy).then(() => {
      const label = copy.textContent
      if (label === copy.dataset.done) return
      copy.textContent = copy.dataset.done
      setTimeout(() => {
        copy.textContent = label
      }, 2000)
    })
  })

  document.addEventListener("submit", (event) => {
    if (!event.target.matches?.("[data-report]")) return
    event.preventDefault()
    sendReport(event.target)
  })

  preparePage()
  openTarget(window.location.hash)
}
