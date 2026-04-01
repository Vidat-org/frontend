"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { client } from "@/lib/orpc"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, CheckCircle2, Bell, Webhook } from "lucide-react"
import { useT } from "next-i18next/client"
import Link from "next/link"
import { parseAsStringEnum, useQueryState } from "nuqs"

export default function ReportOnboardingBanner() {
  const { t } = useT("common")
  const [onboarding] = useQueryState("onboarding", parseAsStringEnum(["1"]))

  const { data } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: async () => await client.getDashboardOverview(),
    enabled: onboarding === "1",
  })

  if (onboarding !== "1") {
    return null
  }

  const state = data?.summary.onboarding

  if (!state) {
    return null
  }

  const nextStep = !state.hasConfiguredAlerts
    ? {
        title: t("reportPage.onboardingAlertsTitle"),
        description: t("reportPage.onboardingAlertsDescription"),
        href: "/dashboard/settings/notifications",
        cta: t("reportPage.onboardingAlertsCta"),
        icon: <Bell className="h-4 w-4" />,
      }
    : !state.hasConnectedIntegration
      ? {
          title: t("reportPage.onboardingIntegrationsTitle"),
          description: t("reportPage.onboardingIntegrationsDescription"),
          href: "/dashboard/settings/integrations",
          cta: t("reportPage.onboardingIntegrationsCta"),
          icon: <Webhook className="h-4 w-4" />,
        }
      : null

  if (!nextStep) {
    return (
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div>
              <CardTitle>{t("reportPage.onboardingCompleteTitle")}</CardTitle>
              <CardDescription>
                {t("reportPage.onboardingCompleteDescription")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              {t("reportPage.onboardingCompleteCta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/15 bg-primary/6">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="outline">{t("dashboard.onboarding")}</Badge>
            <CardTitle className="flex items-center gap-2">
              {nextStep.icon}
              {nextStep.title}
            </CardTitle>
            <CardDescription>{nextStep.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href={nextStep.href}>
            {nextStep.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
