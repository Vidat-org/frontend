import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { OrganizationProfile } from "@clerk/nextjs"
import { getT } from "next-i18next/server"

export default async function Page() {
  const { t } = await getT("common")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("settingsCenter.team.title")}</CardTitle>
          <CardDescription>
            Hantera medlemmar, roller och inbjudningar direkt via Clerk
            Organizations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationProfile
            appearance={{
              elements: {
                rootBox: { width: "100%", backgroundColor: "red" },

                card: { width: "100%" },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
