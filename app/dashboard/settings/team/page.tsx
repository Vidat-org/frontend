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
