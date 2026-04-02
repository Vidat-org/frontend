import Link from "next/link"
import { getT } from "next-i18next/server"
import { trustDirectoryLinks, trustPageContent } from "@/lib/trust-content"
import { createPageMetadata, getMetadataLocale } from "@/lib/metadata"

export async function generateMetadata() {
  const locale = await getMetadataLocale()
  const content = trustPageContent.trust[locale]

  return createPageMetadata({
    title: content.title,
    description: content.intro,
    path: "/trust",
  })
}

export default async function TrustCenterPage() {
  const { i18n } = await getT("common")
  const locale = i18n.resolvedLanguage === "en" ? "en" : "sv"
  const content = trustPageContent.trust[locale]
  const links = trustDirectoryLinks[locale]

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-16">
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

      <section className="grid gap-4 md:grid-cols-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[1.75rem] border bg-card p-6 transition-colors hover:bg-muted/40"
          >
            <h2 className="text-xl font-semibold tracking-tight">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {item.description}
            </p>
          </Link>
        ))}
      </section>
    </main>
  )
}
