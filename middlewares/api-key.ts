import { authenticateApiKey } from "@/lib/api-key"
import { getRequestLogger } from "@/lib/logger"
import { getRequestIp, rateLimit } from "@/lib/rate-limit"

function getRawApiKey(request: Request) {
  const authorization = request.headers.get("authorization")
  const headerKey = request.headers.get("x-api-key")

  if (headerKey) {
    return headerKey.trim()
  }

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim()
  }

  return null
}

export async function requireApiKey(request: Request) {
  const rawKey = getRawApiKey(request)
  const requestIp = getRequestIp(request)
  const log = getRequestLogger(request, {
    requestIp,
  })

  if (!rawKey) {
    log.warn("[api-key] missing API key")
    await log.flush()
    return {
      error: Response.json({ error: "missing_api_key" }, { status: 401 }),
    }
  }

  const preAuthLimit = await rateLimit({
    key: `ratelimit:api:raw:${requestIp}`,
    windowMs: 60_000,
    limit: 120,
  })

  if (!preAuthLimit.allowed) {
    log.warn("[api-key] pre-auth rate limited")
    await log.flush()
    return {
      error: Response.json({ error: "rate_limited" }, { status: 429 }),
    }
  }

  const auth = await authenticateApiKey(rawKey)

  if (!auth) {
    log.warn("[api-key] invalid API key")
    await log.flush()
    return {
      error: Response.json({ error: "invalid_api_key" }, { status: 401 }),
    }
  }

  if (auth.planSlug !== "agency") {
    log.warn("[api-key] plan does not include API access", {
      apiKeyId: auth.id,
      workspaceId: auth.workspaceId,
      planSlug: auth.planSlug ?? null,
    })
    await log.flush()
    return {
      error: Response.json(
        { error: "plan_does_not_include_api_access" },
        { status: 403 }
      ),
    }
  }

  const keyLimit = await rateLimit({
    key: `ratelimit:api:key:${auth.id}`,
    windowMs: 60_000,
    limit: 300,
  })

  if (!keyLimit.allowed) {
    log.warn("[api-key] key rate limited", {
      apiKeyId: auth.id,
      workspaceId: auth.workspaceId,
    })
    await log.flush()
    return {
      error: Response.json({ error: "rate_limited" }, { status: 429 }),
    }
  }

  return { auth }
}
