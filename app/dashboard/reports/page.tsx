import ReportCard from "@/components/report-card"
import { client } from "@/lib/orpc"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { FileChartColumn } from "lucide-react"

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
                <EmptyTitle>Inga rapporter</EmptyTitle>
                <EmptyDescription>
                  Rapporter skapas var 14:e dag
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
