/** Share of a paper's questions that makes it complete: the rest are BPSC-cancelled or picture questions. */
export const COMPLETE_SHARE = 0.85

/**
 * How far along a previous BCS paper is: "complete" (most of its own questions are ready),
 * "partial" or "soon".
 */
export function paperStatus(paper) {
  const own = paper.own ?? paper.questions
  if (own >= paper.total * COMPLETE_SHARE) return "complete"
  return own > 0 ? "partial" : "soon"
}

/** Link that opens a previous BCS paper as a timed exam (answers shown at the end). */
export function examLink(paper) {
  const count = Math.max(5, Math.min(paper.questions || 200, 200))
  return `/app/practice/session?mode=past_exam&exam=bcs-general&paper=${encodeURIComponent(paper.source)}&n=${count}`
}
