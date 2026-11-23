import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faWandMagicSparkles, faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const suggestions = ["Why are the other options wrong?", "Give me a trick to remember this", "Explain in simple words"]

export default function AskAiSheet({ open, onOpenChange, question }) {
  const [msgs, setMsgs] = useState([])
  const [text, setText] = useState("")
  const [typing, setTyping] = useState(false)
  const end = useRef(null)

  useEffect(() => {
    if (open) setMsgs([])
  }, [open, question?.id])
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, typing])

  const ask = (q) => {
    if (!q.trim()) return
    setMsgs((m) => [...m, { me: true, text: q }])
    setText("")
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [
        ...m,
        {
          me: false,
          text:
            question?.lang === "en"
              ? `Based on the verified explanation: ${question.explanation} The other options don't match this meaning.`
              : `যাচাইকৃত ব্যাখ্যা অনুযায়ী: ${question?.explanation} অন্য অপশনগুলো এই তথ্যের সঙ্গে মেলে না, তাই সেগুলো ভুল।`,
        },
      ])
    }, 900)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto flex h-[80dvh] max-w-lg flex-col gap-0 rounded-t-3xl p-0">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="text-primary" /> Ask AI why
          </SheetTitle>
          <SheetDescription>Answers use only this question's verified explanation.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {msgs.length === 0 && (
            <div className="space-y-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => ask(s)} className="block w-full rounded-xl border bg-card px-3 py-2.5 text-left text-sm hover:border-primary/40">
                  {s}
                </button>
              ))}
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={cn("max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed", m.me ? "ml-auto bg-primary text-primary-foreground" : "bn bg-muted")}>
              {m.text}
            </div>
          ))}
          {typing && (
            <div className="flex w-16 gap-1 rounded-2xl bg-muted px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </div>
          )}
          <div ref={end} />
        </div>
        <p className="flex items-center gap-1.5 px-4 pb-1 text-[0.7rem] text-muted-foreground">
          <FontAwesomeIcon icon={faCircleInfo} /> AI help is practice guidance. Report anything that looks wrong.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(text)
          }}
          className="pb-safe flex gap-2 border-t p-3"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask a follow-up…"
            className="h-11 flex-1 rounded-full border bg-card px-4 text-base outline-none focus:border-primary md:text-sm"
          />
          <button type="submit" className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50" disabled={!text.trim()} aria-label="Send">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
