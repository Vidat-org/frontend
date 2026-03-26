import { Button } from "@/components/ui/button"
import { client } from "@/lib/orpc"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowLeft,
  Calendar,
  Monitor,
  Smartphone,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Globe, ShieldCheck, Zap, Clock } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import ScanChart from "@/components/scan-chart"
import IssuesList from "@/components/issues-list"
import WebsiteDetail from "@/components/dashboard-wrapper"
import NewCheck from "@/components/new-check"
import { Badge } from "@/components/ui/badge"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const website = await client.getWebsite({ id })
  // const latestScan = await client.getLatestScan({ website: id })
  const scans = await client.listWebsiteScans({
    website: id,
    device: "mobile",
    limit: 2,
  })

  const latest = scans?.[0]
  const previous = scans?.[1]

  function getDelta(current?: number | null, prev?: number | null) {
    if (current == null || prev == null) return null
    return current - prev
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Sidhuvud */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 space-y-1">
          <a
            href="/dashboard"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Tillbaka till översikten
          </a>

          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-extrabold tracking-tight">
              {website?.name}
            </h1>
            {/*{website && (
              <Badge variant="outline" className="capitalize">
                {website.deviceType === "mobile" ? (
                  <Smartphone className="h-3 w-3" />
                ) : (
                  <Monitor className="h-3 w-3" />
                )}
                {website.deviceType}
              </Badge>
            )}*/}
          </div>

          <a href={website?.url} target="_blank" rel="noopener noreferrer">
            <p className="max-w-xs truncate text-muted-foreground underline hover:text-primary">
              {website?.url}
            </p>
          </a>
        </div>

        {website && (
          <NewCheck
            websiteId={website.id}
            defaultDeviceType={website.deviceType as "mobile" | "desktop"}
          />
        )}
      </div>

      {/* Statistik */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="SEO-poäng"
          value={website?.lastSeoScore ?? "-"}
          delta={getDelta(latest?.seoScore, previous?.seoScore)}
          icon={<Globe className="h-4 w-4" />}
        />
        <MetricCard
          title="Prestanda"
          value={website?.lastPerformanceScore ?? "-"}
          delta={getDelta(latest?.performanceScore, previous?.performanceScore)}
          icon={<Zap className="h-4 w-4" />}
        />
        <MetricCard
          title="Senaste skanning"
          value={
            website?.lastCheckedAt
              ? formatDate(new Date(website.lastCheckedAt))
              : "Aldrig"
          }
          icon={<Clock className="h-4 w-4" />}
        />
        <MetricCard
          title="Nästa skanning"
          value={
            website?.nextCheckAt
              ? formatDate(new Date(website.nextCheckAt))
              : "-"
          }
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      {website && latest && (
        <WebsiteDetail
          latestScanId={latest?.id || ""}
          websiteId={website?.id || ""}
        />
      )}
    </div>
  )
}

function DeltaBadge({ delta }: { delta: number }) {
  const positive = delta > 0
  const neutral = delta === 0

  const variant = neutral ? "secondary" : positive ? "success" : "destructive"

  return (
    <Badge variant={variant}>
      {neutral ? "" : Math.abs(delta)}
      {neutral ? "=" : positive ? <TrendingUp /> : <TrendingDown />}
    </Badge>
  )
}

function MetricCard({
  title,
  value,
  icon,
  delta,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  delta?: number | null
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {delta != null && delta !== 0 && <DeltaBadge delta={delta} />}
        </div>
      </CardContent>
    </Card>
  )
}
