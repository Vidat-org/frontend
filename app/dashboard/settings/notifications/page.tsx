import SettingsCenter from "@/components/settings-center"
import { createPageMetadata, getMetadataT } from "@/lib/metadata"

export async function generateMetadata() {
  const { t } = await getMetadataT()

  return createPageMetadata({
    title: t("settingsNav.notifications"),
    description: t("settingsPage.notificationsDescription"),
    path: "/dashboard/settings/notifications",
    noIndex: true,
  })
}

export default function Page() {
  return <SettingsCenter section="notifications" />
}
