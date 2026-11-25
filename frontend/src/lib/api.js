// Small fetch wrapper for the Laravel API.
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1").replace(/\/$/, "")
export const BACKEND_URL = API_URL.replace(/\/api\/v1$/, "")
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

const TOKEN_KEY = "bd3schools:token"

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("prostuti:token")
    } catch {
      return null
    }
  },
  set: (token) => {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
      } else {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem("prostuti:token")
      }
    } catch {
      /* storage unavailable */
    }
  },
}

/** A random id per browser so the admin can count unique visitors (no personal data). */
let memoryVisitorId = null
export function visitorId() {
  try {
    let id = localStorage.getItem("bd3schools:visitor") || localStorage.getItem("prostuti:visitor")
    if (!id) {
      id = crypto.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
      localStorage.setItem("bd3schools:visitor", id)
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
  /** Permanently deletes the account and everything in it. */
  deleteMe: () => api("/me", { method: "DELETE", body: { confirm: "DELETE" } }),
}

/**
 * Previous BCS papers, newest first. `questions` is how many are shown: the paper's own ones (`own`) plus those added
 * from other papers (`added`) to make a full set; `total` is how many the real paper had.
 */
export const pastPapersApi = {
  list: async () => {
    const { papers } = await api("/past-papers")
    return { papers: papers.map((p) => ({ ...p, own: p.questions, questions: p.shown })) }
  },
  /** One paper with every question, its answer and explanation, numbered 1 to 200. */
  show: async (number) => {
    const { paper, questions, extra_questions: extra } = await api(`/past-papers/${number}`)
    // The paper's own questions keep their printed numbers; the others take the free ones.
    const used = new Set(questions.map((q) => q.number).filter(Boolean))
    let next = 1
    const free = () => {
      while (used.has(next)) next += 1
      used.add(next)
      return next
    }
    const all = [...questions, ...extra].map((q) => ({ ...q, number: q.number || free() })).sort((a, b) => a.number - b.number)
    return { paper: { ...paper, own: paper.questions, questions: paper.shown }, questions: all }
  },
}

/** Dynamic model tests and real exam drills. */
export const modelTestsApi = {
  list: (exam) => api(`/model-tests${exam ? `?exam=${encodeURIComponent(exam)}` : ""}`),
  show: (id) => api(`/model-tests/${encodeURIComponent(id)}`),
  submit: (id, answers, usedSeconds) =>
    api(`/model-tests/${encodeURIComponent(id)}/submit`, {
      method: "POST",
      body: { answers, used_seconds: usedSeconds },
    }),
}

/** Blog articles: list (no body) and one article with related posts. */
export const blogApi = {
  list: () => api("/posts"),
  show: (slug) => api(`/posts/${encodeURIComponent(slug)}`),
}

export const noticesApi = {
  show: (slug) => api(`/notices/${encodeURIComponent(slug)}`),
}

/** Pages made from the question bank (/bcs, /ntrca …): the same content as at their own address. */
export const pagesApi = {
  show: (path) => api(`/pages?path=${encodeURIComponent(path)}`),
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
  list: (exam) => api(`/me/mistakes${exam ? `?exam=${encodeURIComponent(exam)}` : ""}`),
}

/** Mistakes reported in a question (its id) or a notice (its slug). */
export const reportsApi = {
  send: ({ target, targetRef, reason, note }) => api("/reports", { method: "POST", body: { target, target_ref: String(targetRef), reason, note: note || undefined } }),
}

export const dailyQuizApi = {
  get: () => api("/daily-quiz"),
  reshuffle: () => api("/daily-quiz/reshuffle", { method: "POST" }),
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
