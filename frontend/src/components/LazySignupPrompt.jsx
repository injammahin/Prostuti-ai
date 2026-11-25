import { useApp } from "@/lib/app-context"
import { useLazy } from "@/components/use-lazy"

const load = () => import("@/components/SignupPrompt")

/** The sign-up dialog, loaded when it is first asked for. */
export default function LazySignupPrompt() {
  const { signup, setSignup } = useApp()
  const SignupPrompt = useLazy(load, signup.open, () => setSignup({ open: false, reason: "" }))
  return SignupPrompt && <SignupPrompt />
}
