import { Button } from "@/components/ui/button"
import { client } from "@/lib/orpc"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Calendar, Monitor, Smartphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Globe, ShieldCheck, Zap, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import ScanChart from "@/components/scan-chart"
import IssuesList from "@/components/issues-list"
import WebsiteDetail from "@/components/dashboard-wrapper"
import NewCheck from "@/components/new-check"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const website = await client.getWebsite({ id })
  const latestScan = await client.getLatestScan({ website: id })

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      {/* Sidhuvud */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <a
            href="/dashboard"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Tillbaka till översikten
          </a>

          <h1 className="text-4xl font-extrabold tracking-tight">
            {website?.name}
          </h1>

          <p className="text-muted-foreground underline">{website?.url}</p>
        </div>

        {website && <NewCheck websiteId={website.id} />}
      </div>

      {/* Statistik */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="SEO-poäng"
          value={website?.lastSeoScore ?? "-"}
          icon={<Globe className="h-4 w-4" />}
        />

        <MetricCard
          title="Prestanda"
          value={website?.lastPerformanceScore ?? "-"}
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

      {/*<Card className="col-span-4 p-6">
        <CardTitle className="mb-4">Prestanda över tid</CardTitle>

        <div className="flex h-[340px] items-center justify-center rounded-lg border-2 border-dashed pt-3 pr-3 pb-2">
          {website && <ScanChart websiteId={website?.id} />}
        </div>
      </Card>

      {website && <IssuesList websiteId={website?.id} />}*/}
      {website && latestScan && (
        <WebsiteDetail
          latestScanId={latestScan?.id || ""}
          websiteId={website?.id || ""}
        />
      )}
    </div>
  )
}

function MetricCard({ title, value, icon }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
