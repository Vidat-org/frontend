"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { client } from "@/lib/orpc"
import { useQuery } from "@tanstack/react-query"
import { FileChartColumn } from "lucide-react"
import { useT } from "next-i18next/client"
import { useRouter } from "next/navigation"
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs"
import { useEffect } from "react"

export default function OnboardingReportRedirect() {
  const { t } = useT("common")
  const router = useRouter()
  const [onboarding] = useQueryState("onboarding", parseAsStringEnum(["1"]))
  const [websiteId] = useQueryState("website", parseAsString)
  const isActive = onboarding === "1" && Boolean(websiteId)

  const { data } = useQuery({
    queryKey: ["reports", "onboarding", websiteId],
    queryFn: async () => await client.listReports(),
    enabled: isActive,
    refetchInterval: isActive ? 5000 : false,
  })

  useEffect(() => {
    if (!isActive || !websiteId || !data) return

    const latestReport = data
      .flatMap((group) => group.reports)
      .filter((report) => report.websiteId === websiteId)
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      )[0]

    if (latestReport?.id) {
      router.replace(`/dashboard/reports/${latestReport.id}?onboarding=1`)
    }
  }, [data, isActive, router, websiteId])

  if (!isActive) {
    return null
  }

  return (
    <Card className="border-primary/15 bg-primary/6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileChartColumn className="h-4 w-4" />
          {t("reportsPage.onboardingWaitingTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        <span>{t("reportsPage.onboardingWaitingDescription")}</span>
      </CardContent>
    </Card>
  )
}
