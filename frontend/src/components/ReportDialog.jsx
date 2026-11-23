import { useState } from "react"
import { toast } from "sonner"
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

export default function ReportDialog({ open, onOpenChange, target = "question" }) {
  const [reason, setReason] = useState(reasons[target][0])
  const [note, setNote] = useState("")
  const submit = () => {
    onOpenChange(false)
    setNote("")
    toast.success("Thanks! Our team will review this.", { description: "You'll be notified when it's resolved." })
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{titles[target]}</DialogTitle>
          <DialogDescription>It goes to our review queue. A human checks every report.</DialogDescription>
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
          <Button className="rounded-full" onClick={submit}>
            Send report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
