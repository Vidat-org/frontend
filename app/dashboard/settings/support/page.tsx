import SettingsCenter from "@/components/settings-center"
import { createPageMetadata, getMetadataT } from "@/lib/metadata"

export async function generateMetadata() {
  const { t } = await getMetadataT()

  return createPageMetadata({
    title: t("settingsNav.support"),
    description: t("settingsPage.supportDescription"),
    path: "/dashboard/settings/support",
    noIndex: true,
  })
}

export default function Page() {
  return <SettingsCenter section="support" />
}
