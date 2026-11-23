import { useSyncExternalStore } from "react"
import { notices } from "@/lib/data"
import { api } from "@/lib/api"

/**
 * Notices come from the admin panel (API). The shared `notices` array from data.js is filled in place,
 * so every page keeps reading it the same way; pages call useNoticesVersion() to re-render when it changes.
 */
let version = 0
const listeners = new Set()

export async function loadNotices() {
  try {
    const { data } = await api("/notices", { silent: true })
    notices.splice(0, notices.length, ...data)
    version += 1
    listeners.forEach((listener) => listener())
  } catch {
    /* keep whatever is already loaded */
  }
}

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useNoticesVersion() {
  return useSyncExternalStore(subscribe, () => version)
}
