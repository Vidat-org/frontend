import z from "zod"

export const intervals = ["12h", "24h", "36h", "48h", "72h"] as const

export const createWebsiteSchema = z.object({
  name: z.string(),
  url: z.url(),
  interval: z.enum(intervals),
})

export const updateWebsiteSchema = createWebsiteSchema.extend({
  id: z.string(),
})

export const intervalToSeconds: Record<(typeof intervals)[number], number> = {
  "12h": 12 * 3600,
  "24h": 24 * 3600,
  "36h": 36 * 3600,
  "48h": 48 * 3600,
  "72h": 72 * 3600,
}

export function secondsToInterval(seconds: number): (typeof intervals)[number] {
  return (
    intervals.find((interval) => intervalToSeconds[interval] === seconds) ?? "72h"
  )
}
