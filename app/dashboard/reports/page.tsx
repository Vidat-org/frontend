import ReportCard from "@/components/report-card"
import { client } from "@/lib/orpc"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { FileChartColumn } from "lucide-react"
import { t } from "@/lib/i18n"

export default async function Page() {
  const query = await client.listReports()

  return (
    <div className="space-y-8">
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
