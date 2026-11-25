import { Link, NavLink } from "react-router"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Logo } from "@/components/shared"
import { LangToggle } from "@/layouts/PublicLayout"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

/** The website's menu on phones and tablets (loaded by PublicLayout when it is opened). */
export default function MobileMenu({ open, onOpenChange, links }) {
  const { t, user, isGuest } = useApp()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
              onClick={() => onOpenChange(false)}
              className={({ isActive }) => cn("rounded-xl px-4 py-3 font-semibold hover:bg-muted", isActive && "bg-secondary text-secondary-foreground")}
            >
              {t(k)}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-3 border-t p-4">
          {(!user || isGuest) && (
            <Button asChild className="w-full" onClick={() => onOpenChange(false)}>
              <Link to="/login">{t("signIn")}</Link>
            </Button>
          )}
          <div className="flex items-center gap-2">
            <LangToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
