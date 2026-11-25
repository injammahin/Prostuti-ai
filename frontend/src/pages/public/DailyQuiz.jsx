import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
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
  faShareNodes,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp, faFacebookF } from "@fortawesome/free-brands-svg-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Crumbs, Ring } from "@/components/shared"
import AskAiSheet from "@/components/AskAiSheet"
import { dailyQuizApi, siteApi } from "@/lib/api"
import { useApi } from "@/lib/use-api"
import { QUESTION_COUNT } from "@/lib/data"
import { daily } from "@/content/daily"
import { tr, localDigits } from "@/lib/format"
import { useApp } from "@/lib/app-context"
import { useSeo } from "@/lib/seo"
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

function useCountdownToNext(secondsFromBackend) {
  const [leftSeconds, setLeftSeconds] = useState(secondsFromBackend ?? 43200)

  useEffect(() => {
    if (typeof secondsFromBackend === "number") {
      setLeftSeconds(secondsFromBackend)
    }
  }, [secondsFromBackend])

  useEffect(() => {
    const t = setInterval(() => {
      setLeftSeconds((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const hours = Math.floor(leftSeconds / 3600)
  const minutes = Math.floor((leftSeconds % 3600) / 60)
  return tr(`${hours}h ${minutes}m`, `${localDigits(hours)} ঘণ্টা ${localDigits(minutes)} মিনিট`)
}

const verdicts = [
  [10, "Perfect score! 🏆", "You got every single one right. You're ready for the real exam.", "পূর্ণ নম্বর! 🏆", "সবগুলো সঠিক হয়েছে। আপনি আসল পরীক্ষার জন্য প্রস্তুত।"],
  [8, "Excellent! 🌟", "You're well ahead of most candidates. Keep this up every day.", "চমৎকার! 🌟", "আপনি অনেকের চেয়ে এগিয়ে। প্রতিদিন চালিয়ে যান।"],
  [6, "Good job! 👏", "A solid score. A little daily practice will push you to the top.", "ভালো করেছেন! 👏", "ভালো স্কোর। প্রতিদিন একটু অনুশীলনেই শীর্ষে পৌঁছাবেন।"],
  [4, "Nice try! 💪", "You're on your way. Practising a few questions each day makes a big difference.", "ভালো চেষ্টা! 💪", "এগিয়ে যাচ্ছেন। প্রতিদিন কয়েকটি প্রশ্ন অনুশীলনই বড় পার্থক্য গড়ে।"],
  [0, "Keep going! 🌱", "Every expert started here. Practise daily and watch your score climb.", "চালিয়ে যান! 🌱", "সবাই এখান থেকেই শুরু করেছে। প্রতিদিন অনুশীলন করুন, স্কোর বাড়বে।"],
]

export default function DailyQuiz() {
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const autoStart = searchParams.get("start") === "1" || searchParams.get("auto") === "1"
  const { user, isGuest, isAdmin, loginGuest, L, num, fmtDate } = useApp()
  const { data: quiz, loading: quizLoading, error: quizError, reload: reloadQuiz } = useApi(() => dailyQuizApi.get(), [])
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
  useSeo({ title: "Today's BCS Quiz: 10 Free MCQ Questions | আজকের কুইজ — bd3schools", description: "Take a free 10-question BCS, bank, NTRCA and Primary quiz with explanations. No sign-up. আজকের ফ্রি বিসিএস কুইজ, ব্যাখ্যাসহ।" })
  const [stage, setStage] = useState("intro") // intro | quiz | result
  const [qs, setQs] = useState(today)
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState({}) // id -> chosen index
  const [startedAt, setStartedAt] = useState(0)
  const [took, setTook] = useState(0)
  const [ai, setAi] = useState(false)
  const [review, setReview] = useState(false)
  const [reshuffling, setReshuffling] = useState(false)
  const nextIn = useCountdownToNext(quiz?.seconds_until_next)

  const q = qs[i]
  const chosen = q ? answers[q.id] : undefined
  const answered = chosen !== undefined
  const score = qs.filter((x) => answers[x.id] === x.answer).length
  const dateLabel = fmtDate(new Date(), { weekday: "long", day: "numeric", month: "long" })
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

  // Auto-start quiz immediately when ?start=1 or ?auto=1 is in URL
  useEffect(() => {
    if (autoStart && today.length > 0 && stage === "intro") {
      begin(today)
    }
  }, [autoStart, today, stage])

  const restart = () => begin(qs)
  const reshuffle = () => {
    begin(shuffle(today).map((x) => withShuffledOptions(x, Math.random)))
    toast(L("Questions and options shuffled", "প্রশ্ন ও অপশন এলোমেলো করা হয়েছে"))
  }
  const next = () => {
    if (i < qs.length - 1) return setI(i + 1)
    const seconds = Math.round((Date.now() - startedAt) / 1000)
    setTook(seconds)
    setStage("result")
    siteApi.dailyQuizCompleted(score, qs.length, seconds)
    try {
      const best = Number(localStorage.getItem(`bd3schools:daily:${dateKey()}`) || 0)
      localStorage.setItem(`bd3schools:daily:${dateKey()}`, String(Math.max(best, score)))
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const share = (where) => {
    const text = L(
      `I scored ${score}/${qs.length} on today's bd3schools daily quiz 🎯 Can you beat me? Free, no sign-up:`,
      `আজকের bd3schools কুইজে আমি ${num(qs.length)}-এ ${num(score)} পেয়েছি 🎯 আপনি কি আমাকে হারাতে পারবেন? ফ্রি, সাইন আপ লাগে না:`
    )
    if (where === "wa") window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`, "_blank")
    if (where === "fb") window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
    if (where === "copy") {
      navigator.clipboard?.writeText(`${text} ${shareUrl}`)
      toast.success(L("Link copied — paste it in your group!", "লিংক কপি হয়েছে — গ্রুপে শেয়ার করুন!"))
    }
  }

  const handleAdminShare = () => {
    const autoStartUrl = `${window.location.origin}/daily?start=1`
    const postText = `🎯 আজকের ফ্রি বিসিএস ও সরকারি চাকরি কুইজ (১০টি গুরুত্বপূর্ণ প্রশ্ন)
⏱️ সময় মাত্র ৫ মিনিট • কোনো সাইন-আপ ছাড়াই সরাসরি পরীক্ষা শুরু হবে!

👉 এখনই পরীক্ষা দিতে ক্লিক করুন:
${autoStartUrl}

💡 বিসিএস, প্রাইমারি শিক্ষক নিয়োগ ও ব্যাংক প্রস্তুতির সেরা প্রশ্ন ও তাৎক্ষণিক সমাধান।
#bd3schools #BCSPreparation #GovtJob #DailyQuiz`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(postText)
      toast.success(
        L("Auto-Start Quiz Link & Post copied to clipboard!", "সোশ্যাল মিডিয়া পোস্ট ও ডিরেক্ট কুইজ লিংক কপি হয়েছে!"),
        {
          description: L(
            "Link is ready! Anyone clicking it directly enters the exam.",
            "লিংকে ক্লিক করলেই ব্যবহারকারীর কুইজ সরাসরি শুরু হয়ে যাবে।"
          ),
          duration: 4000,
        }
      )
    }
  }

  const handleAdminReshuffle = async () => {
    if (reshuffling) return
    try {
      setReshuffling(true)
      await dailyQuizApi.reshuffle()
      await reloadQuiz()
      toast.success(L("Daily quiz reshuffled! 10 fresh questions loaded.", "১০টি নতুন প্রশ্ন সফলভাবে লোড ও রিশাফেল করা হয়েছে!"))
    } catch (err) {
      toast.error(L("Reshuffle failed. Please ensure you are logged in as admin.", "প্রশ্ন রিশাফেল ব্যর্থ হয়েছে।"))
    } finally {
      setReshuffling(false)
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
        <Crumbs items={[[L("Daily quiz", "আজকের কুইজ")]]} />
        <div className="hero overflow-hidden rounded-3xl p-6 text-center md:p-9 shadow-lg">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            <FontAwesomeIcon icon={faCalendarDay} /> {dateLabel}
          </span>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{L("Today's Quiz", "আজকের কুইজ")}</h1>
          <p className="mx-auto mt-2 max-w-sm text-white/85">{L("10 real exam questions from BCS, Bank, NTRCA & Primary exams. See how you'd score today.", "বিসিএস, ব্যাংক, এনটিআরসিএ ও প্রাইমারির ১০টি আসল প্রশ্ন। দেখুন আজ কত পান।")}</p>
          <div className="mt-6 flex justify-center gap-2 text-xs font-medium">
            {[
              [faCircleCheck, L("10 questions", "১০টি প্রশ্ন")],
              [faClock, L("About 5 min", "প্রায় ৫ মিনিট")],
              [faUserPlus, L("No sign-up", "সাইন আপ লাগে না")],
            ].map(([ic, l]) => (
              <span key={l} className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
                <FontAwesomeIcon icon={ic} className="text-[0.7rem]" /> {l}
              </span>
            ))}
          </div>
          <Button onClick={() => begin(today)} disabled={!today.length} className="mt-7 h-12 w-full max-w-xs rounded-full bg-white text-base font-semibold text-primary hover:bg-white/90">
            <FontAwesomeIcon icon={faPlay} /> {quizLoading ? L("Loading questions…", "প্রশ্ন লোড হচ্ছে…") : quizError ? L("Couldn't load — try again later", "লোড হয়নি — পরে চেষ্টা করুন") : L("Start the quiz", "কুইজ শুরু করুন")}
          </Button>
          <p className="mt-4 text-xs text-white/70">{L(`New questions in ${nextIn}`, `নতুন প্রশ্ন আসবে ${nextIn} পর`)}</p>
        </div>

        {/* Admin Control Bar - Only visible to admin */}
        {isAdmin && (
          <div className="mt-6 rounded-2xl border-2 border-primary/25 bg-card p-4 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {L("Admin Controls", "অ্যাডমিন কন্ট্রোল")}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {L("12h Auto-Shuffle Active", "১২ ঘণ্টায় অটো-শাফেল")}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {L(
                      "Auto-rotates at 12 AM & 12 PM BST · Share decorated short link or force fresh questions anytime",
                      "রাত ১২টা ও দুপুর ১২টায় স্বয়ংক্রিয়ভাবে বদলায় · সোশ্যাল শেয়ার লিংক বা তাৎক্ষণিক নতুন প্রশ্ন আনুন"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={handleAdminShare}
                  className="h-10 rounded-full px-5 text-xs font-bold shadow-xs gap-1.5"
                >
                  <FontAwesomeIcon icon={faShareNodes} />
                  {L("Copy Share Link", "লিংক কপি করুন")}
                </Button>
                <Button
                  variant="outline"
                  disabled={reshuffling}
                  onClick={handleAdminReshuffle}
                  className="h-10 rounded-full px-4 text-xs font-semibold gap-1.5 border-primary/30 hover:bg-primary/10"
                >
                  <FontAwesomeIcon icon={faShuffle} className={cn(reshuffling && "animate-spin")} />
                  {reshuffling ? L("Shuffling…", "লোড হচ্ছে…") : L("Reshuffle Now", "নতুন প্রশ্ন")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {daily.map(([heading, headingBn, text, textBn]) => (
          <section key={heading} className="mt-6">
            <h2 className="text-lg font-bold">{L(heading, headingBn)}</h2>
            <p className="mt-1.5 text-sm leading-relaxed">{L(text, textBn)}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{L(textBn, text)}</p>
          </section>
        ))}
        <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold text-primary">
          <Link to="/bcs">{L("BCS questions", "বিসিএস প্রশ্ন")}</Link>
          <Link to="/ntrca">{L("NTRCA", "এনটিআরসিএ")}</Link>
          <Link to="/primary-teacher">{L("Primary", "প্রাথমিক শিক্ষক")}</Link>
          <Link to="/bank-jobs">{L("Bank jobs", "ব্যাংক চাকরি")}</Link>
          <Link to="/model-tests">{L("Model tests", "মডেল টেস্ট")}</Link>
        </p>
      </div>
    )

  /* ---------------- RESULT ---------------- */
  if (stage === "result") {
    const [, titleEn, lineEn, titleBn, lineBn] = verdicts.find(([min]) => score >= min)
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
                  <span className="block text-4xl font-bold">{num(score)}</span>
                  <span className="text-xs text-white/75">{L(`out of ${COUNT}`, `${num(COUNT)}-এর মধ্যে`)}</span>
                </span>
              }
            />
            <h1 className="mt-4 text-2xl font-bold">{L(titleEn, titleBn)}</h1>
            <p className="mx-auto mt-1 max-w-sm text-sm text-white/85">{L(lineEn, lineBn)}</p>
            <p className="mt-3 text-xs text-white/70">
              {L(`Finished in ${Math.floor(took / 60)}m ${took % 60}s`, `সময় লেগেছে ${num(Math.floor(took / 60))} মিনিট ${num(took % 60)} সেকেন্ড`)}
            </p>
          </div>

          {/* share */}
          <div className="p-5">
            <p className="text-sm font-semibold">{L("Challenge your friends", "বন্ধুদের চ্যালেঞ্জ করুন")}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Button onClick={() => share("wa")} className="h-11 rounded-xl bg-[#25D366] text-white hover:bg-[#1ebe5b]">
                <FontAwesomeIcon icon={faWhatsapp} className="text-lg" /> <span className="hidden sm:inline">WhatsApp</span>
              </Button>
              <Button onClick={() => share("fb")} className="h-11 rounded-xl bg-[#1877F2] text-white hover:bg-[#0f66d6]">
                <FontAwesomeIcon icon={faFacebookF} /> <span className="hidden sm:inline">Facebook</span>
              </Button>
              <Button onClick={() => share("copy")} variant="outline" className="h-11 rounded-xl">
                <FontAwesomeIcon icon={faLink} /> <span className="hidden sm:inline">{L("Copy link", "লিংক কপি")}</span>
              </Button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="ghost" className="h-10 rounded-xl" onClick={restart}>
                <FontAwesomeIcon icon={faRotateLeft} /> {L("Try again", "আবার দিন")}
              </Button>
              <Button variant="ghost" className="h-10 rounded-xl" onClick={() => setReview(!review)}>
                <FontAwesomeIcon icon={faChevronDown} className={cn("transition-transform", review && "rotate-180")} /> {L("See answers", "উত্তর দেখুন")}
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
                      {num(n + 1)}. {x.body}
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

        {/* Irresistible Premium-Conversion Card */}
        <div className="card overflow-hidden border-2 border-primary/20 bg-linear-to-b from-card via-card to-secondary/30 p-6 md:p-8 text-center sm:text-left shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <FontAwesomeIcon icon={faWandMagicSparkles} /> {L("100% Free · No Payment Required", "১০০% ফ্রি • কোনো ফি বা সাবস্ক্রিপশন নেই")}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {L("10,000+ Aspirants Practising Daily", "১০,০০০+ চাকরিপ্রার্থী নিয়মিত অনুশীলন করছেন")}
            </span>
          </div>

          <div className="mt-5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              {L(
                "Want to reach the merit list? Unlock Full Preparation Features!",
                "বিসিএস ও সরকারি চাকরিতে প্রথম সারিতে থাকতে চান? আনলক করুন পূর্ণাঙ্গ প্রস্তুতি!"
              )}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {L(
                "bd3schools is completely free for all students. Access real-time full model tests, in-depth AI explanations, and smart weakness analysis.",
                "bd3schools দেশের সকল চাকরিপ্রার্থীর জন্য সম্পূর্ণ ফ্রি। এখনই ২০টি পূর্ণাঙ্গ মডেল টেস্ট, তাৎক্ষণিক AI সমাধান ও বিষয়ভিত্তিক দুর্বলতা বিশ্লেষণ সুবিধা নিন।"
              )}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {[
              {
                icon: faStopwatch,
                title: L("Full 200-Mark Model Tests", "২০০ নম্বরের পূর্ণাঙ্গ মডেল টেস্ট"),
                desc: L("BPSC balanced subjects, timer & negative marks", "অফিসিয়াল সিলেবাস, টাইমার ও নেগেটিভ মার্কিং"),
              },
              {
                icon: faWandMagicSparkles,
                title: L("Instant AI Tutor Assistance", "স্মার্ট AI টিউটর সাপোর্ট"),
                desc: L("Deep concept explanations on any question", "যেকোনো কঠিন প্রশ্নের তাৎক্ষণিক ব্যাখ্যা"),
              },
              {
                icon: faChartLine,
                title: L("Smart Subject Analytics", "দুর্বল বিষয় ও র্যাংক ট্র্যাকিং"),
                desc: L("Pinpoint accuracy by topic & benchmark vs others", "প্রতিটি বিষয়ের নির্ভুলতা ও রিয়েল-টাইম প্রগ্রেস"),
              },
              {
                icon: faCircleCheck,
                title: L("35+ Years BCS Question Bank", "বিগত ৩৫ বছরের প্রশ্নব্যাংক"),
                desc: L("Complete past papers with detailed answer keys", "সব বিষয়ের নির্ভুল উত্তর ও ব্যাখ্যাপত্র"),
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border bg-background/80 p-3.5 shadow-xs">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary mt-0.5">
                  <FontAwesomeIcon icon={item.icon} className="text-sm" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col sm:flex-row items-center gap-3">
            {user && !isGuest ? (
              <Button asChild className="h-12 w-full rounded-full text-sm font-bold shadow-md">
                <Link to="/app/practice">
                  {L("Go to My Dashboard", "ড্যাশবোর্ডে প্রবেশ করুন")} <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  onClick={goGuest}
                  className="h-12 w-full sm:flex-1 rounded-full text-sm font-bold shadow-md gap-2"
                >
                  <FontAwesomeIcon icon={faEye} />
                  {L("Enter Dashboard as Guest (Instant)", "গেস্ট হিসেবে সরাসরি দেখুন (তাত্ক্ষণিক)")}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-full sm:flex-1 rounded-full text-sm font-bold border-primary/30 hover:bg-primary/10 gap-2"
                >
                  <Link to="/signup">
                    <FontAwesomeIcon icon={faUserPlus} />
                    {L("Create Free Account (Save Rank)", "ফ্রি অ্যাকাউন্ট খুলুন (র্যাংক সেভ রাখুন)")}
                  </Link>
                </Button>
              </>
            )}
          </div>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            {L("No credit card or payment ever · 100% free for all students", "কোনো পেমেন্ট বা সাবস্ক্রিপশন নেই • শিক্ষার্থীদের জন্য চিরকাল ফ্রি")}
          </p>
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
          {L(`Question ${i + 1}`, `প্রশ্ন ${num(i + 1)}`)} <span className="font-normal text-muted-foreground">{L(`of ${qs.length}`, `/ ${num(qs.length)}`)}</span>
        </p>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-8 rounded-full text-muted-foreground" onClick={reshuffle} title="Shuffle questions">
            <FontAwesomeIcon icon={faShuffle} /> <span className="hidden sm:inline">{L("Shuffle", "এলোমেলো")}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 rounded-full text-muted-foreground" onClick={restart} title="Start again">
            <FontAwesomeIcon icon={faRotateLeft} /> <span className="hidden sm:inline">{L("Restart", "আবার শুরু")}</span>
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
                onClick={() => {
                  try {
                    if (typeof navigator !== "undefined" && navigator?.vibrate) {
                      navigator.vibrate(15)
                    }
                  } catch {}
                  setAnswers({ ...answers, [q.id]: n })
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all duration-150 touch-manipulation select-none active:scale-[0.985] cursor-pointer",
                  !answered && "hover:border-primary/50 hover:bg-secondary/40 active:bg-primary/10 active:border-primary",
                  answered && correct && "border-success bg-success/15 ring-2 ring-success/30 font-semibold shadow-xs",
                  answered && picked && !correct && "border-destructive bg-destructive/15 ring-2 ring-destructive/30 font-semibold shadow-xs",
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
              {chosen === q.answer ? L("Correct! 🎉", "সঠিক! 🎉") : L("Not quite.", "হয়নি।")}
            </p>
            <p className={cn("mt-1 text-sm text-muted-foreground", isBn && "bn")}>{q.explanation}</p>
            <button onClick={() => setAi(true)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              <FontAwesomeIcon icon={faWandMagicSparkles} /> {L("Ask AI to explain more", "এআইয়ের কাছে আরও ব্যাখ্যা নিন")}
            </button>
          </div>
        )}
      </div>

      <Button onClick={next} disabled={!answered} className="mt-4 h-12 w-full rounded-full text-base font-semibold">
        {i < qs.length - 1 ? L("Next question", "পরের প্রশ্ন") : L("See my score", "আমার স্কোর দেখুন")} <FontAwesomeIcon icon={faArrowRight} />
      </Button>

      <AskAiSheet open={ai} onOpenChange={setAi} question={q} />
    </div>
  )
}
