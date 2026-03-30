import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Report } from "@/migrations/schema"

import { getT } from "next-i18next/server"
import Link from "next/link"

type Props = {
  report: Report
}

export default async function ReportCard({ report }: Props) {
  const { t } = await getT("common")
  return (
    <Link href={`/dashboard/reports/${report.id}`}>
      <Card>
        <CardHeader>
          <CardDescription>{t("reportCard.reportFrom")}</CardDescription>
          <CardTitle>
            {new Date(report.createdAt || "").toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {report.content.replaceAll("*", "").replaceAll("#", "")}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
