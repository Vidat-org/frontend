"use client"

import { client } from "@/lib/orpc"
import { useQuery } from "@tanstack/react-query"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { Skeleton } from "./ui/skeleton"
import { parseAsStringEnum, useQueryState } from "nuqs"
import { type Locale } from "@/lib/i18n"
import { useTranslation } from "react-i18next"

export default function ScanChart({
  websiteId,
  onScanClick,
}: {
  websiteId: string
  onScanClick?: (scanId: string) => void
}) {
  const { t, i18n } = useTranslation("common")
  const locale = (i18n.resolvedLanguage === "en" ? "en" : "sv") as Locale
  const dateLocale = locale === "en" ? "en-US" : "sv-SE"
  const [device] = useQueryState(
    "device",
    parseAsStringEnum(["mobile", "desktop"]).withDefault("mobile")
  )
  const chartConfig = {
    performanceScore: {
      label: t("scanChart.performance"),
      color: "oklch(var(--chart-1))",
    },
    seoScore: {
      label: "SEO",
      color: "oklch(var(--chart-2))",
    },
    accessibilityScore: {
      label: t("scanChart.accessibility"),
      color: "oklch(var(--chart-3))",
    },
    bestPracticesScore: {
      label: t("scanChart.bestPractices"),
      color: "oklch(var(--chart-4))",
    },
  } satisfies ChartConfig

  const { data: scans, isLoading } = useQuery({
    queryKey: ["scans", websiteId, device],
    queryFn: () => client.listWebsiteScans({ website: websiteId, device }),
  })

  if (isLoading) {
    return <Skeleton className="h-120 w-full" />
  }

  if (!scans?.length) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        {t("scanChart.noScansYet")}
      </div>
    )
  }

  const chartData = scans
    .filter((s) => s.status === "success")
    .map((s) => ({
      id: s.id,
      date: new Intl.DateTimeFormat(dateLocale, {
        day: "numeric",
        month: "short",
      }).format(new Date(s.createdAt || "")),
      performanceScore: s.performanceScore,
      seoScore: s.seoScore,
      accessibilityScore: s.accessibilityScore,
      bestPracticesScore: s.bestPracticesScore,
    }))
    .reverse()

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <LineChart
        data={chartData}
        onClick={(payload) => {
          const scanId = payload?.activePayload?.[0]?.payload?.id
          if (scanId) onScanClick?.(scanId)
        }}
        style={{ cursor: onScanClick ? "pointer" : "default" }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="performanceScore"
          stroke="oklch(0.6 0.2 250)"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="seoScore"
          stroke="oklch(0.65 0.18 142)"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="accessibilityScore"
          stroke="oklch(0.7 0.17 55)"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="bestPracticesScore"
          stroke="oklch(0.62 0.22 0)"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  )
}
