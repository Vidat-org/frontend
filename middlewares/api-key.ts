import { authenticateApiKey } from "@/lib/api-key"
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

  if (!rawKey) {
    return {
      error: Response.json(
        { error: "missing_api_key" },
        { status: 401 }
      ),
    }
  }

  const preAuthLimit = await rateLimit({
    key: `ratelimit:api:raw:${requestIp}`,
    windowMs: 60_000,
    limit: 120,
  })

  if (!preAuthLimit.allowed) {
    return {
      error: Response.json({ error: "rate_limited" }, { status: 429 }),
    }
  }

  const auth = await authenticateApiKey(rawKey)

  if (!auth) {
    return {
      error: Response.json(
        { error: "invalid_api_key" },
        { status: 401 }
      ),
    }
  }

  if (auth.planSlug !== "enterprise") {
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
    return {
      error: Response.json({ error: "rate_limited" }, { status: 429 }),
    }
  }

  return { auth }
}
