import { OrganizationProfile } from "@clerk/nextjs"
import { createPageMetadata, getMetadataT } from "@/lib/metadata"
import { getT } from "next-i18next/server"

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
  const { t } = await getT("common")

  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] border bg-card p-6">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("settingsTeam.clerkTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("settingsTeam.clerkDescription")}
        </p>
      </div>
      <OrganizationProfile
        appearance={{
          variables: {
            colorShadow: "transparent",
          },
        }}
        routing="hash"
      />
    </div>
  )
}
