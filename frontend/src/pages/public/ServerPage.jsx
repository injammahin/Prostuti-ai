import { useEffect } from "react"
import { useLocation } from "react-router"
import { PageLoader } from "@/components/Loaders"
import ServerContent from "@/components/ServerContent"
import { EmptyState } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { pagesApi } from "@/lib/api"
import { useApp } from "@/lib/app-context"
import { useSeo } from "@/lib/seo"
import { firstPageContent, serverPage } from "@/lib/server-page"
import { useApi } from "@/lib/use-api"
import NotFound from "@/pages/NotFound"

/** The pages made from the question bank (/bcs, /ntrca, /model-tests …). Laravel writes them; this shows them. */
export default function ServerPage() {
  const { pathname, hash } = useLocation()
  const { L } = useApp()
  const path = pathname.replace(/\/+$/, "")
  const element = firstPageContent()
  const { data, error, loading, reload } = useApi(() => pagesApi.show(path), [path], { key: `page:${path}`, enabled: !element })

  useSeo(element ? { title: serverPage.title, description: serverPage.description, type: "article" } : data ? { title: data.title, description: data.description, image: data.image, type: data.type, jsonLd: data.json_ld } : {})

  // These pages are in Bangla whatever the menus are in.
  useEffect(() => {
    const before = document.documentElement.lang
    document.documentElement.lang = "bn"
    return () => {
      document.documentElement.lang = before
    }
  }, [])

  const ready = !!(element || data)
  useEffect(() => {
    if (ready && hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [ready, hash, path])

  if (element) return <ServerContent element={element} />
  if (data) return <ServerContent html={data.html} />
  if (loading) return <PageLoader className="mx-auto max-w-4xl px-4 py-8" />
  if (error?.status === 404) return <NotFound />
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <EmptyState title={L("Couldn't load the page", "পাতাটি লোড করা যায়নি")} text={error?.message} action={<Button onClick={reload}>{L("Try again", "আবার চেষ্টা করুন")}</Button>} />
    </div>
  )
}
