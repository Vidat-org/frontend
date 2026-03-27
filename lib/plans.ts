export type CanonicalPlan = "free_user" | "starter" | "pro" | "enterprise"

type PlanDefinition = {
  slug: CanonicalPlan
  label: string
  monthlyPriceSek: number
  websiteLimit: number
  historyDays: number | null
  features: string[]
}

const BILLING_SLUG_ALIASES: Record<string, CanonicalPlan> = {
  free: "free_user",
  free_user: "free_user",
  "free-plan": "free_user",
  free_user_plan: "free_user",
  starter: "starter",
  start: "starter",
  basic: "starter",
  pro: "pro",
  professional: "pro",
  business: "pro",
  enterprise: "enterprise",
  custom: "enterprise",
}

export const PLAN_DEFINITIONS: Record<CanonicalPlan, PlanDefinition> = {
  free_user: {
    slug: "free_user",
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
  starter: {
    slug: "starter",
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
  pro: {
    slug: "pro",
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
  enterprise: {
    slug: "enterprise",
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

export function normalizePlanSlug(plan: string | null | undefined): CanonicalPlan {
  if (!plan) {
    return "free_user"
  }

  return BILLING_SLUG_ALIASES[plan] ?? "free_user"
}

export function getPlanDefinition(plan: string | null | undefined) {
  return PLAN_DEFINITIONS[normalizePlanSlug(plan)]
}

export function planToWebsiteCount(plan: string | null | undefined) {
  return getPlanDefinition(plan).websiteLimit
}
