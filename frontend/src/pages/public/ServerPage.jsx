import { useEffect } from "react"
import { useLocation } from "react-router"
import { PageLoader } from "@/components/Loaders"
import ServerContent from "@/components/ServerContent"
import { EmptyState } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { pagesApi } from "@/lib/api"
import { useApp } from "@/lib/app-context"
import { preparePage, openTarget } from "@/lib/page-actions"
import { useSeo } from "@/lib/seo"
import { firstPageContent, pageAddress, serverPage } from "@/lib/server-page"
import { useApi } from "@/lib/use-api"
import NotFound from "@/pages/NotFound"

/** Pages written by Laravel (/bcs, /notices, /contact …), the same for everyone. `lang` is the language of their text. */
export default function ServerPage({ lang = "bn", children }) {
  const location = useLocation()
  const { L } = useApp()
  const address = pageAddress(location)
  const element = firstPageContent()
  const { data, error, loading, reload } = useApi(() => pagesApi.show(address), [address], { key: `page:${address}`, enabled: !element })

  useSeo(element ? { title: serverPage.title, description: serverPage.description, type: "article" } : data ? { title: data.title, description: data.description, image: data.image, type: data.type, jsonLd: data.json_ld } : {})

  // These pages are in one language whatever the menus are in.
  useEffect(() => {
    const before = document.documentElement.lang
    document.documentElement.lang = lang
    return () => {
      document.documentElement.lang = before
    }
  }, [lang])

  const ready = !!(element || data)
  useEffect(() => {
    if (!ready) return
    preparePage()
    openTarget(location.hash)
  }, [ready, location.hash, address])

  if (element)
    return (
      <>
        <ServerContent element={element} />
        {children}
      </>
    )
  if (data)
    return (
      <>
        <ServerContent html={data.html} />
        {children}
      </>
    )
  if (loading) return <PageLoader className="mx-auto max-w-4xl px-4 py-8" />
  if (error?.status === 404) return <NotFound />
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <EmptyState title={L("Couldn't load the page", "পাতাটি লোড করা যায়নি")} text={error?.message} action={<Button onClick={reload}>{L("Try again", "আবার চেষ্টা করুন")}</Button>} />
    </div>
  )
}
