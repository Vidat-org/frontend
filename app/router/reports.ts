import { db } from "@/db/drizzle"
import { protectedProcedure } from "../orpc"
import { reports, websites } from "@/migrations/schema"
import { and, eq } from "drizzle-orm"
import z from "zod"
import { appendAuditLog, markOnboardingStep } from "@/lib/saas"
import { cachedQuery, reportTag, workspaceTag } from "@/lib/cache"

export const listReports = protectedProcedure.handler(async ({ context }) => {
  const rows = await cachedQuery(
    {
      key: `reports:list:${context.workspaceId}`,
      ttlSeconds: 90,
      tags: [workspaceTag(context.workspaceId)],
    },
    () =>
      db
        .select({
          websiteUrl: websites.url,
          websiteName: websites.name,
          report: reports,
        })
        .from(websites)
        .leftJoin(reports, eq(reports.websiteId, websites.id))
        .where(eq(websites.workspaceId, context.workspaceId))
  )

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
  .handler(async ({ input, context }) => {
    const report = await cachedQuery(
      {
        key: `reports:get:${context.workspaceId}:${input.id}`,
        ttlSeconds: 180,
        tags: [workspaceTag(context.workspaceId), reportTag(input.id)],
      },
      () =>
        db
          .select({ report: reports })
          .from(reports)
          .innerJoin(websites, eq(websites.id, reports.websiteId))
          .where(
            and(eq(reports.id, input.id), eq(websites.workspaceId, context.workspaceId))
          )
          .limit(1)
    )

    if (report[0]?.report) {
      await markOnboardingStep(context.workspaceId, {
        hasViewedReport: true,
      })

      await appendAuditLog({
        workspaceId: context.workspaceId,
        actorUserId: context.userId,
        targetType: "report",
        targetId: input.id,
        action: "report.viewed",
        summary: "En rapport öppnades",
      })
    }

    return report[0]?.report ?? null
  })
