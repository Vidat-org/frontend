import "server-only"
import { db } from "@/db/drizzle"
import { apiKeys, billingSubscriptions, workspaces } from "@/migrations/schema"
import { and, eq, isNull } from "drizzle-orm"

export function generateApiKeySecret() {
  const bytes = new Uint8Array(18)
  crypto.getRandomValues(bytes)
  return `vidat_${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`
}

export async function hashApiKey(secret: string) {
  const encoded = new TextEncoder().encode(secret)
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function getApiKeyPrefix(secret: string) {
  return secret.slice(0, 12)
}

export async function authenticateApiKey(rawKey: string) {
  const keyHash = await hashApiKey(rawKey)

  const result = await db
    .select({
      id: apiKeys.id,
      workspaceId: apiKeys.workspaceId,
      keyPrefix: apiKeys.keyPrefix,
      label: apiKeys.label,
      workspaceName: workspaces.name,
      planSlug: billingSubscriptions.planSlug,
    })
    .from(apiKeys)
    .innerJoin(workspaces, eq(workspaces.id, apiKeys.workspaceId))
    .leftJoin(
      billingSubscriptions,
      eq(billingSubscriptions.workspaceId, apiKeys.workspaceId)
    )
    .where(and(eq(apiKeys.keyHash, keyHash), isNull(apiKeys.revokedAt)))
    .limit(1)

  if (!result[0]) {
    return null
  }

  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date().toISOString() })
    .where(eq(apiKeys.id, result[0].id))

  return result[0]
}
