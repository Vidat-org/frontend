import { db } from "@/db/drizzle"
import { websites } from "@/migrations/schema"
import { desc, eq } from "drizzle-orm"
import { protectedProcedure } from "../orpc"
import { createWebsiteSchema, intervalToSeconds } from "@/lib/schemas/website"
import z from "zod"

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
  .handler(async ({ input }) => {
    const website = await db.query.websites.findFirst({
      where: eq(websites.id, input.id),
    })

    return website
  })
