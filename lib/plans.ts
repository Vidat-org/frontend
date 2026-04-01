export type CanonicalPlan =
  | "free_org"
  | "starter_org"
  | "pro_org"
  | "enterprise_org"

type PlanDefinition = {
  slug: CanonicalPlan
  label: string
  monthlyPriceSek: number
  websiteLimit: number
  historyDays: number | null
  features: string[]
}

const BILLING_SLUG_ALIASES: Record<string, CanonicalPlan> = {
  // canonical pass-throughs
  free_org: "free_org",
  starter_org: "starter_org",
  pro_org: "pro_org",
  enterprise_org: "enterprise_org",
  // free aliases
  free: "free_org",
  free_user: "free_org",
  "free-plan": "free_org",
  free_user_plan: "free_org",
  // starter aliases
  starter: "starter_org",
  start: "starter_org",
  basic: "starter_org",
  // pro aliases
  pro: "pro_org",
  professional: "pro_org",
  business: "pro_org",
  // enterprise aliases
  enterprise: "enterprise_org",
  custom: "enterprise_org",
}

export const PLAN_DEFINITIONS: Record<CanonicalPlan, PlanDefinition> = {
  free_org: {
    slug: "free_org",
    label: "Free",
    monthlyPriceSek: 0,
    websiteLimit: 1,
    historyDays: 7,
    features: [
      "1 aktiv webbplats",
      "Manuella skanningar",
      "7 dagars historik",
      "Grundlaggande rapporter",
    ],
  },
  starter_org: {
    slug: "starter_org",
    label: "Starter",
    monthlyPriceSek: 149,
    websiteLimit: 5,
    historyDays: 90,
    features: [
      "5 aktiva webbplatser",
      "Schemalagda skanningar",
      "90 dagars historik",
      "E-postaviseringar",
    ],
  },
  pro_org: {
    slug: "pro_org",
    label: "Pro",
    monthlyPriceSek: 399,
    websiteLimit: 25,
    historyDays: 365,
    features: [
      "25 aktiva webbplatser",
      "Mobil- och desktopskanning",
      "Regressionsdetektering",
      "Webhook- och Slack-integrationer",
    ],
  },
  enterprise_org: {
    slug: "enterprise_org",
    label: "Enterprise",
    monthlyPriceSek: 999,
    websiteLimit: 9999,
    historyDays: null,
    features: [
      "Obegransade webbplatser",
      "Lang historik",
      "Team och white-label-rapporter",
      "Prioriterad support",
    ],
  },
}

export function normalizePlanSlug(
  plan: string | null | undefined
): CanonicalPlan {
  if (!plan) return "free_org"
  if (plan in PLAN_DEFINITIONS) return plan as CanonicalPlan
  return BILLING_SLUG_ALIASES[plan] ?? "free_org"
}

export function getPlanDefinition(plan: string | null | undefined) {
  return PLAN_DEFINITIONS[normalizePlanSlug(plan)]
}

export function planToWebsiteCount(plan: string | null | undefined) {
  return getPlanDefinition(plan).websiteLimit
}
