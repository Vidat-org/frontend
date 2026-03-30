import { db } from "@/db/drizzle"
import { getPlanDefinition } from "@/lib/plans"
import { requireApiKey } from "@/middlewares/api-key"
import {
  billingSubscriptions,
  scans,
  websites,
  workspaces,
} from "@/migrations/schema"
import { count, eq } from "drizzle-orm"

export async function GET(request: Request) {
  const apiKey = await requireApiKey(request)

  if ("error" in apiKey) {
    return apiKey.error
  }

  const [workspace, subscription, websiteUsage, scanUsage] = await Promise.all([
    db.query.workspaces.findFirst({
      where: eq(workspaces.id, apiKey.auth.workspaceId),
    }),
    db.query.billingSubscriptions.findFirst({
      where: eq(billingSubscriptions.workspaceId, apiKey.auth.workspaceId),
    }),
    db
      .select({ count: count() })
      .from(websites)
      .where(eq(websites.workspaceId, apiKey.auth.workspaceId)),
    db
      .select({ count: count() })
      .from(scans)
      .innerJoin(websites, eq(websites.id, scans.websiteId))
      .where(eq(websites.workspaceId, apiKey.auth.workspaceId)),
  ])

  if (!workspace) {
    return Response.json({ error: "workspace_not_found" }, { status: 404 })
  }

  const plan = getPlanDefinition(subscription?.planSlug ?? "free_user")

  return Response.json({
    workspace: {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      preferredLocale: workspace.preferredLocale,
      plan: plan.slug,
      planLabel: plan.label,
    },
    usage: {
      websites: websiteUsage[0]?.count ?? 0,
      websiteLimit: plan.websiteLimit,
      scans: scanUsage[0]?.count ?? 0,
    },
    apiKey: {
      label: apiKey.auth.label,
      prefix: apiKey.auth.keyPrefix,
    },
  })
}
