import "server-only"
import Redis from "ioredis"
import { logger } from "./logger"

type RateLimitOptions = {
  key: string
  windowMs: number
  limit: number
}

type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
}

const valkeyUrl = process.env.VALKEY_URL
const memoryStore = new Map<string, { count: number; resetAt: number }>()

let redisClient: Redis | null | undefined

function getRedisClient() {
  if (redisClient !== undefined) {
    return redisClient
  }

  if (!valkeyUrl) {
    redisClient = null
    return redisClient
  }

  redisClient = new Redis(valkeyUrl, {
    maxRetriesPerRequest: 1,
  })

  redisClient.on("error", (error) => {
    logger.error("[rate-limit] valkey error", error)
  })

  return redisClient
}

function runMemoryRateLimit(options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const resetAt = now + options.windowMs
  const current = memoryStore.get(options.key)

  if (!current || current.resetAt <= now) {
    memoryStore.set(options.key, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: Math.max(options.limit - 1, 0),
      resetAt,
    }
  }

  current.count += 1
  memoryStore.set(options.key, current)

  return {
    allowed: current.count <= options.limit,
    remaining: Math.max(options.limit - current.count, 0),
    resetAt: current.resetAt,
  }
}

export async function rateLimit(
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const redis = getRedisClient()

  if (!redis) {
    return runMemoryRateLimit(options)
  }

  const resetAt = Date.now() + options.windowMs
  const ttlSeconds = Math.max(Math.ceil(options.windowMs / 1000), 1)

  try {
    const count = await redis.incr(options.key)

    if (count === 1) {
      await redis.expire(options.key, ttlSeconds)
    }

    return {
      allowed: count <= options.limit,
      remaining: Math.max(options.limit - count, 0),
      resetAt,
    }
  } catch (error) {
    logger.error("[rate-limit] fallback to memory", error, {
      key: options.key,
      windowMs: options.windowMs,
      limit: options.limit,
    })
    return runMemoryRateLimit(options)
  }
}

export async function assertRateLimit(
  options: RateLimitOptions & { errorMessage?: string }
) {
  const result = await rateLimit(options)

  if (!result.allowed) {
    throw new Error(options.errorMessage ?? "RATE_LIMITED")
  }

  return result
}

export function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown"
  }

  if (realIp) {
    return realIp.trim()
  }

  return "unknown"
}
