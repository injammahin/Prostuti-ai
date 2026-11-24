import { Component, Fragment, useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faWandMagicSparkles, faCircleInfo, faRotateRight } from "@fortawesome/free-solid-svg-icons"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { aiApi } from "@/lib/api"
import { cn } from "@/lib/utils"

const BANGLA = /[ঀ-৿]/

const copy = {
  bn: {
    title: "AI-কে জিজ্ঞেস করুন",
    description: "এই প্রশ্নের যাচাইকৃত উত্তরের ভিত্তিতে সহজ ব্যাখ্যা।",
    suggestions: [
      ["why_others", "অন্য অপশনগুলো ভুল কেন?"],
      ["trick", "মনে রাখার সহজ কৌশল দাও"],
      ["simple", "সহজ ভাষায় বুঝিয়ে দাও"],
    ],
    placeholder: "আরও কিছু জানতে চাইলে লিখুন…",
    note: "AI-এর উত্তর অনুশীলনের সহায়তা মাত্র। ভুল মনে হলে প্রশ্নটি রিপোর্ট করুন।",
    retry: "আবার চেষ্টা করুন",
    thinking: "ভাবছে…",
    crashed: "উত্তরটি দেখাতে সমস্যা হয়েছে।",
    empty: "এই মুহূর্তে উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।",
  },
  en: {
    title: "Ask AI why",
    description: "Clear explanations based on this question's verified answer.",
    suggestions: [
      ["why_others", "Why are the other options wrong?"],
      ["trick", "Give me a trick to remember this"],
      ["simple", "Explain in simple words"],
    ],
    placeholder: "Ask a follow-up…",
    note: "AI help is practice guidance. Report anything that looks wrong.",
    retry: "Try again",
    thinking: "Thinking…",
    crashed: "Something went wrong showing this answer.",
    empty: "No answer came back just now. Please try again.",
  },
}

/**
 * Catches render errors inside the AI panel so a bad reply (or a browser extension such as
 * page translation rewriting the text) cannot blank the whole practice page.
 */
class AiErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error("AI panel crashed", error)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="m-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        <p>{this.props.message}</p>
        <button onClick={() => this.setState({ failed: false })} className="mt-2 flex items-center gap-1.5 text-xs font-semibold underline underline-offset-2">
          <FontAwesomeIcon icon={faRotateRight} /> {this.props.retry}
        </button>
      </div>
    )
  }
}

/** Renders the tutor's light formatting: **bold**, "- " bullets and paragraphs. */
function RichText({ text }) {
  // Each text piece sits in its own <span> so tools that rewrite page text (e.g. Chrome translate) don't break React's DOM updates.
  const inline = (line) =>
    line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
    )
  const blocks = String(text ?? "").trim().split(/\n{2,}/)
  return (
    <div className="space-y-2">
      {blocks.map((block, b) => {
        const lines = block.split("\n").filter(Boolean)
        if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) {
          return (
            <ul key={b} className="space-y-1">
              {lines.map((l, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-[0.55em] size-1 shrink-0 rounded-full bg-current opacity-50" />
                  <span>{inline(l.replace(/^\s*[-•*]\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={b}>
            {lines.map((l, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {inline(l.replace(/^\s*[-•*]\s+/, "• "))}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}

export default function AskAiSheet({ open, onOpenChange, question }) {
  const [lang, setLang] = useState(question?.lang === "en" ? "en" : "bn")
  const [msgs, setMsgs] = useState([]) // { role: "user"|"assistant", text, error? }
  const [text, setText] = useState("")
  const [typing, setTyping] = useState(false)
  const [lastRequest, setLastRequest] = useState(null)
  const end = useRef(null)
  const t = copy[lang]

  useEffect(() => {
    if (open) {
      setMsgs([])
      setLang(question?.lang === "en" ? "en" : "bn")
    }
  }, [open, question?.id, question?.lang])
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, typing])

  const send = async ({ intent, label, message, replyLang }) => {
    if (!question?.id || typing) return
    const history = msgs.filter((m) => !m.error).map((m) => ({ role: m.role, text: m.text })).slice(-8)
    setMsgs((m) => [...m, { role: "user", text: label }])
    setText("")
    setTyping(true)
    setLastRequest({ intent, label, message, replyLang })
    try {
      const res = await aiApi.explain({ questionId: question.id, intent, message, lang: replyLang, history })
      const reply = typeof res?.reply === "string" ? res.reply.trim() : ""
      setMsgs((m) => [...m, reply ? { role: "assistant", text: reply } : { role: "assistant", text: t.empty, error: true }])
    } catch (e) {
      setMsgs((m) => [...m, { role: "assistant", text: String(e?.message || t.empty), error: true }])
    } finally {
      setTyping(false)
    }
  }

  const askSuggestion = (intent, label) => send({ intent, label, replyLang: lang })
  const askFree = (value) => {
    const message = value.trim()
    if (!message) return
    // Reply in Bangla when the student writes in Bangla; otherwise follow the selected language.
    send({ intent: "free", label: message, message, replyLang: BANGLA.test(message) ? "bn" : lang })
  }
  const retry = () => {
    if (!lastRequest) return
    setMsgs((m) => m.slice(0, -2))
    send(lastRequest)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto flex h-[82dvh] max-w-lg flex-col gap-0 rounded-t-3xl p-0">
        <SheetHeader className="border-b pr-12">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className={cn("flex items-center gap-2", lang === "bn" && "bn")}>
              <FontAwesomeIcon icon={faWandMagicSparkles} className="text-primary" /> <span>{t.title}</span>
            </SheetTitle>
            <div className="flex shrink-0 rounded-full bg-muted p-0.5 text-xs font-semibold" role="group" aria-label="Reply language">
              {[
                ["bn", "বাংলা"],
                ["en", "English"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLang(value)}
                  aria-pressed={lang === value}
                  className={cn("rounded-full px-3 py-1 transition-colors", lang === value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <SheetDescription className={cn(lang === "bn" && "bn")}>{t.description}</SheetDescription>
        </SheetHeader>

        <AiErrorBoundary key={question?.id} message={t.crashed} retry={t.retry}>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {msgs.length === 0 && (
            <div className="space-y-2">
              {t.suggestions.map(([intent, label]) => (
                <button
                  key={intent}
                  onClick={() => askSuggestion(intent, label)}
                  className={cn("block w-full rounded-xl border bg-card px-3.5 py-3 text-left text-sm transition-colors hover:border-primary/40 hover:bg-secondary/40", lang === "bn" && "bn")}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {msgs.map((m, i) => (
            <div
              key={i}
              className={cn(
                "rise max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : m.error ? "border border-destructive/30 bg-destructive/5 text-destructive" : "bg-muted",
                BANGLA.test(m.text) && "bn"
              )}
            >
              {m.role === "assistant" && !m.error ? <RichText text={m.text} /> : <span>{m.text}</span>}
              {m.error && i === msgs.length - 1 && (
                <button onClick={retry} className="mt-2 flex items-center gap-1.5 text-xs font-semibold underline underline-offset-2">
                  <FontAwesomeIcon icon={faRotateRight} /> <span>{t.retry}</span>
                </button>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex w-fit items-center gap-2 rounded-2xl bg-muted px-3.5 py-3 text-xs text-muted-foreground">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </span>
              <span className={cn(lang === "bn" && "bn")}>{t.thinking}</span>
            </div>
          )}
          <div ref={end} />
        </div>
        </AiErrorBoundary>

        <p className={cn("flex items-center gap-1.5 px-4 pb-1 text-[0.7rem] text-muted-foreground", lang === "bn" && "bn")}>
          <FontAwesomeIcon icon={faCircleInfo} /> <span>{t.note}</span>
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            askFree(text)
          }}
          className="pb-safe flex gap-2 border-t p-3"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.placeholder}
            maxLength={500}
            className={cn("h-11 flex-1 rounded-full border bg-card px-4 text-base outline-none focus:border-primary md:text-sm", lang === "bn" && "bn")}
          />
          <button type="submit" className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50" disabled={!text.trim() || typing} aria-label="Send">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
