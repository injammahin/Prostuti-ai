/** Model tests are grouped as "bank" / "primary" / …; this gives the exam (as in data.js) a test belongs to. */
export function examOfTest(testId, group) {
  if (group === "bank") return String(testId).startsWith("bb-") ? "bangladesh-bank" : "combined-bank"
  if (group === "primary") return "primary-teacher"
  return group || "bcs-general"
}

const GROUPS = { "combined-bank": "bank", "bangladesh-bank": "bank", "primary-teacher": "primary" }

/** Tests for an exam, its own first. The two bank exams share the same format, so each also offers the other's tests. */
export function testsForExam(tests, exam) {
  const group = GROUPS[exam] || exam
  const own = (t) => examOfTest(t.id, t.exam) === exam
  return tests.filter((t) => t.exam === group || t.exam === exam).sort((a, b) => own(b) - own(a))
}
