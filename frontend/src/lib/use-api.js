import { useCallback, useEffect, useState } from "react"

/**
 * In-memory cache shared by every page: revisiting a page shows the last data instantly,
 * then refreshes it quietly in the background ("stale-while-revalidate").
 */
const cache = new Map()

/** Public lists (same for everyone) are also kept in the browser, so a reload shows them at once. */
const PERSISTED = ["past-papers", "blog", "model-tests-list"]
const storageKey = (key) => `bd3schools:api:${key}`
const MAX_AGE = 7 * 24 * 60 * 60 * 1000

function read(key) {
  if (cache.has(key)) return cache.get(key)
  if (!PERSISTED.includes(key)) return undefined
  try {
    const { at, data } = JSON.parse(localStorage.getItem(storageKey(key))) ?? {}
    if (!at || Date.now() - at > MAX_AGE) return undefined
    cache.set(key, data)
    return data
  } catch {
    return undefined
  }
}

function write(key, data) {
  cache.set(key, data)
  if (!PERSISTED.includes(key)) return
  try {
    localStorage.setItem(storageKey(key), JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* storage full or unavailable: the in-memory copy is enough */
  }
}

/** Load something into the cache before its page is opened. */
export function prefetchApi(key, fetcher) {
  if (cache.has(key)) return
  fetcher()
    .then((data) => write(key, data))
    .catch(() => {})
}

/** On sign-in and sign-out: forget personal data (public lists stay). */
export function clearApiCache() {
  ;[...cache.keys()].filter((key) => !PERSISTED.includes(key)).forEach((key) => cache.delete(key))
}

/**
 * Load data from the API. Re-runs when `deps` change; pass `enabled: false` to skip (e.g. for guests).
 * `key` identifies the data in the cache — defaults to the fetcher's source plus its deps.
 * Returns { data, error, loading, refreshing, reload }.
 */
export function useApi(fetcher, deps = [], { enabled = true, key } = {}) {
  const cacheKey = key ?? `${fetcher.toString()}|${JSON.stringify(deps)}`
  const cached = enabled ? read(cacheKey) : undefined

  const [state, setState] = useState(() => ({
    data: cached ?? null,
    error: null,
    loading: enabled && cached === undefined,
    refreshing: enabled && cached !== undefined,
  }))
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, error: null, loading: false, refreshing: false })
      return
    }
    let cancelled = false
    const hit = read(cacheKey)
    setState({ data: hit ?? null, error: null, loading: hit === undefined, refreshing: hit !== undefined })
    fetcher()
      .then((data) => {
        write(cacheKey, data)
        if (!cancelled) setState({ data, error: null, loading: false, refreshing: false })
      })
      .catch((error) => {
        // Keep showing the last good data if a background refresh fails.
        if (!cancelled) setState((s) => ({ data: s.data, error: s.data ? null : error, loading: false, refreshing: false }))
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, enabled, tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}
