import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faFileLines,
  faStopwatch,
  faRotate,
  faPlay,
  faArrowRight,
  faChevronRight,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PageHeader,
  Segmented,
  HeroCard,
  IconBox,
} from "@/components/shared";
import { catalogApi, statsApi } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icon";

/** A calm accent colour per subject for the icon tile, link and progress line. */
const ACCENTS = {
  bangla: { tile: "bg-rose-50 text-rose-600", text: "text-rose-600", bar: "bg-rose-500" },
  english: { tile: "bg-sky-50 text-sky-600", text: "text-sky-600", bar: "bg-sky-500" },
  math: { tile: "bg-violet-50 text-violet-600", text: "text-violet-600", bar: "bg-violet-500" },
  "bd-affairs": { tile: "bg-emerald-50 text-emerald-600", text: "text-emerald-600", bar: "bg-emerald-500" },
  "intl-affairs": { tile: "bg-blue-50 text-blue-600", text: "text-blue-600", bar: "bg-blue-500" },
  ict: { tile: "bg-indigo-50 text-indigo-600", text: "text-indigo-600", bar: "bg-indigo-500" },
  science: { tile: "bg-teal-50 text-teal-600", text: "text-teal-600", bar: "bg-teal-500" },
  mental: { tile: "bg-amber-50 text-amber-600", text: "text-amber-600", bar: "bg-amber-500" },
  banking: { tile: "bg-cyan-50 text-cyan-700", text: "text-cyan-700", bar: "bg-cyan-600" },
  geography: { tile: "bg-lime-50 text-lime-700", text: "text-lime-700", bar: "bg-lime-600" },
  ethics: { tile: "bg-fuchsia-50 text-fuchsia-600", text: "text-fuchsia-600", bar: "bg-fuchsia-500" },
  default: { tile: "bg-secondary text-primary", text: "text-primary", bar: "bg-primary" },
};

const modes = [
  {
    id: "drill",
    icon: faBullseye,
    title: "Practice one subject",
    text: "Choose a subject below",
    tone: "primary",
  },
  {
    id: "past",
    icon: faFileLines,
    title: "Old exam questions",
    text: "Questions from past years",
    tone: "info",
    to: "/app/practice/session?mode=past",
  },
  {
    id: "test",
    icon: faStopwatch,
    title: "Take a full test",
    text: "Like the real exam, with a timer",
    tone: "chart5",
    to: "/app/test",
  },
  {
    id: "wrong",
    icon: faRotate,
    title: "Fix my mistakes",
    text: "Try wrong answers again",
    tone: "warning",
    to: "/app/notebook",
  },
];

export default function Practice() {
  const nav = useNavigate();
  const { mainExam, isGuest } = useApp();
  const { data: catalog, loading } = useApi(() => catalogApi.get(), []);
  const { data: stats } = useApi(() => statsApi.get(mainExam), [mainExam], { enabled: !isGuest });
  const exams = catalog?.exams ?? [];
  const subjects = (catalog?.subjects ?? []).map((x) => ({
    id: x.slug,
    name: x.name,
    nameBn: x.name_bn,
    image: x.image,
    icon: x.icon,
    exams: x.exams,
    accuracy: x.accuracy,
    done: x.answered,
    total: x.total,
  }));
  const [targetExam, setTargetExam] = useState(mainExam || "all");
  const [subject, setSubject] = useState(null);
  const [count, setCount] = useState(20);
  const [diff, setDiff] = useState("mixed");
  const [filter, setFilter] = useState("all");

  const examSubjects = subjects.filter(
    (s) => targetExam === "all" || !s.exams || s.exams.includes(targetExam),
  );
  const list = examSubjects.filter(
    (s) =>
      filter === "all" ||
      (s.accuracy !== null &&
        (filter === "weak" ? s.accuracy < 60 : s.accuracy >= 70)),
  );
  const currentExamObj = exams.find((e) => e.slug === targetExam);

  return (
    <>
      <PageHeader
        title="Practice questions"
        subtitle="Pick a subject, answer questions and learn the right answers."
        className="mb-4"
      />

      {/* Target Exam Filter Pills */}
      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 md:mb-5 overflow-x-auto px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setTargetExam("all")}
          className={cn(
            "h-9 rounded-full px-4 text-xs font-semibold whitespace-nowrap transition-colors",
            targetExam === "all"
              ? "bg-primary text-primary-foreground"
              : "border bg-card text-muted-foreground hover:bg-muted",
          )}
        >
          All exams
        </button>
        {exams.map((e) => (
          <button
            key={e.slug}
            onClick={() => setTargetExam(e.slug)}
            className={cn(
              "h-9 rounded-full px-4 text-xs font-semibold whitespace-nowrap transition-colors",
              targetExam === e.slug
                ? "bg-primary text-primary-foreground"
                : "border bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            {e.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 md:gap-8">
        {/* Recommended + quick stats */}
        <HeroCard className="order-1 p-4 md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">
                {currentExamObj
                  ? `Suggested for you · ${currentExamObj.name}`
                  : "Suggested for you"}
              </p>
              <h2 className="mt-1 text-lg md:mt-1.5 md:text-2xl">
                {targetExam === "combined-bank" ||
                targetExam === "bangladesh-bank"
                  ? "Math & Banking questions"
                  : targetExam === "ntrca"
                    ? "Bangla & English Grammar questions"
                    : targetExam === "primary-teacher"
                      ? "Basic Math & Science questions"
                      : "Bangladesh & World Affairs questions"}
              </h2>
              <p className="mt-1 text-xs text-white/75 md:text-sm">
                20 questions · about 15 minutes · the answer is explained after
                each one
              </p>
              <Button
                asChild
                className="mt-3.5 h-10 bg-white md:mt-5 px-5 text-brand hover:bg-white/90"
              >
                <Link
                  to={`/app/practice/session?mode=drill&exam=${targetExam !== "all" ? targetExam : "bcs-general"}`}
                >
                  <FontAwesomeIcon icon={faPlay} /> Start now
                </Link>
              </Button>
            </div>
            <div className="hidden grid-cols-3 gap-3 md:grid lg:w-[26rem]">
              {[
                [(stats?.totals.answered ?? 0).toLocaleString(), "Questions answered"],
                [stats?.totals.accuracy != null ? `${stats.totals.accuracy}%` : "—", "Answers correct"],
                [String(stats?.mistakes_due ?? 0), "Mistakes to retry"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-3 text-center"
                >
                  <p className="text-xl font-semibold">{v}</p>
                  <p className="text-[0.72rem] leading-tight text-white/80">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </HeroCard>

        {/* Modes */}
        <section className="order-3 md:order-2">
          <h2 className="mb-3 text-[1.05rem] font-semibold">
            More ways to practise
          </h2>
          <div className="stagger grid grid-cols-2 gap-2.5 md:gap-3 lg:grid-cols-4 lg:gap-4">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() =>
                  m.to
                    ? nav(m.to)
                    : document
                        .getElementById("subjects")
                        ?.scrollIntoView({ behavior: "smooth" })
                }
                className="card lift group flex items-center gap-2.5 p-3 text-left md:gap-3 md:p-4"
              >
                <IconBox tone={m.tone} className="size-9 rounded-lg md:size-11">
                  <FontAwesomeIcon icon={m.icon} />
                </IconBox>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.8rem] leading-tight font-semibold md:truncate md:text-sm">
                    {m.title}
                  </span>
                  <span className="hidden text-xs text-muted-foreground md:block md:truncate">
                    {m.text}
                  </span>
                </span>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="hidden text-xs text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block"
                />
              </button>
            ))}
          </div>
        </section>

        {/* Subjects */}
        <section id="subjects" className="order-2 scroll-mt-24 md:order-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 md:mb-4">
            <div>
              <h2 className="text-[1.05rem] font-semibold">
                {currentExamObj
                  ? `Subjects for ${currentExamObj.name}`
                  : "All subjects"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Tap a subject to start · {list.length} subjects
              </p>
            </div>
            <Segmented
              options={[
                { value: "all", label: "All" },
                { value: "weak", label: "Weak subjects" },
                { value: "strong", label: "Good subjects" },
              ]}
              value={filter}
              onChange={setFilter}
              className="mx-0 px-0"
            />
          </div>
          <div className="stagger grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 xl:grid-cols-4">
            {loading &&
              [0, 1, 2, 3].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted md:h-52" />
              ))}
            {list.map((s) => {
              const accent = ACCENTS[s.id] || ACCENTS.default;
              const started = s.done > 0;
              const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSubject(s)}
                  aria-label={`Practice ${s.name}`}
                  className="group relative flex flex-col items-center overflow-hidden rounded-2xl border bg-card px-3 pt-6 pb-4 text-center shadow-[0_1px_2px_rgb(0_0_0/0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_12px_32px_-12px_rgb(15_40_80/0.25)] focus-visible:ring-[3px] focus-visible:ring-primary/30 focus-visible:outline-none md:px-4 md:pt-7 md:pb-5"
                >
                  {started && s.accuracy !== null && (
                    <span
                      className={cn(
                        "absolute top-2.5 right-2.5 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tabular-nums",
                        s.accuracy >= 65 ? "bg-success/10 text-success" : "bg-warning/15 text-amber-700",
                      )}
                      title="Your answers correct"
                    >
                      {s.accuracy}%
                    </span>
                  )}
                  <span
                    className={cn(
                      "grid size-14 place-items-center rounded-2xl text-xl transition-transform duration-300 group-hover:scale-110 md:size-16 md:text-2xl",
                      accent.tile,
                    )}
                  >
                    <Icon name={s.icon} />
                  </span>
                  <p className="mt-3.5 line-clamp-2 text-sm leading-snug font-semibold md:text-[0.95rem]">
                    {s.name}
                  </p>
                  <p className="bn mt-0.5 line-clamp-1 text-[0.7rem] text-muted-foreground md:text-xs">
                    {s.nameBn}
                  </p>
                  <p className="mt-2 text-xs font-medium text-muted-foreground tabular-nums">
                    {started ? `${s.done} of ${s.total} done` : `${s.total} questions`}
                  </p>
                  <span
                    className={cn(
                      "mt-3 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold md:text-sm",
                      accent.text,
                    )}
                  >
                    {started ? "Continue" : "Practice now"}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-[0.65rem] transition-transform group-hover:translate-x-1"
                    />
                  </span>
                  {started && (
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-muted">
                      <span
                        className={cn("block h-full rounded-r-full", accent.bar)}
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Practice Configuration Dialog */}
      <Dialog open={!!subject} onOpenChange={(v) => !v && setSubject(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] gap-0 rounded-xl p-0 sm:max-w-md">
          {subject && (
            <>
              <DialogHeader className="flex-row items-center gap-3 space-y-0 border-b p-5 text-left">
                <img
                  src={subject.image}
                  alt=""
                  className="size-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <DialogTitle className="text-base font-semibold">
                    {subject.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    {subject.accuracy === null
                      ? `${subject.total} questions to practise`
                      : `You get ${subject.accuracy}% correct · ${Math.max(0, subject.total - subject.done)} new questions waiting`}
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="space-y-5 p-5">
                <div>
                  <p className="mb-2 text-sm font-medium">
                    How many questions?
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 15, 20, 30].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setCount(n)}
                        aria-pressed={count === n}
                        className={cn(
                          "h-10 rounded-lg border text-sm font-semibold transition-colors",
                          count === n
                            ? "border-primary bg-secondary text-primary"
                            : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">How hard?</p>
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1 sm:grid-cols-4">
                    {[
                      ["mixed", "Mixed (best)"],
                      ["easy", "Easy"],
                      ["medium", "Medium"],
                      ["hard", "Hard"],
                    ].map(([v, l]) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setDiff(v)}
                        aria-pressed={diff === v}
                        className={cn(
                          "h-8 rounded-md text-xs font-semibold transition-all sm:text-sm",
                          diff === v
                            ? "bg-card text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
                  <FontAwesomeIcon icon={faClock} />
                  Takes about {Math.round(count * 0.75)} minutes. You'll see the
                  right answer and why after each question.
                </div>
              </div>

              <DialogFooter className="flex-row gap-2 border-t p-4 sm:justify-end">
                <Button
                  variant="outline"
                  className="h-10 flex-1 sm:flex-none"
                  onClick={() => setSubject(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="h-10 flex-1 sm:flex-none sm:px-6"
                  onClick={() =>
                    nav(
                      `/app/practice/session?mode=drill&subject=${subject.id}&exam=${
                        targetExam !== "all" ? targetExam : "bcs-general"
                      }&n=${count}`,
                    )
                  }
                >
                  <FontAwesomeIcon icon={faPlay} /> Start practice
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
