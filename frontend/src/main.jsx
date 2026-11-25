import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { serverPage } from "@/lib/server-page"

function start() {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

/** The page came complete from the server: let it be drawn first. Touching anything starts the app at once. */
function startAfterPaint() {
  const events = ["pointerdown", "keydown", "touchstart"]
  let started = false
  const once = () => {
    if (started) return
    started = true
    events.forEach((event) => window.removeEventListener(event, once))
    start()
  }
  events.forEach((event) => window.addEventListener(event, once, { passive: true }))
  const soon = () => requestAnimationFrame(() => setTimeout(once, 50))
  if (document.readyState === "complete") soon()
  else window.addEventListener("load", soon, { once: true })
  setTimeout(once, 3000) // a slow image must not hold the app back
}

if (serverPage.content) startAfterPaint()
else start()
