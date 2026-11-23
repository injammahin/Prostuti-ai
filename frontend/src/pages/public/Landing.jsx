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
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { NoticeCard, Pill, IconBox, Bar, Ring, SectionTitle } from "@/components/shared"
import { Icon } from "@/components/icon"
import Illustration from "@/components/Illustration"
import { exams, notices } from "@/lib/data"
import { useApp } from "@/lib/app-context"
import { useNoticesVersion } from "@/lib/notices-store"

const faqs = [
  ["Is Prostuti official or linked to BPSC?", "No. We are an independent preparation platform. Every notice links to its official source, and you should always apply only through the official portal."],
  ["How does the real exam simulation work?", "Every model test strictly reflects official exam conditions: exact question counts (80, 100, or 200 marks), authentic time limits, and official negative marking (-0.50 for BCS/NTRCA, -0.25 for Bank & Primary)."],
  ["Which government exams are supported?", "We currently specialize in 5 major exams: BCS General, NTRCA Teacher Registration, Primary Assistant Teacher, Combined Bank Jobs (BSCS), and Bangladesh Bank."],
  ["Can I try it without an account?", "Yes. Continue as a guest to practice and browse notices. Create a free account when you want to save progress, bookmarks and alerts."],
  ["Is it really free?", "Yes. Every feature — adaptive practice drills, full model tests, syllabus guides, mistake notebook and alerts — is 100% free right now."],
]

const steps = [
  [faClipboardCheck, "Take a 15-minute diagnostic", "We find your level in every subject of your target exam."],
  [faRoute, "Follow your daily plan", "3–5 focused tasks a day. Weak topics come back before you forget them."],
  [faChartLine, "Test, get feedback, improve", "Real-format timed model tests and instant diagnostic feedback on weak subjects."],
]

export default function Landing() {
  const noticesVersion = useNoticesVersion()
  const { loginGuest, user, isGuest } = useApp()
  const nav = useNavigate()
  const guest = () => {
    if (!user) loginGuest()
    nav("/app")
  }

  return (
    <>
      {/* Hero — white, premium */}
      <section className="relative isolate -mt-16 overflow-hidden bg-white pt-16 md:-mt-[4.5rem] md:pt-[4.5rem] dark:bg-card">

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-8 pb-14 md:pt-14 lg:grid-cols-[1.02fr_1fr] lg:pb-20">
          <div className="stagger">
            <Link
              to="/notices/51st-special-bcs-circular"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 py-1.5 pr-3.5 pl-1.5 text-xs font-semibold shadow-card backdrop-blur transition-all hover:border-primary/30 sm:text-sm dark:bg-card"
            >
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[0.68rem] font-bold text-primary-foreground">NEW</span>
              51st Special BCS circular is out
              <FontAwesomeIcon icon={faArrowRight} className="text-[0.65rem] text-primary transition-transform group-hover:translate-x-0.5" />
            </Link>
            <h1 className="mt-6 text-[2.35rem] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[3.4rem] lg:text-[4rem]">
              Prepare smarter for{" "}
              <span className="relative inline-block text-primary">
                BCS
                <svg viewBox="0 0 120 12" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-3 w-full" aria-hidden>
                  <path d="M2 8 C30 2 70 2 118 7" fill="none" stroke="var(--glow)" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>{" "}
              &amp; every govt job exam.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Adaptive question drills, authentic timed model tests, spaced mistake revision, and verified exam dates — one beautifully simple app, made for your phone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="btn-shine h-[3.25rem] px-7 text-base">
                <Link to={user && !isGuest ? "/app" : "/signup"}>
                  <FontAwesomeIcon icon={faUserPlus} /> {user && !isGuest ? "Go to dashboard" : "Create free account"}
                </Link>
              </Button>
              {(!user || isGuest) && (
                <Button onClick={guest} variant="outline" className="h-[3.25rem] px-7 text-base">
                  <FontAwesomeIcon icon={faEye} /> Continue as guest
                </Button>
              )}
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {["men-32", "women-44", "men-75", "women-68"].map((a, i) => (
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
                <p className="font-bold">100% free · বাংলা &amp; English</p>
                <p className="text-muted-foreground">BCS · NTRCA · Primary · Bank Jobs</p>
              </div>
            </div>
          </div>

          {/* Illustration composition */}
          <div className="relative mx-auto w-full max-w-[26.5rem]">
            <Illustration name="desk" circle={false} className="aspect-square w-full" alt="Student preparing at a desk" />


            <div className="float-slow absolute top-[4%] -right-1 flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-lift backdrop-blur-md sm:-right-6 dark:border-border dark:bg-card/90">
              <span className="grid size-10 place-items-center rounded-xl bg-warning/15 text-warning">
                <FontAwesomeIcon icon={faFire} />
              </span>
              <span>
                <span className="block text-lg leading-none font-extrabold">12 days</span>
                <span className="text-[0.7rem] text-muted-foreground">Study streak</span>
              </span>
            </div>

            <div className="float absolute -bottom-[7%] -left-2 hidden items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-2.5 pr-4 shadow-lift backdrop-blur-md sm:flex dark:border-border dark:bg-card/90">
              <span className="flex w-11 flex-col items-center rounded-xl bg-destructive/10 py-1 text-destructive">
                <span className="text-[0.55rem] font-bold uppercase">Apply</span>
                <span className="text-base leading-none font-extrabold">25</span>
                <span className="text-[0.55rem] font-semibold">Nov</span>
              </span>
              <span className="text-xs">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="live-dot size-1.5 rounded-full bg-success" /> Deadline alert
                </span>
                <span className="text-muted-foreground">Bangladesh Bank AD · 3 days left</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="card stagger grid grid-cols-2 p-2 md:grid-cols-4 md:divide-x md:divide-border/70">
          {[
            ["6,500+", "Practice questions"],
            ["100%", "Negative marking simulated"],
            ["5 Target", "Govt exam tracks"],
            ["100%", "Verified notices"],
          ].map(([v, l]) => (
            <div key={l} className="px-3 py-3.5 text-center md:py-5">
              <p className="text-xl font-extrabold text-primary md:text-[1.7rem]">{v}</p>
              <p className="text-xs text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Daily quiz teaser */}
      <section className="mx-auto max-w-6xl px-4 pt-10 md:pt-14">
        <Link
          to="/daily"
          className="hero group flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between md:p-8"
        >
          <div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">New every day · Free · No sign-up</span>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">Take today's 10-question quiz</h2>
            <p className="mt-1 text-sm text-white/85">Real BCS, Bank, NTRCA & Primary questions. Find out your score in 5 minutes.</p>
          </div>
          <span className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-white px-6 font-semibold text-primary transition-transform group-hover:translate-x-1">
            Start quiz →
          </span>
        </Link>
      </section>

      {/* Features bento */}
      <section className="mx-auto max-w-6xl px-4 pt-20 md:pt-28">
        <div className="mx-auto max-w-2xl text-center">
          <Pill tone="primary" className="px-3 py-1">Why Prostuti</Pill>
          <h2 className="mt-4 text-[1.8rem] leading-tight font-semibold tracking-[-0.025em] text-balance md:text-[2.6rem]">
            Everything from circular to viva, <span className="text-primary">in one place</span>
          </h2>
          <p className="mt-3 text-muted-foreground">Built around how BCS and govt job aspirants actually prepare.</p>
        </div>

        <div className="stagger mt-12 grid gap-4 md:grid-cols-6">
          {/* Model tests & simulations — wide */}
          <div className="card lift group relative overflow-hidden p-6 md:col-span-4 md:p-8">
            <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-secondary" />
            <div className="relative grid items-center gap-6 sm:grid-cols-[1fr_15rem]">
              <div>
                <IconBox className="size-11 transition-transform group-hover:scale-110">
                  <FontAwesomeIcon icon={faWandMagicSparkles} />
                </IconBox>
                <h3 className="mt-5 text-xl font-bold">Simulated model tests &amp; mock drills</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Practice with authentic question counts, real countdown limits, and strict negative marking (-0.50 / -0.25). Get instant cut-off percentile calculations and weak area diagnostics.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Timed simulations", "-0.50 negative marking", "Percentile ranks"].map((t) => (
                    <Pill key={t} tone="primary">{t}</Pill>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border bg-card p-4 shadow-lift transition-transform duration-500 group-hover:-rotate-1 group-hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <Ring value={68} size={54} stroke={6} label={<span className="text-xs">68%</span>} />
                  <div>
                    <p className="text-[0.7rem] text-muted-foreground">Mock score</p>
                    <p className="text-2xl leading-none font-extrabold">124.5<span className="text-sm font-medium text-muted-foreground">/200</span></p>
                  </div>
                </div>
                <div className="mt-4 space-y-2.5">
                  {[
                    ["Bangla & Literature", 78, "bg-primary"],
                    ["English Grammar", 64, "bg-primary"],
                    ["Math & Analytical", 72, "bg-success"],
                  ].map(([k, v, c]) => (
                    <div key={k}>
                      <div className="mb-1 flex justify-between text-[0.7rem] font-medium">
                        <span>{k}</span>
                        <span className="text-muted-foreground">{v}%</span>
                      </div>
                      <Bar value={v} tone={c} className="h-1.5" />
                    </div>
                  ))}
                </div>
                <p className="mt-3 rounded-lg bg-success/10 px-2.5 py-1.5 text-[0.72rem] font-semibold text-success">✓ Cut-off passed · Rank #1,204</p>
              </div>
            </div>
          </div>

          {/* Notice board — dark */}
          <div className="hero lift group overflow-hidden rounded-2xl p-6 md:col-span-2 md:p-7">
            <span className="grid size-11 place-items-center rounded-xl bg-white/15 transition-transform group-hover:scale-110">
              <FontAwesomeIcon icon={faBullhorn} />
            </span>
            <h3 className="mt-5 text-xl font-bold">Verified notice board</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">Circulars, deadlines, admit cards and results — checked against the official source.</p>
            <div className="mt-5 space-y-2">
              {[
                ["19", "Dec", "Combined 9 Banks Senior Officer test"],
                ["10", "Dec", "19th NTRCA application deadline"],
              ].map(([d, m, t], i) => (
                <div
                  key={t}
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-2 pr-3 backdrop-blur transition-transform duration-300 group-hover:translate-x-1"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <span className="flex w-10 flex-col items-center rounded-lg bg-white py-1 text-brand">
                    <span className="text-sm leading-none font-extrabold">{d}</span>
                    <span className="text-[0.55rem] font-bold uppercase">{m}</span>
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold">{t}</span>
                  <FontAwesomeIcon icon={faCircleCheck} className="text-glow" />
                </div>
              ))}
            </div>
          </div>

          {/* Bank & Teacher Specialization */}
          <div className="card lift group relative overflow-hidden p-6 md:col-span-3 md:p-7">
            <div className="pointer-events-none absolute -right-16 -bottom-16 size-48 rounded-full bg-warning/8" />
            <div className="relative">
              <IconBox tone="warning" className="size-11 transition-transform group-hover:scale-110">
                <FontAwesomeIcon icon={faBuildingColumns} />
              </IconBox>
              <h3 className="mt-5 text-xl font-bold">Bank &amp; Teacher Recruitment</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Dedicated question banks for Bangladesh Bank AD, Combined 9 Banks, NTRCA and Primary Assistant Teacher.</p>
              <div className="mt-5 rounded-2xl border bg-card p-3.5 shadow-card">
                <p className="text-xs font-semibold">Bangladesh Bank AD: Cash Reserve Ratio (CRR)?</p>
                <div className="mt-2 grid grid-cols-2 gap-1.5 text-[0.7rem]">
                  <span className="rounded-lg border px-2 py-1.5">Vault cash limit</span>
                  <span className="rounded-lg border border-success bg-success/10 px-2 py-1.5 font-semibold">Reserves with BB ✓</span>
                </div>
                <p className="mt-2.5 flex items-center gap-1.5 text-[0.68rem] font-semibold text-success">
                  <FontAwesomeIcon icon={faCircleCheck} /> Verified past exam question · BSCS pattern
                </p>
              </div>
            </div>
          </div>

          {/* Adaptive coach */}
          <div className="card lift group relative overflow-hidden p-6 md:col-span-3 md:p-7">
            <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-info/8" />
            <div className="relative">
              <IconBox tone="info" className="size-11 transition-transform group-hover:scale-110">
                <FontAwesomeIcon icon={faRoute} />
              </IconBox>
              <h3 className="mt-5 text-xl font-bold">One adaptive coach</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A daily plan that follows your target exams and brings weak topics back before you forget them.</p>
              <div className="mt-5 flex items-center gap-4 rounded-2xl border bg-card p-3.5 shadow-card">
                <Ring value={75} size={60} stroke={7} label="3/4" />
                <ul className="flex-1 space-y-1.5 text-[0.75rem]">
                  {[
                    ["Weak-topic drill: UN bodies", true],
                    ["Revise 12 wrong answers", true],
                    ["Target drill: Math 20 MCQs", false],
                  ].map(([t, d]) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className={`grid size-4 shrink-0 place-items-center rounded-full text-[0.5rem] ${d ? "bg-success text-white" : "border-2 border-input"}`}>
                        {d && <FontAwesomeIcon icon={faCircleCheck} />}
                      </span>
                      <span className={d ? "text-muted-foreground line-through" : "font-semibold"}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pt-16 md:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Illustration name="think" circle={false} className="mx-auto aspect-square w-full max-w-[22rem]" alt="Student planning her study" />
          <div>
            <Pill tone="primary" className="px-3 py-1">How it works</Pill>
            <h2 className="mt-3 text-[1.75rem] leading-tight font-extrabold md:text-4xl">Three steps to a better score</h2>
            <ol className="stagger mt-7 space-y-4">
              {steps.map(([ic, title, text], i) => (
                <li key={title} className="card lift flex gap-4 p-4">
                  <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <FontAwesomeIcon icon={ic} />
                    <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-glow text-[0.65rem] font-extrabold text-brand-strong">{i + 1}</span>
                  </span>
                  <span>
                    <span className="block font-bold">{title}</span>
                    <span className="text-sm text-muted-foreground">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Latest notices */}
      <section className="mx-auto max-w-6xl px-4 pt-16 md:pt-24">
        <SectionTitle title="Latest verified notices" to="/notices" />
        <div className="stagger grid gap-3 md:grid-cols-3">
          {notices.slice(0, 3).map((n) => (
            <NoticeCard key={n.slug} n={n} compact />
          ))}
        </div>
      </section>

      {/* Exams */}
      <section className="mx-auto max-w-6xl px-4 pt-16 md:pt-24">
        <SectionTitle title="Exams we cover" to="/exams" linkLabel="All exams" />
        <div className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((e) => (
            <Link key={e.slug} to={`/exams/${e.slug}`} className="card lift group flex items-center gap-3.5 p-4">
              <IconBox tone={e.color} className="size-12 rounded-2xl text-lg transition-transform group-hover:scale-105">
                <Icon name={e.icon} />
              </IconBox>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{e.name}</p>
                <p className="bn truncate text-sm text-muted-foreground">{e.nameBn}</p>
              </div>
              {e.comingSoon ? <Pill>Soon</Pill> : <Pill tone="success">Live</Pill>}
            </Link>
          ))}
        </div>
      </section>

      {/* Top 5 Exams Band */}
      <section className="mx-auto max-w-6xl px-4 pt-16 md:pt-24">
        <div className="card grid items-center gap-6 overflow-hidden p-6 md:grid-cols-[1fr_auto] md:p-10">
          <div>
            <Pill tone="primary" className="px-3 py-1">
              <FontAwesomeIcon icon={faBuildingColumns} /> 5 Major Government Exam Tracks
            </Pill>
            <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">Comprehensive Preparation for Top 5 Exams</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">BCS General, NTRCA Teacher Registration, Primary Assistant Teacher, Combined Bank Jobs and Bangladesh Bank. Full model tests, authentic question banks, and detailed explanations.</p>
          </div>
          <Button asChild className="h-12 bg-primary px-6 text-base text-white shadow-primary/25 hover:bg-primary/90">
            <Link to="/exams">
              Explore All 5 Exams <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pt-16 md:grid-cols-[1fr_1.6fr] md:pt-24">
        <div>
          <h2 className="text-2xl font-extrabold md:text-3xl">Questions?</h2>
          <p className="mt-3 flex gap-2 text-sm text-muted-foreground">
            <FontAwesomeIcon icon={faShieldHalved} className="mt-0.5 text-primary" />
            Trust is the product. We show sources, reviewers and verification dates everywhere.
          </p>
        </div>
        <Accordion type="single" collapsible className="card px-5">
          {faqs.map(([q, a], i) => (
            <AccordionItem key={q} value={`f${i}`}>
              <AccordionTrigger className="text-left text-[0.95rem] font-semibold">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-3 pt-16 sm:px-4 md:pt-24">
        <div className="hero grid items-center gap-6 rounded-[2rem] p-6 sm:p-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <Pill tone="white" className="px-3 py-1">
              <FontAwesomeIcon icon={faBolt} /> Free for everyone
            </Pill>
            <h2 className="mt-3 text-[1.75rem] leading-tight font-extrabold md:text-4xl">Your next circular is coming. Be ready.</h2>
            <p className="mt-2 text-white/75">Join in 30 seconds with your mobile number — or look around as a guest first.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="btn-shine h-12 bg-white px-6 text-base text-brand hover:bg-white">
                <Link to="/signup">Create free account</Link>
              </Button>
              <Button onClick={guest} variant="outline" className="h-12 border-white/25 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white">
                Try as guest
              </Button>
            </div>
          </div>
          <Illustration name="write" className="mx-auto hidden aspect-square w-full max-w-[17rem] md:grid" />
        </div>
      </section>
    </>
  )
}
