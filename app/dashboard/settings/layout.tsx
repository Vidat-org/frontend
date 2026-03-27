import type { ReactNode } from "react"
import SettingsNav from "@/components/settings-nav"
import { t } from "@/lib/i18n"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{t("settingsLayout.eyebrow")}</p>
        <h1 className="text-3xl font-bold tracking-tight">{t("settingsLayout.title")}</h1>
      </div>
      <SettingsNav />
      {children}
    </div>
  )
}
