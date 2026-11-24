// Small fetch wrapper for the Laravel API.
import { bcs48thQuestions, BCS_48TH_META } from "./bcs-48th-questions"
import { bcs47thQuestions, BCS_47TH_META } from "./bcs-47th-questions"
import { bcs46thQuestions, BCS_46TH_META } from "./bcs-46th-questions"
import { bcs45thQuestions, BCS_45TH_META } from "./bcs-45th-questions"
import { bcs44thQuestions, BCS_44TH_META } from "./bcs-44th-questions"
import { bcs43rdQuestions, BCS_43RD_META } from "./bcs-43rd-questions"
import { bcs42ndQuestions, BCS_42ND_META } from "./bcs-42nd-questions"
import { bcs41stQuestions, BCS_41ST_META } from "./bcs-41st-questions"
import { bcs40thQuestions, BCS_40TH_META } from "./bcs-40th-questions"
import { bcs39thQuestions, BCS_39TH_META } from "./bcs-39th-questions"
import { bcs38thQuestions, BCS_38TH_META } from "./bcs-38th-questions"
import { bcs37thQuestions, BCS_37TH_META } from "./bcs-37th-questions"
import { bcs36thQuestions, BCS_36TH_META } from "./bcs-36th-questions"
import { bcs35thQuestions, BCS_35TH_META } from "./bcs-35th-questions"
import { bcs34thQuestions, BCS_34TH_META } from "./bcs-34th-questions"
import { bcs33rdQuestions, BCS_33RD_META } from "./bcs-33rd-questions"
import { bcs32ndQuestions, BCS_32ND_META } from "./bcs-32nd-questions"
import { bcs31stQuestions, BCS_31ST_META } from "./bcs-31st-questions"
import { bcs30thQuestions, BCS_30TH_META } from "./bcs-30th-questions"
import { bcs29thQuestions, BCS_29TH_META } from "./bcs-29th-questions"
import { bcs28thQuestions, BCS_28TH_META } from "./bcs-28th-questions"
import { bcs27thQuestions, BCS_27TH_META } from "./bcs-27th-questions"
import { bcs26thQuestions, BCS_26TH_META } from "./bcs-26th-questions"
import { bcs25thQuestions, BCS_25TH_META } from "./bcs-25th-questions"
import { bcs24thQuestions, BCS_24TH_META } from "./bcs-24th-questions"
import { bcs23rdQuestions, BCS_23RD_META } from "./bcs-23rd-questions"
import { bcs22ndQuestions, BCS_22ND_META } from "./bcs-22nd-questions"
import { bcs21stQuestions, BCS_21ST_META } from "./bcs-21st-questions"
import { bcs20thQuestions, BCS_20TH_META } from "./bcs-20th-questions"

export const BCS_ALL_DATASETS = {
  48: { meta: BCS_48TH_META, questions: bcs48thQuestions },
  47: { meta: BCS_47TH_META, questions: bcs47thQuestions },
  46: { meta: BCS_46TH_META, questions: bcs46thQuestions },
  45: { meta: BCS_45TH_META, questions: bcs45thQuestions },
  44: { meta: BCS_44TH_META, questions: bcs44thQuestions },
  43: { meta: BCS_43RD_META, questions: bcs43rdQuestions },
  42: { meta: BCS_42ND_META, questions: bcs42ndQuestions },
  41: { meta: BCS_41ST_META, questions: bcs41stQuestions },
  40: { meta: BCS_40TH_META, questions: bcs40thQuestions },
  39: { meta: BCS_39TH_META, questions: bcs39thQuestions },
  38: { meta: BCS_38TH_META, questions: bcs38thQuestions },
  37: { meta: BCS_37TH_META, questions: bcs37thQuestions },
  36: { meta: BCS_36TH_META, questions: bcs36thQuestions },
  35: { meta: BCS_35TH_META, questions: bcs35thQuestions },
  34: { meta: BCS_34TH_META, questions: bcs34thQuestions },
  33: { meta: BCS_33RD_META, questions: bcs33rdQuestions },
  32: { meta: BCS_32ND_META, questions: bcs32ndQuestions },
  31: { meta: BCS_31ST_META, questions: bcs31stQuestions },
  30: { meta: BCS_30TH_META, questions: bcs30thQuestions },
  29: { meta: BCS_29TH_META, questions: bcs29thQuestions },
  28: { meta: BCS_28TH_META, questions: bcs28thQuestions },
  27: { meta: BCS_27TH_META, questions: bcs27thQuestions },
  26: { meta: BCS_26TH_META, questions: bcs26thQuestions },
  25: { meta: BCS_25TH_META, questions: bcs25thQuestions },
  24: { meta: BCS_24TH_META, questions: bcs24thQuestions },
  23: { meta: BCS_23RD_META, questions: bcs23rdQuestions },
  22: { meta: BCS_22ND_META, questions: bcs22ndQuestions },
  21: { meta: BCS_21ST_META, questions: bcs21stQuestions },
  20: { meta: BCS_20TH_META, questions: bcs20thQuestions },
}

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
    const fullPaperNumbers = [
      48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34,
      33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20
    ]
    try {
      const res = await api("/past-papers")
      let papers = Array.isArray(res?.papers) ? [...res.papers] : []
      papers = papers.map((p) => {
        const dataset = BCS_ALL_DATASETS[p.number]
        if (dataset) {
          return {
            ...p,
            questions: Math.max(p.questions || 0, dataset.questions.length),
            name: dataset.meta.name,
            name_bn: dataset.meta.name_bn,
            special: dataset.meta.special,
          }
        }
        return p
      })

      for (const num of fullPaperNumbers) {
        if (!papers.some((p) => p.number === num)) {
          const ds = BCS_ALL_DATASETS[num]
          if (ds) {
            papers.push({
              number: num,
              source: ds.meta.source,
              name: ds.meta.name,
              name_bn: ds.meta.name_bn,
              special: ds.meta.special,
              questions: ds.questions.length,
            })
          }
        }
      }
      papers.sort((a, b) => b.number - a.number)
      return { ...res, papers }
    } catch {
      const papers = fullPaperNumbers.map((num) => {
        const ds = BCS_ALL_DATASETS[num]
        return {
          number: num,
          source: ds.meta.source,
          name: ds.meta.name,
          name_bn: ds.meta.name_bn,
          special: ds.meta.special,
          questions: ds.questions.length,
        }
      })
      return { papers }
    }
  },
  /** One paper with every question, its answer and explanation. */
  show: async (number) => {
    const numVal = parseInt(number, 10)
    const entry = BCS_ALL_DATASETS[numVal]
    if (entry) {
      try {
        const res = await api(`/past-papers/${number}`)
        if (res?.questions && res.questions.length >= entry.questions.length) {
          return {
            paper: {
              ...res.paper,
              ...entry.meta,
              questions: res.questions.length,
            },
            questions: res.questions,
          }
        }
      } catch {
        // Fallback to client-side complete verified dataset
      }
      return {
        paper: {
          ...entry.meta,
        },
        questions: entry.questions,
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
