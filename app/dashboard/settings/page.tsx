import Link from "next/link"
import {
  Bell,
  CreditCard,
  History,
  KeyRound,
  LifeBuoy,
  Users,
  Webhook,
} from "lucide-react"
import { getT } from "next-i18next/server"

const items = [
  {
    href: "/dashboard/settings",
    title: "settingsPage.billingTitle",
    description: "settingsPage.billingDescription",
    icon: CreditCard,
  },
  {
    href: "/dashboard/settings/notifications",
    title: "settingsPage.notificationsTitle",
    description: "settingsPage.notificationsDescription",
    icon: Bell,
  },
  {
    href: "/dashboard/settings/team",
    title: "settingsPage.teamTitle",
    description: "settingsPage.teamDescription",
    icon: Users,
  },
  {
    href: "/dashboard/settings/integrations",
    title: "settingsPage.integrationsTitle",
    description: "settingsPage.integrationsDescription",
    icon: Webhook,
  },
  {
    href: "/dashboard/settings/api",
    title: "settingsPage.apiTitle",
    description: "settingsPage.apiDescription",
    icon: KeyRound,
  },
  {
    href: "/dashboard/settings/support",
    title: "settingsPage.supportTitle",
    description: "settingsPage.supportDescription",
    icon: LifeBuoy,
  },
  {
    href: "/dashboard/settings/logs",
    title: "settingsPage.logsTitle",
    description: "settingsPage.logsDescription",
    icon: History,
  },
] as const

export default async function Page() {
  const { t } = await getT("common")

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[1.5rem] border bg-card p-6 transition-colors hover:bg-muted/40"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-chart-1/10 text-chart-1">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-xl font-semibold tracking-tight">
              {t(item.title)}
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {t(item.description)}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
