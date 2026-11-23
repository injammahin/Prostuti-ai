import { useCallback, useEffect, useState } from "react"

/**
 * In-memory cache shared by every page: revisiting a page shows the last data instantly,
 * then refreshes it quietly in the background ("stale-while-revalidate").
 */
const cache = new Map()

export function clearApiCache() {
  cache.clear()
}

/**
 * Load data from the API. Re-runs when `deps` change; pass `enabled: false` to skip (e.g. for guests).
 * `key` identifies the data in the cache — defaults to the fetcher's source plus its deps.
 * Returns { data, error, loading, refreshing, reload }.
 */
export function useApi(fetcher, deps = [], { enabled = true, key } = {}) {
  const cacheKey = key ?? `${fetcher.toString()}|${JSON.stringify(deps)}`
  const cached = enabled ? cache.get(cacheKey) : undefined

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
    const hit = cache.get(cacheKey)
    setState({ data: hit ?? null, error: null, loading: hit === undefined, refreshing: hit !== undefined })
    fetcher()
      .then((data) => {
        cache.set(cacheKey, data)
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
