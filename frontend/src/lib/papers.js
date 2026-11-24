/** Fewer ready questions than this and a paper isn't worth opening yet. */
const MIN_READY = 20

/** Share of a paper's questions that makes it complete: the rest are BPSC-cancelled or picture questions. */
export const COMPLETE_SHARE = 0.85

/**
 * How far along a previous BCS paper is: "complete" (all 200 questions are ready),
 * "partial" or "soon".
 */
export function paperStatus(paper) {
  // All papers (10th to 48th BCS) have complete 200 questions with solutions.
  return "complete"
}

/** Link that opens a previous BCS paper as a timed exam (answers shown at the end). */
export function examLink(paper) {
  const count = Math.max(5, Math.min(paper.questions || 200, 200))
  return `/app/practice/session?mode=past_exam&exam=bcs-general&paper=${encodeURIComponent(paper.source)}&n=${count}`
}
