import { useEffect, useState } from "react"
import { Link, NavLink, Outlet, useLocation } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { faFacebook, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Logo } from "@/components/shared"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

const links = [
  ["/daily", "dailyQuiz"],
  ["/notices", "notices"],
  ["/calendar", "calendar"],
  ["/exams", "exams"],
]

export function LangToggle({ className }) {
  const { lang, set } = useApp()
  return (
    <button
      onClick={() => set({ lang: lang === "en" ? "bn" : "en" })}
      className={cn("h-9 rounded-full border bg-card px-3.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary", className)}
      aria-label="Switch language"
    >
      {lang === "en" ? "বাংলা" : "English"}
    </button>
  )
}

export default function PublicLayout() {
  const { t, user, isGuest } = useApp()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-white dark:bg-background">
      <header
        className={cn(
          "pt-safe sticky top-0 z-40 transition-all duration-300",
          scrolled ? "border-b border-border/70 bg-white/85 shadow-sm backdrop-blur-xl dark:bg-background/85" : "bg-transparent"
        )}
      >
        <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:h-[4.5rem]">
          <Logo />
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
            {links.map(([to, k]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "relative rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground",
                    isActive && "text-primary after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary"
                  )
                }
              >
                {t(k)}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <LangToggle className="hidden sm:block" />
            {user && !isGuest ? (
              <Button asChild className="h-10 px-5">
                <Link to="/app">
                  Dashboard <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild className="btn-shine h-10 px-5">
                  <Link to="/login">{t("signIn")}</Link>
                </Button>
              </>
            )}
            <button className="grid size-10 place-items-center rounded-full hover:bg-muted lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[84%] max-w-xs p-0">
          <SheetHeader className="border-b p-5">
            <SheetTitle asChild>
              <div>
                <Logo />
              </div>
            </SheetTitle>
          </SheetHeader>
          <nav className="stagger flex flex-col gap-1 p-3">
            {[["/", "home"], ...links].map(([to, k]) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) => cn("rounded-xl px-4 py-3 font-semibold hover:bg-muted", isActive && "bg-secondary text-secondary-foreground")}
              >
                {t(k)}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto space-y-3 border-t p-4">
            {(!user || isGuest) && (
              <Button asChild className="w-full" onClick={() => setOpen(false)}>
                <Link to="/login">{t("signIn")}</Link>
              </Button>
            )}
            <div className="flex items-center gap-2">
              <LangToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1">
        <div key={pathname} className="rise">
          <Outlet />
        </div>
      </main>

      <footer className="mt-16 border-t bg-white dark:bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Prepare for BCS General, NTRCA, Primary Assistant Teacher, Combined Bank Jobs and Bangladesh Bank exams with adaptive practice, model tests and verified notices. Free.
            </p>
            <div className="mt-5 flex gap-2">
              {[faFacebook, faYoutube].map((ic, i) => (
                <a key={i} href="#" aria-label={i ? "YouTube" : "Facebook"} className="grid size-10 place-items-center rounded-full border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                  <FontAwesomeIcon icon={ic} />
                </a>
              ))}
            </div>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold">Prepare</p>
            <ul className="space-y-2.5 text-muted-foreground">
              <li><Link to="/exams/bcs-general" className="hover:text-primary">BCS General</Link></li>
              <li><Link to="/exams/ntrca" className="hover:text-primary">NTRCA Registration</Link></li>
              <li><Link to="/exams/primary-teacher" className="hover:text-primary">Primary Teacher</Link></li>
              <li><Link to="/exams/combined-bank" className="hover:text-primary">Combined Bank Jobs</Link></li>
              <li><Link to="/exams/bangladesh-bank" className="hover:text-primary">Bangladesh Bank</Link></li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold">Stay updated</p>
            <ul className="space-y-2.5 text-muted-foreground">
              <li><Link to="/notices" className="hover:text-primary">Notice board</Link></li>
              <li><Link to="/calendar" className="hover:text-primary">Exam calendar</Link></li>
              <li><a href="#" className="hover:text-primary">Privacy policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/70">
          <p className="mx-auto max-w-6xl px-4 py-5 text-xs leading-relaxed text-muted-foreground">
            Prostuti is an independent preparation platform and is not affiliated with BPSC or any ministry. Always confirm dates on the official website
            and apply only through the official portal. © 2026 Prostuti.
          </p>
        </div>
      </footer>
    </div>
  )
}
