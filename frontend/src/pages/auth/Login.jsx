import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faCircleCheck,
  faEnvelopeOpenText,
  faEye,
  faEyeSlash,
  faUser,
  faEnvelope,
  faArrowRight,
  faLock,
  faKey,
} from "@fortawesome/free-solid-svg-icons"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Logo, Ring } from "@/components/shared"
import Illustration from "@/components/Illustration"
import { isBangla, tr } from "@/lib/format"
import { useApp } from "@/lib/app-context"
import { adminApi, authApi, GOOGLE_CLIENT_ID } from "@/lib/api"
import { cn } from "@/lib/utils"

const RESEND_SECONDS = 45
const MIN_PASSWORD = 6

function Field({ icon, right, className, ...props }) {
  return (
    <div
      className={cn(
        "flex h-[3.25rem] items-center overflow-hidden rounded-2xl border bg-card transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/12",
        className
      )}
    >
      <span className="grid w-11 shrink-0 place-items-center text-muted-foreground">
        <FontAwesomeIcon icon={icon} />
      </span>
      <input className="h-full min-w-0 flex-1 bg-transparent pr-4 text-base outline-none placeholder:text-muted-foreground/70" {...props} />
      {right}
    </div>
  )
}

function PasswordField({ value, onChange, placeholder = tr("Password", "পাসওয়ার্ড"), autoComplete = "current-password", id }) {
  const [show, setShow] = useState(false)
  return (
    <Field
      id={id}
      icon={faLock}
      type={show ? "text" : "password"}
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      aria-label={placeholder}
      right={
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="grid h-full w-12 shrink-0 place-items-center text-muted-foreground hover:text-foreground"
          aria-label={show ? "Hide password" : "Show password"}
        >
          <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
        </button>
      }
    />
  )
}

function CodeBoxes({ value, onChange, error }) {
  const refs = useRef([])
  useEffect(() => {
    setTimeout(() => refs.current[0]?.focus(), 80)
  }, [])

  const set = (i, v) => {
    const digits = v.replace(/\D/g, "")
    const next = [...value]
    if (digits.length > 1) {
      digits.slice(0, 6 - i).split("").forEach((d, j) => (next[i + j] = d))
      refs.current[Math.min(5, i + digits.length)]?.focus()
    } else {
      next[i] = digits
      if (digits && i < 5) refs.current[i + 1]?.focus()
    }
    onChange(next)
  }

  return (
    <div className="flex justify-between gap-2">
      {value.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Code digit ${i + 1}`}
          onChange={(e) => set(i, e.target.value)}
          onKeyDown={(e) => e.key === "Backspace" && !d && i > 0 && refs.current[i - 1]?.focus()}
          className={cn(
            "h-14 w-full min-w-0 rounded-2xl border bg-card text-center text-xl font-extrabold outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/12",
            d && "border-primary/50 bg-secondary/50",
            error && "border-destructive/60"
          )}
        />
      ))}
    </div>
  )
}

/** Renders Google's official sign-in button (or a placeholder when no client ID is configured). */
function GoogleButton({ onCredential, disabled }) {
  const box = useRef(null)
  const [ready, setReady] = useState(false)
  const callback = useRef(onCredential)
  callback.current = onCredential

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    let initialized = false
    let lastWidth = 0
    const render = () => {
      if (!window.google?.accounts?.id || !box.current) return
      // Google's button is a fixed-width iframe (max 400px), so size it to the form's full width.
      const width = Math.round(Math.min(400, box.current.parentElement?.offsetWidth || 320))
      if (initialized && width === lastWidth) return
      if (!initialized) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (res) => callback.current(res.credential),
          ux_mode: "popup",
        })
        initialized = true
      }
      lastWidth = width
      box.current.innerHTML = ""
      window.google.accounts.id.renderButton(box.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        logo_alignment: "center",
        locale: isBangla() ? "bn" : "en",
        width,
      })
      setReady(true)
    }

    let resizeTimer
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(render, 150)
    }
    window.addEventListener("resize", onResize)

    let script = document.getElementById("gsi-client")
    if (window.google?.accounts?.id) render()
    else {
      if (!script) {
        script = document.createElement("script")
        script.id = "gsi-client"
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        document.head.appendChild(script)
      }
      script.addEventListener("load", render)
    }
    return () => {
      script?.removeEventListener("load", render)
      window.removeEventListener("resize", onResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  if (!GOOGLE_CLIENT_ID)
    return (
      <Button type="button" variant="outline" className="h-12 w-full text-[0.95rem]" onClick={() => toast(tr("Google sign-in is coming soon. Please use your email for now.", "গুগল সাইন ইন শিগগিরই আসছে। আপাতত ইমেইল ব্যবহার করুন।"))}>
        <FontAwesomeIcon icon={faGoogle} /> {tr("Continue with Google", "গুগল দিয়ে চালিয়ে যান")}
      </Button>
    )

  return (
    <div className={cn("relative flex min-h-11 w-full justify-center", disabled && "pointer-events-none opacity-60")}>
      <div ref={box} className="flex w-full justify-center" />
      {!ready && <span className="absolute inset-0 h-11 w-full animate-pulse rounded-full bg-muted" />}
    </div>
  )
}

const emptyCode = () => Array(6).fill("")

export default function Login({ mode = "login" }) {
  const { login, loginGuest, logout, user, isGuest, L, num } = useApp()

  // One login for everyone: the admin panel sends people here (?next=admin) and back here after logging out (?logout=1).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("logout") === "1") {
      logout()
      window.history.replaceState(null, "", window.location.pathname)
      return
    }
    if (params.get("next") === "admin" && user && !isGuest) {
      if (user.is_admin) {
        adminApi.openPanel().catch(() => {})
      } else {
        toast.error(L("This account doesn't have admin access.", "এই অ্যাকাউন্টে অ্যাডমিন অনুমতি নেই।"))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const nav = useNavigate()
  const loc = useLocation()

  // view: signin | signup | forgot · step: form | code (signup & forgot only)
  const [view, setView] = useState(mode === "signup" ? "signup" : "signin")
  const [step, setStep] = useState("form")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [code, setCode] = useState(emptyCode)
  const [timer, setTimer] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setView(mode === "signup" ? "signup" : "signin")
    setStep("form")
    setError("")
  }, [mode])

  useEffect(() => {
    if (!timer) return
    const t = setTimeout(() => setTimer(timer - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])

  const cleanEmail = email.trim()
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)
  const codeFull = code.join("").length === 6
  const passwordOk = password.length >= MIN_PASSWORD

  const switchView = (v) => {
    setView(v)
    setStep("form")
    setError("")
    setPassword("")
    if (v === "signin") nav("/login", { replace: true, state: loc.state })
    if (v === "signup") nav("/signup", { replace: true, state: loc.state })
  }

  const run = async (fn) => {
    if (loading) return
    setLoading(true)
    setError("")
    try {
      await fn()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const finish = (res) => {
    login(res.user, res.token)
    const first = res.user.name.split(" ")[0]
    if (res.user.is_admin) {
      // Admins go straight to the admin panel, already signed in there.
      toast.success(`Welcome back, ${first}! Opening the admin panel…`)
      adminApi.openPanel().catch(() => nav("/app", { replace: true }))
      return
    }
    toast.success(
      res.is_new_user ? L(`Welcome to bd3schools, ${first}! 🎉`, `bd3schools-এ স্বাগতম, ${first}! 🎉`) : L(`Welcome back, ${first}!`, `আবার স্বাগতম, ${first}!`)
    )
    const from = loc.state?.from
    // New users still pick their exam first, then go back to the page they were on (e.g. a BCS paper).
    if (res.is_new_user) nav("/onboarding", { replace: true, state: from ? { from } : undefined })
    else nav(from || "/app", { replace: true })
  }

  const signIn = (e) => {
    e.preventDefault()
    if (!validEmail || !password) return
    run(async () => finish(await authApi.login(cleanEmail, password)))
  }

  const sendCode = (e) => {
    e?.preventDefault()
    if (!validEmail) return
    run(async () => {
      await authApi.sendCode(cleanEmail, view === "forgot" ? "reset" : "register")
      setCode(emptyCode())
      setPassword("")
      setStep("code")
      setTimer(RESEND_SECONDS)
      toast.success(L("Code sent! Check your email.", "কোড পাঠানো হয়েছে! ইমেইল দেখুন।"))
    })
  }

  const completeSignup = (e) => {
    e.preventDefault()
    if (!codeFull || name.trim().length < 2 || !passwordOk) return
    run(async () => finish(await authApi.register({ email: cleanEmail, code: code.join(""), name: name.trim(), password })))
  }

  const completeReset = (e) => {
    e.preventDefault()
    if (!codeFull || !passwordOk) return
    run(async () => {
      const res = await authApi.resetPassword({ email: cleanEmail, code: code.join(""), password })
      toast.success(L("Your new password is set.", "নতুন পাসওয়ার্ড সেট হয়েছে।"))
      finish(res)
    })
  }

  const google = (credential) => run(async () => finish(await authApi.google(credential)))

  const guest = () => {
    loginGuest()
    nav("/app", { replace: true })
  }

  const errorText = error && <p className="text-sm text-destructive">{error}</p>
  const resend = (
    <p className="mt-5 text-center text-sm text-muted-foreground">
      {timer > 0 ? (
        L(`Didn't get it? Resend in 0:${String(timer).padStart(2, "0")}`, `কোড পাননি? ${num(timer)} সেকেন্ড পর আবার পাঠান`)
      ) : (
        <button type="button" onClick={sendCode} className="font-bold text-primary">
          {L("Resend code", "আবার কোড পাঠান")}
        </button>
      )}
      <span className="mt-1 block text-xs">{L("Can't find it? Check your Spam or Promotions folder.", "খুঁজে পাচ্ছেন না? Spam বা Promotions ফোল্ডার দেখুন।")}</span>
    </p>
  )

  const back = step === "code" ? () => (setStep("form"), setError("")) : view === "forgot" ? () => switchView("signin") : null

  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="hero m-3 hidden flex-col rounded-[2rem] p-10 lg:flex">
        <Logo light />
        <div className="relative mx-auto my-auto w-full max-w-md">
          <Illustration name="write" className="aspect-square w-full" />
          <div className="float card absolute top-4 -left-6 flex items-center gap-3 p-3 text-foreground">
            <Ring value={72} size={44} stroke={5} label={<span className="text-[0.6rem]">{num("72%")}</span>} />
            <span className="text-sm">
              <b className="block">{L("Answers correct", "সঠিক উত্তর")}</b>
              <span className="text-xs text-muted-foreground">{L("+3.2% this week", "এ সপ্তাহে +৩.২%")}</span>
            </span>
          </div>
          <div className="float-slow card absolute -right-4 bottom-10 p-3 text-sm text-foreground">
            <p className="flex items-center gap-2 font-bold">
              <FontAwesomeIcon icon={faCircleCheck} className="text-success" /> {L("Verified notice", "যাচাইকৃত নোটিশ")}
            </p>
            <p className="text-xs text-muted-foreground">{L("Every notice links to its source", "প্রতিটি নোটিশে সূত্রের লিংক")}</p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl leading-tight font-extrabold">{L("Every govt exam you're preparing for, in one place.", "আপনার সব সরকারি পরীক্ষার প্রস্তুতি, এক জায়গায়।")}</h2>
          <p className="mt-3 text-white/70">{L("100% free. Not affiliated with BPSC or any ministry.", "১০০% ফ্রি। বিপিএসসি বা কোনো মন্ত্রণালয়ের সঙ্গে যুক্ত নয়।")}</p>
        </div>
      </aside>

      {/* Form */}
      <div className="pt-safe flex min-h-dvh flex-col px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          {back ? (
            <button onClick={back} className="card -ml-1 grid size-10 place-items-center rounded-full" aria-label="Back">
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          ) : (
            <Logo className="lg:invisible" />
          )}
          <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            {L("Home", "হোম")}
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center pb-10">
          {/* ---------- Sign in / Create account (first step) ---------- */}
          {(view === "signin" || view === "signup") && step === "form" && (
            <div className="stagger">
              <h1 className="text-[1.75rem] leading-tight font-extrabold">{view === "signin" ? L("Welcome back", "আবার স্বাগতম") : L("Create your free account", "ফ্রি অ্যাকাউন্ট খুলুন")}</h1>
              <p className="mt-1.5 text-muted-foreground">{view === "signin" ? L("Sign in to continue your preparation.", "প্রস্তুতি চালিয়ে যেতে সাইন ইন করুন।") : L("It takes less than a minute.", "এক মিনিটও লাগবে না।")}</p>

              <div className="mt-6 grid grid-cols-2 rounded-2xl bg-muted p-1">
                {[
                  ["signin", L("Sign in", "সাইন ইন")],
                  ["signup", L("Create account", "অ্যাকাউন্ট খুলুন")],
                ].map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => switchView(v)}
                    className={cn("rounded-xl py-2.5 text-sm font-bold transition-all", view === v ? "bg-card text-foreground shadow-card" : "text-muted-foreground")}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <GoogleButton onCredential={google} disabled={loading} />
              </div>

              <div className="my-5 flex items-center gap-3 text-xs font-medium text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> {L("or with email", "অথবা ইমেইল দিয়ে")} <span className="h-px flex-1 bg-border" />
              </div>

              {view === "signin" ? (
                <form onSubmit={signIn} className="space-y-3">
                  <Field
                    icon={faEnvelope}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={L("Email address", "ইমেইল ঠিকানা")}
                    value={email}
                    onChange={(e) => (setEmail(e.target.value), setError(""))}
                    aria-label={L("Email address", "ইমেইল ঠিকানা")}
                  />
                  <PasswordField value={password} onChange={(e) => (setPassword(e.target.value), setError(""))} />
                  <div className="text-right">
                    <button type="button" onClick={() => switchView("forgot")} className="text-sm font-semibold text-primary">
                      {L("Forgot password?", "পাসওয়ার্ড ভুলে গেছেন?")}
                    </button>
                  </div>
                  {errorText}
                  <Button type="submit" disabled={!validEmail || !password || loading} className="btn-shine h-[3.25rem] w-full text-base">
                    {loading ? L("Signing in…", "সাইন ইন হচ্ছে…") : L("Sign in", "সাইন ইন")}
                  </Button>
                </form>
              ) : (
                <form onSubmit={sendCode} className="space-y-3">
                  <Field
                    icon={faEnvelope}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={L("Email address", "ইমেইল ঠিকানা")}
                    value={email}
                    onChange={(e) => (setEmail(e.target.value), setError(""))}
                    aria-label={L("Email address", "ইমেইল ঠিকানা")}
                  />
                  {errorText}
                  <Button type="submit" disabled={!validEmail || loading} className="btn-shine h-[3.25rem] w-full text-base">
                    {loading ? (
                      L("Sending code…", "কোড পাঠানো হচ্ছে…")
                    ) : (
                      <>
                        {L("Continue", "এগিয়ে যান")} <FontAwesomeIcon icon={faArrowRight} />
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">{L("We'll email you a code to confirm it's really you.", "আপনাকে নিশ্চিত করতে ইমেইলে একটি কোড পাঠাব।")}</p>
                </form>
              )}

              <Button type="button" variant="ghost" className="mt-4 h-11 w-full text-[0.95rem] text-muted-foreground" onClick={guest}>
                <FontAwesomeIcon icon={faEye} /> {L("Just look around (guest)", "অতিথি হিসেবে ঘুরে দেখুন")}
              </Button>

              <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
                {L("By continuing you agree to our ", "এগিয়ে গেলে আপনি আমাদের ")}
                <Link to="/terms" className="font-semibold underline">{L("Terms", "শর্তাবলি")}</Link> {L("and", "ও")} <Link to="/privacy" className="font-semibold underline">{L("Privacy Policy", "গোপনীয়তা নীতি")}</Link>
                {L(".", " মেনে নিচ্ছেন।")}
              </p>
            </div>
          )}

          {/* ---------- Create account: code + name + password ---------- */}
          {view === "signup" && step === "code" && (
            <form onSubmit={completeSignup} className="rise">
              <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-secondary text-xl text-primary">
                <FontAwesomeIcon icon={faEnvelopeOpenText} />
              </div>
              <h1 className="text-[1.75rem] leading-tight font-extrabold">{L("Check your email", "ইমেইল দেখুন")}</h1>
              <p className="mt-1.5 text-muted-foreground">
                {L("Enter the 6-digit code we sent to", "৬ সংখ্যার কোডটি লিখুন, পাঠানো হয়েছে:")} <b className="break-all text-foreground">{cleanEmail}</b>
              </p>

              <div className="mt-6">
                <CodeBoxes value={code} onChange={(v) => (setCode(v), setError(""))} error={!!error} />
              </div>

              <div className="mt-6 space-y-3">
                <Field icon={faUser} placeholder={L("Your full name", "আপনার পুরো নাম")} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-label={L("Full name", "পুরো নাম")} />
                <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} placeholder={L("Create a password", "পাসওয়ার্ড দিন")} autoComplete="new-password" />
                <p className={cn("text-xs", password && !passwordOk ? "text-destructive" : "text-muted-foreground")}>{L(`At least ${MIN_PASSWORD} characters.`, `কমপক্ষে ${num(MIN_PASSWORD)} অক্ষর।`)}</p>
                {errorText}
              </div>

              <Button type="submit" disabled={!codeFull || name.trim().length < 2 || !passwordOk || loading} className="mt-5 h-[3.25rem] w-full text-base">
                {loading ? L("Creating account…", "অ্যাকাউন্ট তৈরি হচ্ছে…") : L("Create my account", "অ্যাকাউন্ট তৈরি করুন")}
              </Button>
              {resend}
            </form>
          )}

          {/* ---------- Forgot password: email ---------- */}
          {view === "forgot" && step === "form" && (
            <form onSubmit={sendCode} className="rise space-y-3">
              <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-secondary text-xl text-primary">
                <FontAwesomeIcon icon={faKey} />
              </div>
              <h1 className="text-[1.75rem] leading-tight font-extrabold">{L("Forgot your password?", "পাসওয়ার্ড ভুলে গেছেন?")}</h1>
              <p className="pb-3 text-muted-foreground">{L("No problem. Enter your email and we'll send you a code to set a new one.", "সমস্যা নেই। ইমেইল দিন, নতুন পাসওয়ার্ডের জন্য কোড পাঠাব।")}</p>
              <Field
                icon={faEnvelope}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={L("Email address", "ইমেইল ঠিকানা")}
                value={email}
                onChange={(e) => (setEmail(e.target.value), setError(""))}
                aria-label={L("Email address", "ইমেইল ঠিকানা")}
              />
              {errorText}
              <Button type="submit" disabled={!validEmail || loading} className="h-[3.25rem] w-full text-base">
                {loading ? L("Sending code…", "কোড পাঠানো হচ্ছে…") : L("Send me a code", "কোড পাঠান")}
              </Button>
            </form>
          )}

          {/* ---------- Forgot password: code + new password ---------- */}
          {view === "forgot" && step === "code" && (
            <form onSubmit={completeReset} className="rise">
              <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-secondary text-xl text-primary">
                <FontAwesomeIcon icon={faEnvelopeOpenText} />
              </div>
              <h1 className="text-[1.75rem] leading-tight font-extrabold">{L("Set a new password", "নতুন পাসওয়ার্ড দিন")}</h1>
              <p className="mt-1.5 text-muted-foreground">
                {L("Enter the code we sent to", "কোডটি লিখুন, পাঠানো হয়েছে:")} <b className="break-all text-foreground">{cleanEmail}</b>
              </p>
              <div className="mt-6">
                <CodeBoxes value={code} onChange={(v) => (setCode(v), setError(""))} error={!!error} />
              </div>
              <div className="mt-6 space-y-3">
                <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} placeholder={L("New password", "নতুন পাসওয়ার্ড")} autoComplete="new-password" />
                <p className={cn("text-xs", password && !passwordOk ? "text-destructive" : "text-muted-foreground")}>{L(`At least ${MIN_PASSWORD} characters.`, `কমপক্ষে ${num(MIN_PASSWORD)} অক্ষর।`)}</p>
                {errorText}
              </div>
              <Button type="submit" disabled={!codeFull || !passwordOk || loading} className="mt-5 h-[3.25rem] w-full text-base">
                {loading ? L("Saving…", "সংরক্ষণ হচ্ছে…") : L("Save & sign in", "সংরক্ষণ ও সাইন ইন")}
              </Button>
              {resend}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
