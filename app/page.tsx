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

import { getT } from "next-i18next/server"
import { PricingTable, Show } from "@clerk/nextjs"
import {
  CheckoutButton,
  SubscriptionDetailsButton,
} from "@clerk/nextjs/experimental"

// --- Datakonstanter ---

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

// --- Komponenter ---

async function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="max-w-2xl space-y-3 md:space-y-4">
      <p className="text-[10px] font-semibold tracking-[0.2em] text-chart-1 uppercase md:text-xs md:tracking-[0.28em]">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base md:leading-7">
          {description}
        </p>
      )}
    </div>
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
    <div className="rounded-2xl border border-border/80 bg-background/80 p-4 shadow-sm">
      <p className="text-[10px] tracking-wider text-muted-foreground uppercase md:text-xs">
        {label}
      </p>
      <p
        className={`mt-2 text-2xl font-bold tracking-tight md:text-3xl ${tone === "good" ? "text-chart-1" : "text-destructive"}`}
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
    <article className="rounded-[1.75rem] border border-border/80 bg-card/80 p-6 transition-colors hover:bg-card">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-chart-1/12 text-chart-1">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </article>
  )
}

// --- Huvudsida ---

export default async function HomePage() {
  const { t } = await getT("common")

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
    { question: t("home.faq.q1.question"), answer: t("home.faq.q1.answer") },
    { question: t("home.faq.q2.question"), answer: t("home.faq.q2.answer") },
    { question: t("home.faq.q3.question"), answer: t("home.faq.q3.answer") },
  ]

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-136 bg-[radial-gradient(circle_at_top_left,_rgba(185,92,48,0.12),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(41,37,36,0.1),_transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_0,transparent_calc(100%-1px),rgba(120,113,108,0.08)_calc(100%-1px)),linear-gradient(to_bottom,transparent_0,transparent_calc(100%-1px),rgba(120,113,108,0.08)_calc(100%-1px))] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.3),transparent_90%)] bg-[size:60px_60px] md:bg-[size:80px_80px]" />

      <div className="relative mx-auto flex max-w-7xl flex-col px-4 pt-4 pb-12 sm:px-6 lg:px-10">
        {/* Header */}
        <header className="rounded-2xl border border-border/80 bg-background/85 px-4 py-3 backdrop-blur md:rounded-full md:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <div className="grid h-8 w-8 shrink-0 grid-cols-2 gap-1 rounded-md bg-card p-1 shadow-sm md:h-9 md:w-9">
                <span className="rounded-sm bg-chart-1" />
                <span className="rounded-sm bg-chart-2/25" />
                <span className="rounded-sm bg-chart-2/25" />
                <span className="rounded-sm bg-chart-1" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold tracking-widest uppercase">
                  {t("home.brand")}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("home.tagline")}
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
              <a
                href="#features"
                className="transition-colors hover:text-foreground"
              >
                {t("home.nav.features")}
              </a>
              <a
                href="#complete-saas"
                className="transition-colors hover:text-foreground"
              >
                {t("home.nav.completeSaas")}
              </a>
              <a
                href="#pricing"
                className="transition-colors hover:text-foreground"
              >
                {t("home.nav.pricing")}
              </a>
              <Link
                href="/docs"
                className="transition-colors hover:text-foreground"
              >
                {t("home.nav.docs")}
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="hidden shrink-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
              >
                {t("home.actions.signIn")}
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-chart-1 px-4 py-2 text-xs font-semibold text-white transition-all hover:brightness-110 active:scale-95 md:text-sm"
              >
                <span className="whitespace-nowrap">
                  {t("home.actions.startFree")}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </div>

          <nav className="mt-3 no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {["features", "complete-saas", "pricing", "docs"].map((id) => (
              <a
                key={id}
                href={id === "docs" ? "/docs" : `#${id}`}
                className="shrink-0 rounded-full border border-border/80 bg-background/50 px-3 py-1 text-[10px] font-medium whitespace-nowrap text-muted-foreground"
              >
                {t(`home.nav.${id === "complete-saas" ? "saasShort" : id}`)}
              </a>
            ))}
          </nav>
        </header>

        {/* Hero Section */}
        <section className="grid gap-12 pt-12 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-24">
          <div className="flex flex-col items-center space-y-8 text-center lg:items-start lg:text-left">
            <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-chart-1/20 bg-chart-1/8 px-4 py-2 text-[10px] tracking-widest text-chart-1 uppercase md:text-xs">
              <BellRing className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">{t("home.hero.pill")}</span>
            </div>

            <div className="space-y-6">
              <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                {t("home.hero.title")}
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg md:leading-8 lg:mx-0">
                {t("home.hero.description")}
              </p>
            </div>

            {/* Hero Buttons: Fixed for Mobile */}
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/sign-in"
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 active:scale-95 sm:w-auto"
              >
                {t("home.actions.createAccount")}
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>

              <Link
                href="/dashboard/settings"
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold transition-colors hover:bg-muted/70 sm:w-auto"
              >
                {t("home.actions.viewSaasSettings")}
              </Link>
            </div>

            <div className="grid w-full grid-cols-2 gap-4 border-t border-border/80 pt-8 sm:grid-cols-3">
              {[
                { val: "24/7", label: t("home.metrics.m1") },
                { val: "4", label: t("home.metrics.m2") },
                { val: t("home.metrics.value3"), label: t("home.metrics.m3") },
              ].map((m, i) => (
                <div
                  key={i}
                  className={i === 2 ? "col-span-2 sm:col-span-1" : ""}
                >
                  <p className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {m.val}
                  </p>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Card Mockup */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute inset-0 -translate-x-2 -translate-y-2 rounded-[2rem] bg-chart-1/12 blur-3xl sm:-translate-x-4 sm:-translate-y-4" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/90 p-4 shadow-2xl sm:p-6">
              <div className="flex flex-col gap-4 border-b border-border/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                    {t("home.demo.eyebrow")}
                  </p>
                  <h3 className="mt-1 text-xl font-bold tracking-tight">
                    {t("home.demo.title")}
                  </h3>
                </div>
                <span className="w-fit shrink-0 rounded-full bg-chart-1/15 px-3 py-1 text-[10px] font-bold whitespace-nowrap text-chart-1 uppercase">
                  {t("home.demo.pill")}
                </span>
              </div>

              <div className="xsm:grid-cols-3 grid grid-cols-1 gap-3 py-5">
                <MetricCard
                  label={t("home.demo.metrics.performance")}
                  value="92"
                  tone="good"
                />
                <MetricCard
                  label={t("home.demo.metrics.seo")}
                  value="96"
                  tone="good"
                />
                <MetricCard
                  label={t("home.demo.metrics.bestPractices")}
                  value="78"
                  tone="warn"
                />
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        {t("home.demo.alertTitle")}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {t("home.demo.alertDescription")}
                      </p>
                    </div>
                    <span className="w-fit shrink-0 rounded-full bg-destructive/10 px-3 py-1 text-[10px] font-bold whitespace-nowrap text-destructive">
                      {t("home.demo.alertPill")}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
                    <p className="text-[10px] tracking-widest text-chart-1 uppercase">
                      {t("home.demo.aiEyebrow")}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {t("home.demo.aiDescription")}
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <div className="rounded-xl border border-border/80 bg-background/80 p-3">
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {t("home.demo.integrationsLabel")}
                      </p>
                      <p className="text-xs font-bold">
                        {t("home.demo.integrationsValue")}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/80 bg-background/80 p-3">
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {t("home.demo.billingLabel")}
                      </p>
                      <p className="text-xs font-bold">
                        {t("home.demo.billingValue")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Pillars */}
        <section className="grid gap-4 border-y border-border/80 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {productPillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <article
                key={pillar.titleKey}
                className="rounded-3xl border border-border/80 bg-card/50 p-6 transition-colors hover:bg-card/80"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-chart-1/12 text-chart-1">
                  <Icon className="h-5 w-5 shrink-0" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  {t(pillar.titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(pillar.descriptionKey)}
                </p>
              </article>
            )
          })}
        </section>

        {/* Features Row */}
        <section
          id="features"
          className="grid gap-12 py-20 lg:grid-cols-[0.8fr_1.2fr]"
        >
          <SectionHeading
            eyebrow={t("home.sections.features.eyebrow")}
            title={t("home.sections.features.title")}
            description={t("home.sections.features.description")}
          />
          <div className="space-y-6">
            {featureRows.map((row) => (
              <article
                key={row.titleKey}
                className="rounded-[2rem] border border-border/80 bg-card/40 p-6 transition-all hover:bg-card/60 md:p-10"
              >
                <p className="text-[10px] font-bold tracking-widest text-chart-1 uppercase">
                  {t(row.eyebrowKey)}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
                  {t(row.titleKey)}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {t(row.descriptionKey)}
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {row.bulletKeys.map((bulletKey) => (
                    <div
                      key={bulletKey}
                      className="rounded-2xl border border-border/60 bg-background/60 p-4 text-xs font-medium text-muted-foreground"
                    >
                      {t(bulletKey)}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Complete SaaS Section */}
        <section
          id="complete-saas"
          className="rounded-[2.5rem] border border-border/80 bg-card/75 px-6 py-16 md:px-12"
        >
          <SectionHeading
            eyebrow={t("home.sections.completeSaas.eyebrow")}
            title={t("home.sections.completeSaas.title")}
            description={t("home.sections.completeSaas.description")}
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completeSaasItems.map((item) => {
              const Icon = item.icon
              return (
                <article
                  key={item.titleKey}
                  className="rounded-[2rem] border border-border/80 bg-background/85 p-6 transition-transform hover:-translate-y-1"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
                    <Icon className="h-5 w-5 shrink-0" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">
                    {t(item.titleKey)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(item.descriptionKey)}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        {/* Trust Section */}
        <section className="grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow={t("home.sections.trust.eyebrow")}
            title={t("home.sections.trust.title")}
            description={t("home.sections.trust.description")}
          />
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
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

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <SectionHeading
            eyebrow={t("home.sections.pricing.eyebrow")}
            title={t("home.sections.pricing.title")}
            description={t("home.sections.pricing.description")}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pricing.map((plan) => (
              <article
                key={plan.name}
                className={`flex flex-col rounded-[2rem] border p-8 transition-all hover:shadow-lg ${
                  plan.featured
                    ? "z-10 scale-105 border-chart-1 bg-foreground text-background shadow-xl"
                    : "border-border/80 bg-card/80"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-[10px] font-bold tracking-widest uppercase ${plan.featured ? "text-chart-1" : "text-muted-foreground"}`}
                    >
                      {plan.name}
                    </p>
                    {plan.featured && (
                      <span className="rounded-full bg-chart-1 px-2.5 py-1 text-[10px] font-bold whitespace-nowrap text-white uppercase">
                        {t("home.pricing.recommended")}
                      </span>
                    )}
                  </div>
                  <p className="mt-6 text-4xl font-bold tracking-tight">
                    {plan.price}
                  </p>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${plan.featured ? "text-background/70" : "text-muted-foreground"}`}
                  >
                    {plan.description}
                  </p>
                  <div className="mt-8 space-y-3">
                    {plan.features.map((f) => (
                      <div
                        key={f}
                        className={`rounded-xl px-4 py-2.5 text-xs font-medium ${plan.featured ? "bg-white/10" : "bg-background/80"}`}
                      >
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  href="/sign-in"
                  className={`mt-8 block shrink-0 rounded-full py-3 text-center text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
                    plan.featured
                      ? "bg-chart-1 text-white hover:brightness-110"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  {t("home.actions.startFree")}
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow={t("home.sections.faq.eyebrow")}
            title={t("home.sections.faq.title")}
          />
          <div className="space-y-4">
            {faq.map((item) => (
              <article
                key={item.question}
                className="rounded-3xl border border-border/80 bg-card/80 p-6 md:p-8"
              >
                <h3 className="text-lg font-bold tracking-tight">
                  {item.question}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-foreground px-6 py-16 text-background md:px-16">
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl space-y-6">
              <p className="text-[10px] font-bold tracking-[0.3em] text-chart-1 uppercase">
                {t("home.nextSteps.eyebrow")}
              </p>
              <h2 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl">
                {t("home.nextSteps.title")}
              </h2>
              <p className="text-sm leading-relaxed text-background/70 md:text-lg">
                {t("home.nextSteps.description")}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard/settings"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-chart-1 px-8 py-4 text-sm font-bold whitespace-nowrap text-white transition-transform hover:-translate-y-1 active:scale-95 sm:w-auto"
              >
                {t("home.nextSteps.actions.openSettings")}
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-bold whitespace-nowrap text-background transition-colors hover:bg-white/10 sm:w-auto"
              >
                {t("home.nextSteps.actions.contactUs")}
              </Link>
            </div>
          </div>
          <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-chart-1/20 blur-[100px]" />
        </section>

        {/* Footer */}
        <footer className="mt-20 flex flex-col gap-10 border-t border-border/80 py-12 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="font-bold tracking-[0.24em] text-foreground uppercase">
              {t("home.brand")}
            </p>
            <p className="max-w-xs">{t("home.footer.tagline")}</p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-4 font-medium">
            {[
              { href: "/trust", label: "Trust Center" },
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
              { href: "/security", label: "Security" },
              { href: "/contact", label: t("home.footer.links.contact") },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </footer>
      </div>
    </main>
  )
}
