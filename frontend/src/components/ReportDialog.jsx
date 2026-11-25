import { useState } from "react"
import { toast } from "sonner"
import { reportsApi } from "@/lib/api"
import { useApp } from "@/lib/app-context"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const reasons = {
  question: ["Wrong answer key", "Mistake in the question", "Explanation is wrong", "Typo or formatting", "Other"],
  notice: ["Wrong date", "Wrong organisation or exam", "Broken official link", "Outdated information", "Other"],
  evaluation: ["Score feels unfair", "Missed a point I covered", "Factual error in feedback", "OCR misread my answer", "Other"],
}

const titles = { question: "Report this question", notice: "Report an error", evaluation: "Report this feedback" }

export default function ReportDialog({ open, onOpenChange, target = "question", targetRef, questionId }) {
  const { L } = useApp()
  const [sending, setSending] = useState(false)
  const [reason, setReason] = useState(reasons[target][0])
  const [note, setNote] = useState("")
  const submit = async () => {
    setSending(true)
    try {
      await reportsApi.send({ target, targetRef: targetRef ?? questionId, reason, note: note.trim() })
      onOpenChange(false)
      setNote("")
      toast.success(L("Thank you! Your report was sent to our team.", "ধন্যবাদ! আপনার রিপোর্ট আমাদের টিমের কাছে পাঠানো হয়েছে।"))
    } catch {
      toast.error(L("Your report could not be sent. Please try again.", "রিপোর্ট পাঠানো যায়নি। আবার চেষ্টা করুন।"))
    } finally {
      setSending(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2.5rem)] max-w-[calc(100vw-2.5rem)] sm:w-full sm:max-w-md rounded-2xl p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle>{titles[target]}</DialogTitle>
          <DialogDescription>{L("Our team will see it in the admin panel.", "আমাদের টিম এটি দেখতে পাবে।")}</DialogDescription>
        </DialogHeader>
        <RadioGroup value={reason} onValueChange={setReason} className="gap-0 rounded-xl border">
          {reasons[target].map((r) => (
            <Label key={r} className="flex cursor-pointer items-center gap-3 border-b px-3 py-3 font-normal last:border-0">
              <RadioGroupItem value={r} /> {r}
            </Label>
          ))}
        </RadioGroup>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add details (optional)" className="min-h-20 text-base md:text-sm" />
        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="rounded-full" onClick={submit} disabled={sending}>
            Send report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
