/** Link that opens a previous BCS paper as a timed exam (answers shown at the end). */
export function examLink(paper) {
  const count = Math.max(5, Math.min(paper.questions, 200))
  return `/app/practice/session?mode=past_exam&exam=bcs-general&paper=${encodeURIComponent(paper.source)}&n=${count}`
}
