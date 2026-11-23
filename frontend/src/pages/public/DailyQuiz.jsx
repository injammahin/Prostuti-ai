import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlay,
  faShuffle,
  faRotateLeft,
  faCheck,
  faXmark,
  faArrowRight,
  faWandMagicSparkles,
  faLink,
  faUserPlus,
  faEye,
  faClock,
  faCalendarDay,
  faCircleCheck,
  faChartLine,
  faStopwatch,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp, faFacebookF } from "@fortawesome/free-brands-svg-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Ring } from "@/components/shared"
import AskAiSheet from "@/components/AskAiSheet"
import { dailyQuizApi } from "@/lib/api"
import { useApi } from "@/lib/use-api"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

const COUNT = 10
const LETTERS = ["A", "B", "C", "D"]

/* ---------- daily pick: same 10 questions for everyone on the same date ---------- */
const dateKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
function shuffle(arr, rnd = Math.random) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
// shuffles a question's options and remaps the correct answer index
function withShuffledOptions(q, rnd) {
  const order = shuffle([0, 1, 2, 3].slice(0, q.options.length), rnd)
  return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) }
}

function useCountdownToMidnight() {
  const calc = () => {
    const now = new Date()
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const s = Math.max(0, Math.floor((next - now) / 1000))
    return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
  }
  const [left, setLeft] = useState(calc)
  useEffect(() => {
    const t = setInterval(() => setLeft(calc()), 30000)
    return () => clearInterval(t)
  }, [])
  return left
}

const verdicts = [
  [10, "Perfect score! 🏆", "You got every single one right. You're ready for the real exam."],
  [8, "Excellent! 🌟", "You're well ahead of most candidates. Keep this up every day."],
  [6, "Good job! 👏", "A solid score. A little daily practice will push you to the top."],
  [4, "Nice try! 💪", "You're on your way. Practising a few questions each day makes a big difference."],
  [0, "Keep going! 🌱", "Every expert started here. Practise daily and watch your score climb."],
]

export default function DailyQuiz() {
  const nav = useNavigate()
  const { user, isGuest, loginGuest } = useApp()
  const { data: quiz, loading: quizLoading, error: quizError } = useApi(() => dailyQuizApi.get(), [])
  const today = useMemo(
    () =>
      (quiz?.questions ?? []).map((q) => ({
        id: q.id,
        body: q.body,
        options: q.options,
        answer: q.answer_index,
        explanation: q.explanation,
        lang: q.lang,
        subject: q.subject?.name,
        source: q.source,
      })),
    [quiz]
  )
  const [stage, setStage] = useState("intro") // intro | quiz | result
  const [qs, setQs] = useState(today)
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState({}) // id -> chosen index
  const [startedAt, setStartedAt] = useState(0)
  const [took, setTook] = useState(0)
  const [ai, setAi] = useState(false)
  const [review, setReview] = useState(false)
  const nextIn = useCountdownToMidnight()

  const q = qs[i]
  const chosen = q ? answers[q.id] : undefined
  const answered = chosen !== undefined
  const score = qs.filter((x) => answers[x.id] === x.answer).length
  const dateLabel = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
  const shareUrl = `${window.location.origin}/daily`

  const begin = (list) => {
    setQs(list)
    setI(0)
    setAnswers({})
    setReview(false)
    setStartedAt(Date.now())
    setStage("quiz")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const restart = () => begin(qs)
  const reshuffle = () => {
    begin(shuffle(today).map((x) => withShuffledOptions(x, Math.random)))
    toast("Questions and options shuffled")
  }
  const next = () => {
    if (i < qs.length - 1) return setI(i + 1)
    setTook(Math.round((Date.now() - startedAt) / 1000))
    setStage("result")
    try {
      const best = Number(localStorage.getItem(`prostuti:daily:${dateKey()}`) || 0)
      localStorage.setItem(`prostuti:daily:${dateKey()}`, String(Math.max(best, score)))
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const share = (where) => {
    const text = `I scored ${score}/${COUNT} on today's Prostuti daily quiz 🎯 Can you beat me? Free, no sign-up:`
    if (where === "wa") window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`, "_blank")
    if (where === "fb") window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
    if (where === "copy") {
      navigator.clipboard?.writeText(`${text} ${shareUrl}`)
      toast.success("Link copied — paste it in your group!")
    }
  }

  const goGuest = () => {
    if (!user) loginGuest()
    nav("/app/practice")
  }

  /* ---------------- INTRO ---------------- */
  if (stage === "intro")
    return (
      <div className="mx-auto max-w-xl px-4 py-8 md:py-14">
        <div className="hero overflow-hidden rounded-3xl p-6 text-center md:p-9">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            <FontAwesomeIcon icon={faCalendarDay} /> {dateLabel}
          </span>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">Today's Quiz</h1>
          <p className="mx-auto mt-2 max-w-sm text-white/85">10 real exam questions from BCS, Bank, NTRCA & Primary exams. See how you'd score today.</p>
          <div className="mt-6 flex justify-center gap-2 text-xs font-medium">
            {[
              [faCircleCheck, "10 questions"],
              [faClock, "About 5 min"],
              [faUserPlus, "No sign-up"],
            ].map(([ic, l]) => (
              <span key={l} className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
                <FontAwesomeIcon icon={ic} className="text-[0.7rem]" /> {l}
              </span>
            ))}
          </div>
          <Button onClick={() => begin(today)} disabled={!today.length} className="mt-7 h-12 w-full max-w-xs rounded-full bg-white text-base font-semibold text-primary hover:bg-white/90">
            <FontAwesomeIcon icon={faPlay} /> {quizLoading ? "Loading questions…" : quizError ? "Couldn't load — try again later" : "Start the quiz"}
          </Button>
          <p className="mt-4 text-xs text-white/70">New questions in {nextIn}</p>
        </div>
      </div>
    )

  /* ---------------- RESULT ---------------- */
  if (stage === "result") {
    const [, title, line] = verdicts.find(([min]) => score >= min)
    const pct = Math.round((score / COUNT) * 100)
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-8 md:py-12">
        <div className="card overflow-hidden text-center">
          <div className="hero px-6 pt-8 pb-7">
            <Ring
              value={pct}
              size={132}
              stroke={10}
              color="stroke-white"
              track="stroke-white/20"
              className="mx-auto"
              label={
                <span className="leading-none">
                  <span className="block text-4xl font-bold">{score}</span>
                  <span className="text-xs text-white/75">out of {COUNT}</span>
                </span>
              }
            />
            <h1 className="mt-4 text-2xl font-bold">{title}</h1>
            <p className="mx-auto mt-1 max-w-sm text-sm text-white/85">{line}</p>
            <p className="mt-3 text-xs text-white/70">
              Finished in {Math.floor(took / 60)}m {took % 60}s
            </p>
          </div>

          {/* share */}
          <div className="p-5">
            <p className="text-sm font-semibold">Challenge your friends</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Button onClick={() => share("wa")} className="h-11 rounded-xl bg-[#25D366] text-white hover:bg-[#1ebe5b]">
                <FontAwesomeIcon icon={faWhatsapp} className="text-lg" /> <span className="hidden sm:inline">WhatsApp</span>
              </Button>
              <Button onClick={() => share("fb")} className="h-11 rounded-xl bg-[#1877F2] text-white hover:bg-[#0f66d6]">
                <FontAwesomeIcon icon={faFacebookF} /> <span className="hidden sm:inline">Facebook</span>
              </Button>
              <Button onClick={() => share("copy")} variant="outline" className="h-11 rounded-xl">
                <FontAwesomeIcon icon={faLink} /> <span className="hidden sm:inline">Copy link</span>
              </Button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="ghost" className="h-10 rounded-xl" onClick={restart}>
                <FontAwesomeIcon icon={faRotateLeft} /> Try again
              </Button>
              <Button variant="ghost" className="h-10 rounded-xl" onClick={() => setReview(!review)}>
                <FontAwesomeIcon icon={faChevronDown} className={cn("transition-transform", review && "rotate-180")} /> See answers
              </Button>
            </div>
          </div>
        </div>

        {review && (
          <ol className="card divide-y">
            {qs.map((x, n) => {
              const ok = answers[x.id] === x.answer
              return (
                <li key={x.id} className="flex gap-3 p-4">
                  <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-[0.65rem] text-white", ok ? "bg-success" : "bg-destructive")}>
                    <FontAwesomeIcon icon={ok ? faCheck : faXmark} />
                  </span>
                  <div className="min-w-0 text-sm">
                    <p className={cn("font-medium", x.lang === "bn" && "bn")}>
                      {n + 1}. {x.body}
                    </p>
                    <p className={cn("mt-1 text-success", x.lang === "bn" && "bn")}>✓ {x.options[x.answer]}</p>
                    {!ok && answers[x.id] !== undefined && (
                      <p className={cn("text-destructive line-through", x.lang === "bn" && "bn")}>{x.options[answers[x.id]]}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        )}

        {/* sign-up pitch */}
        <div className="card p-5 md:p-6">
          <h2 className="text-lg font-bold">Want a higher score tomorrow?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Prostuti is 100% free. Practise every day and watch your score grow.</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              [faCircleCheck, "6,500+ real exam questions with explanations"],
              [faStopwatch, "Full model tests with a timer, like the real exam"],
              [faChartLine, "See your weak subjects and track your progress"],
            ].map(([ic, l]) => (
              <li key={l} className="flex items-center gap-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-xs text-primary">
                  <FontAwesomeIcon icon={ic} />
                </span>
                {l}
              </li>
            ))}
          </ul>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {user && !isGuest ? (
              <Button asChild className="h-11 rounded-full font-semibold sm:col-span-2">
                <Link to="/app/practice">
                  Continue practising <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild className="h-11 rounded-full font-semibold">
                  <Link to="/signup">
                    <FontAwesomeIcon icon={faUserPlus} /> Create free account
                  </Link>
                </Button>
                <Button variant="outline" className="h-11 rounded-full font-semibold" onClick={goGuest}>
                  <FontAwesomeIcon icon={faEye} /> Look around first
                </Button>
              </>
            )}
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">New quiz in {nextIn}</p>
        </div>
      </div>
    )
  }

  /* ---------------- QUIZ ---------------- */
  const isBn = q.lang === "bn"
  return (
    <div className="mx-auto max-w-xl px-4 py-6 md:py-10">
      {/* top bar */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">
          Question {i + 1} <span className="font-normal text-muted-foreground">of {qs.length}</span>
        </p>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-8 rounded-full text-muted-foreground" onClick={reshuffle} title="Shuffle questions">
            <FontAwesomeIcon icon={faShuffle} /> <span className="hidden sm:inline">Shuffle</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 rounded-full text-muted-foreground" onClick={restart} title="Start again">
            <FontAwesomeIcon icon={faRotateLeft} /> <span className="hidden sm:inline">Restart</span>
          </Button>
        </div>
      </div>
      <div className="mb-5 flex gap-1">
        {qs.map((x, n) => (
          <span
            key={x.id}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              answers[x.id] === undefined ? (n === i ? "bg-primary/40" : "bg-muted") : answers[x.id] === x.answer ? "bg-success" : "bg-destructive"
            )}
          />
        ))}
      </div>

      <div key={q.id} className="rise card p-5 md:p-6">
        <p className="text-xs font-medium text-muted-foreground">
          {q.subject}
          {q.source && ` · ${q.source}`}
        </p>
        <h2 className={cn("mt-2 text-lg leading-relaxed font-semibold", isBn && "bn")}>{q.body}</h2>

        <div className="mt-5 space-y-2.5">
          {q.options.map((o, n) => {
            const correct = n === q.answer
            const picked = n === chosen
            return (
              <button
                key={n}
                disabled={answered}
                onClick={() => setAnswers({ ...answers, [q.id]: n })}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-colors",
                  !answered && "hover:border-primary/50 hover:bg-secondary/40",
                  answered && correct && "border-success bg-success/10",
                  answered && picked && !correct && "border-destructive bg-destructive/10",
                  answered && !picked && !correct && "opacity-60"
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border text-sm font-semibold",
                    answered && correct && "border-success bg-success text-white",
                    answered && picked && !correct && "border-destructive bg-destructive text-white"
                  )}
                >
                  {answered && correct ? <FontAwesomeIcon icon={faCheck} /> : answered && picked ? <FontAwesomeIcon icon={faXmark} /> : LETTERS[n]}
                </span>
                <span className={cn("text-[0.95rem]", isBn && "bn")}>{o}</span>
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="rise mt-5 rounded-xl bg-muted/60 p-4">
            <p className={cn("text-sm font-semibold", chosen === q.answer ? "text-success" : "text-destructive")}>
              {chosen === q.answer ? "Correct! 🎉" : "Not quite."}
            </p>
            <p className={cn("mt-1 text-sm text-muted-foreground", isBn && "bn")}>{q.explanation}</p>
            <button onClick={() => setAi(true)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              <FontAwesomeIcon icon={faWandMagicSparkles} /> Ask AI to explain more
            </button>
          </div>
        )}
      </div>

      <Button onClick={next} disabled={!answered} className="mt-4 h-12 w-full rounded-full text-base font-semibold">
        {i < qs.length - 1 ? "Next question" : "See my score"} <FontAwesomeIcon icon={faArrowRight} />
      </Button>

      <AskAiSheet open={ai} onOpenChange={setAi} question={q} />
    </div>
  )
}
