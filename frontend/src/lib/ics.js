const d = (iso) => iso.replaceAll("-", "")

/** Download an .ics file with all-day events for a notice's key dates. */
export function downloadIcs(notice) {
  const events = [
    notice.applyFrom && ["Application opens", notice.applyFrom],
    notice.applyUntil && ["Application deadline", notice.applyUntil],
    notice.examDate && ["Exam", notice.examDate],
  ].filter(Boolean)
  if (!events.length) events.push(["Published", notice.published])

  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DreamPrep//Notices//EN"]
  events.forEach(([label, iso], i) => {
    const end = new Date(iso + "T00:00:00")
    end.setDate(end.getDate() + 1)
    lines.push(
      "BEGIN:VEVENT",
      `UID:${notice.slug}-${i}@dreamprep.bd`,
      `DTSTAMP:${d(new Date().toISOString().slice(0, 10))}T000000Z`,
      `DTSTART;VALUE=DATE:${d(iso)}`,
      `DTEND;VALUE=DATE:${d(end.toISOString().slice(0, 10))}`,
      `SUMMARY:${label}: ${notice.title}`,
      `DESCRIPTION:Confirm on the official site: ${notice.url}`,
      "END:VEVENT"
    )
  })
  lines.push("END:VCALENDAR")

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = `${notice.slug}.ics`
  a.click()
  URL.revokeObjectURL(a.href)
}
