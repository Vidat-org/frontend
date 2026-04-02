import SettingsCenter from "@/components/settings-center"
import { createPageMetadata, getMetadataT } from "@/lib/metadata"

import { getT } from "next-i18next/server"

export async function generateMetadata() {
  const { t } = await getMetadataT()

  return createPageMetadata({
    title: t("settingsNav.api"),
    description: t("settingsPage.apiDescription"),
    path: "/dashboard/settings/api",
    noIndex: true,
  })
}

export default async function Page() {
  const { t } = await getT("common")

  return (
    <div className="space-y-4">
      <SettingsCenter section="api" />
      <div className="rounded-[1.5rem] border bg-card p-6">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("settingsApi.restApiTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("settingsApi.authPrefix")}{" "}
          <code>Authorization: Bearer &lt;api_key&gt;</code>{" "}
          {t("settingsApi.authOr")}
          <code> x-api-key</code>.
        </p>
        <div className="mt-4 space-y-2 font-mono text-xs text-muted-foreground">
          <p>GET /api/v1/workspaces/current</p>
          <p>GET /api/v1/websites</p>
          <p>GET /api/v1/websites/:id/scans/latest</p>
        </div>
      </div>
    </div>
  )
}
