import z from "zod"
import { protectedProcedure } from "../orpc"
import { db } from "@/db/drizzle"
import { scans } from "@/migrations/schema"
import { and, desc, eq } from "drizzle-orm"

export const listWebsiteScans = protectedProcedure
  .input(
    z.object({
      website: z.string(),
      limit: z.number().default(10).optional(),
      device: z.enum(["mobile", "desktop"]),
    })
  )
  .handler(async ({ input }) => {
    const scansQuery = await db.query.scans.findMany({
      where: and(
        eq(scans.websiteId, input.website),
        eq(scans.deviceType, input.device)
      ),
      limit: input.limit,
      orderBy: desc(scans.createdAt),
    })

    return scansQuery
  })

export const getLatestScan = protectedProcedure
  .input(z.object({ website: z.string() }))
  .handler(async ({ input }) => {
    const scanQuery = await db.query.scans.findFirst({
      where: eq(scans.websiteId, input.website),
      orderBy: (scans, { desc }) => [desc(scans.createdAt)],
    })

    return scanQuery
  })

export const getScan = protectedProcedure
  .input(z.object({ scan: z.string() }))
  .handler(async ({ input }) => {
    const scan = await db.query.scans.findFirst({
      where: eq(scans.id, input.scan),
    })

    return scan
  })
