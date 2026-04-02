import SettingsCenter from "@/components/settings-center"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PricingTable } from "@clerk/nextjs"
import { getT } from "next-i18next/server"
import { createPageMetadata, getMetadataT } from "@/lib/metadata"

export async function generateMetadata() {
  const { t } = await getMetadataT()

  return createPageMetadata({
    title: t("settingsNav.billing"),
    description: t("settingsPage.billingDescription"),
    path: "/dashboard/settings/billing",
    noIndex: true,
  })
}

export default async function Page() {
  const { t } = await getT("common")

  return (
    <div className="space-y-6">
      <SettingsCenter section="billing" />

      <Card>
        <CardHeader>
          <CardTitle>{t("settingsCenter.pricingTableTitle")}</CardTitle>
          <CardDescription>
            {t("settingsCenter.pricingTableDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PricingTable
            for="organization"
            i18nIsDynamicList
            newSubscriptionRedirectUrl="/dashboard/settings/billing"
            appearance={{
              variables: {
                colorShadow: "transparent",
                colorMuted: "var(--accent)",
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
