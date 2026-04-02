import "@/lib/orpc.server"
import OnboardingReportRedirect from "@/components/onboarding-report-redirect"
import ReportCard from "@/components/report-card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { client } from "@/lib/orpc"
import { FileChartColumn } from "lucide-react"
import { createPageMetadata, getMetadataT } from "@/lib/metadata"

import { getT } from "next-i18next/server"

export async function generateMetadata() {
  const { t } = await getMetadataT()

  return createPageMetadata({
    title: t("sidebar.reports"),
    description: t("reportsPage.reportEvery14Days"),
    path: "/dashboard/reports",
    noIndex: true,
  })
}

export default async function Page() {
  const [{ t }, query] = await Promise.all([
    getT("common"),
    client.listReports(),
  ])

  return (
    <div className="space-y-8">
      <OnboardingReportRedirect />

      {query.map((website) => (
        <div key={website.website} className="space-y-3">
          <h3 className="text-2xl font-semibold">
            {website.name || website.website}
          </h3>

          {website.reports.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileChartColumn />
                </EmptyMedia>
                <EmptyTitle>{t("reportsPage.noReports")}</EmptyTitle>
                <EmptyDescription>
                  {t("reportsPage.reportEvery14Days")}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {website.reports.map((report) => (
                <li key={report.id}>
                  <ReportCard report={report} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
