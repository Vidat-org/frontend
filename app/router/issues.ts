import z from "zod"
import { protectedProcedure } from "../orpc"
import { and, desc, eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { scanIssues, scans, websites } from "@/migrations/schema"
import { cachedQuery, scanTag, workspaceTag } from "@/lib/cache"

export const listScanIssues = protectedProcedure
  .input(z.object({ scanId: z.string() }))
  .handler(async ({ input, context }) => {
    const issuesQuery = await cachedQuery(
      {
        key: `issues:list:${context.workspaceId}:${input.scanId}`,
        ttlSeconds: 120,
        tags: [workspaceTag(context.workspaceId), scanTag(input.scanId)],
      },
      () =>
        db
          .select({ issue: scanIssues })
          .from(scanIssues)
          .innerJoin(scans, eq(scans.id, scanIssues.scanId))
          .innerJoin(websites, eq(websites.id, scans.websiteId))
          .where(
            and(
              eq(scanIssues.scanId, input.scanId),
              eq(websites.workspaceId, context.workspaceId)
            )
          )
          .orderBy(desc(scanIssues.createdAt))
          .limit(10)
    )

    return issuesQuery.map(({ issue }) => issue)
  })
