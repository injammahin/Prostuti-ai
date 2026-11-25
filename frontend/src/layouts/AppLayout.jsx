import { Suspense, useState } from "react"
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHouse,
  faListCheck,
  faPenNib,
  faBullhorn,
  faEllipsis,
  faCalendarDays,
  faChartLine,
  faBook,
  faBell,
  faGear,
  faRoute,
  faChevronDown,
  faRightFromBracket,
  faCheck,
  faShieldHalved,
  faLayerGroup,
  faStopwatch,
  faMagnifyingGlass,
  faUserPlus,
  faArrowRight,
  faBars,
  faBarsStaggered,
  faLock,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Logo, Pill } from "@/components/shared"
import { LangToggle } from "@/layouts/PublicLayout"
import { useApp } from "@/lib/app-context"
import { exams } from "@/lib/data"
import { adminApi } from "@/lib/api"
import AnnouncementBar from "@/components/AnnouncementBar"
import { PageLoader } from "@/components/Loaders"
import { cn } from "@/lib/utils"

const groups = [
  {
    label: "g_study",
    items: [
      { to: "/app", key: "dashboard", icon: faHouse, end: true },
      { to: "/app/practice", key: "practice", icon: faListCheck },
      { to: "/app/model-test", key: "tests", icon: faStopwatch },
      { to: "/app/bcs-papers", key: "papers", icon: faFileLines },
      { to: "/app/notebook", key: "notebook", icon: faBook, locked: true },
      { to: "/app/notices", key: "notices", icon: faBullhorn },
    ],
  },
  {
    label: "g_track",
    items: [
      { to: "/app/progress", key: "progress", icon: faChartLine, locked: true },
      { to: "/app/plan", key: "planner", icon: faRoute, locked: true },
      { to: "/app/calendar", key: "calendar", icon: faCalendarDays },
      { to: "/app/exams", key: "exams", icon: faLayerGroup },
    ],
  },
  {
    label: "g_account",
    items: [
      { to: "/app/alerts", key: "alerts", icon: faBell, locked: true },
      { to: "/app/settings", key: "settings", icon: faGear, locked: true },
    ],
  },
]

const tabs = [
  { to: "/app", key: "today", icon: faHouse, end: true },
  { to: "/app/practice", key: "practice", icon: faListCheck },
  { to: "/app/model-test", key: "tests", icon: faStopwatch },
  { to: "/app/notices", key: "notices", icon: faBullhorn },
]
const moreItems = groups.flatMap((g) => g.items).filter((i) => !tabs.some((t) => t.to === i.to))

const titles = {
  "/app": "dashboard",
  "/app/practice": "practice",
  "/app/model-test": "tests",
  "/app/test": "tests",
  "/app/bcs-papers": "papers",
  "/app/notices": "notices",
  "/app/progress": "progress",
  "/app/plan": "planner",
  "/app/notebook": "notebook",
  "/app/calendar": "calendar",
  "/app/exams": "exams",
  "/app/alerts": "alerts",
  "/app/settings": "settings",
}

function SideLink({ item, t, collapsed, tooltip = true }) {
  const { isGuest, L } = useApp()
  if (isGuest && item.locked) {
    const locked = (
      <Link
        to="/login"
        state={{ from: item.to }}
        aria-label={`${t("n_" + item.key)} (log in to use)`}
        className="group relative flex h-11 items-center gap-3 overflow-hidden rounded-xl px-3 text-sm font-medium whitespace-nowrap text-muted-foreground/70 transition-colors hover:bg-muted"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted/50">
          <FontAwesomeIcon icon={item.icon} className="text-[0.9rem] opacity-60" />
        </span>
        <span className={cn("min-w-0 flex-1 truncate transition-opacity duration-200", collapsed && "opacity-0")}>{t("n_" + item.key)}</span>
        <FontAwesomeIcon icon={faLock} className={cn("text-[0.7rem] transition-opacity duration-200", collapsed && "opacity-0")} />
      </Link>
    )
    if (!tooltip) return locked
    return (
      <Tooltip delayDuration={collapsed ? 150 : 700} disableHoverableContent>
        <TooltipTrigger asChild>
          <div>{locked}</div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10} className="rounded-lg px-3 py-1.5 text-xs">
          {L(`Log in to use ${t("n_" + item.key)}`, `${t("n_" + item.key)} ব্যবহার করতে লগ ইন করুন`)}
        </TooltipContent>
      </Tooltip>
    )
  }
  const link = (
    <NavLink
      to={item.to}
      end={item.end}
      aria-label={t("n_" + item.key)}
      className={({ isActive }) =>
        cn(
          "group relative flex h-11 items-center gap-3 overflow-hidden rounded-xl px-3 text-sm font-medium whitespace-nowrap text-foreground/80 transition-colors hover:bg-muted hover:text-foreground",
          isActive && "active bg-secondary font-semibold text-primary hover:bg-secondary hover:text-primary"
        )
      }
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted/70 transition-colors group-[.active]:bg-primary group-[.active]:text-primary-foreground">
        <FontAwesomeIcon icon={item.icon} className="text-[0.9rem]" />
      </span>
      <span className={cn("min-w-0 flex-1 truncate transition-opacity duration-200", collapsed && "opacity-0")}>{t("n_" + item.key)}</span>
      {item.soon && <Pill className={cn("text-[0.6rem] transition-opacity duration-200", collapsed && "opacity-0")}>{L("Soon", "শীঘ্রই")}</Pill>}
      {item.soon && <span className={cn("absolute top-2 left-8 size-1.5 rounded-full bg-warning transition-opacity", collapsed ? "opacity-100" : "opacity-0")} />}
    </NavLink>
  )
  if (!tooltip) return link
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <div>{link}</div>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={10} className="rounded-lg px-3 py-1.5 text-xs">
        {collapsed && (
          <span className="block font-semibold">
            {t("n_" + item.key)}
            {item.soon && ` · ${L("Soon", "শীঘ্রই")}`}
          </span>
        )}
        <span className={cn("block", !collapsed && "font-medium")}>{t("h_" + item.key)}</span>
      </TooltipContent>
    </Tooltip>
  )
}
function ExamSwitcher({ className }) {
  const { mainExam, setMainExam, followed, L } = useApp()
  const current = exams.find((e) => e.slug === mainExam) || exams[0]
  const options = exams.filter((e) => followed.includes(e.slug) || e.tier === 1)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change the exam you are preparing for"
        className={cn("card flex h-11 min-w-0 items-center gap-2.5 rounded-full py-1 pr-3.5 pl-1.5 text-left transition-colors hover:border-primary/30", className)}
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-primary">
          <FontAwesomeIcon icon={faLayerGroup} className="text-xs" />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block text-[0.65rem] font-medium text-muted-foreground">{L("Preparing for", "প্রস্তুতি নিচ্ছেন")}</span>
          <span className="block truncate text-sm font-semibold">{L(current.name, current.nameBn || current.name)}</span>
        </span>
        <FontAwesomeIcon icon={faChevronDown} className="text-[0.6rem] text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 rounded-xl p-1.5">
        <DropdownMenuLabel className="text-xs text-muted-foreground">{L("Which exam are you preparing for?", "কোন পরীক্ষার প্রস্তুতি নিচ্ছেন?")}</DropdownMenuLabel>
        {options.map((e) => (
          <DropdownMenuItem key={e.slug} onClick={() => setMainExam(e.slug)} disabled={e.comingSoon} className="rounded-lg py-2.5">
            <span className="flex-1 font-medium">{L(e.name, e.nameBn || e.name)}</span>
            {e.comingSoon && <span className="text-xs text-muted-foreground">{L("Soon", "শীঘ্রই")}</span>}
            {e.slug === mainExam && <FontAwesomeIcon icon={faCheck} className="text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UserMenu({ showName }) {
  const { user, logout, t, isGuest, L } = useApp()
  const nav = useNavigate()
  const initials = isGuest ? "G" : (user?.name || "U").split(" ").map((s) => s[0]).slice(0, 2).join("")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full p-0.5 pr-1 transition-colors hover:bg-muted" aria-label="Account menu">
        <Avatar className="size-9 ring-2 ring-primary/15">
          <AvatarFallback className="bg-gradient-to-br from-brand to-brand-strong text-sm font-bold text-white">{initials}</AvatarFallback>
        </Avatar>
        {showName && (
          <span className="hidden text-left leading-tight xl:block">
            <span className="block text-sm font-bold">{user?.name}</span>
            <span className="text-xs text-muted-foreground">{isGuest ? L("Guest mode", "অতিথি মোড") : L("Free account", "ফ্রি অ্যাকাউন্ট")}</span>
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5">
        <DropdownMenuLabel>
          <p className="font-bold">{user?.name}</p>
          <p className="text-xs font-normal text-muted-foreground">{isGuest ? L("Exploring without an account", "অ্যাকাউন্ট ছাড়া ঘুরে দেখছেন") : user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isGuest ? (
          <>
            <DropdownMenuItem className="rounded-lg py-2" onClick={() => nav("/signup")}>
              <FontAwesomeIcon icon={faUserPlus} fixedWidth /> {L("Create free account", "ফ্রি অ্যাকাউন্ট খুলুন")}
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg py-2" onClick={() => nav("/login")}>
              <FontAwesomeIcon icon={faArrowRight} fixedWidth /> {t("login")}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem className="rounded-lg py-2" onClick={() => nav("/app/settings")}>
              <FontAwesomeIcon icon={faGear} fixedWidth /> {t("settings")}
            </DropdownMenuItem>
            {user?.is_admin && (
              <DropdownMenuItem className="rounded-lg py-2" onClick={() => adminApi.openPanel({ newTab: true }).catch((e) => toast.error(e.message))}>
                <FontAwesomeIcon icon={faShieldHalved} fixedWidth /> {L("Admin panel", "অ্যাডমিন প্যানেল")}
              </DropdownMenuItem>
            )}
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="rounded-lg py-2"
          onClick={() => {
            logout()
            nav("/")
          }}
        >
          <FontAwesomeIcon icon={faRightFromBracket} fixedWidth /> {isGuest ? L("Exit guest mode", "অতিথি মোড থেকে বের হন") : t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SearchBox() {
  const nav = useNavigate()
  const { L } = useApp()
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const q = new FormData(e.currentTarget).get("q")
        nav(`/app/notices?q=${encodeURIComponent(q || "")}`)
      }}
      className="relative hidden w-72 lg:block"
    >
      <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-muted-foreground" />
      <input
        name="q"
        placeholder={L("Search for an exam or notice…", "পরীক্ষা বা নোটিশ খুঁজুন…")}
        className="card h-10 w-full rounded-full pr-4 pl-10 text-sm outline-none transition-shadow focus:ring-[3px] focus:ring-primary/15"
      />
    </form>
  )
}

function NavGroups({ t, collapsed = false, tooltip = true, onNavigate }) {
  return groups.map((g) => (
    <div key={g.label}>
      <div className="relative h-7">
        <p className={cn("px-3.5 text-[0.7rem] font-semibold tracking-wider whitespace-nowrap text-muted-foreground/80 uppercase transition-opacity duration-200", collapsed && "opacity-0")}>
          {t(g.label)}
        </p>
        <span className={cn("absolute top-2 left-3.5 h-px w-5 bg-border transition-opacity duration-200", collapsed ? "opacity-100" : "opacity-0")} />
      </div>
      <div className="space-y-0.5" onClick={onNavigate}>
        {g.items.map((i) => (
          <SideLink key={i.to} item={i} t={t} collapsed={collapsed} tooltip={tooltip} />
        ))}
      </div>
    </div>
  ))
}
export default function AppLayout() {
  const { t, isGuest, set, mainExam, sidebarCollapsed: collapsed, L, fmtDate } = useApp()
  const [drawer, setDrawer] = useState(false)
  const { pathname } = useLocation()
  const immersive = /\/app\/(practice\/session|(model-)?test\/run)/.test(pathname)
  const moreActive = moreItems.some((s) => pathname.startsWith(s.to))
  const title = titles[pathname] ?? titles[Object.keys(titles).filter((k) => k !== "/app" && pathname.startsWith(k))[0]] ?? "dashboard"
  const today = fmtDate(new Date(), { weekday: "long", day: "numeric", month: "long" })

  return (
    <div
      className={cn("portal min-h-dvh transition-[padding] duration-300", collapsed ? "lg:pl-[5.25rem]" : "lg:pl-[17rem]")}
      style={{ "--sidebar-w": collapsed ? "5.25rem" : "17rem" }}
    >
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col overflow-clip border-r bg-sidebar transition-[width] duration-300 lg:flex",
          collapsed ? "w-[5.25rem]" : "w-[17rem]"
        )}
      >
        <div className="flex h-[4.5rem] shrink-0 items-center overflow-clip px-6">
          <Logo className={cn("[&>span]:transition-opacity [&>span]:duration-200", collapsed && "[&>span]:opacity-0")} />
        </div>
        <nav
          className="no-scrollbar flex-1 space-y-5 overflow-x-hidden overflow-y-auto px-[1.125rem] pt-2 pb-6"
          onScroll={(e) => {
            if (e.currentTarget.scrollLeft) e.currentTarget.scrollLeft = 0
          }}
        >
          <NavGroups t={t} collapsed={collapsed} />
        </nav>
      </aside>

      {/* Mobile / tablet drawer */}
      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="left" onOpenAutoFocus={(e) => e.preventDefault()} className="w-[85%] max-w-[18rem] gap-0 p-0">
          <SheetHeader className="h-16 justify-center border-b px-5">
            <SheetTitle asChild>
              <div>
                <Logo />
              </div>
            </SheetTitle>
          </SheetHeader>
          <nav className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-4">
            <NavGroups t={t} tooltip={false} onNavigate={(e) => e.target.closest("a") && setDrawer(false)} />
          </nav>
          <div className="pb-safe flex items-center gap-2 border-t px-4 py-3">
            <LangToggle />
          </div>
        </SheetContent>
      </Sheet>

      {!immersive && <AnnouncementBar />}

      {/* Top bar */}
      {!immersive && (
        <header className="pt-safe sticky top-0 z-20 border-b border-transparent bg-background/95 backdrop-blur-md">
          <div className="flex h-16 items-center gap-2 px-3 sm:gap-2.5 sm:px-4 md:h-[4.5rem] md:px-6 lg:px-8">
            <button
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              className="grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            >
              <FontAwesomeIcon icon={faBars} className="text-[1.05rem]" />
            </button>
            <Logo compact className="hidden sm:flex lg:hidden" />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => set({ sidebarCollapsed: !collapsed })}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  aria-expanded={!collapsed}
                  className="hidden size-10 shrink-0 place-items-center rounded-xl border bg-card text-muted-foreground transition-colors hover:text-primary lg:grid"
                >
                  <FontAwesomeIcon icon={collapsed ? faBars : faBarsStaggered} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="rounded-lg px-3 py-1.5 text-xs font-semibold">
                {collapsed ? L("Show full menu", "পূর্ণ মেনু দেখান") : L("Make menu smaller", "মেনু ছোট করুন")}
              </TooltipContent>
            </Tooltip>
            <div className="hidden min-w-0 lg:ml-1 lg:block">
              <p className="text-lg leading-tight font-semibold">{t("n_" + title)}</p>
              <p className="text-xs text-muted-foreground">{today}</p>
            </div>
            <ExamSwitcher className="max-w-[46vw] sm:max-w-none lg:ml-5" />
            <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
              <SearchBox />
              <LangToggle className="hidden md:block" />
              <Link
                to="/app/alerts"
                className="relative grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Alerts"
              >
                <FontAwesomeIcon icon={faBell} className="text-[1.05rem]" />
                <span className="absolute top-2 right-2.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
              </Link>
              <UserMenu showName />
            </div>
          </div>
        </header>
      )}

      <main className={cn("w-full px-4 md:px-6 lg:px-8", immersive ? "py-0" : "pt-2 pb-28 md:pt-4 md:pb-12")}>
        {isGuest && !immersive && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-primary/15 bg-secondary/60 p-3 pr-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <FontAwesomeIcon icon={faUserPlus} className="text-sm" />
            </span>
            <p className="min-w-0 flex-1 text-sm">
              <b className="font-semibold">{L("You're exploring as a guest.", "আপনি অতিথি হিসেবে ঘুরে দেখছেন।")}</b>{" "}
              <span className="hidden text-muted-foreground sm:inline">{L("Create a free account to save progress, bookmarks and alerts.", "অগ্রগতি ও নোটিফিকেশন সংরক্ষণে ফ্রি অ্যাকাউন্ট খুলুন।")}</span>
            </p>
            <Link to="/signup" className="shrink-0 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground">
              {L("Sign up free", "ফ্রি সাইন আপ")}
            </Link>
          </div>
        )}
        {/* Changing the exam reopens the page for it — except during a test, where answers must not be lost. */}
        <div key={immersive || pathname.endsWith("/result") ? pathname : `${pathname}:${mainExam}`} className={immersive ? undefined : "rise"}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      {/* Phone bottom nav */}
      {!immersive && (
        <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur-md md:hidden" aria-label="Main">
          <div className="mx-auto grid h-16 max-w-lg grid-cols-5">
            {tabs.map((i) => (
              <NavLink key={i.to} to={i.to} end={i.end} className="flex items-center justify-center" aria-label={t(i.key)}>
                {({ isActive }) => (
                  <span className={cn("flex flex-col items-center gap-1 text-[0.68rem] font-semibold text-muted-foreground transition-colors", isActive && "text-primary")}>
                    <span className={cn("grid h-7 w-12 place-items-center rounded-full transition-colors", isActive && "bg-secondary")}>
                      <FontAwesomeIcon icon={i.icon} className="text-[1.05rem]" />
                    </span>
                    {t(i.key)}
                  </span>
                )}
              </NavLink>
            ))}
            <button onClick={() => setDrawer(true)} className="flex items-center justify-center" aria-label={t("more")}>
              <span className={cn("flex flex-col items-center gap-1 text-[0.68rem] font-semibold text-muted-foreground", moreActive && "text-primary")}>
                <span className={cn("grid h-7 w-12 place-items-center rounded-full", moreActive && "bg-secondary")}>
                  <FontAwesomeIcon icon={faEllipsis} className="text-[1.05rem]" />
                </span>
                {t("more")}
              </span>
            </button>
          </div>
        </nav>
      )}
    </div>
  )
}