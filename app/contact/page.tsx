import { t } from "@/lib/i18n"

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{t("contact.eyebrow")}</p>
        <h1 className="text-4xl font-bold tracking-tight">{t("contact.title")}</h1>
        <p className="text-muted-foreground">{t("contact.intro")}</p>
      </div>

      <section className="space-y-2 rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        <p>{t("contact.support")}</p>
        <p>{t("contact.billing")}</p>
        <p>{t("contact.security")}</p>
        <p>{t("contact.status")}</p>
        <p>{t("contact.sla")}</p>
      </section>
    </main>
  )
}
