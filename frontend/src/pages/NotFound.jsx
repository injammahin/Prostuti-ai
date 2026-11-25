import { Link } from "react-router"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="grid min-h-[60dvh] place-items-center px-4 text-center">
      <div>
        <p className="text-5xl font-bold text-primary">404</p>
        <h1 className="mt-2 font-semibold">This page doesn't exist</h1>
        <p className="mt-1 text-sm text-muted-foreground">It may have moved, or the link is wrong.</p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </div>
  )
}
