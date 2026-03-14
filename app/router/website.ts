import { db } from "@/db/drizzle"
import { websites } from "@/migrations/schema"
import { and, count, desc, eq } from "drizzle-orm"
import { protectedProcedure } from "../orpc"
import { createWebsiteSchema, intervalToSeconds } from "@/lib/schemas/website"
import z from "zod"
import { planToWebsiteCount } from "@/lib/utils"
import { ORPCError } from "@orpc/server"
import { ErrUpgradePlan } from "@/lib/errors"

export const listWebsites = protectedProcedure.handler(async ({ context }) => {
  const websitesQuery = await db.query.websites.findMany({
    where: eq(websites.userId, context.userId),
    orderBy: desc(websites.createdAt),
  })

  return websitesQuery
})

export const createWebsite = protectedProcedure
  .input(createWebsiteSchema)
  .handler(async ({ context, input }) => {
    const websiteCount = await db
      .select({ count: count() })
      .from(websites)
      .where(eq(websites.userId, context.userId))

    const planCount = planToWebsiteCount(context.plan)

    if (websiteCount[0].count === planCount) {
      throw new ORPCError(ErrUpgradePlan)
    }

    const interval = intervalToSeconds[input.interval]

    await db.insert(websites).values({
      userId: context.userId,
      url: input.url,
      intervalSeconds: interval,
      name: "",
    })
  })

export const getWebsite = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input, context }) => {
    const website = await db.query.websites.findFirst({
      where: and(
        eq(websites.userId, context.userId),
        eq(websites.id, input.id)
      ),
    })

    return website
  })

export const updateNextCheck = protectedProcedure
  .input(z.object({ website: z.string(), date: z.date() }))
  .handler(async ({ context, input }) => {
    await db
      .update(websites)
      .set({ nextCheckAt: input.date.toISOString() })
      .where(
        and(eq(websites.userId, context.userId), eq(websites.id, input.website))
      )
  })
