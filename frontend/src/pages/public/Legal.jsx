import { PageHeader } from "@/components/shared"
import { useApp } from "@/lib/app-context"
import { useSeo } from "@/lib/seo"
import { CONTACT_EMAIL } from "@/lib/site"
import { PAGES, UPDATED } from "@/content/legal"

/** About, privacy policy and terms of use. */
export default function Legal({ page }) {
  const { L, fmtDate } = useApp()
  const { sections, title, description } = PAGES[page]

  useSeo({ title: title[0], description })

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      <PageHeader title={L(...title)} subtitle={`${L("Last updated", "সর্বশেষ হালনাগাদ")}: ${fmtDate(UPDATED, { day: "numeric", month: "long", year: "numeric" })}`} />
      <div className="card space-y-7 p-5 md:p-8">
        {sections.map(([heading, headingBn, items]) => (
          <section key={heading}>
            <h2 className="text-lg font-bold">{L(heading, headingBn)}</h2>
            <ul className="mt-2 space-y-2 text-[0.95rem] leading-relaxed text-foreground/85">
              {items.map(([en, bn]) => (
                <li key={en} className={items.length > 1 ? "ml-5 list-disc marker:text-primary" : undefined}>
                  {L(en, bn)}
                </li>
              ))}
            </ul>
          </section>
        ))}
        {CONTACT_EMAIL && (
          <section>
            <h2 className="text-lg font-bold">{L("Contact", "যোগাযোগ")}</h2>
            <p className="mt-2 text-[0.95rem]">
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
