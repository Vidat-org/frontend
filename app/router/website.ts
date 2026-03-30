import { db } from "@/db/drizzle"
import { websites } from "@/migrations/schema"
import { and, count, desc, eq } from "drizzle-orm"
import { protectedProcedure } from "../orpc"
import { createWebsiteSchema, intervalToSeconds } from "@/lib/schemas/website"
import z from "zod"
import { planToWebsiteCount } from "@/lib/utils"
import { ORPCError } from "@orpc/server"
import { ErrUpgradePlan } from "@/lib/errors"
import { appendAuditLog, markOnboardingStep } from "@/lib/saas"
import {
  cachedQuery,
  invalidateCacheTags,
  websiteTag,
  workspaceTag,
} from "@/lib/cache"
import { assertRateLimit } from "@/lib/rate-limit"

export const listWebsites = protectedProcedure.handler(async ({ context }) => {
  const websitesQuery = await cachedQuery(
    {
      key: `websites:list:${context.workspaceId}`,
      ttlSeconds: 60,
      tags: [workspaceTag(context.workspaceId)],
    },
    () =>
      db.query.websites.findMany({
        where: eq(websites.workspaceId, context.workspaceId),
        orderBy: desc(websites.createdAt),
      })
  )

  return websitesQuery
})

async function invalidateWebsiteQueries(
  workspaceId: string,
  websiteId?: string
) {
  const tags = [workspaceTag(workspaceId)]

  if (websiteId) {
    tags.push(websiteTag(websiteId))
  }

  await invalidateCacheTags(tags)
}

export const createWebsite = protectedProcedure
  .input(createWebsiteSchema)
  .handler(async ({ context, input }) => {
    await assertRateLimit({
      key: `ratelimit:websites:create:${context.workspaceId}:${context.userId}`,
      windowMs: 60_000,
      limit: 10,
    })

    const websiteCount = await db
      .select({ count: count() })
      .from(websites)
      .where(
        and(
          eq(websites.workspaceId, context.workspaceId),
          eq(websites.isEnabled, true)
        )
      )

    const planCount = planToWebsiteCount(context.plan)

    if (websiteCount[0].count >= planCount) {
      throw new ORPCError(ErrUpgradePlan)
    }

    const interval = intervalToSeconds[input.interval]

    const inserted = await db
      .insert(websites)
      .values({
        userId: context.userId,
        workspaceId: context.workspaceId,
        url: input.url,
        intervalSeconds: interval,
        name: input.name,
      })
      .returning({ id: websites.id })

    await markOnboardingStep(context.workspaceId, {
      hasAddedWebsite: true,
    })

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "website",
      action: "website.created",
      summary: `Webbplatsen ${input.url} lades till`,
      metadata: {
        intervalSeconds: interval,
      },
    })

    await invalidateWebsiteQueries(context.workspaceId, inserted[0]?.id)

    return inserted[0] ?? null
  })

export const getWebsite = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input, context }) => {
    const website = await cachedQuery(
      {
        key: `websites:get:${context.workspaceId}:${input.id}`,
        ttlSeconds: 60,
        tags: [workspaceTag(context.workspaceId), websiteTag(input.id)],
      },
      () =>
        db.query.websites.findFirst({
          where: and(
            eq(websites.workspaceId, context.workspaceId),
            eq(websites.id, input.id)
          ),
        })
    )

    return website
  })

export const updateNextCheck = protectedProcedure
  .input(z.object({ website: z.string(), date: z.date() }))
  .handler(async ({ context, input }) => {
    await assertRateLimit({
      key: `ratelimit:websites:scan:${context.workspaceId}:${context.userId}`,
      windowMs: 60_000,
      limit: 20,
    })

    await db
      .update(websites)
      .set({ nextCheckAt: input.date.toISOString() })
      .where(
        and(
          eq(websites.workspaceId, context.workspaceId),
          eq(websites.id, input.website)
        )
      )

    await invalidateWebsiteQueries(context.workspaceId, input.website)
  })

export const updateWebsiteDeviceType = protectedProcedure
  .input(
    z.object({ website: z.string(), device: z.enum(["mobile", "desktop"]) })
  )
  .handler(async ({ context, input }) => {
    await db
      .update(websites)
      .set({ deviceType: input.device })
      .where(
        and(
          eq(websites.workspaceId, context.workspaceId),
          eq(websites.id, input.website)
        )
      )

    await invalidateWebsiteQueries(context.workspaceId, input.website)
  })
