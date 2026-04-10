import { getT } from "next-i18next/server"
import Link from "next/link"
import { createPageMetadata, getMetadataT } from "@/lib/metadata"

const currentCapabilities = [
  "docs.v1.capability1",
  "docs.v1.capability2",
  "docs.v1.capability3",
  "docs.v1.capability4",
]

const launchReadiness = [
  "docs.v1.launch1",
  "docs.v1.launch2",
  "docs.v1.launch3",
  "docs.v1.launch4",
]

const scanContract = [
  "docs.v1.contract1",
  "docs.v1.contract2",
  "docs.v1.contract3",
  "docs.v1.contract4",
]

export async function generateMetadata() {
  const { t } = await getMetadataT()

  return createPageMetadata({
    title: t("docs.title"),
    description: t("docs.v1.intro"),
    path: "/docs",
  })
}

export default async function DocsPage() {
  const { t } = await getT("common")

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-16">
      <section className="space-y-4">
        <p className="text-sm tracking-[0.22em] text-chart-1 uppercase">
          {t("docs.eyebrow")}
        </p>
        <h1 className="font-serif text-5xl tracking-tight">
          {t("docs.title")}
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
          {t("docs.v1.intro")}
        </p>
      </section>

      <section className="rounded-[1.75rem] border bg-card p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("docs.currentTitle")}
        </h2>
        <div className="mt-5 grid gap-3">
          {currentCapabilities.map((item) => (
            <div
              key={item}
              className="rounded-2xl border bg-background/80 p-4 text-sm leading-7 text-muted-foreground"
            >
              {t(item)}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border bg-card p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("docs.v1.launchTitle")}
        </h2>
        <div className="mt-5 grid gap-3">
          {launchReadiness.map((item) => (
            <div
              key={item}
              className="rounded-2xl border bg-background/80 p-4 text-sm leading-7 text-muted-foreground"
            >
              {t(item)}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border bg-card p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("docs.v1.contractTitle")}
        </h2>
        <div className="mt-5 grid gap-3">
          {scanContract.map((item) => (
            <div
              key={item}
              className="rounded-2xl border bg-background/80 p-4 text-sm leading-7 text-muted-foreground"
            >
              {t(item)}
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/" className="underline underline-offset-4">
          {t("docs.toHome")}
        </Link>
        <Link
          href="/dashboard/settings"
          className="underline underline-offset-4"
        >
          {t("docs.toSettings")}
        </Link>
      </div>
    </main>
  )
}
