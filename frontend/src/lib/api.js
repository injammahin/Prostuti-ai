// Small fetch wrapper for the Laravel API.
import { bcs48thQuestions, BCS_48TH_META } from "./bcs-48th-questions"
import { bcs47thQuestions, BCS_47TH_META } from "./bcs-47th-questions"
import { bcs46thQuestions, BCS_46TH_META } from "./bcs-46th-questions"
import { bcs45thQuestions, BCS_45TH_META } from "./bcs-45th-questions"
import { bcs44thQuestions, BCS_44TH_META } from "./bcs-44th-questions"
import { bcs43rdQuestions, BCS_43RD_META } from "./bcs-43rd-questions"

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1").replace(/\/$/, "")
export const BACKEND_URL = API_URL.replace(/\/api\/v1$/, "")
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

const TOKEN_KEY = "prostuti:token"

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set: (token) => {
    try {
      token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* storage unavailable */
    }
  },
}

/** A random id per browser so the admin can count unique visitors (no personal data). */
let memoryVisitorId = null
export function visitorId() {
  try {
    let id = localStorage.getItem("prostuti:visitor")
    if (!id) {
      id = crypto.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
      localStorage.setItem("prostuti:visitor", id)
    }
    return id
  } catch {
    memoryVisitorId ||= `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
    return memoryVisitorId
  }
}

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

/** Number of API requests in flight, for the top loading bar. Background requests pass `silent`. */
const pending = { count: 0, listeners: new Set() }
export function onPendingChange(listener) {
  pending.listeners.add(listener)
  return () => pending.listeners.delete(listener)
}
const setPending = (delta) => {
  pending.count = Math.max(0, pending.count + delta)
  pending.listeners.forEach((l) => l(pending.count))
}

export async function api(path, { method = "GET", body, silent = false } = {}) {
  if (!silent) setPending(1)
  try {
    return await request(path, method, body)
  } finally {
    if (!silent) setPending(-1)
  }
}

async function request(path, method, body) {
  const token = tokenStore.get()
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        "X-Visitor-Id": visitorId(),
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError("Can't reach the server. Check your internet connection and try again.", 0)
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const firstError = data.errors && Object.values(data.errors)[0]?.[0]
    const message =
      res.status === 429 ? "Too many tries. Please wait a minute and try again." : firstError || data.message || "Something went wrong. Please try again."
    throw new ApiError(message, res.status, data.errors)
  }
  return data
}

export const authApi = {
  sendCode: (email, purpose) => api("/auth/send-code", { method: "POST", body: { email, purpose } }),
  register: (fields) => api("/auth/register", { method: "POST", body: fields }),
  login: (email, password) => api("/auth/login", { method: "POST", body: { email, password } }),
  resetPassword: (fields) => api("/auth/reset-password", { method: "POST", body: fields }),
  google: (credential) => api("/auth/google", { method: "POST", body: { credential } }),
  me: () => api("/me"),
  updateMe: (fields) => api("/me", { method: "PATCH", body: fields }),
  logout: () => api("/auth/logout", { method: "POST" }),
}

/** Previous BCS papers, newest first: [{ number, source, name, name_bn, special, questions }] */
export const pastPapersApi = {
  list: async () => {
    try {
      const res = await api("/past-papers")
      if (res?.papers) {
        let has48 = false
        let has47 = false
        let has46 = false
        const papers = res.papers.map((p) => {
          if (p.number === 48) {
            has48 = true
            return {
              ...p,
              questions: Math.max(p.questions || 0, 200),
              name: "48th BCS",
              name_bn: "৪৮তম বিশেষ বিসিএস",
              special: true,
            }
          }
          if (p.number === 47) {
            has47 = true
            return {
              ...p,
              questions: Math.max(p.questions || 0, 200),
              name: "47th BCS",
              name_bn: "৪৭তম বিসিএস",
              special: false,
            }
          }
          if (p.number === 46) {
            has46 = true
            return {
              ...p,
              questions: Math.max(p.questions || 0, 200),
              name: "46th BCS",
              name_bn: "৪৬তম বিসিএস",
              special: false,
            }
          }
          return p
        })
        if (!has46) {
          const insertIdx = (has48 ? 1 : 0) + (has47 ? 1 : 0)
          papers.splice(insertIdx, 0, {
            number: 46,
            source: "46th BCS",
            name: "46th BCS",
            name_bn: "৪৬তম বিসিএস",
            special: false,
            questions: 200,
          })
        }
        if (!has47) {
          const insertIdx = has48 ? 1 : 0
          papers.splice(insertIdx, 0, {
            number: 47,
            source: "47th BCS",
            name: "47th BCS",
            name_bn: "৪৭তম বিসিএস",
            special: false,
            questions: 200,
          })
        }
        if (!has48) {
          papers.unshift({
            number: 48,
            source: "48th BCS",
            name: "48th BCS",
            name_bn: "৪৮তম বিশেষ বিসিএস",
            special: true,
            questions: 200,
          })
        }
        return { ...res, papers }
      }
      return res
    } catch {
      return {
        papers: [
          {
            number: 48,
            source: "48th BCS",
            name: "48th BCS",
            name_bn: "৪৮তম বিশেষ বিসিএস",
            special: true,
            questions: 200,
          },
          {
            number: 47,
            source: "47th BCS",
            name: "47th BCS",
            name_bn: "৪৭তম বিসিএস",
            special: false,
            questions: 200,
          },
          {
            number: 46,
            source: "46th BCS",
            name: "46th BCS",
            name_bn: "৪৬তম বিসিএস",
            special: false,
            questions: 200,
          },
        ],
      }
    }
  },
  /** One paper with every question, its answer and explanation. */
  show: async (number) => {
    const numVal = parseInt(number, 10)
    if (numVal === 48) {
      try {
        const res = await api(`/past-papers/${number}`)
        if (res?.questions && res.questions.length >= 200) {
          return {
            paper: {
              ...res.paper,
              ...BCS_48TH_META,
              questions: res.questions.length,
            },
            questions: res.questions,
          }
        }
      } catch {
        // Fallback to client-side complete 200 questions dataset
      }
      return {
        paper: {
          ...BCS_48TH_META,
        },
        questions: bcs48thQuestions,
      }
    }
    if (numVal === 47) {
      try {
        const res = await api(`/past-papers/${number}`)
        if (res?.questions && res.questions.length >= 200) {
          return {
            paper: {
              ...res.paper,
              ...BCS_47TH_META,
              questions: res.questions.length,
            },
            questions: res.questions,
          }
        }
      } catch {
        // Fallback to client-side complete 200 questions dataset
      }
      return {
        paper: {
          ...BCS_47TH_META,
        },
        questions: bcs47thQuestions,
      }
    }
    if (numVal === 46) {
      try {
        const res = await api(`/past-papers/${number}`)
        if (res?.questions && res.questions.length >= 200) {
          return {
            paper: {
              ...res.paper,
              ...BCS_46TH_META,
              questions: res.questions.length,
            },
            questions: res.questions,
          }
        }
      } catch {
        // Fallback to client-side complete 200 questions dataset
      }
      return {
        paper: {
          ...BCS_46TH_META,
        },
        questions: bcs46thQuestions,
      }
    }
    return api(`/past-papers/${number}`)
  },
}

/** Blog articles: list (no body) and one article with related posts. */
export const blogApi = {
  list: () => api("/posts"),
  show: (slug) => api(`/posts/${encodeURIComponent(slug)}`),
}

export const catalogApi = {
  get: () => api("/catalog"),
}

export const practiceApi = {
  start: ({ mode, exam, subject, count, paper }) =>
    api("/practice/sessions", { method: "POST", body: { mode, exam: exam || undefined, subject: subject || undefined, count, paper: paper || undefined } }),
  show: (id) => api(`/practice/sessions/${id}`),
  answer: (id, questionId, chosenIndex, timeMs) =>
    api(`/practice/sessions/${id}/answers`, { method: "POST", body: { question_id: questionId, chosen_index: chosenIndex, time_ms: timeMs } }),
  finish: (id) => api(`/practice/sessions/${id}/finish`, { method: "POST" }),
}

export const statsApi = {
  get: (exam) => api(`/me/stats${exam ? `?exam=${encodeURIComponent(exam)}` : ""}`),
}

export const mistakesApi = {
  list: () => api("/me/mistakes"),
}

export const dailyQuizApi = {
  get: () => api("/daily-quiz"),
}

export const siteApi = {
  settings: () => api("/settings"),
  trackPageView: (path, referrer) => api("/track", { method: "POST", silent: true, body: { visitor_id: visitorId(), path, referrer: referrer || undefined } }).catch(() => {}),
  dailyQuizCompleted: (score, total, seconds) => api("/daily-quiz/complete", { method: "POST", silent: true, body: { score, total, seconds } }).catch(() => {}),
}

export const adminApi = {
  /** Opens the admin panel already signed in (one-time link from the server). */
  openPanel: async ({ newTab = false } = {}) => {
    const { url } = await api("/admin/sso-link", { method: "POST" })
    if (newTab) window.open(url, "_blank", "noopener")
    else window.location.assign(url)
  },
}

export const aiApi = {
  /** intent: "why_others" | "trick" | "simple" | "free"; history: [{ role: "user"|"assistant", text }] */
  explain: ({ questionId, intent, message, lang, history }) =>
    api("/ai/explain", { method: "POST", body: { question_id: questionId, intent, message: message || undefined, lang, history } }),
}
