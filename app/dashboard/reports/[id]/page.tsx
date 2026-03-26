import { client } from "@/lib/orpc"
import ReportContent from "./report-content"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const report = await client.getReportById({ id })

  return (
    report?.content && (
      <div className="mx-auto w-fit">
        <ReportContent content={report?.content} />
      </div>
    )
  )
}
