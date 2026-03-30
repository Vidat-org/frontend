"use client"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/orpc"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useT } from "next-i18next/client"
import type { TFunction } from "i18next"

type Metric = {
  label: string
  value: number | null
  unit: string
  thresholds: [number, number]
  higherIsBetter?: boolean
}

function getStatus(
  value: number | null,
  thresholds: [number, number],
  higherIsBetter = false
): "good" | "needs-improvement" | "poor" | "unknown" {
  if (value === null || value === undefined) return "unknown"
  if (higherIsBetter) {
    if (value >= thresholds[0]) return "good"
    if (value >= thresholds[1]) return "needs-improvement"
    return "poor"
  }
  if (value <= thresholds[0]) return "good"
  if (value <= thresholds[1]) return "needs-improvement"
  return "poor"
}

function MetricBar({
  value,
  thresholds,
  higherIsBetter = false,
  statusConfig,
}: {
  value: number | null
  thresholds: [number, number]
  higherIsBetter?: boolean
  statusConfig: ReturnType<typeof getStatusConfig>
}) {
  if (value === null) return <div className="h-1.5 rounded-full bg-muted" />

  const max = higherIsBetter ? thresholds[0] * 1.2 : thresholds[1] * 1.5
  const pct = higherIsBetter
    ? Math.min(100, (value / max) * 100)
    : Math.max(0, 100 - (value / max) * 100)

  const status = getStatus(value, thresholds, higherIsBetter)

  return (
    <div className="h-1.5 w-full rounded-full bg-muted">
      <div
        className={cn(
          "h-1.5 rounded-full transition-all duration-700",
          statusConfig[status].bar
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function MetricTile({
  metric,
  statusConfig,
}: {
  metric: Metric
  statusConfig: ReturnType<typeof getStatusConfig>
}) {
  const status = getStatus(
    metric.value,
    metric.thresholds,
    metric.higherIsBetter
  )
  const cfg = statusConfig[status]
  const { t } = useT("common")
  const display =
    metric.value !== null
      ? metric.unit === "s"
        ? `${metric.value.toFixed(1)}s`
        : metric.unit === "ms"
          ? `${Math.round(metric.value)}ms`
          : metric.unit === "kb"
            ? `${Math.round(metric.value)}kb`
            : metric.value.toFixed(3)
      : "-"

  return (
    <div className={cn("space-y-3 rounded-lg border p-4", cfg.bg, cfg.border)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {metric.label}
        </span>
        <span className={cn("text-xs font-medium", cfg.text)}>{cfg.label}</span>
      </div>
      <div className={cn("text-2xl font-bold tabular-nums", cfg.text)}>
        {display}
      </div>
      <MetricBar
        value={metric.value}
        thresholds={metric.thresholds}
        higherIsBetter={metric.higherIsBetter}
        statusConfig={statusConfig}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>
          {t("vitals.goodLabel")}{" "}
          {metric.higherIsBetter
            ? `>=${metric.thresholds[0]}`
            : `<=${metric.thresholds[0]}${metric.unit}`}
        </span>
        <span>
          {t("vitals.poorLabel")}{" "}
          {metric.higherIsBetter
            ? `<${metric.thresholds[1]}`
            : `>${metric.thresholds[1]}${metric.unit}`}
        </span>
      </div>
    </div>
  )
}

export default function CoreWebVitals({ scanId }: { scanId: string }) {
  const { data: scan, isLoading } = useQuery({
    queryKey: ["scan", scanId],
    queryFn: () => client.getScan({ scan: scanId }),
    enabled: !!scanId,
  })

  const { t } = useT("common")
  const statusConfig = getStatusConfig(t)

  const metrics: Metric[] = [
    {
      label: "LCP",
      value: scan?.lcpMs ? scan.lcpMs / 1000 : null,
      unit: "s",
      thresholds: [2.5, 4],
    },
    {
      label: "FCP",
      value: scan?.fcpMs ? scan.fcpMs / 1000 : null,
      unit: "s",
      thresholds: [1.8, 3],
    },
    {
      label: "CLS",
      value: scan?.clsScore != null ? Number(scan.clsScore) : null,
      unit: "",
      thresholds: [0.1, 0.25],
    },
    {
      label: "TTFB",
      value: scan?.ttfbMs ?? null,
      unit: "ms",
      thresholds: [800, 1800],
    },
    {
      label: "INP",
      value: scan?.inpMs ?? null,
      unit: "ms",
      thresholds: [200, 500],
    },
    {
      label: t("vitals.speedIndex"),
      value: scan?.speedIndexMs ? scan.speedIndexMs / 1000 : null,
      unit: "s",
      thresholds: [3.4, 5.8],
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>{t("vitals.title")}</CardTitle>
          <a
            href="https://web.dev/explore/metrics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            {t("vitals.whatIsThis")}
          </a>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {metrics.map((m) => (
              <MetricTile key={m.label} metric={m} statusConfig={statusConfig} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getStatusConfig(t: TFunction) {
  return {
    good: {
      label: t("vitals.statusGood"),
      bar: "bg-emerald-500",
      text: "text-emerald-800 dark:text-emerald-400",
      bg: "bg-emerald-100/50 dark:bg-emerald-950/40",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    "needs-improvement": {
      label: t("vitals.statusNeedsImprovement"),
      bar: "bg-amber-500",
      text: "text-amber-900 dark:text-amber-400",
      bg: "bg-amber-100/50 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-800",
    },
    poor: {
      label: t("vitals.statusPoor"),
      bar: "bg-destructive",
      text: "text-destructive dark:text-red-400",
      bg: "bg-destructive/15 dark:bg-destructive/25",
      border: "border-destructive/30 dark:border-destructive/50",
    },
    unknown: {
      label: "-",
      bar: "bg-muted",
      text: "text-muted-foreground",
      bg: "bg-muted/30",
      border: "border-border",
    },
  }
}
