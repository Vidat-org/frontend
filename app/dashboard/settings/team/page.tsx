import { OrganizationProfile } from "@clerk/nextjs"
import { createPageMetadata, getMetadataT } from "@/lib/metadata"

export async function generateMetadata() {
  const { t } = await getMetadataT()

  return createPageMetadata({
    title: t("settingsNav.team"),
    description: t("settingsPage.teamDescription"),
    path: "/dashboard/settings/team",
    noIndex: true,
  })
}

export default async function Page() {
  return (
    <div className="space-y-6">
      <OrganizationProfile
        appearance={{
          variables: {
            colorShadow: "transparent",
          },
        }}
      />
    </div>
  )
}
