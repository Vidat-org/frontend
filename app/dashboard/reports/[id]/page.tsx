import "@/lib/orpc.server"
import { client } from "@/lib/orpc"
import ReportOnboardingBanner from "@/components/report-onboarding-banner"
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
      <div className="mx-auto w-fit space-y-6">
        <ReportOnboardingBanner />
        <ReportContent content={report?.content} />
      </div>
    )
  )
}
