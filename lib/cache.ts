import "server-only"
import Redis from "ioredis"

type CacheTagScope = "workspace" | "user" | "website" | "scan" | "report"

export type CacheTag = {
  scope: CacheTagScope
  id: string
}

type CachedQueryOptions = {
  key: string
  ttlSeconds: number
  tags?: CacheTag[]
}

const cachePrefix = process.env.VALKEY_PREFIX ?? "vidat"
const valkeyUrl = process.env.VALKEY_URL

let client: Redis | null | undefined

function getValkeyClient(): Redis | null {
  if (client !== undefined) {
    return client
  }

  if (!valkeyUrl) {
    console.warn("[valkey] VALKEY_URL not set, cache disabled")
    client = null
    return client
  }

  client = new Redis(valkeyUrl, {
    maxRetriesPerRequest: 1,
  })

  client.on("connect", () => {
    console.log("[valkey] connected")
  })

  client.on("error", (error) => {
    console.error("[valkey] error", error)
  })

  return client
}

function getVersionKey(tag: CacheTag) {
  return `${cachePrefix}:version:${tag.scope}:${tag.id}`
}

async function getVersionSuffix(redis: Redis, tags: CacheTag[]) {
  if (tags.length === 0) {
    return "global:0"
  }

  const versions = await redis.mget(tags.map(getVersionKey))

  return tags
    .map((tag, index) => `${tag.scope}:${tag.id}:${versions[index] ?? "0"}`)
    .join("|")
}

export async function cachedQuery<T>(
  options: CachedQueryOptions,
  loader: () => Promise<T>
): Promise<T> {
  const redis = getValkeyClient()

  // No Redis → just run normally
  if (!redis) {
    return loader()
  }

  try {
    const suffix = await getVersionSuffix(redis, options.tags ?? [])
    const cacheKey = `${cachePrefix}:data:${options.key}:${suffix}`

    const cached = await redis.get(cacheKey)

    if (cached !== null) {
      return JSON.parse(cached) as T
    }

    const value = await loader()

    await redis.set(cacheKey, JSON.stringify(value), "EX", options.ttlSeconds)

    return value
  } catch (error) {
    console.error("[valkey] cache failed", error)
    return loader()
  }
}

export async function invalidateCacheTags(tags: CacheTag[]) {
  const redis = getValkeyClient()

  if (!redis || tags.length === 0) {
    return
  }

  try {
    const pipeline = redis.pipeline()

    for (const tag of tags) {
      pipeline.incr(getVersionKey(tag))
    }

    await pipeline.exec()
  } catch (error) {
    console.error("[valkey] invalidation failed", error)
  }
}

// Tag helpers
export function workspaceTag(workspaceId: string): CacheTag {
  return { scope: "workspace", id: workspaceId }
}

export function userTag(userId: string): CacheTag {
  return { scope: "user", id: userId }
}

export function websiteTag(websiteId: string): CacheTag {
  return { scope: "website", id: websiteId }
}

export function scanTag(scanId: string): CacheTag {
  return { scope: "scan", id: scanId }
}

export function reportTag(reportId: string): CacheTag {
  return { scope: "report", id: reportId }
}
