import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router"
import { BACKEND_URL } from "@/lib/api"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { AppProvider, useApp } from "@/lib/app-context"
import PublicLayout from "@/layouts/PublicLayout"
import AppLayout from "@/layouts/AppLayout"
import SignupPrompt from "@/components/SignupPrompt"

const p = (f) => lazy(f)
const Landing = p(() => import("@/pages/public/Landing"))
const Notices = p(() => import("@/pages/public/Notices"))
const DailyQuiz = p(() => import("@/pages/public/DailyQuiz"))
const NoticeDetail = p(() => import("@/pages/public/NoticeDetail"))
const Calendar = p(() => import("@/pages/public/Calendar"))
const Exams = p(() => import("@/pages/public/Exams"))
const ExamDetail = p(() => import("@/pages/public/ExamDetail"))
const Login = p(() => import("@/pages/auth/Login"))
const Onboarding = p(() => import("@/pages/auth/Onboarding"))
const NotFound = p(() => import("@/pages/NotFound"))

const Today = p(() => import("@/pages/app/Today"))
const Practice = p(() => import("@/pages/app/Practice"))
const Session = p(() => import("@/pages/app/Session"))
const ModelTests = p(() => import("@/pages/app/ModelTests"))
const TestRun = p(() => import("@/pages/app/TestRun"))
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

function RequireAuth({ children }) {
  const { user } = useApp()
  const loc = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return children
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
          <Route path="doctors" element={<Navigate to="/exams" replace />} />
        </Route>
        <Route path="login" element={<Login mode="login" />} />
        <Route path="signup" element={<Login mode="signup" />} />
        <Route path="onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />

        <Route path="app" element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route index element={<Today />} />
          <Route path="practice" element={<Practice />} />
          <Route path="practice/session" element={<Session />} />
          <Route path="test" element={<ModelTests />} />
          <Route path="test/run" element={<TestRun />} />
          <Route path="test/result" element={<TestResult />} />
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
  return (
    <AppProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppRoutes />
          <SignupPrompt />
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  )
}
