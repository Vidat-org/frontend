"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  CreditCard,
  History,
  KeyRound,
  LifeBuoy,
  Users,
  Webhook,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "next-i18next/client"

const items = [
  {
    href: "/dashboard/settings",
    label: "settingsNav.overview",
    match: "/dashboard/settings",
  },
  {
    href: "/dashboard/settings/billing",
    label: "settingsNav.billing",
    icon: CreditCard,
  },
  {
    href: "/dashboard/settings/notifications",
    label: "settingsNav.notifications",
    icon: Bell,
  },

  { href: "/dashboard/settings/team", label: "settingsNav.team", icon: Users },
  {
    href: "/dashboard/settings/integrations",
    label: "settingsNav.integrations",
    icon: Webhook,
  },
  { href: "/dashboard/settings/api", label: "settingsNav.api", icon: KeyRound },
  {
    href: "/dashboard/settings/support",
    label: "settingsNav.support",
    icon: LifeBuoy,
  },
  {
    href: "/dashboard/settings/logs",
    label: "settingsNav.logs",
    icon: History,
  },
] as const

export default function SettingsNav() {
  const pathname = usePathname()
  const { t } = useT("common")
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isActive =
          item.href === "/dashboard/settings"
            ? pathname === item.href
            : pathname.startsWith(item.href)
        const Icon = "icon" in item ? item.icon : null

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex min-w-0 items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors",
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card hover:bg-muted/60"
            )}
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            <span className="truncate">{t(item.label)}</span>
          </Link>
        )
      })}
    </div>
  )
}
