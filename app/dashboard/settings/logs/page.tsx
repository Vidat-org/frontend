import SettingsCenter from "@/components/settings-center"
import { createPageMetadata, getMetadataT } from "@/lib/metadata"

export async function generateMetadata() {
  const { t } = await getMetadataT()

  return createPageMetadata({
    title: t("settingsNav.logs"),
    description: t("settingsPage.logsDescription"),
    path: "/dashboard/settings/logs",
    noIndex: true,
  })
}

export default function Page() {
  return <SettingsCenter section="logs" />
}
