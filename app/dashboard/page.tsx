"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Activity,
  AlertTriangle,
  FileChartColumn,
  Globe,
  Link as LinkIcon,
  Rocket,
  ShieldCheck,
  Siren,
  Users,
  Zap,
} from "lucide-react"
import AddWebsite from "@/components/add-website"
import WebsiteCard, { WebsiteCardSkeleton } from "@/components/website-card"
import { client } from "@/lib/orpc"
import { Badge } from "@/components/ui/badge"
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
import { t } from "@/lib/i18n"

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: async () => await client.getDashboardOverview(),
  })

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

  return (
    <div className="space-y-6">
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
          value={summary?.plan.label ?? "Free"}
          description={`${summary?.billing.status ?? "trialing"} · ${summary?.billing.dunningStatus ?? "clear"}`}
          icon={<Zap className="h-4 w-4" />}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title={t("dashboard.workspace")}
          value={String(summary?.workspace.memberCount ?? 0)}
          description={t("dashboard.pendingInvites", {
            count: summary?.workspace.pendingInviteCount ?? 0,
          })}
          icon={<Users className="h-4 w-4" />}
        />
        <SummaryCard
          title={t("dashboard.onboarding")}
          value={`${summary?.onboarding.completedSteps ?? 0}/${summary?.onboarding.totalSteps ?? 0}`}
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
              <CardDescription>{t("dashboard.overviewDescription")}</CardDescription>
            </div>
            <AddWebsite />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground">{t("dashboard.planUsage")}</span>
                <span className="font-medium">
                  {summary?.usage.activeWebsites ?? 0} / {summary?.usage.websiteLimit ?? 0}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (((summary?.usage.activeWebsites ?? 0) /
                          Math.max(summary?.usage.websiteLimit ?? 1, 1)) *
                          100)
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
                    detail: `Perf ${site.lastPerformanceScore ?? 0} · SEO ${site.lastSeoScore ?? 0}`,
                  })) ?? []
                }
                emptyText={t("dashboard.noSitesBelowTarget")}
                tone="warning"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.latestActivity")}</CardTitle>
            <CardDescription>{t("dashboard.latestActivityDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.recentScans ?? []).slice(0, 3).map((scan) => (
              <div key={scan.scanId} className="rounded-lg border p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">{scan.websiteName || scan.websiteUrl}</p>
                    <p className="text-xs text-muted-foreground">
                      {scan.status === "failed"
                        ? scan.errorMessage || t("dashboard.scanFailed")
                        : `Perf ${scan.performanceScore ?? 0} · SEO ${scan.seoScore ?? 0}`}
                    </p>
                  </div>
                  <Badge variant={scan.status === "failed" ? "destructive" : "outline"}>
                    {scan.status}
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
                      {entry.channel} → {entry.destination}
                    </p>
                    <p className="text-xs text-muted-foreground">{entry.eventType}</p>
                  </div>
                  <Badge variant={entry.status === "failed" ? "destructive" : "outline"}>
                    {entry.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.onboardingAndTeam")}</CardTitle>
            <CardDescription>
              {summary?.workspace.name} · {t("dashboard.role")} {summary?.workspace.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ChecklistRow
              label={t("dashboard.firstWebsiteAdded")}
              checked={summary?.onboarding.hasAddedWebsite ?? false}
            />
            <ChecklistRow
              label={t("dashboard.firstScanRun")}
              checked={summary?.onboarding.hasRunFirstScan ?? false}
            />
            <ChecklistRow
              label={t("dashboard.reportRead")}
              checked={summary?.onboarding.hasViewedReport ?? false}
            />
            <ChecklistRow
              label={t("dashboard.alertsConfigured")}
              checked={summary?.onboarding.hasConfiguredAlerts ?? false}
            />
            <ChecklistRow
              label={t("dashboard.integrationConnected")}
              checked={summary?.onboarding.hasConnectedIntegration ?? false}
            />
            <Link href="/dashboard/settings" className="text-sm underline underline-offset-4">
              {t("dashboard.openSettingsToManageWorkspace")}
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.operationsLog")}</CardTitle>
            <CardDescription>{t("dashboard.operationsLogDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.recentAuditLogs ?? []).map((entry) => (
              <div key={entry.id} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{entry.summary}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.action} · {formatStamp(entry.createdAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-bold">{t("dashboard.yourWebsites")}</h3>
          {summary?.billing.manageUrl ? (
            <Badge variant="outline">{t("dashboard.billingConnected")}</Badge>
          ) : (
            <Badge variant="outline">{t("dashboard.billingRequiresEnv")}</Badge>
          )}
        </div>

        {websites.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LinkIcon />
              </EmptyMedia>
              <EmptyTitle>{t("dashboard.noWebsitesYet")}</EmptyTitle>
              <EmptyDescription>{t("dashboard.addFirstWebsiteDescription")}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <AddWebsite />
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
            <div key={`${item.label}-${item.detail}`} className="rounded-lg bg-muted/40 p-3">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ChecklistRow({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium">{label}</p>
      <Badge variant={checked ? "success" : "outline"}>
        {checked ? t("dashboard.done") : t("dashboard.missing")}
      </Badge>
    </div>
  )
}

function formatStamp(value: string | null | undefined) {
  if (!value) return t("dashboard.unknownTime")
  return new Date(value).toLocaleString("sv-SE", {
    dateStyle: "short",
    timeStyle: "short",
  })
}
