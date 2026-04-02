import DashboardPage from "@/components/dashboard-page"
import { createPageMetadata, getMetadataT } from "@/lib/metadata"

export async function generateMetadata() {
  const { t } = await getMetadataT()

  return createPageMetadata({
    title: t("sidebar.dashboard"),
    description: t("dashboard.overviewDescription"),
    path: "/dashboard",
    noIndex: true,
  })
}

export default function Page() {
  return <DashboardPage />
}
