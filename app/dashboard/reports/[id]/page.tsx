import "@/lib/orpc.server"
import { client } from "@/lib/orpc"
import ReportOnboardingBanner from "@/components/report-onboarding-banner"
import ReportContent from "./report-content"
import { createPageMetadata, getMetadataLocale } from "@/lib/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const locale = await getMetadataLocale()

  return createPageMetadata({
    title: locale === "en" ? "Report" : "Rapport",
    description:
      locale === "en"
        ? "Detailed report view for a monitored website in Vidat."
        : "Detaljerad rapportvy för en övervakad webbplats i Vidat.",
    path: `/dashboard/reports/${id}`,
    noIndex: true,
  })
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const report = await client.getReportById({ id })

  return (
    report?.content && (
      <div className="mx-auto w-fit max-w-3xl space-y-6 md:pt-14">
        <ReportOnboardingBanner />
        <ReportContent content={report?.content} />
      </div>
    )
  )
}
