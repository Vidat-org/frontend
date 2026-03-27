import Link from "next/link"
import type { ReactNode } from "react"
import {
  Activity,
  BellRing,
  Building2,
  ChevronRight,
  CreditCard,
  FileText,
  Gauge,
  Lock,
  MessagesSquare,
  Rocket,
  ShieldCheck,
  Users,
  Webhook,
} from "lucide-react"
import { t } from "@/lib/i18n"

const productPillars = [
  {
    titleKey: "home.productPillars.performance.title",
    descriptionKey: "home.productPillars.performance.description",
    icon: Gauge,
  },
  {
    titleKey: "home.productPillars.insights.title",
    descriptionKey: "home.productPillars.insights.description",
    icon: Activity,
  },
  {
    titleKey: "home.productPillars.ops.title",
    descriptionKey: "home.productPillars.ops.description",
    icon: Webhook,
  },
]

const featureRows = [
  {
    eyebrowKey: "home.features.monitoring.eyebrow",
    titleKey: "home.features.monitoring.title",
    descriptionKey: "home.features.monitoring.description",
    bulletKeys: [
      "home.features.monitoring.bullet1",
      "home.features.monitoring.bullet2",
      "home.features.monitoring.bullet3",
    ],
  },
  {
    eyebrowKey: "home.features.reporting.eyebrow",
    titleKey: "home.features.reporting.title",
    descriptionKey: "home.features.reporting.description",
    bulletKeys: [
      "home.features.reporting.bullet1",
      "home.features.reporting.bullet2",
      "home.features.reporting.bullet3",
    ],
  },
  {
    eyebrowKey: "home.features.automation.eyebrow",
    titleKey: "home.features.automation.title",
    descriptionKey: "home.features.automation.description",
    bulletKeys: [
      "home.features.automation.bullet1",
      "home.features.automation.bullet2",
      "home.features.automation.bullet3",
    ],
  },
]

const completeSaasItems = [
  {
    titleKey: "home.completeSaas.billing.title",
    descriptionKey: "home.completeSaas.billing.description",
    icon: CreditCard,
  },
  {
    titleKey: "home.completeSaas.orgs.title",
    descriptionKey: "home.completeSaas.orgs.description",
    icon: Users,
  },
  {
    titleKey: "home.completeSaas.onboarding.title",
    descriptionKey: "home.completeSaas.onboarding.description",
    icon: Rocket,
  },
  {
    titleKey: "home.completeSaas.trust.title",
    descriptionKey: "home.completeSaas.trust.description",
    icon: Lock,
  },
  {
    titleKey: "home.completeSaas.support.title",
    descriptionKey: "home.completeSaas.support.description",
    icon: MessagesSquare,
  },
  {
    titleKey: "home.completeSaas.gtm.title",
    descriptionKey: "home.completeSaas.gtm.description",
    icon: Building2,
  },
]

const pricing = [
  {
    name: t("home.pricing.free.name"),
    price: "0 kr",
    description: t("home.pricing.free.description"),
    features: [
      t("home.pricing.free.feature1"),
      t("home.pricing.free.feature2"),
      t("home.pricing.free.feature3"),
      t("home.pricing.free.feature4"),
    ],
  },
  {
    name: t("home.pricing.starter.name"),
    price: "149 kr",
    description: t("home.pricing.starter.description"),
    features: [
      t("home.pricing.starter.feature1"),
      t("home.pricing.starter.feature2"),
      t("home.pricing.starter.feature3"),
      t("home.pricing.starter.feature4"),
    ],
    featured: true,
  },
  {
    name: t("home.pricing.pro.name"),
    price: "399 kr",
    description: t("home.pricing.pro.description"),
    features: [
      t("home.pricing.pro.feature1"),
      t("home.pricing.pro.feature2"),
      t("home.pricing.pro.feature3"),
      t("home.pricing.pro.feature4"),
    ],
  },
  {
    name: t("home.pricing.enterprise.name"),
    price: "999 kr",
    description: t("home.pricing.enterprise.description"),
    features: [
      t("home.pricing.enterprise.feature1"),
      t("home.pricing.enterprise.feature2"),
      t("home.pricing.enterprise.feature3"),
      t("home.pricing.enterprise.feature4"),
    ],
  },
]

const faq = [
  {
    question: t("home.faq.q1.question"),
    answer: t("home.faq.q1.answer"),
  },
  {
    question: t("home.faq.q2.question"),
    answer: t("home.faq.q2.answer"),
  },
  {
    question: t("home.faq.q3.question"),
    answer: t("home.faq.q3.answer"),
  },
]

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-chart-1">
        {eyebrow}
      </p>
      <h2 className="font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,_rgba(185,92,48,0.16),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(41,37,36,0.14),_transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_0,transparent_calc(100%-1px),rgba(120,113,108,0.12)_calc(100%-1px)),linear-gradient(to_bottom,transparent_0,transparent_calc(100%-1px),rgba(120,113,108,0.12)_calc(100%-1px))] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.28),transparent_90%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6 lg:px-10">
        <header className="rounded-[2rem] border border-border/80 bg-background/85 px-4 py-4 backdrop-blur sm:px-5 sm:py-3 md:rounded-full">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 grid-cols-2 gap-1 rounded-md bg-card p-1 shadow-sm">
              <span className="rounded-sm bg-chart-1" />
              <span className="rounded-sm bg-chart-2/25" />
              <span className="rounded-sm bg-chart-2/25" />
              <span className="rounded-sm bg-chart-1" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em]">
                {t("home.brand")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("home.tagline")}
              </p>
            </div>
            </Link>

            <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
              <a href="#features" className="transition-colors hover:text-foreground">
                {t("home.nav.features")}
              </a>
              <a href="#complete-saas" className="transition-colors hover:text-foreground">
                {t("home.nav.completeSaas")}
              </a>
              <a href="#pricing" className="transition-colors hover:text-foreground">
                {t("home.nav.pricing")}
              </a>
              <Link href="/docs" className="transition-colors hover:text-foreground">
                {t("home.nav.docs")}
              </Link>
            </nav>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:justify-end">
              <nav className="flex flex-wrap gap-2 text-xs text-muted-foreground lg:hidden">
                <a
                  href="#features"
                  className="rounded-full border border-border/80 px-3 py-1.5 transition-colors hover:text-foreground"
                >
                  {t("home.nav.features")}
                </a>
                <a
                  href="#complete-saas"
                  className="rounded-full border border-border/80 px-3 py-1.5 transition-colors hover:text-foreground"
                >
                  {t("home.nav.saasShort")}
                </a>
                <a
                  href="#pricing"
                  className="rounded-full border border-border/80 px-3 py-1.5 transition-colors hover:text-foreground"
                >
                  {t("home.nav.pricing")}
                </a>
                <Link
                  href="/docs"
                  className="rounded-full border border-border/80 px-3 py-1.5 transition-colors hover:text-foreground"
                >
                  {t("home.nav.docs")}
                </Link>
              </nav>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/sign-in"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
                >
                  {t("home.actions.signIn")}
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-chart-1 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  {t("home.actions.startFree")}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-10 pb-16 pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-24">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-chart-1/20 bg-chart-1/8 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-chart-1 sm:text-xs sm:tracking-[0.22em]">
              <BellRing className="h-3.5 w-3.5" />
              {t("home.hero.pill")}
            </div>

            <div className="space-y-6">
              <h1 className="font-serif text-4xl leading-none tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                {t("home.hero.title")}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                {t("home.hero.description")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                {t("home.actions.createAccount")}
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted/70"
              >
                {t("home.actions.viewSaasSettings")}
              </Link>
            </div>

            <div className="grid gap-4 border-t border-border/80 pt-8 sm:grid-cols-3">
              <div>
                <p className="text-2xl font-semibold tracking-tight sm:text-3xl">24/7</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("home.metrics.m1")}
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight sm:text-3xl">4</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("home.metrics.m2")}
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight sm:text-3xl">1 plats</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("home.metrics.m3")}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[2rem] bg-chart-1/12 blur-3xl sm:translate-x-4 sm:translate-y-4" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/90 p-4 shadow-xl sm:p-5">
              <div className="flex flex-col gap-3 border-b border-border/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {t("home.demo.eyebrow")}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                    {t("home.demo.title")}
                  </h3>
                </div>
                <span className="rounded-full bg-chart-1/15 px-3 py-1 text-xs font-semibold text-chart-1">
                  {t("home.demo.pill")}
                </span>
              </div>

              <div className="grid gap-4 py-5 sm:grid-cols-3">
                <MetricCard label="Performance" value="92" tone="good" />
                <MetricCard label="SEO" value="96" tone="good" />
                <MetricCard label="Best practice" value="78" tone="warn" />
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold">{t("home.demo.alertTitle")}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {t("home.demo.alertDescription")}
                      </p>
                    </div>
                    <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                      {t("home.demo.alertPill")}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-chart-1">
                    {t("home.demo.aiEyebrow")}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {t("home.demo.aiDescription")}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {t("home.demo.integrationsLabel")}
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      {t("home.demo.integrationsValue")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {t("home.demo.billingLabel")}
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      {t("home.demo.billingValue")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-y border-border/80 py-10 md:grid-cols-3">
          {productPillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <article
                key={pillar.titleKey}
                className="rounded-[1.75rem] border border-border/80 bg-card/70 p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-chart-1/12 text-chart-1">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  {t(pillar.titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {t(pillar.descriptionKey)}
                </p>
              </article>
            )
          })}
        </section>

        <section
          id="features"
          className="grid gap-10 py-20 lg:grid-cols-[0.85fr_1.15fr]"
        >
          <SectionHeading
            eyebrow={t("home.sections.features.eyebrow")}
            title={t("home.sections.features.title")}
            description={t("home.sections.features.description")}
          />

          <div className="space-y-4">
            {featureRows.map((row) => (
              <article
                key={row.titleKey}
                className="rounded-[1.75rem] border border-border/80 bg-card/85 p-6 md:p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-chart-1">
                  {t(row.eyebrowKey)}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                  {t(row.titleKey)}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {t(row.descriptionKey)}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {row.bulletKeys.map((bulletKey) => (
                    <div
                      key={bulletKey}
                      className="rounded-2xl border border-border/80 bg-background/80 p-4 text-sm leading-6 text-muted-foreground"
                    >
                      {t(bulletKey)}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="complete-saas"
          className="rounded-[2rem] border border-border/80 bg-card/75 px-4 py-12 sm:px-6 sm:py-16 md:px-10"
        >
          <SectionHeading
            eyebrow={t("home.sections.completeSaas.eyebrow")}
            title={t("home.sections.completeSaas.title")}
            description={t("home.sections.completeSaas.description")}
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {completeSaasItems.map((item) => {
              const Icon = item.icon
              return (
                <article
                  key={item.titleKey}
                  className="rounded-[1.75rem] border border-border/80 bg-background/85 p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {t(item.titleKey)}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {t(item.descriptionKey)}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="grid gap-10 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow={t("home.sections.trust.eyebrow")}
            title={t("home.sections.trust.title")}
            description={t("home.sections.trust.description")}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <TrustCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title={t("home.trust.cards.ops.title")}
              description={t("home.trust.cards.ops.description")}
            />
            <TrustCard
              icon={<FileText className="h-5 w-5" />}
              title={t("home.trust.cards.policies.title")}
              description={t("home.trust.cards.policies.description")}
            />
            <TrustCard
              icon={<BellRing className="h-5 w-5" />}
              title={t("home.trust.cards.comms.title")}
              description={t("home.trust.cards.comms.description")}
            />
          </div>
        </section>

        <section id="pricing" className="py-6">
          <SectionHeading
            eyebrow={t("home.sections.pricing.eyebrow")}
            title={t("home.sections.pricing.title")}
            description={t("home.sections.pricing.description")}
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            {pricing.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-[1.9rem] border p-6 ${
                  plan.featured
                    ? "border-chart-1 bg-foreground text-background shadow-xl"
                    : "border-border/80 bg-card/80"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.26em] ${
                        plan.featured ? "text-chart-1" : "text-muted-foreground"
                      }`}
                    >
                      {plan.name}
                    </p>
                    <p className="mt-4 text-4xl font-semibold tracking-tight">
                      {plan.price}
                    </p>
                    <p
                      className={`mt-3 text-sm leading-6 ${
                        plan.featured ? "text-background/75" : "text-muted-foreground"
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>
                  {plan.featured ? (
                    <span className="rounded-full bg-chart-1 px-3 py-1 text-xs font-semibold text-white">
                      {t("home.pricing.recommended")}
                    </span>
                  ) : null}
                </div>

                <div className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        plan.featured
                          ? "bg-white/8 text-background"
                          : "bg-background/80 text-muted-foreground"
                      }`}
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow={t("home.sections.faq.eyebrow")}
            title={t("home.sections.faq.title")}
          />

          <div className="space-y-4">
            {faq.map((item) => (
              <article
                key={item.question}
                className="rounded-[1.75rem] border border-border/80 bg-card/80 p-6"
              >
                <h3 className="text-lg font-semibold tracking-tight">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-border/80 bg-foreground px-4 py-12 text-background sm:px-6 sm:py-14 md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-chart-1">
                {t("home.nextSteps.eyebrow")}
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
                {t("home.nextSteps.title")}
              </h2>
              <p className="mt-4 text-sm leading-7 text-background/72 md:text-base">
                {t("home.nextSteps.description")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-2 rounded-full bg-chart-1 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                {t("home.nextSteps.actions.openSettings")}
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-white/8"
              >
                {t("home.nextSteps.actions.contactUs")}
              </Link>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-5 border-t border-border/80 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold uppercase tracking-[0.24em] text-foreground">
              {t("home.brand")}
            </p>
            <p className="mt-1">
              {t("home.footer.tagline")}
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              {t("home.footer.links.privacy")}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              {t("home.footer.links.terms")}
            </Link>
            <Link href="/docs" className="transition-colors hover:text-foreground">
              {t("home.footer.links.docs")}
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">
              {t("home.footer.links.contact")}
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "good" | "warn"
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-3 text-3xl font-semibold tracking-tight ${
          tone === "good" ? "text-chart-1" : "text-destructive"
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function TrustCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <article className="rounded-[1.75rem] border border-border/80 bg-card/80 p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-chart-1/12 text-chart-1">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </article>
  )
}
