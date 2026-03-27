import z from "zod"
import { protectedProcedure } from "../orpc"
import { db } from "@/db/drizzle"
import { scans, websites } from "@/migrations/schema"
import { and, desc, eq } from "drizzle-orm"
import { cachedQuery, scanTag, websiteTag, workspaceTag } from "@/lib/cache"

export const listWebsiteScans = protectedProcedure
  .input(
    z.object({
      website: z.string(),
      limit: z.number().default(10).optional(),
      device: z.enum(["mobile", "desktop"]),
    })
  )
  .handler(async ({ input, context }) => {
    const scansQuery = await cachedQuery(
      {
        key: `scans:list:${context.workspaceId}:${input.website}:${input.device}:${input.limit ?? 10}`,
        ttlSeconds: 45,
        tags: [workspaceTag(context.workspaceId), websiteTag(input.website)],
      },
      () =>
        db
          .select({ scan: scans })
          .from(scans)
          .innerJoin(websites, eq(websites.id, scans.websiteId))
          .where(
            and(
              eq(scans.websiteId, input.website),
              eq(scans.deviceType, input.device),
              eq(websites.workspaceId, context.workspaceId)
            )
          )
          .orderBy(desc(scans.createdAt))
          .limit(input.limit ?? 10)
    )

    return scansQuery.map(({ scan }) => scan)
  })

export const getLatestScan = protectedProcedure
  .input(z.object({ website: z.string() }))
  .handler(async ({ input, context }) => {
    const scanQuery = await cachedQuery(
      {
        key: `scans:latest:${context.workspaceId}:${input.website}`,
        ttlSeconds: 30,
        tags: [workspaceTag(context.workspaceId), websiteTag(input.website)],
      },
      () =>
        db
          .select({ scan: scans })
          .from(scans)
          .innerJoin(websites, eq(websites.id, scans.websiteId))
          .where(
            and(
              eq(scans.websiteId, input.website),
              eq(websites.workspaceId, context.workspaceId)
            )
          )
          .orderBy(desc(scans.createdAt))
          .limit(1)
    )

    return scanQuery[0]?.scan ?? null
  })

export const getScan = protectedProcedure
  .input(z.object({ scan: z.string() }))
  .handler(async ({ input, context }) => {
    const scan = await cachedQuery(
      {
        key: `scans:get:${context.workspaceId}:${input.scan}`,
        ttlSeconds: 120,
        tags: [workspaceTag(context.workspaceId), scanTag(input.scan)],
      },
      () =>
        db
          .select({ scan: scans })
          .from(scans)
          .innerJoin(websites, eq(websites.id, scans.websiteId))
          .where(
            and(
              eq(scans.id, input.scan),
              eq(websites.workspaceId, context.workspaceId)
            )
          )
          .limit(1)
    )

    return scan[0]?.scan ?? null
  })
