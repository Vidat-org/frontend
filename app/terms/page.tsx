import { getT } from "next-i18next/server"

export default async function Page() {
  const { t } = await getT("common")
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{t("terms.eyebrow")}</p>
        <h1 className="text-4xl font-bold tracking-tight">
          {t("terms.title")}
        </h1>
        <p className="text-muted-foreground">{t("terms.intro")}</p>
      </div>

      <section className="space-y-2 rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        <p>{t("terms.item1")}</p>
        <p>{t("terms.item2")}</p>
        <p>{t("terms.item3")}</p>
        <p>{t("terms.item4")}</p>
      </section>
    </main>
  )
}
