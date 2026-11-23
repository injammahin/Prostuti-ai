import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react"
import { dict } from "@/lib/i18n"
import { authApi, tokenStore } from "@/lib/api"

const AppContext = createContext(null)
const KEY = "prostuti:v1"

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY)) || {}
    if (Array.isArray(data.followed)) {
      data.followed = data.followed.filter((x) => x !== "bcs-health")
    }
    if (data.mainExam === "bcs-health") {
      data.mainExam = "bcs-general"
    }
    return data
  } catch {
    return {}
  }
}

const defaults = {
  palette: "blue", // "blue" | "green"
  lang: "en",
  fontSize: 16,
  user: null, // { id, name, email, phone, is_admin, ... } | { guest: true, name: "Guest" }
  followed: ["bcs-general", "ntrca", "primary-teacher", "combined-bank", "bangladesh-bank"],
  mainExam: "bcs-general",
  sidebarCollapsed: false,
  bookmarks: ["bcs_q1", "cbank_q1"],
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => ({ ...defaults, ...load() }))
  const [signup, setSignup] = useState({ open: false, reason: "" })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable */
    }
    const root = document.documentElement
    root.classList.remove("dark")
    root.dataset.accent = state.palette
    root.lang = state.lang
    root.style.setProperty("--app-font-size", `${state.fontSize}px`)
  }, [state])

  const set = useCallback((patch) => setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) })), [])

  // Refresh the signed-in user from the server once on load; drop the session if the token is no longer valid.
  useEffect(() => {
    if (!tokenStore.get()) return
    authApi
      .me()
      .then(({ data }) => set({ user: data }))
      .catch((e) => {
        if (e.status === 401) {
          tokenStore.set(null)
          set({ user: null })
        }
      })
  }, [set])

  const toggleIn = useCallback(
    (field, id) =>
      setState((s) => ({
        ...s,
        [field]: s[field].includes(id) ? s[field].filter((x) => x !== id) : [...s[field], id],
      })),
    []
  )

  const t = useCallback((k) => dict[state.lang]?.[k] ?? dict.en[k] ?? k, [state.lang])
  const isGuest = !state.user || !!state.user.guest

  /** Returns true when the user has an account; otherwise opens the sign-up prompt. */
  const requireAccount = useCallback(
    (reason) => {
      if (!isGuest) return true
      setSignup({ open: true, reason })
      return false
    },
    [isGuest]
  )

  const value = useMemo(
    () => ({
      ...state,
      isGuest,
      set,
      t,
      signup,
      setSignup,
      requireAccount,
      toggleFollow: (id) => requireAccount("follow exams and get alerts") && toggleIn("followed", id),
      toggleBookmark: (id) => requireAccount("bookmark questions") && toggleIn("bookmarks", id),
      login: (user, token) => {
        tokenStore.set(token)
        set({ user, ...(user.main_exam ? { mainExam: user.main_exam } : {}) })
      },
      loginGuest: () => set({ user: { guest: true, name: "Guest" } }),
      logout: () => {
        if (tokenStore.get()) authApi.logout().catch(() => {})
        tokenStore.set(null)
        set({ user: null })
      },
    }),
    [state, isGuest, set, t, signup, requireAccount, toggleIn]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
