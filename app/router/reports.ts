import { db } from "@/db/drizzle"
import { protectedProcedure } from "../orpc"
import { reports, websites } from "@/migrations/schema"
import { eq } from "drizzle-orm"
import z from "zod"

export const listReports = protectedProcedure.handler(async ({ context }) => {
  const userReports = await db
    .select()
    .from(reports)
    .innerJoin(websites, eq(reports.websiteId, websites.id))
    .where(eq(websites.userId, context.userId))

  return userReports
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
