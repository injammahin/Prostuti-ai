import { useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBullhorn,
  faHourglassHalf,
  faIdCard,
  faTrophy,
  faCalendarDay,
  faClockRotateLeft,
  faCheck,
  faCheckDouble,
  faBell,
  faCircleCheck,
  faEnvelope,
  faMobileScreen,
  faArrowUpRightFromSquare,
  faSliders,
  faCalendarPlus,
  faShieldHalved,
  faCircleExclamation,
  faFilter,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { PageHeader, Panel, Segmented, IconBox, Pill, SectionTitle } from "@/components/shared"
import { exams, notices } from "@/lib/data"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

const initialAlerts = [
  {
    id: "alert-1",
    exam: "ntrca",
    examName: "19th NTRCA Teacher Registration",
    category: "circular",
    categoryLabel: "New Circular",
    icon: faBullhorn,
    tone: "primary",
    title: "19th NTRCA Teacher Registration circular published: 35,000+ vacancies",
    summary: "NTRCA invites online applications for School, School-2 and College level registration certificates. Application portal is now live.",
    time: "2 hours ago",
    date: "22 Nov 2026",
    to: "/app/notices/ntrca-19th-registration",
    authority: "NTRCA Official",
    unread: true,
    urgent: false,
    actionLabel: "View Circular",
  },
  {
    id: "alert-2",
    exam: "bcs-general",
    examName: "BCS General",
    category: "admit",
    categoryLabel: "Admit Card",
    icon: faIdCard,
    tone: "info",
    title: "50th BCS Written: Admit card download is now live",
    summary: "Download your admit card from bpsc.teletalk.com.bd using your User ID and Password before the 8 December exam date.",
    time: "Yesterday",
    date: "21 Nov 2026",
    to: "/app/notices/50th-bcs-written-admit",
    authority: "BPSC Verified",
    unread: true,
    urgent: false,
    actionLabel: "Download Admit",
  },
  {
    id: "alert-3",
    exam: "bangladesh-bank",
    examName: "Bangladesh Bank",
    category: "deadline",
    categoryLabel: "Urgent Deadline",
    icon: faHourglassHalf,
    tone: "destructive",
    title: "Bangladesh Bank AD (General): Only 3 days left to submit application",
    summary: "Online application and fee payment window for Bangladesh Bank Assistant Director (General) closes at 11:59 PM on 25 November.",
    time: "3 days ago",
    date: "19 Nov 2026",
    to: "/app/notices/bangladesh-bank-ad-2026",
    authority: "Bangladesh Bank Recruitment",
    unread: false,
    urgent: true,
    actionLabel: "Apply Online",
  },
  {
    id: "alert-4",
    exam: "bcs-general",
    examName: "BCS General",
    category: "schedule",
    categoryLabel: "Date Changed",
    icon: faClockRotateLeft,
    tone: "warning",
    title: "50th BCS Written schedule confirmed: Exam starts 8 December",
    summary: "BPSC has updated the compulsory written exam timeline across Dhaka, Chattogram, Rajshahi, Khulna, Barishal, Sylhet, Rangpur & Mymensingh centres.",
    time: "4 days ago",
    date: "18 Nov 2026",
    to: "/app/notices/50th-bcs-written-schedule",
    authority: "BPSC Gazette",
    unread: false,
    urgent: false,
    actionLabel: "View Schedule",
  },
  {
    id: "alert-5",
    exam: "combined-bank",
    examName: "Combined 9 Banks",
    category: "schedule",
    categoryLabel: "Exam Date",
    icon: faCalendarDay,
    tone: "primary",
    title: "Combined 9 Banks Senior Officer: Preliminary exam date announced for 19 Dec",
    summary: "Bankers Selection Committee Secretariat announced the 100-mark preliminary MCQ test across 89 centers in Dhaka.",
    time: "5 days ago",
    date: "17 Nov 2026",
    to: "/app/notices/combined-bank-senior-officer-2026",
    authority: "BSCS Official",
    unread: false,
    urgent: false,
    actionLabel: "View Routine",
  },
  {
    id: "alert-6",
    exam: "primary-teacher",
    examName: "Primary Assistant Teacher",
    category: "result",
    categoryLabel: "Merit Result",
    icon: faTrophy,
    tone: "success",
    title: "Primary Assistant Teacher 3rd phase MCQ result published: 13,780 qualified",
    summary: "Directorate of Primary Education released the third phase preliminary screening results. Viva voce dates to commence from 15 December.",
    time: "10 days ago",
    date: "12 Nov 2026",
    to: "/app/notices/primary-teacher-result-phase3",
    authority: "DPE Verified",
    unread: false,
    urgent: false,
    actionLabel: "Check Result",
  },
  {
    id: "alert-7",
    exam: "combined-bank",
    examName: "Combined 8 Banks",
    category: "circular",
    categoryLabel: "New Circular",
    icon: faBullhorn,
    tone: "primary",
    title: "Combined 8 Banks Officer (Cash): 1,511 vacancies circular announced",
    summary: "BSCS invited applications for 1,511 Officer (Cash) posts in Sonali, Janata, Agrani, Rupali and other scheduled banks. Last date 2 December.",
    time: "12 days ago",
    date: "10 Nov 2026",
    to: "/app/notices/combined-bank-officer-cash",
    authority: "BSCS Official",
    unread: false,
    urgent: false,
    actionLabel: "View Details",
  },
]

export default function Alerts() {
  const { followed, toggleFollow, mainExam } = useApp()
  const [tab, setTab] = useState("inbox")
  const [alerts, setAlerts] = useState(initialAlerts)
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedExam, setSelectedExam] = useState("all")

  // Notification channels
  const [channels, setChannels] = useState({
    push: true,
    inapp: true,
    sms: true,
    email: false,
  })
  const [smsPhone, setSmsPhone] = useState("+880 1700-000000")

  const unreadCount = alerts.filter((a) => a.unread).length

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })))
    toast.success("All notifications marked as read")
  }

  const handleToggleRead = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, unread: !a.unread } : a))
    )
  }

  const handleAddToPlan = (alertItem, e) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success(`"${alertItem.examName}" milestone added to your Study Plan!`)
  }

  const handleTestNotification = () => {
    toast.info("Test Notification: 50th BCS Written exam date confirmed for 8 Dec 2026.", {
      description: "Push delivery verified successfully on this browser.",
      action: {
        label: "OK",
        onClick: () => {},
      },
    })
  }

  // Filtered alerts
  const filtered = alerts.filter((a) => {
    if (activeCategory !== "all" && a.category !== activeCategory) return false
    if (selectedExam !== "all" && a.exam !== selectedExam) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header with Title and Quick Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">Exam Alerts & Notifications</h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Instant circulars, admit card releases, exam routines, and deadline reminders for your target exams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tab === "inbox" && unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="h-9 gap-1.5 rounded-xl text-xs font-medium"
            >
              <FontAwesomeIcon icon={faCheckDouble} className="text-primary" />
              Mark all as read
            </Button>
          )}
          <Segmented
            options={[
              { value: "inbox", label: "Alerts Feed" },
              { value: "settings", label: "Channels & Rules" },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>
      </div>

      {tab === "inbox" ? (
        <div className="space-y-4">
          {/* Controls Bar: Category Pills + Exam Selector */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Alerts", count: alerts.length },
                { id: "circular", label: "Circulars", count: alerts.filter((a) => a.category === "circular").length },
                { id: "admit", label: "Admit Cards", count: alerts.filter((a) => a.category === "admit").length },
                { id: "deadline", label: "Deadlines", count: alerts.filter((a) => a.category === "deadline").length },
                { id: "schedule", label: "Routines", count: alerts.filter((a) => a.category === "schedule").length },
                { id: "result", label: "Results", count: alerts.filter((a) => a.category === "result").length },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                    activeCategory === c.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{c.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px]",
                      activeCategory === c.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {c.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Target Exam Filter Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <FontAwesomeIcon icon={faFilter} className="text-xs text-muted-foreground" />
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="h-8 rounded-lg border bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All 5 Target Exams</option>
                {exams.map((ex) => (
                  <option key={ex.slug} value={ex.slug}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Alerts Feed */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
                <FontAwesomeIcon icon={faBell} className="text-xl" />
              </div>
              <h3 className="mt-3 text-sm font-semibold">No notifications found</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                There are currently no alerts matching your selected filter criteria.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveCategory("all")
                  setSelectedExam("all")
                }}
                className="mt-4 rounded-xl text-xs"
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "group relative flex flex-col gap-3 rounded-2xl border p-4.5 transition-all duration-200 sm:flex-row sm:items-start sm:gap-4",
                    item.unread
                      ? "border-primary/30 bg-primary/[0.02] shadow-xs hover:border-primary/50 hover:bg-primary/[0.04]"
                      : "bg-card hover:border-border/80 hover:bg-muted/20"
                  )}
                >
                  {/* Left: Icon Box */}
                  <div className="flex items-center justify-between sm:block">
                    <IconBox tone={item.tone} className="size-10 text-sm shadow-2xs">
                      <FontAwesomeIcon icon={item.icon} />
                    </IconBox>

                    {/* Mobile unread pip */}
                    <div className="flex items-center gap-2 sm:hidden">
                      <span className="text-[11px] text-muted-foreground">{item.time}</span>
                      {item.unread && <span className="size-2 rounded-full bg-primary" />}
                    </div>
                  </div>

                  {/* Middle: Content */}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground">
                        {item.examName}
                      </span>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[11px] font-medium",
                          item.urgent
                            ? "bg-destructive/10 text-destructive font-semibold"
                            : "bg-muted/80 text-muted-foreground"
                        )}
                      >
                        {item.categoryLabel}
                      </span>
                      <span className="hidden text-xs text-muted-foreground sm:inline">·</span>
                      <span className="hidden text-xs text-muted-foreground sm:inline">{item.time}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                        <FontAwesomeIcon icon={faCircleCheck} className="text-[10px]" />
                        {item.authority}
                      </span>
                    </div>

                    <h3
                      className={cn(
                        "text-sm sm:text-base leading-snug",
                        item.unread ? "font-bold text-foreground" : "font-medium text-foreground/90"
                      )}
                    >
                      {item.title}
                    </h3>

                    <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                      {item.summary}
                    </p>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Button asChild size="sm" className="h-8 rounded-xl px-3.5 text-xs font-semibold gap-1.5 shadow-2xs">
                        <Link to={item.to}>
                          <span>{item.actionLabel}</span>
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleAddToPlan(item, e)}
                        className="h-8 rounded-xl px-3 text-xs gap-1.5 font-medium hover:bg-muted"
                      >
                        <FontAwesomeIcon icon={faCalendarPlus} className="text-muted-foreground text-[11px]" />
                        Add to Study Plan
                      </Button>

                      <button
                        type="button"
                        onClick={(e) => handleToggleRead(item.id, e)}
                        className="ml-auto inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      >
                        <FontAwesomeIcon icon={item.unread ? faCheck : faCheckDouble} className="text-[11px]" />
                        <span>{item.unread ? "Mark as read" : "Mark unread"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Desktop Unread Pip Indicator */}
                  {item.unread && (
                    <div className="hidden shrink-0 pt-1.5 sm:block" title="Unread notification">
                      <span className="block size-2 rounded-full bg-primary ring-4 ring-primary/20" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Settings / Delivery Channels Tab */
        <div className="grid gap-6 md:grid-cols-2">
          {/* Column 1: Notification Channels */}
          <div className="space-y-6">
            <section className="rounded-2xl border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2.5 border-b pb-3.5">
                <IconBox tone="primary" className="size-8 text-xs">
                  <FontAwesomeIcon icon={faBell} />
                </IconBox>
                <div>
                  <h3 className="text-sm font-semibold">Delivery Channels</h3>
                  <p className="text-xs text-muted-foreground">Select how you receive high-priority alerts</p>
                </div>
              </div>

              <div className="divide-y pt-1">
                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <FontAwesomeIcon icon={faBell} className="text-xs" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Browser Push Notifications</p>
                      <p className="text-xs text-muted-foreground">Instant pop-up on desktop & mobile Chrome</p>
                    </div>
                  </div>
                  <Switch
                    checked={channels.push}
                    onCheckedChange={(val) => setChannels({ ...channels, push: val })}
                  />
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <FontAwesomeIcon icon={faMobileScreen} className="text-xs" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">SMS Urgent Flash</p>
                      <p className="text-xs text-muted-foreground">For deadlines within 48 hours & exam room routines</p>
                    </div>
                  </div>
                  <Switch
                    checked={channels.sms}
                    onCheckedChange={(val) => setChannels({ ...channels, sms: val })}
                  />
                </div>

                {channels.sms && (
                  <div className="bg-muted/40 rounded-xl p-3 my-2 space-y-2 border">
                    <label className="text-xs font-semibold text-muted-foreground">Registered Phone for SMS</label>
                    <div className="flex gap-2">
                      <Input
                        value={smsPhone}
                        onChange={(e) => setSmsPhone(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toast.success("Phone verified for critical SMS alerts")}
                        className="h-8 text-xs shrink-0"
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Weekly Email Summary</p>
                      <p className="text-xs text-muted-foreground">Digest of upcoming application windows every Sunday</p>
                    </div>
                  </div>
                  <Switch
                    checked={channels.email}
                    onCheckedChange={(val) => setChannels({ ...channels, email: val })}
                  />
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestNotification}
                  className="w-full rounded-xl text-xs font-medium"
                >
                  Send Test Browser Notification
                </Button>
              </div>
            </section>
          </div>

          {/* Column 2: Target Exam Subscriptions */}
          <div className="space-y-6">
            <section className="rounded-2xl border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2.5 border-b pb-3.5">
                <IconBox tone="info" className="size-8 text-xs">
                  <FontAwesomeIcon icon={faSliders} />
                </IconBox>
                <div>
                  <h3 className="text-sm font-semibold">Active Track Subscriptions</h3>
                  <p className="text-xs text-muted-foreground">Only receive notifications for the exams you prepare for</p>
                </div>
              </div>

              <div className="divide-y pt-1">
                {exams.map((e) => {
                  const isFollowed = followed.includes(e.slug)
                  return (
                    <div key={e.slug} className="flex items-center justify-between py-3.5">
                      <div>
                        <p className="text-sm font-medium">{e.name}</p>
                        <p className="text-xs text-muted-foreground">{e.orgShort} · {e.syllabusVersion}</p>
                      </div>
                      <Switch
                        checked={isFollowed}
                        onCheckedChange={() => {
                          toggleFollow(e.slug)
                          toast.success(
                            isFollowed
                              ? `Muted alerts for ${e.name}`
                              : `Subscribed to real-time alerts for ${e.name}`
                          )
                        }}
                      />
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 rounded-xl bg-muted/40 p-3.5 text-xs text-muted-foreground border">
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-primary mt-0.5" />
                  <span>
                    Our notification crawler synchronizes with official government gazettes (BPSC, DPE, NTRCA, and Bangladesh Bank) every 15 minutes.
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
