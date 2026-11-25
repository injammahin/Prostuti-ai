import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TODAY } from "@/lib/data"

export default function EligibilityDialog({ open, onOpenChange, notice }) {
  const [dob, setDob] = useState("1998-05-14")
  const [degree, setDegree] = useState("graduate")
  const [result, setResult] = useState(null)

  const check = () => {
    const age = (TODAY - new Date(dob)) / (365.25 * 86400000)
    const maxAge = 32
    const okDegree = degree !== "hsc"
    setResult(age <= maxAge && okDegree ? "likely" : "check")
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setResult(null) }}>
      <DialogContent className="w-[calc(100vw-2.5rem)] max-w-[calc(100vw-2.5rem)] sm:w-full sm:max-w-md rounded-2xl p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle>Eligibility check</DialogTitle>
          <DialogDescription>A quick guide only — never a final decision. Read the circular carefully.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dob">Date of birth</Label>
            <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="h-11 text-base md:text-sm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deg">Highest degree</Label>
            <select id="deg" value={degree} onChange={(e) => setDegree(e.target.value)} className="h-11 w-full rounded-md border bg-transparent px-3 text-base md:text-sm">
              <option value="graduate">Bachelor's / Honours (4 years)</option>
              <option value="masters">Master's Degree</option>
              <option value="degree">Degree (Pass Course)</option>
              <option value="hsc">HSC or below</option>
            </select>
          </div>
          {result && (
            <div className={`flex gap-3 rounded-xl p-3 text-sm ${result === "likely" ? "bg-success/10 text-success" : "bg-warning/12"}`}>
              <FontAwesomeIcon icon={result === "likely" ? faCircleCheck : faTriangleExclamation} className="mt-0.5" />
              <p>
                <b>{result === "likely" ? "Likely eligible" : "Check carefully"}</b>
                <span className="block text-foreground/75">
                  {result === "likely"
                    ? "Your age and degree seem to match. Quota-based age relaxations and other rules may apply."
                    : "Something may not match (age limit, degree or registration). Read the official circular before applying."}
                </span>
              </p>
            </div>
          )}
          <Button className="h-11 w-full rounded-full" onClick={check}>
            Check now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
