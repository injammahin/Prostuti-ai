import { useEffect, useState } from "react"

/**
 * A component whose code is fetched the first time it is wanted; null until it is there.
 * Unlike React.lazy, a failed download never takes the page down: onError is called and the next try fetches again.
 */
export function useLazy(load, wanted, onError) {
  const [Component, setComponent] = useState(null)
  useEffect(() => {
    if (!wanted || Component) return
    let cancelled = false
    load()
      .then((module) => !cancelled && setComponent(() => module.default))
      .catch(() => !cancelled && onError?.())
    return () => {
      cancelled = true
    }
    // onError is only called from the try in progress.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [load, wanted, Component])
  return Component
}
