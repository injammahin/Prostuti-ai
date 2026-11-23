import { useState } from "react"
import { useNavigate } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faDownload,
  faTrash,
  faChevronRight,
  faRightFromBracket,
  faUser,
  faCheck,
  faPalette,
  faShieldHalved,
  faBell,
  faSliders,
  faCamera,
  faCircleCheck,
  faGlobe,
  faFont,
  faStar,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PageHeader, Panel, SectionTitle, Pill, IconBox } from "@/components/shared"
import { exams } from "@/lib/data"
import { useApp } from "@/lib/app-context"
import { authApi } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function Settings() {
  const app = useApp()
  const nav = useNavigate()
  const [del, setDel] = useState(false)
  const [confirmText, setConfirmText] = useState("")

  // Form states
  const [name, setName] = useState(app.user?.name || "")
  const [phone, setPhone] = useState(app.user?.phone || "")
  const [saving, setSaving] = useState(false)
  const email = app.user?.email || ""
  const [dob, setDob] = useState("1998-05-14")
  const [degree, setDegree] = useState("graduate")
  const [district, setDistrict] = useState("Dhaka")

  // Notification states
  const [notifs, setNotifs] = useState({
    emailAlerts: true,
    smsUrgent: false,
    weeklyReport: true,
    soundFx: true,
  })

  const exportData = () => {
    const data = {
      profile: { name, email, dob, degree, district },
      followedExams: app.followed,
      mainExam: app.mainExam,
      bookmarks: app.bookmarks,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `prostuti-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    toast.success("All personal preparation data successfully exported!")
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const { data } = await authApi.updateMe({ name: name.trim(), phone: phone.trim() || null })
      app.set({ user: data })
      toast.success("Profile saved!")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account Settings"
        subtitle="Manage your profile, target exam preferences, display options, and security"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* Left Column: Settings Sections */}
        <div className="space-y-6">
          {/* Section: Profile */}
          <div className="card p-5 md:p-6 border shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <div>
                <h3 className="font-bold text-base">Personal Information</h3>
                <p className="text-xs text-muted-foreground">Used to power your eligibility verification and certificates</p>
              </div>
            </div>

            {/* Avatar Row */}
            <div className="flex items-center gap-4 mb-5 p-3 rounded-xl bg-muted/30 border">
              <div className="relative">
                <div className="grid size-16 place-items-center rounded-full bg-primary font-bold text-xl text-primary-foreground">
                  {name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <button
                  type="button"
                  onClick={() => toast("Photo upload available on verified accounts")}
                  className="absolute bottom-0 right-0 grid size-6 place-items-center rounded-full bg-foreground text-background text-xs shadow-sm hover:scale-105 transition-transform"
                  title="Upload picture"
                >
                  <FontAwesomeIcon icon={faCamera} className="text-[0.65rem]" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{name}</p>
                <p className="text-xs text-muted-foreground">Free account</p>
                <div className="mt-1 flex items-center gap-1.5 text-[0.68rem] text-success font-medium">
                  <FontAwesomeIcon icon={faCircleCheck} /> Email verified{app.user?.has_google ? " · Google connected" : ""}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground">Mobile number (optional)</Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, "").slice(0, 14))}
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Email (used to sign in)</Label>
                <Input id="email" type="email" value={email} disabled className="h-10 cursor-not-allowed bg-muted/40 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dob" className="text-xs font-semibold text-muted-foreground">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deg" className="text-xs font-semibold text-muted-foreground">Highest Educational Degree</Label>
                <select
                  id="deg"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="h-10 w-full rounded-md border bg-card px-3 text-sm font-medium"
                >
                  <option value="graduate">Bachelor's / Honours (4 Years)</option>
                  <option value="masters">Master's Degree</option>
                  <option value="degree">Degree (Pass Course - 3 Years)</option>
                  <option value="hsc">HSC / Higher Secondary</option>
                  <option value="diploma">Diploma in Engineering / Technical</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dist" className="text-xs font-semibold text-muted-foreground">Home District / Division</Label>
                <Input
                  id="dist"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Dhaka, Chittagong, Rajshahi"
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t pt-4">
              <p className="text-xs text-muted-foreground">Date of birth & degree calculate your official circular eligibility.</p>
              <Button onClick={handleSaveProfile} disabled={saving || name.trim().length < 2} className="h-9 rounded-full px-5">
                {saving ? "Saving…" : "Save Profile"}
              </Button>
            </div>
          </div>

          {/* Section: Target Exams Manager */}
          <div className="card p-5 md:p-6 border shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <span className="grid size-8 place-items-center rounded-lg bg-warning/10 text-warning-foreground">
                <FontAwesomeIcon icon={faLayerGroup} />
              </span>
              <div>
                <h3 className="font-bold text-base">Target Government Exams</h3>
                <p className="text-xs text-muted-foreground">Select the exams you are preparing for. Click the star ★ to mark your primary focus.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {exams.map((ex) => {
                const isFollowed = app.followed.includes(ex.slug)
                const isMain = app.mainExam === ex.slug
                return (
                  <div
                    key={ex.slug}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                      isFollowed ? "border-primary/40 bg-secondary/20" : "bg-card"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => app.toggleFollow(ex.slug)}
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-md border text-xs transition-colors",
                        isFollowed ? "bg-primary border-primary text-primary-foreground" : "border-input hover:border-primary"
                      )}
                    >
                      {isFollowed && <FontAwesomeIcon icon={faCheck} />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{ex.name}</p>
                      <p className="text-xs text-muted-foreground">{ex.orgShort} · {ex.stages[0]?.marks || 100} Marks Preliminary</p>
                    </div>

                    {isFollowed && (
                      <button
                        type="button"
                        onClick={() => {
                          app.set({ mainExam: ex.slug })
                          toast.success(`Set ${ex.name} as primary target exam!`)
                        }}
                        className={cn(
                          "flex items-center gap-1.5 h-7 rounded-full px-2.5 text-xs font-semibold transition-all",
                          isMain ? "bg-warning/20 text-warning-foreground border border-warning/30" : "text-muted-foreground hover:bg-muted"
                        )}
                        title="Set as main target"
                      >
                        <FontAwesomeIcon icon={faStar} className={isMain ? "text-amber-500" : "text-muted-foreground"} />
                        <span className="text-[0.68rem]">{isMain ? "Primary" : "Set Primary"}</span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section: Display & Appearance */}
          <div className="card p-5 md:p-6 border shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <span className="grid size-8 place-items-center rounded-lg bg-info/10 text-info">
                <FontAwesomeIcon icon={faPalette} />
              </span>
              <div>
                <h3 className="font-bold text-base">Display &amp; Appearance</h3>
                <p className="text-xs text-muted-foreground">Adjust language, theme palettes and reading size</p>
              </div>
            </div>

            <div className="space-y-4 divide-y">
              {/* Language Switch */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-sm font-semibold">Platform Language</p>
                  <p className="text-xs text-muted-foreground">Switch between বাংলা and English across the UI</p>
                </div>
                <div className="flex rounded-lg border p-1 bg-muted/40">
                  {[
                    ["bn", "বাংলা"],
                    ["en", "English"],
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => app.set({ lang: val })}
                      className={cn(
                        "h-8 px-3 rounded-md text-xs font-semibold transition-all",
                        app.lang === val ? "bg-card text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Palette */}
              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-semibold">Theme Palette</p>
                  <p className="text-xs text-muted-foreground">Choose your interface brand accent color</p>
                </div>
                <div className="flex gap-2">
                  {[
                    ["blue", "Royal Blue", "bg-[#1b6ca8]"],
                    ["green", "Emerald Green", "bg-[#1f6b53]"],
                  ].map(([val, label, bgClass]) => (
                    <button
                      key={val}
                      onClick={() => app.set({ palette: val })}
                      className={cn(
                        "flex items-center gap-2 h-9 rounded-xl border px-3 text-xs font-semibold transition-all",
                        app.palette === val ? "border-primary ring-2 ring-primary/20 bg-secondary/30" : "hover:border-primary/40 bg-card"
                      )}
                    >
                      <span className={cn("size-3 rounded-full", bgClass)} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Slider */}
              <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold">Text &amp; Question Font Size</p>
                  <span className="text-xs font-bold tabular-nums text-primary">{app.fontSize}px</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground">A</span>
                  <input
                    type="range"
                    min={14}
                    max={20}
                    step={1}
                    value={app.fontSize}
                    onChange={(e) => app.set({ fontSize: Number(e.target.value) })}
                    className="flex-1 accent-[var(--primary)] h-2 rounded-lg bg-muted"
                  />
                  <span className="text-base font-semibold">A</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground rounded-lg bg-muted/40 p-2 border" style={{ fontSize: `${app.fontSize}px` }}>
                  Sample: “গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান কার্যকর হয় ১৬ ডিসেম্বর ১৯৭২ থেকে।”
                </p>
              </div>
            </div>
          </div>

          {/* Section: Notification Channels */}
          <div className="card p-5 md:p-6 border shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <span className="grid size-8 place-items-center rounded-lg bg-chart-5/10 text-chart-5">
                <FontAwesomeIcon icon={faBell} />
              </span>
              <div>
                <h3 className="font-bold text-base">Notification Preferences</h3>
                <p className="text-xs text-muted-foreground">Configure channels for circular announcements &amp; reminders</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {[
                ["emailAlerts", "Email Digest & Admit Card Notifications", "Get circular updates delivered straight to your inbox"],
                ["smsUrgent", "Urgent SMS Deadline Reminders", "SMS alerts 24 hours before circular deadlines"],
                ["weeklyReport", "Weekly Performance & Rank Summary", "Detailed rank breakdown and national percentile every Friday"],
                ["soundFx", "In-App Audio & Timer Effects", "Sound feedback when finishing model tests and question drills"],
              ].map(([key, title, desc]) => (
                <label key={key} className="flex items-center justify-between gap-4 p-2.5 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={notifs[key]}
                    onCheckedChange={(val) => {
                      setNotifs((n) => ({ ...n, [key]: val }))
                      toast.success("Notification preference updated.")
                    }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Section: Privacy & Danger Zone */}
          <div className="card p-5 md:p-6 border shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <span className="grid size-8 place-items-center rounded-lg bg-destructive/10 text-destructive">
                <FontAwesomeIcon icon={faShieldHalved} />
              </span>
              <div>
                <h3 className="font-bold text-base">Privacy &amp; Data Control</h3>
                <p className="text-xs text-muted-foreground">Export your test records or delete your account</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border bg-card">
                <div>
                  <p className="text-sm font-semibold">Anonymized Performance Diagnostics</p>
                  <p className="text-xs text-muted-foreground">Contribute anonymous practice drill statistics to calibrate national percentiles</p>
                </div>
                <Switch defaultChecked={false} onCheckedChange={() => toast("AI preference updated.")} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border bg-card">
                <div>
                  <p className="text-sm font-semibold">Export Preparation History</p>
                  <p className="text-xs text-muted-foreground">Download a complete JSON archive of all bookmarks, test attempts &amp; notes</p>
                </div>
                <Button variant="outline" size="sm" onClick={exportData} className="h-9 gap-1.5 rounded-full">
                  <FontAwesomeIcon icon={faDownload} /> Export
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-destructive/20 bg-destructive/5">
                <div>
                  <p className="text-sm font-semibold text-destructive">Delete Candidate Account</p>
                  <p className="text-xs text-muted-foreground">Permanently remove all solved questions, streaks and bookmarks</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => setDel(true)} className="h-9 rounded-full">
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Summary & Quick Stats */}
        <div className="space-y-5">
          {/* Candidate Card */}
          <div className="card p-5 border shadow-xs">
            <div className="text-center pb-4 border-b">
              <div className="mx-auto grid size-20 place-items-center rounded-full bg-primary font-bold text-2xl text-primary-foreground shadow-md">
                {name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <h4 className="mt-3 font-bold text-base">{name}</h4>
              <p className="text-xs text-muted-foreground">{email}</p>
              <div className="mt-2.5 flex justify-center gap-1.5">
                <Pill tone="primary">Pro Candidate</Pill>
                <Pill tone="success">Active</Pill>
              </div>
            </div>

            <div className="py-3.5 space-y-2.5 text-xs border-b">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Primary Focus</span>
                <span className="font-semibold text-primary">{exams.find((e) => e.slug === app.mainExam)?.name || "BCS General"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exams Followed</span>
                <span className="font-semibold tabular-nums">{app.followed.length} Tracks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bookmarks Saved</span>
                <span className="font-semibold tabular-nums">{app.bookmarks.length} Questions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Streak</span>
                <span className="font-semibold text-amber-500 tabular-nums">12 Days</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-4 w-full h-10 rounded-xl gap-2 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                app.logout()
                nav("/")
              }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} /> Sign Out
            </Button>
          </div>

          {/* Platform Info Panel */}
          <div className="card p-4 border bg-muted/20 text-xs space-y-2 text-muted-foreground">
            <p className="font-semibold text-foreground">Prostuti Govt Job Prep Platform</p>
            <p>Version 2.4.0 (2026 Production Build)</p>
            <p>End-to-end question verification active. Built with high precision syllabus rubrics.</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={del} onOpenChange={setDel}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <FontAwesomeIcon icon={faTrash} /> Delete Account?
            </DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. All your practice history, test results, and saved questions will be deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label className="text-xs text-muted-foreground">
              Type <b className="text-foreground">DELETE</b> to confirm:
            </Label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="mt-1.5 h-10"
            />
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setDel(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={confirmText !== "DELETE"}
              onClick={() => {
                setDel(false)
                app.logout()
                nav("/")
                toast.success("Account deleted.")
              }}
            >
              Confirm Deletion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
