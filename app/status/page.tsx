import { t } from "@/lib/i18n"

const systems = [
  {
    name: "status.systemScanning",
    status: "status.operational",
    detail: "status.detailScanning",
  },
  {
    name: "status.systemReports",
    status: "status.operational",
    detail: "status.detailReports",
  },
  {
    name: "status.systemBilling",
    status: "status.operational",
    detail: "status.detailBilling",
  },
  {
    name: "status.systemNotifications",
    status: "status.operational",
    detail: "status.detailNotifications",
  },
]

export default function StatusPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-16">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.22em] text-chart-1">{t("status.eyebrow")}</p>
        <h1 className="font-serif text-5xl tracking-tight">{t("status.title")}</h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">{t("status.intro")}</p>
      </section>

      <section className="grid gap-4">
        {systems.map((system) => (
          <article key={system.name} className="rounded-[1.75rem] border bg-card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-tight">{t(system.name)}</h2>
              <span className="rounded-full bg-chart-1/10 px-3 py-1 text-xs font-semibold text-chart-1">
                {t(system.status)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{t(system.detail)}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
