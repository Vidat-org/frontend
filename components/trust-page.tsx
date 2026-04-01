import Link from "next/link"
import type { TrustPageContent } from "@/lib/trust-content"

export function TrustPage({ content }: { content: TrustPageContent }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-16">
      <section className="space-y-4">
        <p className="text-sm tracking-[0.22em] text-chart-1 uppercase">
          {content.eyebrow}
        </p>
        <h1 className="font-serif text-5xl tracking-tight">{content.title}</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
          {content.intro}
        </p>
      </section>

      <section className="rounded-[1.75rem] border border-chart-1/20 bg-chart-1/5 p-6 md:p-8">
        <p className="text-sm leading-7 text-foreground/90">
          {content.highlight}
        </p>
      </section>

      <section className="grid gap-4">
        {content.sections.map((section) => (
          <article
            key={section.title}
            className="rounded-[1.75rem] border bg-card p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              {section.title}
            </h2>
            <div className="mt-4 space-y-3">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-7 text-muted-foreground md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="flex flex-wrap gap-4 text-sm">
        {content.ctas.map((cta) => (
          <Link
            key={cta.href}
            href={cta.href}
            className="rounded-full border bg-card px-4 py-2 font-medium transition-colors hover:bg-muted"
          >
            {cta.label}
          </Link>
        ))}
      </section>
    </main>
  )
}
