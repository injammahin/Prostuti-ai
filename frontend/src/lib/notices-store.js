import { useSyncExternalStore } from "react"
import { notices } from "@/lib/data"
import { api } from "@/lib/api"
import { serverPage } from "@/lib/server-page"

/**
 * Notices come from the admin panel (API). The shared `notices` array from data.js is filled in place,
 * so every page keeps reading it the same way; pages call useNoticesVersion() to re-render when it changes.
 */
let version = 0
const listeners = new Set()

const STORAGE_KEY = "bd3schools:api:notices"

function show(data) {
  // Status notes without a date (e.g. "circular not published yet") go after the notices people must act on.
  const isNote = (n) => n.type === "other" && !n.applyUntil && !n.examDate
  notices.splice(0, notices.length, ...data.filter((n) => !isNote(n)), ...data.filter(isNote))
  version += 1
  listeners.forEach((listener) => listener())
}

/** Shows the notices from the last visit at once, then the current ones. */
export async function loadNotices() {
  if (!serverPage.data.notices) {
    try {
      const { at, data } = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
      if (data && Date.now() - at < 24 * 60 * 60 * 1000) show(data)
    } catch {
      /* nothing saved */
    }
  }
  try {
    const { data } = await api("/notices", { silent: true })
    show(data)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now(), data }))
    } catch {
      /* storage unavailable */
    }
  } catch {
    /* keep whatever is already loaded */
  }
}

// Notices that came with the page are there from the first render.
if (serverPage.data.notices) show(serverPage.data.notices)

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useNoticesVersion() {
  return useSyncExternalStore(subscribe, () => version)
}
