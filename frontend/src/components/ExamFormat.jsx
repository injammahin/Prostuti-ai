import { td } from "@/lib/format"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

const line = "border border-primary/25"
const cell = `${line} px-3 py-3 md:px-4`
const headCell = `${line} bg-[color-mix(in_oklab,var(--primary)_22%,white)] px-3 py-3 font-bold text-foreground md:px-4`
const totalCell = `${line} bg-[color-mix(in_oklab,var(--primary)_14%,white)] px-3 py-3 text-center font-bold md:px-4`

/** Which section starts at each row, so its cell can span the section's subjects. */
function sectionStarts(stage) {
  const starts = {}
  let row = 0
  for (const [en, bn, count] of stage.sections ?? []) {
    const marks = stage.subjects.slice(row, row + count).reduce((sum, [, , m]) => sum + m, 0)
    starts[row] = { en, bn, count, marks }
    row += count
  }
  return starts
}

function SubjectTable({ stage }) {
  const { L, num } = useApp()
  const starts = sectionStarts(stage)
  const hasSections = !!stage.sections
  const changes = stage.changes ?? {}
  const change = (subject) => num(changes[subject] > 0 ? `+${changes[subject]}` : `−${-changes[subject]}`)
  let shaded = false // sections alternate between white and tinted

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm md:text-[0.95rem]">
          <thead>
            <tr>
              <th scope="col" className={cn(headCell, "w-10 md:w-14")}>#</th>
              <th scope="col" className={cn(headCell, "text-left")}>{L("Subject", "বিষয়ের নাম")}</th>
              <th scope="col" className={cn(headCell, "w-20 md:w-36")}>{L("Marks", "নম্বর বণ্টন")}</th>
              {hasSections && <th scope="col" className={cn(headCell, "w-24 md:w-40")}>{L("Section", "সেকশন")}</th>}
            </tr>
          </thead>
          <tbody>
            {stage.subjects.map(([en, bn, marks], i) => {
              const section = starts[i]
              if (section) shaded = !shaded
              const tint = (hasSections ? !shaded : i % 2 === 1) && "bg-primary/[0.045]"
              return (
                <tr key={en} className={cn(tint)}>
                  <td className={cn(cell, "text-center font-semibold tabular-nums")}>{num(i + 1)}</td>
                  <td className={cell}>
                    {L(en, bn)} <span className="text-xs text-muted-foreground">({L(bn, en)})</span>
                    {changes[en] && (
                      <span className={cn("ml-1.5 font-semibold whitespace-nowrap tabular-nums", changes[en] > 0 ? "text-success" : "text-destructive")}>({change(en)})</span>
                    )}
                  </td>
                  <td className={cn(cell, "text-center font-semibold tabular-nums")}>{num(marks)}</td>
                  {section && (
                    <td rowSpan={section.count} className={cn(cell, "text-center align-middle")}>
                      <span className="block">{L(section.en, section.bn)}</span>
                      <b className="tabular-nums">{num(section.marks)}</b>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className={totalCell}>{L("Total", "মোট")}</td>
              <td className={cn(totalCell, "tabular-nums")}>{num(stage.marks)}</td>
              {hasSections && <td className={cn(totalCell, "tabular-nums")}>{num(stage.marks)}</td>}
            </tr>
          </tfoot>
        </table>
      </div>

      {Object.keys(changes).length > 0 && (
        <div className="mt-6 text-sm">
          <p className="font-bold">{L("What changed", "পরিবর্তনসমূহ")}:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-primary">
            {stage.subjects
              .filter(([en]) => changes[en])
              .map(([en, bn]) => {
                const by = Math.abs(changes[en])
                return (
                  <li key={en}>
                    {changes[en] > 0
                      ? L(`${en}: ${by} more marks than before.`, `${bn}: আগের চেয়ে ${num(by)} নম্বর বেড়েছে।`)
                      : L(`${en}: ${by} fewer marks than before.`, `${bn}: আগের চেয়ে ${num(by)} নম্বর কমেছে।`)}
                  </li>
                )
              })}
          </ul>
        </div>
      )}
    </>
  )
}

/** Stages without a subject list (viva, some written exams): just the facts. */
function FactTable({ stage }) {
  const { L, num } = useApp()
  return (
    <table className="w-full border-collapse text-sm md:text-[0.95rem]">
      <tbody>
        {[
          [L("Total marks", "মোট নম্বর"), num(stage.marks)],
          [L("Time", "সময়"), td(stage.duration)],
          [L("Pass mark", "পাস নম্বর"), td(stage.pass)],
        ].map(([label, value]) => (
          <tr key={label}>
            <th scope="row" className={cn(headCell, "w-2/5 text-left")}>{label}</th>
            <td className={cn(cell, "font-semibold")}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** Exam format as printed syllabus sheets: one bordered marks table per stage. */
export default function ExamFormat({ exam }) {
  const { L } = useApp()
  return (
    <div className="space-y-6">
      {exam.stages.map((stage) => {
        const detailed = stage.subjects.length > 0
        return (
          <section key={stage.type} className="card p-4 sm:p-6 md:p-9">
            <header className="mb-6 text-center">
              {stage.isNew && <p className="text-xs font-bold tracking-wide text-success uppercase">{L("New", "নতুন")}</p>}
              <h2 className="text-xl leading-tight md:text-2xl">
                {L(exam.name, exam.nameBn)} — {td(stage.type)}
              </h2>
              {detailed && <p className="mt-1 text-sm text-muted-foreground">{L("Syllabus & mark distribution", "সিলেবাস ও নম্বর বণ্টন")}</p>}
              {stage.note && <p className="mt-2 text-sm font-medium italic">{L(stage.note[0], stage.note[1])}</p>}
              {detailed && (
                <p className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{L("Time", "সময়")}: <b className="text-foreground">{td(stage.duration)}</b></span>
                  <span>{L("Negative", "নেগেটিভ")}: <b className="text-foreground">{td(stage.negative)}</b></span>
                  <span>{L("Pass", "পাস")}: <b className="text-foreground">{td(stage.pass)}</b></span>
                </p>
              )}
            </header>
            {detailed ? <SubjectTable stage={stage} /> : <FactTable stage={stage} />}
          </section>
        )
      })}
    </div>
  )
}
