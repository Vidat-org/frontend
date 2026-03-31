import { getT } from "next-i18next/server"
import { getSystemHealth } from "@/lib/health"
import { formatDate } from "@/lib/utils"

const systemLabels = {
  scanning: "status.systemScanning",
  reports: "status.systemReports",
  billing: "status.systemBilling",
  notifications: "status.systemNotifications",
} as const

function getStatusAppearance(status: "operational" | "degraded" | "outage") {
  if (status === "operational") {
    return "bg-chart-1/10 text-chart-1"
  }

  if (status === "degraded") {
    return "bg-amber-500/10 text-amber-700 dark:text-amber-300"
  }

  return "bg-destructive/10 text-destructive"
}

export default async function StatusPage() {
  const { t, i18n } = await getT("common")
  const locale = i18n.resolvedLanguage === "en" ? "en" : "sv"
  const health = await getSystemHealth()

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-16">
      <section className="space-y-4">
        <p className="text-sm tracking-[0.22em] text-chart-1 uppercase">
          {t("status.eyebrow")}
        </p>
        <h1 className="font-serif text-5xl tracking-tight">
          {t("status.title")}
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
          {t("status.intro")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("status.checkedAt")}: {formatDate(health.checkedAt, locale)}
        </p>
      </section>

      <section className="grid gap-4">
        {health.components.map((system) => (
          <article
            key={system.key}
            className="rounded-[1.75rem] border bg-card p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-tight">
                {t(systemLabels[system.key])}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusAppearance(system.status)}`}
              >
                {t(`status.${system.status}`)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {t(system.detailKey)}
            </p>
          </article>
        ))}
      </section>
    </main>
  )
}
