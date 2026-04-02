import SettingsCenter from "@/components/settings-center"
import { createPageMetadata, getMetadataT } from "@/lib/metadata"

export async function generateMetadata() {
  const { t } = await getMetadataT()

  return createPageMetadata({
    title: t("settingsNav.integrations"),
    description: t("settingsPage.integrationsDescription"),
    path: "/dashboard/settings/integrations",
    noIndex: true,
  })
}

export default function Page() {
  return <SettingsCenter section="integrations" />
}
