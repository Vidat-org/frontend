import z from "zod"
import { protectedProcedure } from "../orpc"
import { desc, eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { scanIssues } from "@/migrations/schema"

export const listScanIssues = protectedProcedure
  .input(z.object({ scanId: z.string() }))
  .handler(async ({ input }) => {
    const issuesQuery = await db.query.scanIssues.findMany({
      where: eq(scanIssues.scanId, input.scanId),
      orderBy: desc(scanIssues.createdAt),
      limit: 10,
    })

    return issuesQuery
  })
