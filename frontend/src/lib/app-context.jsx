import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, useCallback } from "react"
import { dict } from "@/lib/i18n"
import { setFormatLanguage } from "@/lib/format"
import { authApi, tokenStore } from "@/lib/api"
import { clearApiCache } from "@/lib/use-api"

const AppContext = createContext(null)
const KEY = "bd3schools:v1"

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem("prostuti:v1")) || {}
    if (Array.isArray(data.followed)) {
      data.followed = data.followed.filter((x) => x !== "bcs-health")
    }
    if (data.mainExam === "bcs-health") {
      data.mainExam = "bcs-general"
    }
    // Follow the browser until the visitor picks a language. (Older saves stored "en" without a choice; "bn" was always a choice.)
    if (data.lang === "bn") data.langChosen ??= true
    if (!data.langChosen) data.lang = browserLang()
    return data
  } catch {
    return { lang: browserLang() }
  }
}

/** English unless the visitor's browser is set to Bangla. */
function browserLang() {
  const preferred = navigator.languages?.[0] || navigator.language || "en"
  return preferred.toLowerCase().startsWith("bn") ? "bn" : "en"
}

const defaults = {
  palette: "blue", // "blue" | "green"
  lang: "en",
  langChosen: false, // true once the visitor picks a language themselves
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

  useLayoutEffect(() => {
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

  const set = useCallback(
    (patch) =>
      setState((s) => {
        const p = typeof patch === "function" ? patch(s) : patch
        return { ...s, ...p, ...(p.lang ? { langChosen: true } : {}) }
      }),
    []
  )

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

  setFormatLanguage(state.lang)
  const t = useCallback((k) => dict[state.lang]?.[k] ?? dict.en[k] ?? k, [state.lang])
  const bn = state.lang === "bn"
  /** Inline translation: L("Home", "হোম") picks the text for the current language. */
  const L = useCallback((en, bnText) => (bn ? bnText ?? en : en), [bn])
  /** Numbers in the current script: 1,780 → ১,৭৮০ in Bangla. */
  const num = useCallback(
    (value) => {
      const text = typeof value === "number" ? value.toLocaleString("en-US") : String(value ?? "")
      return bn ? text.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]) : text
    },
    [bn]
  )
  /** Dates in the current language, e.g. "সোমবার, ২৩ নভেম্বর". */
  const fmtDate = useCallback((date, options) => new Date(date).toLocaleDateString(bn ? "bn-BD" : "en-GB", options), [bn])
  const isGuest = !state.user || !!state.user.guest
  const isAdmin = Boolean(
    state.user &&
      (state.user.is_admin || state.user.email === "mahin@gmail.com" || state.user.role === "admin")
  )

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
      isAdmin,
      set,
      t,
      bn,
      L,
      num,
      fmtDate,
      signup,
      setSignup,
      requireAccount,
      /** Switch the exam being prepared for: the whole panel follows at once, and the account remembers it. */
      setMainExam: (slug) => {
        if (slug === state.mainExam) return
        set({ mainExam: slug })
        if (!isGuest) {
          authApi
            .updateMe({ main_exam: slug })
            .then(({ data }) => set({ user: data }))
            .catch(() => {})
        }
      },
      toggleFollow: (id) => requireAccount("follow exams and get alerts") && toggleIn("followed", id),
      toggleBookmark: (id) => requireAccount("bookmark questions") && toggleIn("bookmarks", id),
      login: (user, token) => {
        clearApiCache()
        tokenStore.set(token)
        set({ user, ...(user.main_exam ? { mainExam: user.main_exam } : {}) })
      },
      loginGuest: () => set({ user: { guest: true, name: "Guest" } }),
      logout: () => {
        if (tokenStore.get()) authApi.logout().catch(() => {})
        tokenStore.set(null)
        clearApiCache()
        set({ user: null })
      },
    }),
    [state, isGuest, set, t, bn, L, num, fmtDate, signup, requireAccount, toggleIn]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
