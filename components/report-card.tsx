import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Report } from "@/migrations/schema"
import Link from "next/link"

type Props = {
  report: Report
}

export default function ReportCard({ report }: Props) {
  return (
    <Link href={`/dashboard/reports/${report.id}`}>
      <Card>
        <CardHeader>
          <CardDescription>Rapport från:</CardDescription>
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
