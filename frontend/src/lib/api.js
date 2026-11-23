// Small fetch wrapper for the Laravel API.
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

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export async function api(path, { method = "GET", body } = {}) {
  const token = tokenStore.get()
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
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

export const catalogApi = {
  get: () => api("/catalog"),
}

export const practiceApi = {
  start: ({ mode, exam, subject, count }) => api("/practice/sessions", { method: "POST", body: { mode, exam: exam || undefined, subject: subject || undefined, count } }),
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
