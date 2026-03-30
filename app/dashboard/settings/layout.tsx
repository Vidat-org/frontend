import SettingsNav from "@/components/settings-nav"
import { getT } from "next-i18next/server"
import type { ReactNode } from "react"

export default async function Layout({ children }: { children: ReactNode }) {
  const { t } = await getT("common")

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {t("settingsLayout.eyebrow")}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("settingsLayout.title")}
        </h1>
      </div>
      <SettingsNav />
      {children}
    </div>
  )
}
