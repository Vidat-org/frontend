import { db } from "@/db/drizzle"
import { protectedProcedure } from "../orpc"
import { reports, websites } from "@/migrations/schema"
import { count, eq } from "drizzle-orm"
import z from "zod"

export const listReports = protectedProcedure.handler(async ({ context }) => {
  const rows = await db
    .select({
      websiteUrl: websites.url,
      websiteName: websites.name,
      report: reports,
    })
    .from(websites)
    .leftJoin(reports, eq(reports.websiteId, websites.id))
    .where(eq(websites.userId, context.userId))

  const grouped = Object.values(
    rows.reduce(
      (acc, row) => {
        if (!acc[row.websiteUrl]) {
          acc[row.websiteUrl] = {
            website: row.websiteUrl,
            name: row.websiteName,
            reports: [],
          }
        }

        // ✅ Only push if report exists
        if (row.report) {
          acc[row.websiteUrl].reports.push(row.report)
        }

        return acc
      },
      {} as Record<
        string,
        {
          website: string
          name: string | null
          reports: (typeof reports.$inferSelect)[]
        }
      >
    )
  )

  return grouped
})

export const getReportById = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const report = await db.query.reports.findFirst({
      where: eq(reports.id, input.id),
    })

    return report
  })
