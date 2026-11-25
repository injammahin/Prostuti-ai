import { lazy, Suspense, useEffect, useRef } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router"
import { BACKEND_URL, blogApi, modelTestsApi, pastPapersApi, siteApi } from "@/lib/api"
import { prefetchApi } from "@/lib/use-api"
import { TopLoadingBar } from "@/components/Loaders"
import { loadNotices } from "@/lib/notices-store"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { AppProvider, useApp } from "@/lib/app-context"
import PublicLayout from "@/layouts/PublicLayout"
import SignupPrompt from "@/components/SignupPrompt"

// Pages load on demand; all of them are fetched in the background after the first paint,
// so moving between menu items never waits for a download.
const pageImporters = []
const p = (f) => {
  pageImporters.push(f)
  return lazy(f)
}
function preloadAllPages() {
  // Not on data-saver or very slow connections.
  const connection = navigator.connection
  if (connection?.saveData || /2g/.test(connection?.effectiveType ?? "")) return
  const run = () => {
    pageImporters.forEach((load) => load().catch(() => {}))
    prefetchData()
  }
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 2500 })
  else setTimeout(run, 1500)
}
/** The lists people open next, so those pages appear with their content. */
function prefetchData() {
  prefetchApi("past-papers", pastPapersApi.list)
  prefetchApi("blog", blogApi.list)
  prefetchApi("model-tests-list", modelTestsApi.list)
}
const AppLayout = p(() => import("@/layouts/AppLayout"))
const Landing = p(() => import("@/pages/public/Landing"))
const Notices = p(() => import("@/pages/public/Notices"))
const DailyQuiz = p(() => import("@/pages/public/DailyQuiz"))
const NoticeDetail = p(() => import("@/pages/public/NoticeDetail"))
const Calendar = p(() => import("@/pages/public/Calendar"))
const Exams = p(() => import("@/pages/public/Exams"))
const ExamDetail = p(() => import("@/pages/public/ExamDetail"))
const Blog = p(() => import("@/pages/public/Blog"))
const BlogPost = p(() => import("@/pages/public/BlogPost"))
const Legal = p(() => import("@/pages/public/Legal"))
const Login = p(() => import("@/pages/auth/Login"))
const Onboarding = p(() => import("@/pages/auth/Onboarding"))
const NotFound = p(() => import("@/pages/NotFound"))

const Today = p(() => import("@/pages/app/Today"))
const Practice = p(() => import("@/pages/app/Practice"))
const Session = p(() => import("@/pages/app/Session"))
const ModelTests = p(() => import("@/pages/app/ModelTests"))
const TestRun = p(() => import("@/pages/app/TestRun"))
const PastPapers = p(() => import("@/pages/app/PastPapers"))
const PaperSolutions = p(() => import("@/pages/app/PaperSolutions"))
const TestResult = p(() => import("@/pages/app/TestResult"))
const Written = p(() => import("@/pages/app/Written"))
const WrittenAnswer = p(() => import("@/pages/app/WrittenAnswer"))
const WrittenResult = p(() => import("@/pages/app/WrittenResult"))
const Plan = p(() => import("@/pages/app/Plan"))
const Progress = p(() => import("@/pages/app/Progress"))
const Notebook = p(() => import("@/pages/app/Notebook"))
const Alerts = p(() => import("@/pages/app/Alerts"))
const Settings = p(() => import("@/pages/app/Settings"))

function Loader() {
  return (
    <div className="grid min-h-[50dvh] place-items-center">
      <span className="size-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" aria-label="Loading" />
    </div>
  )
}

/** Pages that need a real account — guests are sent to login and brought back afterwards. */
function MembersOnly({ children }) {
  const { isGuest } = useApp()
  const loc = useLocation()
  if (isGuest) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return children
}

/** The admin panel lives on the Laravel backend (Filament). */
function GoToAdminPanel() {
  window.location.replace(`${BACKEND_URL}/admin`)
  return null
}

/**
 * Public entry to the previous BCS papers (website menu). Members go straight in;
 * visitors are signed in as a guest first, so they can read and practise right away
 * and are asked to sign up when they want to keep their results.
 */
function OpenBcsPapers() {
  const { user, loginGuest } = useApp()
  const { pathname } = useLocation()
  useEffect(() => {
    if (!user) loginGuest()
  }, [user, loginGuest])
  if (!user) return <Loader />
  return <Navigate to={`/app${pathname}`} replace />
}

function RequireAuth({ children }) {
  const { user } = useApp()
  const loc = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return children
}

/** Sends one page view to the server each time the page changes (for the admin's visitor stats). */
function PageTracker() {
  const { pathname } = useLocation()
  const lastPath = useRef(null)
  useEffect(() => {
    if (lastPath.current === pathname) return
    const referrer = lastPath.current === null ? document.referrer : undefined
    lastPath.current = pathname
    const t = setTimeout(() => siteApi.trackPageView(pathname, referrer), 1200)
    return () => clearTimeout(t)
  }, [pathname])
  return null
}

function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="daily" element={<DailyQuiz />} />
          <Route path="notices" element={<Notices />} />
          <Route path="notices/:slug" element={<NoticeDetail />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="exams" element={<Exams />} />
          <Route path="exams/:slug" element={<ExamDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="about" element={<Legal page="about" />} />
          <Route path="privacy" element={<Legal page="privacy" />} />
          <Route path="terms" element={<Legal page="terms" />} />
          <Route path="doctors" element={<Navigate to="/exams" replace />} />
        </Route>
        <Route path="bcs-papers" element={<OpenBcsPapers />} />
        <Route path="bcs-papers/:number" element={<OpenBcsPapers />} />
        <Route path="login" element={<Login mode="login" />} />
        <Route path="signup" element={<Login mode="signup" />} />
        <Route path="onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />

        <Route path="app" element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route index element={<Today />} />
          <Route path="practice" element={<Practice />} />
          <Route path="practice/session" element={<Session />} />
          <Route path="model-test" element={<ModelTests />} />
          <Route path="model-test/run" element={<TestRun />} />
          <Route path="model-test/result" element={<TestResult />} />
          <Route path="test" element={<Navigate to="/app/model-test" replace />} />
          <Route path="test/run" element={<Navigate to="/app/model-test/run" replace />} />
          <Route path="test/result" element={<Navigate to="/app/model-test/result" replace />} />
          <Route path="test/*" element={<Navigate to="/app/model-test" replace />} />
          <Route path="bcs-papers" element={<PastPapers />} />
          <Route path="bcs-papers/:number" element={<PaperSolutions />} />
          <Route path="written/*" element={<Navigate to="/app/practice" replace />} />
          <Route path="written" element={<Navigate to="/app/practice" replace />} />
          <Route path="medical" element={<Navigate to="/app/practice" replace />} />
          <Route path="plan" element={<MembersOnly><Plan /></MembersOnly>} />
          <Route path="progress" element={<MembersOnly><Progress /></MembersOnly>} />
          <Route path="notebook" element={<MembersOnly><Notebook /></MembersOnly>} />
          <Route path="notices" element={<Notices inApp />} />
          <Route path="notices/:slug" element={<NoticeDetail inApp />} />
          <Route path="calendar" element={<Calendar inApp />} />
          <Route path="exams" element={<Exams inApp />} />
          <Route path="exams/:slug" element={<ExamDetail inApp />} />
          <Route path="viva" element={<Navigate to="/app" replace />} />
          <Route path="alerts" element={<MembersOnly><Alerts /></MembersOnly>} />
          <Route path="settings" element={<MembersOnly><Settings /></MembersOnly>} />
        </Route>

        <Route path="admin/*" element={<GoToAdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  useEffect(preloadAllPages, [])
  useEffect(() => {
    loadNotices()
  }, [])
  return (
    <AppProvider>
      <TooltipProvider>
        <BrowserRouter>
          <TopLoadingBar />
          <PageTracker />
          <AppRoutes />
          <SignupPrompt />
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  )
}
