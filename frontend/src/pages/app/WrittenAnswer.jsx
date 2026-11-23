import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faKeyboard, faCamera, faStopwatch, faTrash, faPlus, faWandMagicSparkles, faCircleInfo, faCheck } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { PageHeader, Panel, Pill, Bar } from "@/components/shared"
import { writtenQuestions } from "@/lib/data"
import { cn } from "@/lib/utils"
import NotFound from "@/pages/NotFound"

const OCR_TEXT =
  "বাংলাদেশের অর্থনীতিতে রেমিট্যান্স একটি গুরুত্বপূর্ণ চালিকাশক্তি। প্রবাসী শ্রমিকদের পাঠানো অর্থ দেশের বৈদেশিক মুদ্রার প্রধান উৎসগুলোর একটি। এটি গ্রামীণ অর্থনীতিতে ভোগ ও বিনিয়োগ বাড়ায়, দারিদ্র্য কমায় এবং..."

const stages = ["Reading your answer", "Checking key points", "Scoring against rubric", "Writing feedback"]

export default function WrittenAnswer() {
  const { id } = useParams()
  const nav = useNavigate()
  const w = writtenQuestions.find((x) => x.id === id)
  const [mode, setMode] = useState("type")
  const [text, setText] = useState("")
  const [photos, setPhotos] = useState([])
  const [ocr, setOcr] = useState(null)
  const [ocrBusy, setOcrBusy] = useState(false)
  const [timed, setTimed] = useState(false)
  const [left, setLeft] = useState(0)
  const [evaluating, setEvaluating] = useState(-1)
  const file = useRef(null)

  useEffect(() => {
    if (!timed || left <= 0) return
    const t = setTimeout(() => setLeft(left - 1), 1000)
    return () => clearTimeout(t)
  }, [timed, left])

  useEffect(() => {
    if (evaluating < 0) return
    if (evaluating >= stages.length) {
      nav(`/app/written/${id}/result`, { replace: true })
      return
    }
    const t = setTimeout(() => setEvaluating(evaluating + 1), 900)
    return () => clearTimeout(t)
  }, [evaluating, id, nav])

  if (!w) return <NotFound />

  const answer = mode === "type" ? text : ocr ?? ""
  const words = answer.trim() ? answer.trim().split(/\s+/).length : 0
  const [minW] = w.words.split("–").map(Number)

  const addPhotos = (files) => {
    const list = [...files].map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))
    setPhotos((p) => [...p, ...list])
    setOcr(null)
  }

  const runOcr = () => {
    setOcrBusy(true)
    setTimeout(() => {
      setOcrBusy(false)
      setOcr(OCR_TEXT)
    }, 1200)
  }

  if (evaluating >= 0) {
    return (
      <div className="grid min-h-[70dvh] place-items-center">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto grid size-16 animate-pulse place-items-center rounded-2xl bg-primary/10 text-2xl text-primary">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </div>
          <p className="mt-5 text-lg font-semibold">Evaluating your answer…</p>
          <p className="text-sm text-muted-foreground">Usually under a minute</p>
          <ul className="mt-6 space-y-2.5 text-left">
            {stages.map((s, i) => (
              <li key={s} className={cn("flex items-center gap-3 text-sm", i > evaluating && "text-muted-foreground")}>
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full border text-[0.65rem]",
                    i < evaluating && "border-success bg-success text-white",
                    i === evaluating && "border-primary"
                  )}
                >
                  {i < evaluating ? <FontAwesomeIcon icon={faCheck} /> : i === evaluating ? <span className="size-2 animate-ping rounded-full bg-primary" /> : null}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeader back="/app/written" title="Write your answer" />

      <Panel className="mb-4">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <Pill tone="primary">{w.subject}</Pill>
          <Pill>{w.marks} marks</Pill>
          <Pill>{w.words} words</Pill>
        </div>
        <p className={cn("text-lg leading-relaxed font-semibold", w.lang !== "en" && "bn")}>{w.title}</p>
        <label className="mt-4 flex items-center justify-between gap-3 border-t pt-3 text-sm">
          <span className="flex items-center gap-2">
            <FontAwesomeIcon icon={faStopwatch} className="text-muted-foreground" />
            Exam-condition timer
            {timed && (
              <span className={cn("font-semibold tabular-nums", left < 120 && "text-destructive")}>
                {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
              </span>
            )}
          </span>
          <Switch
            checked={timed}
            onCheckedChange={(v) => {
              setTimed(v)
              setLeft(w.marks * 90)
            }}
          />
        </label>
      </Panel>

      <div className="mb-3 grid grid-cols-2 rounded-full border bg-card p-1">
        {[
          ["type", faKeyboard, "Type"],
          ["photo", faCamera, "Photo of handwriting"],
        ].map(([v, ic, l]) => (
          <button
            key={v}
            onClick={() => setMode(v)}
            className={cn("flex h-10 items-center justify-center gap-2 rounded-full text-sm font-medium", mode === v ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
          >
            <FontAwesomeIcon icon={ic} /> <span className="truncate">{l}</span>
          </button>
        ))}
      </div>

      {mode === "type" ? (
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="এখানে লিখুন… / Start writing here…"
          className="bn min-h-[45dvh] rounded-2xl bg-card p-4 text-base leading-relaxed"
        />
      ) : (
        <div className="space-y-3">
          <input ref={file} type="file" accept="image/*" capture="environment" multiple hidden onChange={(e) => addPhotos(e.target.files)} />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {photos.map((p, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-xl border bg-muted">
                <img src={p.url} alt={`Page ${i + 1}`} className="size-full object-cover" />
                <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-2 text-xs text-white">p{i + 1}</span>
                <button
                  onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 grid size-7 place-items-center rounded-full bg-black/60 text-xs text-white"
                  aria-label="Remove page"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
            <button
              onClick={() => file.current?.click()}
              className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm text-muted-foreground hover:border-primary hover:text-primary"
            >
              <FontAwesomeIcon icon={photos.length ? faPlus : faCamera} className="text-xl" />
              {photos.length ? "Add page" : "Take photo"}
            </button>
          </div>
          {photos.length > 0 && !ocr && (
            <Button variant="outline" className="h-11 w-full rounded-full" onClick={runOcr} disabled={ocrBusy}>
              {ocrBusy ? "Reading handwriting…" : "Extract text"}
            </Button>
          )}
          {ocrBusy && <Bar value={65} className="animate-pulse" />}
          {ocr !== null && (
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                <FontAwesomeIcon icon={faCircleInfo} className="text-info" /> Check the extracted text and fix any mistakes
              </p>
              <Textarea value={ocr} onChange={(e) => setOcr(e.target.value)} className="bn min-h-56 rounded-2xl bg-card p-4 text-base leading-relaxed" />
            </div>
          )}
          <p className="text-xs text-muted-foreground">Tip: good light, flat page, one page per photo.</p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className={cn(words > 0 && words < minW && "text-warning")}>
          {words} words {words > 0 && words < minW && `· aim for ${minW}+`}
        </span>
        <span>Your answer is treated as data only.</span>
      </div>

      <div className="pb-safe sticky bottom-20 mt-5 lg:bottom-4">
        <Button className="h-12 w-full rounded-full text-base shadow-lg shadow-primary/20" disabled={words < 5} onClick={() => setEvaluating(0)}>
          <FontAwesomeIcon icon={faWandMagicSparkles} /> Get AI evaluation
        </Button>
      </div>
    </>
  )
}
