import { authenticateApiKey } from "@/lib/api-key"

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

  if (!rawKey) {
    return {
      error: Response.json(
        { error: "missing_api_key" },
        { status: 401 }
      ),
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

  return { auth }
}
