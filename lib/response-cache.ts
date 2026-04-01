type CachePolicy = "private-short" | "public-health"

function getCacheControl(policy: CachePolicy) {
  switch (policy) {
    case "private-short":
      return "private, max-age=15, stale-while-revalidate=45"
    case "public-health":
      return "public, max-age=30, stale-while-revalidate=120"
  }
}

export function jsonWithCache<T>(
  body: T,
  init: ResponseInit = {},
  policy: CachePolicy
) {
  const headers = new Headers(init.headers)
  headers.set("Cache-Control", getCacheControl(policy))

  if (policy === "private-short") {
    headers.set("Vary", "Authorization, X-API-Key")
  }

  return Response.json(body, {
    ...init,
    headers,
  })
}
