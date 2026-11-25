import { Link, useNavigate } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRight,
  faWandMagicSparkles,
  faBuildingColumns,
  faBullhorn,
  faRoute,
  faCircleCheck,
  faBolt,
  faFire,
  faShieldHalved,
  faUserPlus,
  faClipboardCheck,
  faChartLine,
  faEye,
  faBookOpen,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons"
import { useApi } from "@/lib/use-api"
import { pastPapersApi, blogApi } from "@/lib/api"
import { PostCard } from "@/components/BlogCards"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { NoticeCard, Pill, IconBox, SectionTitle } from "@/components/shared"
import { Icon } from "@/components/icon"
import Illustration from "@/components/Illustration"
import CountUp from "@/components/CountUp"
import { cn } from "@/lib/utils"
import { exams, notices, QUESTION_COUNT } from "@/lib/data"
import { daysUntil, keyDate, noticeTitle, relDays } from "@/lib/format"
import { useApp } from "@/lib/app-context"
import { useNoticesVersion } from "@/lib/notices-store"
import { useSeo } from "@/lib/seo"
import { bcsPath } from "@/lib/bcs"
import { faqs, features, steps } from "@/content/landing"

// In the same order as the texts in content/landing.js
const featureIcons = [faStopwatch, faBookOpen, faBullhorn, faBuildingColumns, faRoute, faWandMagicSparkles]
const stepIcons = [faClipboardCheck, faRoute, faChartLine]

export default function Landing() {
  useNoticesVersion()
  const latestNotice = notices.find((n) => n.isNew && n.type !== "other")
  const newestNotices = [...notices].sort((a, b) => (b.published ?? "").localeCompare(a.published ?? "")).slice(0, 10)
  const nextDate = notices
    .map((n) => ({ n, ...keyDate(n) }))
    .filter((x) => x.label !== "Published" && daysUntil(x.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))[0]
  const { loginGuest, user, isGuest } = useApp()
  const nav = useNavigate()
  const { data: paperList } = useApi(() => pastPapersApi.list(), [], { key: "past-papers" })
  const { L, bn, num, fmtDate } = useApp()
  const { data: blog } = useApi(() => blogApi.list(), [], { key: "blog" })
  const latestPosts = (blog?.data ?? []).slice(0, 3)
  const readyPapers =(paperList?.papers ?? []).filter((p) => p.questions >= 100).slice(0, 8) // only full papers make a good first impression
  const guest = () => {
    if (!user) loginGuest()
    nav("/app")
  }

  useSeo({
    title: "Free BCS & Govt Job Exam Preparation | বিসিএস প্রস্তুতি – bd3schools",
    description: "Free BCS, NTRCA, Primary & bank job exam prep in Bangladesh. বিসিএস প্রশ্ন সমাধান, মডেল টেস্ট ও চাকরির নোটিশ।",
    keywords: "14 bcs question with solution, bcs question solution, 10th to 48th bcs question solution, বিসিএস প্রশ্ন সমাধান, bcs question bank, bcs preliminary question with answer, bcs model test online, govt job exam bangladesh, bd3schools",
    image: "/icon-512.png",
  })

  return (
    <>
      {/* Hero — white, premium */}
      <section className="relative isolate -mt-16 overflow-hidden bg-white pt-16 md:-mt-[4.5rem] md:pt-[4.5rem] dark:bg-card">

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-8 pb-14 md:pt-14 lg:grid-cols-[1.02fr_1fr] lg:pb-20">
          <div className="stagger">
            {latestNotice && (
              <Link
                to={`/notices/${latestNotice.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 py-1.5 pr-3.5 pl-1.5 text-xs font-semibold shadow-card backdrop-blur transition-all hover:border-primary/30 sm:text-sm dark:bg-card"
              >
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-[0.68rem] font-bold text-primary-foreground">{L("NEW", "নতুন")}</span>
                <span className="line-clamp-1">{noticeTitle(latestNotice)}</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[0.65rem] text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
            <h1
              className={cn(
                "mt-6 font-semibold text-balance",
                bn ? "text-[2.1rem] leading-[1.35] sm:text-[2.9rem] lg:text-[3.1rem]" : "text-[2.2rem] leading-[1.12] tracking-[-0.03em] sm:text-[3.1rem] lg:text-[3.5rem]"
              )}
            >
              {L("Free ", "বাংলাদেশে ফ্রি ")}
              <span className="relative inline-block text-primary">
                {L("BCS", "বিসিএস")}
                <svg viewBox="0 0 120 12" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-3 w-full" aria-hidden>
                  <path d="M2 8 C30 2 70 2 118 7" fill="none" stroke="var(--glow)" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
              {L(" & Govt Job Exam Preparation in Bangladesh", " ও সরকারি চাকরির পরীক্ষার প্রস্তুতি")}
            </h1>
            <p className="mt-4 max-w-lg text-lg font-semibold md:text-xl">{L("Prepare smarter for BCS & every govt job exam.", "বিসিএস ও সব সরকারি চাকরির প্রস্তুতি এখন আরও স্মার্ট।")}</p>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              {L(
                "Every BCS question solution from the 10th to the 48th, timed model tests, a daily quiz and verified exam dates in one simple app. বিসিএস প্রস্তুতি for your phone, free.",
                "বিসিএস প্রস্তুতি এক অ্যাপে: ১০ম থেকে ৪৮তম বিসিএস প্রশ্ন সমাধান (BCS question solution), সময় ধরে মডেল টেস্ট, প্রতিদিনের কুইজ ও যাচাইকৃত পরীক্ষার তারিখ। সম্পূর্ণ ফ্রি।"
              )}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="btn-shine h-[3.25rem] px-7 text-base">
                <Link to={user && !isGuest ? "/app" : "/signup"}>
                  <FontAwesomeIcon icon={faUserPlus} /> {user && !isGuest ? L("Go to dashboard", "ড্যাশবোর্ডে যান") : L("Create free account", "ফ্রি অ্যাকাউন্ট খুলুন")}
                </Link>
              </Button>
              {(!user || isGuest) && (
                <Button onClick={guest} variant="outline" className="h-[3.25rem] px-7 text-base">
                  <FontAwesomeIcon icon={faEye} /> {L("Continue as guest", "অতিথি হিসেবে দেখুন")}
                </Button>
              )}
            </div>
            <Link
              to="/bcs"
              className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <FontAwesomeIcon icon={faBookOpen} className="text-xs" />
              {L("Previous BCS questions & solutions — free", "বিগত বিসিএস প্রশ্ন ও সমাধান — ফ্রি")}
              <FontAwesomeIcon icon={faArrowRight} className="text-[0.65rem] transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {["bd-1", "bd-2", "bd-3", "bd-4"].map((a, i) => (
                  <img
                    key={a}
                    src={`/avatars/${a}.jpg`}
                    alt=""
                    width="40"
                    height="40"
                    className="size-10 rounded-full object-cover ring-[3px] ring-white transition-transform duration-300 hover:z-10 hover:-translate-y-1 dark:ring-card"
                    style={{ zIndex: 4 - i }}
                  />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold">{L("100% free · বাংলা & English", "১০০% ফ্রি · বাংলা ও English")}</p>
                <p className="text-muted-foreground">{L("BCS · NTRCA · Primary · Bank Jobs", "বিসিএস · এনটিআরসিএ · প্রাইমারি · ব্যাংক")}</p>
              </div>
            </div>
          </div>

          {/* Illustration composition */}
          <div className="relative mx-auto w-full max-w-[26.5rem]">
            <Illustration name="desk" priority circle={false} className="aspect-square w-full" alt="Student preparing at a desk" />


            <div className="float-slow absolute top-[4%] -right-1 flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-lift backdrop-blur-md sm:-right-6 dark:border-border dark:bg-card/90">
              <span className="grid size-10 place-items-center rounded-xl bg-warning/15 text-warning">
                <FontAwesomeIcon icon={faFire} />
              </span>
              <span>
                <span className="block text-lg leading-none font-extrabold">{L("12 days", "১২ দিন")}</span>
                <span className="text-[0.7rem] text-muted-foreground">{L("Study streak", "পড়ার ধারাবাহিকতা")}</span>
              </span>
            </div>

            {nextDate && (
              <Link
                to={`/notices/${nextDate.n.slug}`}
                className="float absolute -bottom-[7%] -left-2 hidden max-w-[20rem] items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-2.5 pr-4 shadow-lift backdrop-blur-md sm:flex dark:border-border dark:bg-card/90"
              >
                <span className="flex w-11 shrink-0 flex-col items-center rounded-xl bg-destructive/10 py-1 text-destructive-ink">
                  <span className="text-[0.55rem] font-bold uppercase">{nextDate.label === "Exam" ? L("Exam", "পরীক্ষা") : L("Apply", "আবেদন")}</span>
                  <span className="text-base leading-none font-extrabold">{num(new Date(`${nextDate.date}T00:00`).getDate())}</span>
                  <span className="text-[0.55rem] font-semibold">{fmtDate(`${nextDate.date}T00:00`, { month: "short" })}</span>
                </span>
                <span className="min-w-0 text-xs">
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="live-dot size-1.5 rounded-full bg-success" /> {relDays(nextDate.date)}
                  </span>
                  <span className="line-clamp-2 text-muted-foreground">{noticeTitle(nextDate.n)}</span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="card stagger grid grid-cols-2 p-2 md:grid-cols-4 md:divide-x md:divide-border/70">
          {[
            [QUESTION_COUNT, "+", L("Practice questions", "অনুশীলন প্রশ্ন")],
            [100, "%", L("Negative marking simulated", "আসল নেগেটিভ মার্কিং")],
            [5, L(" Target", "টি"), L("Govt exam tracks", "সরকারি পরীক্ষার প্রস্তুতি")],
            [100, "%", L("Verified notices", "যাচাইকৃত নোটিশ")],
          ].map(([v, suffix, l], i) => (
            <div key={i} className="px-3 py-3.5 text-center md:py-5">
              <p className="text-xl font-extrabold text-primary md:text-[1.7rem]">
                <CountUp value={v} suffix={suffix} />
              </p>
              <p className="text-xs text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Previous BCS papers */}
      <section className="mx-auto max-w-6xl px-4 pt-10 md:pt-14">
        <div className="card relative overflow-hidden rounded-3xl border-primary/20 p-6 md:p-8">
          <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-primary/8 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <FontAwesomeIcon icon={faBookOpen} /> {L("10th–48th BCS", "১০ম–৪৮তম বিসিএস")}
              </span>
              <h2 className="mt-3 text-2xl font-bold md:text-3xl">{L("Previous BCS questions & solutions", "বিগত বিসিএস প্রশ্ন ও সমাধান")}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground md:text-base">
                {L(
                  "Every BCS preliminary paper, newest first. Read each question with its answer and explanation, or sit the full paper as a timed exam with −0.5 negative marking.",
                  "সব বিসিএস প্রিলিমিনারি প্রশ্নপত্র, নতুন থেকে পুরোনো। উত্তর ও ব্যাখ্যাসহ প্রতিটি প্রশ্ন পড়ুন, অথবা −০.৫ নেগেটিভ মার্কিংসহ সময় ধরে পুরো পরীক্ষা দিন।"
                )}
              </p>
              {readyPapers.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  {readyPapers.map((p) => (
                    <Link
                      key={p.number}
                      to={bcsPath(p.number)}
                      className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border bg-card px-2 sm:px-3.5 py-1.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {L(p.name, `${num(p.number)}তম বিসিএস`)}
                      <span className="text-xs font-medium text-muted-foreground max-[350px]:hidden">{L(`${p.questions} Q`, `${num(p.questions)} প্রশ্ন`)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Button asChild className="btn-shine h-12 shrink-0 rounded-full px-7 text-base">
              <Link to="/bcs">
                {L("See all BCS papers", "সব বিসিএস প্রশ্ন দেখুন")} <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Daily quiz teaser */}
      <section className="mx-auto max-w-6xl px-4 pt-10 md:pt-14">
        <Link
          to="/daily"
          className="hero group flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between md:p-8"
        >
          <div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{L("New every day · Free · No sign-up", "প্রতিদিন নতুন · ফ্রি · সাইন আপ লাগে না")}</span>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">{L("Take today's 10-question quiz", "আজকের ১০ প্রশ্নের কুইজ দিন")}</h2>
            <p className="mt-1 text-sm text-white/85">{L("Real BCS, Bank, NTRCA & Primary questions. Find out your score in 5 minutes.", "বিসিএস, ব্যাংক, এনটিআরসিএ ও প্রাইমারির আসল প্রশ্ন। ৫ মিনিটেই জানুন আপনার স্কোর।")}</p>
          </div>
          <span className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-white px-6 font-semibold text-primary transition-transform group-hover:translate-x-1">
            {L("Start quiz", "কুইজ শুরু করুন")} →
          </span>
        </Link>
      </section>

      {/* Features bento */}
      <section className="mx-auto max-w-6xl px-4 pt-20 md:pt-28">
        <div className="mx-auto max-w-2xl text-center">
          <Pill tone="primary" className="px-3 py-1">{L("Why bd3schools", "কেন bd3schools")}</Pill>
          <h2 className="mt-4 text-[1.8rem] leading-tight font-semibold tracking-[-0.025em] text-balance md:text-[2.6rem]">
            {L("Everything from circular to viva, ", "সার্কুলার থেকে ভাইভা, ")}
            <span className="text-primary">{L("in one place", "সব এক জায়গায়")}</span>
          </h2>
          <p className="mt-3 text-muted-foreground">{L("Built around how BCS and govt job aspirants actually prepare.", "বিসিএস ও সরকারি চাকরিপ্রার্থীদের আসল প্রস্তুতির ধরন মাথায় রেখে তৈরি।")}</p>
        </div>

        <div className="stagger mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {features.map(({ tone, title, text, points, titleBn, textBn, pointsBn }, i) => (
            <div key={title} className="card lift group flex flex-col p-6">
              <IconBox tone={tone} className="size-11 transition-transform group-hover:scale-105">
                <FontAwesomeIcon icon={featureIcons[i]} />
              </IconBox>
              <h3 className="mt-4 text-lg font-bold">{L(title, titleBn)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{L(text, textBn)}</p>
              <ul className="mt-4 space-y-2 border-t pt-4 text-sm">
                {L(points, pointsBn).map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCircleCheck} className="mt-0.5 text-[0.8rem] text-success" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pt-16 md:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Illustration name="think" circle={false} className="mx-auto aspect-square w-full max-w-[22rem]" alt="Student planning her study" />
          <div>
            <Pill tone="primary" className="px-3 py-1">{L("How it works", "যেভাবে কাজ করে")}</Pill>
            <h2 className="mt-3 text-[1.75rem] leading-tight font-extrabold md:text-4xl">{L("Three steps to a better score", "ভালো স্কোরের তিন ধাপ")}</h2>
            <ol className="stagger mt-7 space-y-4">
              {steps.map(([title, text, titleBn, textBn], i) => (
                <li key={title} className="card lift flex gap-4 p-4">
                  <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <FontAwesomeIcon icon={stepIcons[i]} />
                    <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-glow text-[0.65rem] font-extrabold text-brand-strong">{num(i + 1)}</span>
                  </span>
                  <span>
                    <span className="block font-bold">{L(title, titleBn)}</span>
                    <span className="text-sm text-muted-foreground">{L(text, textBn)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Latest notices */}
      <section className="mx-auto max-w-6xl px-4 pt-16 md:pt-24">
        <SectionTitle title={L("Latest verified notices", "সর্বশেষ যাচাইকৃত নোটিশ")} to="/notices" />
        <div className="stagger grid gap-3 md:grid-cols-2">
          {newestNotices.map((n) => (
            <NoticeCard key={n.slug} n={n} compact />
          ))}
        </div>
      </section>

      {/* Exams */}
      <section className="mx-auto max-w-6xl px-4 pt-16 md:pt-24">
        <SectionTitle title={L("Exams we cover", "যেসব পরীক্ষার প্রস্তুতি")} to="/exams" linkLabel={L("All exams", "সব পরীক্ষা")} />
        <div className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((e) => (
            <Link key={e.slug} to={`/exams/${e.slug}`} className="card lift group flex items-center gap-3.5 p-4">
              <IconBox tone={e.color} className="size-12 rounded-2xl text-lg transition-transform group-hover:scale-105">
                <Icon name={e.icon} />
              </IconBox>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{L(e.name, e.nameBn)}</p>
                <p className="bn truncate text-sm text-muted-foreground">{L(e.nameBn, e.name)}</p>
              </div>
              {e.comingSoon ? <Pill>{L("Soon", "শিগগিরই")}</Pill> : <Pill tone="success">{L("Live", "চালু")}</Pill>}
            </Link>
          ))}
        </div>
      </section>

      {/* Top 5 Exams Band */}
      <section className="mx-auto max-w-6xl px-4 pt-16 md:pt-24">
        <div className="card grid items-center gap-6 overflow-hidden p-6 md:grid-cols-[1fr_auto] md:p-10">
          <div>
            <Pill tone="primary" className="px-3 py-1">
              <FontAwesomeIcon icon={faBuildingColumns} /> {L("5 Major Government Exam Tracks", "৫টি প্রধান সরকারি পরীক্ষা")}
            </Pill>
            <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">{L("Comprehensive Preparation for Top 5 Exams", "সেরা ৫ পরীক্ষার পূর্ণাঙ্গ প্রস্তুতি")}</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              {L(
                "BCS General, NTRCA Teacher Registration, Primary Assistant Teacher, Combined Bank Jobs and Bangladesh Bank. Full model tests, authentic question banks, and detailed explanations.",
                "বিসিএস সাধারণ, এনটিআরসিএ শিক্ষক নিবন্ধন, প্রাথমিক সহকারী শিক্ষক, সমন্বিত ব্যাংক ও বাংলাদেশ ব্যাংক। পূর্ণাঙ্গ মডেল টেস্ট, নির্ভরযোগ্য প্রশ্নব্যাংক ও বিস্তারিত ব্যাখ্যা।"
              )}
            </p>
          </div>
          <Button asChild className="h-12 bg-primary px-6 text-base text-white shadow-primary/25 hover:bg-primary/90">
            <Link to="/exams">
              {L("Explore All 5 Exams", "৫টি পরীক্ষাই দেখুন")} <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </Button>
        </div>
      </section>

      {/* From the blog — internal links help search engines find the articles */}
      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-16 md:pt-24">
          <SectionTitle title={L("From the blog", "ব্লগ থেকে")} to="/blog" linkLabel={L("All articles", "সব লেখা")} />
          <div className="stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((p) => (
              <PostCard key={p.slug} post={p} L={L} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pt-16 md:grid-cols-[1fr_1.6fr] md:pt-24">
        <div>
          <h2 className="text-2xl font-extrabold md:text-3xl">{L("Questions?", "প্রশ্ন আছে?")}</h2>
          <p className="mt-3 flex gap-2 text-sm text-muted-foreground">
            <FontAwesomeIcon icon={faShieldHalved} className="mt-0.5 text-primary" />
            {L("Trust is the product. We show sources, reviewers and verification dates everywhere.", "বিশ্বাসই আমাদের মূল শক্তি। সব জায়গায় সূত্র, পর্যালোচক ও যাচাইয়ের তারিখ দেখানো হয়।")}
          </p>
        </div>
        <Accordion type="single" collapsible className="card px-5">
          {faqs.map(([q, a, qBn, aBn], i) => (
            <AccordionItem key={q} value={`f${i}`}>
              <AccordionTrigger className="text-left text-[0.95rem] font-semibold">{L(q, qBn)}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{L(a, aBn)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-3 pt-16 sm:px-4 md:pt-24">
        <div className="hero grid items-center gap-6 rounded-[2rem] p-6 sm:p-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <Pill tone="white" className="px-3 py-1">
              <FontAwesomeIcon icon={faBolt} /> {L("Free for everyone", "সবার জন্য ফ্রি")}
            </Pill>
            <h2 className="mt-3 text-[1.75rem] leading-tight font-extrabold md:text-4xl">{L("Your next circular is coming. Be ready.", "পরের সার্কুলার আসছে। প্রস্তুত থাকুন।")}</h2>
            <p className="mt-2 text-white/75">{L("Join in 30 seconds with your email — or look around as a guest first.", "ইমেইল দিয়ে ৩০ সেকেন্ডে যোগ দিন — অথবা আগে অতিথি হিসেবে ঘুরে দেখুন।")}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="btn-shine h-12 bg-white px-6 text-base text-brand hover:bg-white">
                <Link to="/signup">{L("Create free account", "ফ্রি অ্যাকাউন্ট খুলুন")}</Link>
              </Button>
              <Button onClick={guest} variant="outline" className="h-12 border-white/25 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white">
                {L("Try as guest", "অতিথি হিসেবে দেখুন")}
              </Button>
            </div>
          </div>
          <Illustration name="write" className="mx-auto hidden aspect-square w-full max-w-[17rem] md:grid" />
        </div>
      </section>
    </>
  )
}
