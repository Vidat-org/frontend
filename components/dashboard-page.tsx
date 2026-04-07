"use client"

import AddWebsite from "@/components/add-website"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import WebsiteCard, { WebsiteCardSkeleton } from "@/components/website-card"
import { type Locale } from "@/lib/i18n"
import {
  getBillingStatusLabel,
  getDeliveryChannelLabel,
  getDeliveryStatusLabel,
  getDunningStatusLabel,
  getEventTypeLabel,
  getPlanLabel,
  getRoleLabel,
  getScanStatusLabel,
} from "@/lib/messages"
import { client } from "@/lib/orpc"
import { formatDate } from "@/lib/utils"
import { useOrganization } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import type { TFunction } from "i18next"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  CreditCard,
  FileChartColumn,
  Globe,
  Link as LinkIcon,
  Rocket,
  ShieldCheck,
  Siren,
  Users,
  Zap,
} from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

export default function DashboardPage() {
  const { t, i18n } = useTranslation("common")
  const locale = (i18n.resolvedLanguage === "en" ? "en" : "sv") as Locale

  const { data, isLoading } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: async () => await client.getDashboardOverview(),
  })

  const { organization } = useOrganization()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 animate-pulse rounded-lg bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
        <ul className="grid grid-cols-1 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i}>
              <WebsiteCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const websites = data?.websites ?? []
  const summary = data?.summary
  const onboarding = summary?.onboarding
  const onboardingSteps = [
    {
      key: "website",
      label: t("dashboard.firstWebsiteAdded"),
      description: t("dashboard.onboardingStepWebsiteDescription"),
      checked: onboarding?.hasAddedWebsite ?? false,
      href: null,
    },
    {
      key: "scan",
      label: t("dashboard.firstScanRun"),
      description: t("dashboard.onboardingStepScanDescription"),
      checked: onboarding?.hasRunFirstScan ?? false,
      href: websites[0] ? `/dashboard/${websites[0].id}` : null,
    },
    {
      key: "report",
      label: t("dashboard.reportRead"),
      description: t("dashboard.onboardingStepReportDescription"),
      checked: onboarding?.hasViewedReport ?? false,
      href: "/dashboard/reports",
    },
    {
      key: "alerts",
      label: t("dashboard.alertsConfigured"),
      description: t("dashboard.onboardingStepAlertsDescription"),
      checked: onboarding?.hasConfiguredAlerts ?? false,
      href: "/dashboard/settings/notifications",
    },
    {
      key: "integration",
      label: t("dashboard.integrationConnected"),
      description: t("dashboard.onboardingStepIntegrationDescription"),
      checked: onboarding?.hasConnectedIntegration ?? false,
      href: "/dashboard/settings/integrations",
    },
  ]
  const nextStep = onboardingSteps.find((step) => !step.checked) ?? null
  const showOnboardingGuide =
    websites.length === 0 ||
    (onboarding?.completedSteps ?? 0) < (onboarding?.totalSteps ?? 0)

  if (websites.length === 0) {
    return (
      <FirstRunOnboardingPage
        workspaceName={summary?.workspace.name}
        memberCount={summary?.workspace.memberCount ?? 0}
        pendingInviteCount={summary?.workspace.pendingInviteCount ?? 0}
        totalSteps={onboarding?.totalSteps ?? 0}
      />
    )
  }

  return (
    <div className="space-y-6">
      {showOnboardingGuide ? (
        <OnboardingGuideCard
          workspaceName={summary?.workspace.name}
          completedSteps={onboarding?.completedSteps ?? 0}
          totalSteps={onboarding?.totalSteps ?? 0}
          nextStep={nextStep}
          steps={onboardingSteps}
        />
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          title={t("dashboard.activeSites")}
          value={`${summary?.usage.activeWebsites ?? 0}/${summary?.usage.websiteLimit ?? 0}`}
          description={t("dashboard.savedTotal", {
            count: summary?.usage.totalWebsites ?? 0,
          })}
          icon={<Globe className="h-4 w-4" />}
        />
        <SummaryCard
          title={t("dashboard.scans")}
          value={String(summary?.usage.scans ?? 0)}
          description={t("dashboard.historicalRuns")}
          icon={<Activity className="h-4 w-4" />}
        />
        <SummaryCard
          title={t("dashboard.reports")}
          value={String(summary?.usage.reports ?? 0)}
          description={t("dashboard.generatedReports")}
          icon={<FileChartColumn className="h-4 w-4" />}
        />
        <SummaryCard
          title={t("dashboard.plan")}
          value={getPlanLabel(summary?.plan.slug, t)}
          description={`${getBillingStatusLabel(summary?.billing.status, t)} · ${getDunningStatusLabel(summary?.billing.dunningStatus, t)}`}
          icon={<Zap className="h-4 w-4" />}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title={t("dashboard.workspace")}
          value={String(summary?.workspace.memberCount ?? 0)}
          description={t(
            organization
              ? organization?.pendingInvitationsCount > 1
                ? "dashboard.pendingInvitesPlural"
                : "dashboard.pendingInvitesSingle"
              : "dashboard.pendingInvitesSingle",
            {
              count: organization?.pendingInvitationsCount ?? 0,
            }
          )}
          icon={<Users className="h-4 w-4" />}
        />
        <SummaryCard
          title={t("dashboard.onboarding")}
          value={`${onboarding?.completedSteps ?? 0}/${onboarding?.totalSteps ?? 0}`}
          description={t("dashboard.firstValueSteps")}
          icon={<Rocket className="h-4 w-4" />}
        />
        <SummaryCard
          title={t("dashboard.trustLayer")}
          value={String(data?.recentAuditLogs?.length ?? 0)}
          description={t("dashboard.latestDeliveries", {
            count: data?.recentDeliveries?.length ?? 0,
          })}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{t("dashboard.overviewTitle")}</CardTitle>
              <CardDescription>
                {t("dashboard.overviewDescription")}
              </CardDescription>
            </div>
            <AddWebsite />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground">
                  {t("dashboard.planUsage")}
                </span>
                <span className="font-medium">
                  {summary?.usage.activeWebsites ?? 0} /{" "}
                  {summary?.usage.websiteLimit ?? 0}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        ((summary?.usage.activeWebsites ?? 0) /
                          Math.max(summary?.usage.websiteLimit ?? 1, 1)) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <AlertList
                title={t("dashboard.operationalWarnings")}
                items={[
                  ...(data?.alerts.failedScans.map((scan) => ({
                    label: scan.websiteName || scan.websiteUrl,
                    detail: scan.errorMessage || t("dashboard.lastScanFailed"),
                  })) ?? []),
                  ...(data?.alerts.pausedSites.map((site) => ({
                    label: site.name || site.url,
                    detail: t("dashboard.pausedByPlanLimit"),
                  })) ?? []),
                ]}
                emptyText={t("dashboard.noCriticalWarnings")}
                tone="danger"
              />
              <AlertList
                title={t("dashboard.needsImprovement")}
                items={
                  data?.alerts.unhealthySites.map((site) => ({
                    label: site.name || site.url,
                    detail: t("dashboard.performanceSeoSummary", {
                      perf: site.lastPerformanceScore ?? 0,
                      seo: site.lastSeoScore ?? 0,
                    }),
                  })) ?? []
                }
                emptyText={t("dashboard.noSitesBelowTarget")}
                tone="warning"
              />
            </div>
          </CardContent>
        </Card>

        {/* <BillingOverviewCard summary={summary} locale={locale} /> */}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.latestActivity")}</CardTitle>
            <CardDescription>
              {t("dashboard.latestActivityDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.recentScans ?? []).slice(0, 3).map((scan) => (
              <div key={scan.scanId} className="rounded-lg border p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {scan.websiteName || scan.websiteUrl}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {scan.status === "failed"
                        ? scan.errorMessage || t("dashboard.scanFailed")
                        : t("dashboard.performanceSeoSummary", {
                            perf: scan.performanceScore ?? 0,
                            seo: scan.seoScore ?? 0,
                          })}
                    </p>
                  </div>
                  <Badge
                    variant={
                      scan.status === "failed" ? "destructive" : "outline"
                    }
                  >
                    {getScanStatusLabel(scan.status, t)}
                  </Badge>
                </div>
              </div>
            ))}
            {(data?.recentReports ?? []).map((report) => (
              <Link
                key={report.id}
                href={`/dashboard/reports/${report.id}`}
                className="flex flex-col gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">
                    {report.websiteName || report.websiteUrl}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("dashboard.newReportAvailable")}
                  </p>
                </div>
                <FileChartColumn className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
            {(data?.recentDeliveries ?? []).slice(0, 2).map((entry) => (
              <div key={entry.id} className="rounded-lg border p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {getDeliveryChannelLabel(entry.channel, t)} →{" "}
                      {entry.destination}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getEventTypeLabel(entry.eventType, t)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      entry.status === "failed" ? "destructive" : "outline"
                    }
                  >
                    {getDeliveryStatusLabel(entry.status, t)}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <OnboardingChecklistCard
          workspaceName={summary?.workspace.name}
          role={getRoleLabel(summary?.workspace.role, t)}
          steps={onboardingSteps}
          nextStep={nextStep}
        />

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.operationsLog")}</CardTitle>
            <CardDescription>
              {t("dashboard.operationsLogDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.recentAuditLogs ?? []).map((entry) => (
              <div key={entry.id} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{entry.summary}</p>
                <p className="text-xs text-muted-foreground">
                  {formatStamp(entry.createdAt, t, locale)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-bold">{t("dashboard.yourWebsites")}</h3>
        </div>

        {websites.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LinkIcon />
              </EmptyMedia>
              <EmptyTitle>{t("dashboard.noWebsitesYet")}</EmptyTitle>
              <EmptyDescription>
                {t("dashboard.addFirstWebsiteDescription")}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <AddWebsite redirectOnCreate />
            </EmptyContent>
          </Empty>
        ) : (
          <ul className="grid grid-cols-1 gap-3">
            {websites.map((website) => (
              <li key={website.id}>
                <WebsiteCard website={website} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function FirstRunOnboardingPage({
  workspaceName,
  memberCount,
  pendingInviteCount,
  totalSteps,
}: {
  workspaceName: string | undefined
  memberCount: number
  pendingInviteCount: number
  totalSteps: number
}) {
  const { t } = useTranslation("common")

  return (
    <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-5xl items-center">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-primary/15 bg-gradient-to-br from-primary/8 via-background to-background">
          <CardHeader className="space-y-4">
            <Badge variant="outline" className="w-fit">
              {t("dashboard.onboarding")}
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-3xl tracking-tight sm:text-4xl">
                {t("dashboard.firstRunTitle", {
                  workspace: workspaceName || t("dashboard.workspaceFallback"),
                })}
              </CardTitle>
              <CardDescription className="max-w-2xl text-base">
                {t("dashboard.firstRunDescription")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-3">
              <AddWebsite />
              <Button asChild variant="outline">
                <Link href="/dashboard/settings/team">
                  {t("dashboard.manageTeam")}
                </Link>
              </Button>
            </div>

            <div className="grid gap-3">
              <StepPreview
                label={t("dashboard.firstRunStepOneTitle")}
                description={t("dashboard.firstRunStepOneDescription")}
                checked={false}
              />
              <StepPreview
                label={t("dashboard.firstRunStepTwoTitle")}
                description={t("dashboard.firstRunStepTwoDescription")}
                checked={false}
              />
              <StepPreview
                label={t("dashboard.firstRunStepThreeTitle")}
                description={t("dashboard.firstRunStepThreeDescription")}
                checked={false}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.whatHappensNext")}</CardTitle>
              <CardDescription>
                {t("dashboard.whatHappensNextDescription", {
                  count: totalSteps,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ChecklistRow
                label={t("dashboard.firstWebsiteAdded")}
                description={t("dashboard.onboardingStepWebsiteDescription")}
                checked={false}
                href={null}
              />
              <ChecklistRow
                label={t("dashboard.firstScanRun")}
                description={t("dashboard.onboardingStepScanDescription")}
                checked={false}
                href={null}
              />
              <ChecklistRow
                label={t("dashboard.reportRead")}
                description={t("dashboard.onboardingStepReportDescription")}
                checked={false}
                href={null}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.workspaceReadyTitle")}</CardTitle>
              <CardDescription>
                {t("dashboard.workspaceReadyDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoStat
                label={t("dashboard.workspace")}
                value={workspaceName || t("dashboard.workspaceFallback")}
              />
              <InfoStat
                label={t("dashboard.workspaceMembers")}
                value={String(memberCount)}
              />
              <InfoStat
                label={t("dashboard.pendingInvitesLabel")}
                value={String(pendingInviteCount)}
              />
              <p className="text-sm text-muted-foreground">
                {t("dashboard.switchOrgHint")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function OnboardingGuideCard({
  workspaceName,
  completedSteps,
  totalSteps,
  nextStep,
  steps,
}: {
  workspaceName: string | undefined
  completedSteps: number
  totalSteps: number
  nextStep: {
    key: string
    label: string
    description: string
    href: string | null
  } | null
  steps: Array<{
    key: string
    label: string
    description: string
    checked: boolean
    href: string | null
  }>
}) {
  const { t } = useTranslation("common")
  const progress =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  return (
    <section>
      <Card className="border-primary/15 bg-gradient-to-br from-primary/8 via-background to-background">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Badge variant="outline" className="w-fit">
                {t("dashboard.onboarding")}
              </Badge>
              <div className="space-y-2">
                <CardTitle className="text-2xl tracking-tight sm:text-3xl">
                  {t("dashboard.onboardingHeroTitle", {
                    workspace:
                      workspaceName || t("dashboard.workspaceFallback"),
                  })}
                </CardTitle>
                <CardDescription className="max-w-2xl text-sm sm:text-base">
                  {nextStep
                    ? t("dashboard.onboardingHeroDescription", {
                        step: nextStep.label,
                      })
                    : t("dashboard.onboardingCompleteDescription")}
                </CardDescription>
              </div>
            </div>
            <div className="min-w-40 rounded-2xl border bg-background/85 p-4">
              <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {t("dashboard.progress")}
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {completedSteps}/{totalSteps}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.onboardingProgressPercent", {
                  percent: progress,
                })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="h-2 overflow-hidden rounded-full bg-background/80">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {nextStep?.key === "website" || !nextStep ? (
              <AddWebsite redirectOnCreate />
            ) : null}
            {nextStep?.href ? (
              <Button asChild variant="outline">
                <Link href={nextStep.href}>
                  {t("dashboard.openNextStep")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="ghost">
              <Link href="/dashboard/settings/team">
                {t("dashboard.manageTeam")}
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {steps.slice(0, 3).map((step) => (
              <StepPreview
                key={step.key}
                label={step.label}
                description={step.description}
                checked={step.checked}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function StepPreview({
  label,
  description,
  checked,
}: {
  label: string
  description: string
  checked: boolean
}) {
  return (
    <div className="rounded-xl border bg-background/80 p-4">
      <div className="mb-3 flex items-center gap-2">
        {checked ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : (
          <CircleDashed className="h-4 w-4 text-muted-foreground" />
        )}
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  )
}

function OnboardingChecklistCard({
  workspaceName,
  role,
  steps,
  nextStep,
}: {
  workspaceName: string | undefined
  role: string
  steps: Array<{
    key: string
    label: string
    description: string
    checked: boolean
    href: string | null
  }>
  nextStep: {
    key: string
    label: string
    description: string
    href: string | null
  } | null
}) {
  const { t } = useTranslation("common")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.onboardingAndTeam")}</CardTitle>
        <CardDescription>
          {workspaceName} · {t("dashboard.role")} {role}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {nextStep ? (
          <div className="rounded-xl border border-primary/15 bg-primary/6 p-4">
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {t("dashboard.nextRecommendedStep")}
            </p>
            <p className="mt-2 text-sm font-medium">{nextStep.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {nextStep.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {nextStep.key === "website" ? (
                <AddWebsite redirectOnCreate />
              ) : null}
              {nextStep.href ? (
                <Button asChild size="sm" variant="outline">
                  <Link href={nextStep.href}>
                    {t("dashboard.openStep")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}

        {steps.map((step) => (
          <ChecklistRow
            key={step.key}
            label={step.label}
            description={step.description}
            checked={step.checked}
            href={step.href}
          />
        ))}

        <Link
          href="/dashboard/settings"
          className="text-sm underline underline-offset-4"
        >
          {t("dashboard.openSettingsToManageWorkspace")}
        </Link>
      </CardContent>
    </Card>
  )
}

function BillingOverviewCard({
  summary,
  locale,
}: {
  summary:
    | Awaited<ReturnType<typeof client.getDashboardOverview>>["summary"]
    | undefined
  locale: Locale
}) {
  const { t } = useTranslation("common")
  const billing = summary?.billing
  const recommendedUpgrade = billing?.recommendedUpgrade as
    | "starter"
    | "pro"
    | "agency"
    | undefined
  const amount =
    billing?.amountSek && billing.amountSek > 0
      ? new Intl.NumberFormat(locale === "sv" ? "sv-SE" : "en-US", {
          style: "currency",
          currency: "SEK",
          maximumFractionDigits: 0,
        }).format(billing.amountSek)
      : null
  const meta = getBillingMeta(summary, t, locale)
  const upgradeUrl = recommendedUpgrade
    ? (billing?.checkout?.[recommendedUpgrade] ?? null)
    : null
  const primaryHref = billing?.manageUrl ?? upgradeUrl
  const primaryLabel = billing?.manageUrl
    ? t("dashboard.subscriptionManage")
    : upgradeUrl
      ? t("dashboard.subscriptionUpgrade")
      : null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {t("dashboard.subscriptionTitle")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.subscriptionDescription")}
            </CardDescription>
          </div>
          <Badge variant={billing?.status === "active" ? "success" : "outline"}>
            {getBillingStatusLabel(billing?.status, t)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-bold">
              {getPlanLabel(summary?.plan.slug, t)}
            </p>
            <p className="text-sm text-muted-foreground">
              {getDunningStatusLabel(billing?.dunningStatus, t)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{amount ?? "SEK -"}</p>
            <p className="text-xs text-muted-foreground">{meta}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {primaryHref && primaryLabel ? (
            <Button asChild>
              <Link href={primaryHref} target="_blank" rel="noreferrer">
                {primaryLabel}
              </Link>
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("dashboard.subscriptionUnavailable")}
            </p>
          )}
          <Button asChild variant="outline">
            <Link href="/dashboard/settings/billing">
              {t("sidebar.billing")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AlertList({
  title,
  items,
  emptyText,
  tone,
}: {
  title: string
  items: Array<{ label: string; detail: string }>
  emptyText: string
  tone: "danger" | "warning"
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-3 flex items-center gap-2">
        {tone === "danger" ? (
          <Siren className="h-4 w-4 text-destructive" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-chart-1" />
        )}
        <p className="text-sm font-medium">{title}</p>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          items.slice(0, 3).map((item) => (
            <div
              key={`${item.label}-${item.detail}`}
              className="rounded-lg bg-muted/40 p-3"
            >
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ChecklistRow({
  label,
  description,
  checked,
  href,
}: {
  label: string
  description: string
  checked: boolean
  href: string | null
}) {
  const { t } = useTranslation("common")

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Badge variant={checked ? "success" : "outline"}>
          {checked ? t("dashboard.done") : t("dashboard.missing")}
        </Badge>
      </div>
      {!checked && href ? (
        <div>
          <Button asChild size="sm" variant="ghost">
            <Link href={href}>
              {t("dashboard.openStep")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function formatStamp(
  value: string | null | undefined,
  t: TFunction,
  locale: Locale
) {
  if (!value) return t("dashboard.unknownTime")
  return formatDate(value, locale)
}

function getBillingMeta(
  summary:
    | Awaited<ReturnType<typeof client.getDashboardOverview>>["summary"]
    | undefined,
  t: TFunction,
  locale: Locale
) {
  const billing = summary?.billing
  const format = (value: string | null | undefined) =>
    value ? formatDate(value, locale) : t("dashboard.unknownTime")

  if (billing?.cancelAtPeriodEnd && billing.currentPeriodEndsAt) {
    return t("dashboard.subscriptionCancelsOn", {
      date: format(billing.currentPeriodEndsAt),
    })
  }

  if (billing?.status === "canceled" && billing?.currentPeriodEndsAt) {
    return t("dashboard.subscriptionCanceledOn", {
      date: format(billing.currentPeriodEndsAt),
    })
  }

  if (billing?.trialEndsAt) {
    return t("dashboard.subscriptionTrialEndsOn", {
      date: format(billing.trialEndsAt),
    })
  }

  if (billing?.currentPeriodEndsAt) {
    return t("dashboard.subscriptionRenewsOn", {
      date: format(billing.currentPeriodEndsAt),
    })
  }

  return getDunningStatusLabel(billing?.dunningStatus, t)
}
