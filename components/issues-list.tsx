"use client"
import { client } from "@/lib/orpc"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Globe,
  Zap,
  ShieldCheck,
  Tag,
} from "lucide-react"
import { auditLabels } from "@/lib/messages"

const severityConfig: Record<
  string,
  {
    label: string
    variant: "destructive" | "secondary" | "outline"
    icon: React.ReactNode
  }
> = {
  critical: {
    label: "Kritisk",
    variant: "destructive",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  },
  high: {
    label: "Hög",
    variant: "destructive",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  warning: {
    label: "Medel",
    variant: "secondary",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  info: {
    label: "Låg",
    variant: "outline",
    icon: <Info className="h-3.5 w-3.5" />,
  },
}

const categoryIcon: Record<string, React.ReactNode> = {
  seo: <Globe className="h-4 w-4 text-muted-foreground" />,
  performance: <Zap className="h-4 w-4 text-muted-foreground" />,
  security: <ShieldCheck className="h-4 w-4 text-muted-foreground" />,
}

export default function IssuesList({ scanId }: { scanId: string }) {
  const { data: issues, isLoading } = useQuery({
    queryKey: ["issues", scanId],
    queryFn: async () => await client.listScanIssues({ scanId }),
    enabled: !!scanId,
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Hittade problem</CardTitle>
        {issues && issues.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {issues.length} {issues.length === 1 ? "problem" : "problem"}{" "}
            hittade
          </span>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        )}

        {!isLoading && (!issues || issues.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShieldCheck className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              Inga problem hittades
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              Allt ser bra ut för den senaste skanningen.
            </p>
          </div>
        )}

        {!isLoading && issues && issues.length > 0 && (
          <ul className="flex flex-col divide-y divide-border">
            {issues.map((issue) => {
              const severity =
                severityConfig[issue.severity?.toLowerCase()] ??
                severityConfig.low
              const catIcon = categoryIcon[issue.category?.toLowerCase()] ?? (
                <Tag className="h-4 w-4 text-muted-foreground" />
              )
              return (
                <li
                  key={issue.id}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  {/* Category icon */}
                  <div className="mt-0.5 shrink-0">{catIcon}</div>

                  {/* Main content */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm leading-none font-medium">
                        {auditLabels[issue.key]}
                      </p>
                      <Badge
                        variant={severity.variant}
                        className="flex items-center gap-1 px-1.5 py-0.5 text-[11px]"
                      >
                        {severity.icon}
                        {severity.label}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {issue.description}
                    </p>
                  </div>

                  {/* Category label */}
                  <div className="shrink-0">
                    <span className="text-xs text-muted-foreground capitalize">
                      {issue.category}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
