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

const productPillars = [
  {
    title: "Prestanda utan manuellt arbete",
    description:
      "Schemalagda Lighthouse-körningar, historik och regressionsspårning för varje webbplats.",
    icon: Gauge,
  },
  {
    title: "Insikter som går att agera på",
    description:
      "AI-förklaringar, prioriterade förbättringsförslag och rapporter som kan delas internt eller med kund.",
    icon: Activity,
  },
  {
    title: "Byggd för operativ drift",
    description:
      "Webhook-flöden, notifieringar, billing-stöd och tydliga planbegränsningar redan i produkten.",
    icon: Webhook,
  },
]

const featureRows = [
  {
    eyebrow: "Övervakning",
    title: "Följ varje deploy som om den vore affärskritisk.",
    description:
      "Vidat fångar förändringar i Core Web Vitals, SEO och teknisk kvalitet innan användarna märker att något gått fel.",
    bullets: [
      "Dagliga, veckovisa eller deploy-triggade skanningar",
      "Mobil- och desktopperspektiv i samma arbetsflöde",
      "Historik som gör regressionsmönster tydliga",
    ],
  },
  {
    eyebrow: "Rapportering",
    title: "Gör siffror begripliga för både team och kund.",
    description:
      "Rapporterna fokuserar på vad som förändrats, varför det spelar roll och vad som bör göras härnäst.",
    bullets: [
      "AI-summeringar på svenska",
      "Tydliga prioriteringar i stället för rådata",
      "White-label-redo för byråer och konsultteam",
    ],
  },
  {
    eyebrow: "Automatisering",
    title: "Koppla ihop produkten med resten av din drift.",
    description:
      "Notiser och händelser går att skicka vidare till Slack, interna verktyg eller externa system via webhook.",
    bullets: [
      "Scan failure alerts och score-drop-varningar",
      "Webhook-destinationer per konto",
      "Billing- och planstyrning för SaaS-upplägg",
    ],
  },
]

const completeSaasItems = [
  {
    title: "Riktiga betalflöden",
    description:
      "Checkout, abonnemangsändringar, kvitton, dunning och självservice i billing-portalen måste fungera utan manuell hantering.",
    icon: CreditCard,
  },
  {
    title: "Organisationer och roller",
    description:
      "Teamkonton, inbjudningar, ägare/admin/medlem-roller och separata arbetsytor är ofta det som skiljer en bra produkt från en verklig SaaS.",
    icon: Users,
  },
  {
    title: "Onboarding som konverterar",
    description:
      "Guidad första upplevelse, sample-data, checklista och tydlig aktivering efter signup minskar churn direkt.",
    icon: Rocket,
  },
  {
    title: "Trust och compliance",
    description:
      "Audit logs, databevarande, incidentprocess, backup-strategi, rate limiting och säker hantering av webhooks behöver vara tydligt definierade.",
    icon: Lock,
  },
  {
    title: "Support och kundresa",
    description:
      "Inbyggd hjälp, statuskommunikation, SLA-nivåer, kontaktvägar och success-flöden för större kunder bör vara produktiserade.",
    icon: MessagesSquare,
  },
  {
    title: "Go-to-market underbyggt i produkten",
    description:
      "Referral-spårning, trial-regler, usage limits, uppgraderingspunkter och expansionsdrivande triggers behöver vara medvetet designade.",
    icon: Building2,
  },
]

const pricing = [
  {
    name: "Free",
    price: "0 kr",
    description: "För solo-test och första webbplatsen.",
    features: [
      "1 aktiv webbplats",
      "Manuella skanningar",
      "7 dagars historik",
      "Grundläggande rapporter",
    ],
  },
  {
    name: "Starter",
    price: "149 kr",
    description: "För mindre team som vill börja automatisera.",
    features: [
      "5 aktiva webbplatser",
      "Schemalagda skanningar",
      "90 dagars historik",
      "E-postaviseringar",
    ],
    featured: true,
  },
  {
    name: "Pro",
    price: "399 kr",
    description: "För team som arbetar aktivt med deploys och regressionsrisk.",
    features: [
      "25 aktiva webbplatser",
      "Mobil + desktop",
      "Webhook- och Slack-stöd",
      "Regressionsdetektering",
    ],
  },
  {
    name: "Enterprise",
    price: "999 kr",
    description: "För byråer, större produktteam och fler intressenter.",
    features: [
      "Nästan obegränsade webbplatser",
      "Lång historik",
      "Team och white-label",
      "Prioriterad support",
    ],
  },
]

const faq = [
  {
    question: "Vad finns redan på plats i produkten?",
    answer:
      "Dashboard, rapporter, planstyrning, settings, webhooks, notifieringsinställningar och grunden för billing finns redan i kodbasen.",
  },
  {
    question: "Vad skulle jag prioritera härnäst?",
    answer:
      "1) riktiga betalflöden, 2) organisationskonton, 3) onboarding/aktivering, 4) robust notifieringsleverans och 5) audit/compliance.",
  },
  {
    question: "Är produkten byggd för byråer eller interna team?",
    answer:
      "Båda. White-label, teamfunktioner, fler arbetsytor och kundvänliga rapporter gör den särskilt stark för byråspåret.",
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
                Vidat
              </p>
              <p className="text-xs text-muted-foreground">
                Performance monitoring for teams
              </p>
            </div>
            </Link>

            <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
              <a href="#features" className="transition-colors hover:text-foreground">
                Funktioner
              </a>
              <a href="#complete-saas" className="transition-colors hover:text-foreground">
                Komplett SaaS
              </a>
              <a href="#pricing" className="transition-colors hover:text-foreground">
                Priser
              </a>
              <Link href="/docs" className="transition-colors hover:text-foreground">
                Docs
              </Link>
            </nav>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:justify-end">
              <nav className="flex flex-wrap gap-2 text-xs text-muted-foreground lg:hidden">
                <a
                  href="#features"
                  className="rounded-full border border-border/80 px-3 py-1.5 transition-colors hover:text-foreground"
                >
                  Funktioner
                </a>
                <a
                  href="#complete-saas"
                  className="rounded-full border border-border/80 px-3 py-1.5 transition-colors hover:text-foreground"
                >
                  SaaS
                </a>
                <a
                  href="#pricing"
                  className="rounded-full border border-border/80 px-3 py-1.5 transition-colors hover:text-foreground"
                >
                  Priser
                </a>
                <Link
                  href="/docs"
                  className="rounded-full border border-border/80 px-3 py-1.5 transition-colors hover:text-foreground"
                >
                  Docs
                </Link>
              </nav>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/sign-in"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
                >
                  Logga in
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-chart-1 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  Starta gratis
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
              Upptäck regressionsproblem innan kunden gör det
            </div>

            <div className="space-y-6">
              <h1 className="font-serif text-4xl leading-none tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                Gör prestanda till en produkt, inte en eftertanke.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                Vidat hjälper team att övervaka Lighthouse, förstå förändringar
                över tid och agera direkt när en release försämrar upplevelsen.
                Tjänsten har redan kärnan för en modern SaaS, men några avgörande
                lager återstår för att den ska bli kommersiellt komplett.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                Skapa konto
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted/70"
              >
                Se SaaS-inställningar
              </Link>
            </div>

            <div className="grid gap-4 border-t border-border/80 pt-8 sm:grid-cols-3">
              <div>
                <p className="text-2xl font-semibold tracking-tight sm:text-3xl">24/7</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Monitorering av sajter, rapporter och score-förändringar.
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight sm:text-3xl">4</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Planer från gratisnivå till enterprise-stöd.
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight sm:text-3xl">1 plats</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  För dashboard, rapporter, webhooks och account controls.
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
                    Live Overview
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                    Deploy health
                  </h3>
                </div>
                <span className="rounded-full bg-chart-1/15 px-3 py-1 text-xs font-semibold text-chart-1">
                  Pro workspace
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
                      <p className="text-sm font-semibold">Regression upptäckt</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        LCP har försämrats med 380 ms efter senaste deploy på
                        mobil. Analytics-bundeln har vuxit markant.
                      </p>
                    </div>
                    <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                      Alert
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-chart-1">
                    AI rekommendation
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Bryt ut tredjepartsskript från kritisk rendering, fördröj
                    tag manager på mobil och kontrollera senaste deploy för nya
                    bildblock ovanför folden.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Integrations
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      Slack, webhooks, e-post
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Billing status
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      Portal + upgrade paths redo
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
                key={pillar.title}
                className="rounded-[1.75rem] border border-border/80 bg-card/70 p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-chart-1/12 text-chart-1">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {pillar.description}
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
            eyebrow="Funktioner"
            title="Landningssidan ska sälja ett arbetsflöde, inte bara features."
            description="Det här upplägget gör tydligare vad produkten faktiskt löser: övervakning, rapportering och driftkoppling i samma verktyg."
          />

          <div className="space-y-4">
            {featureRows.map((row) => (
              <article
                key={row.title}
                className="rounded-[1.75rem] border border-border/80 bg-card/85 p-6 md:p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-chart-1">
                  {row.eyebrow}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                  {row.title}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {row.description}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {row.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="rounded-2xl border border-border/80 bg-background/80 p-4 text-sm leading-6 text-muted-foreground"
                    >
                      {bullet}
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
            eyebrow="Komplett SaaS"
            title="Det här bör du lägga till för att tjänsten ska kännas färdig på riktigt."
            description="Produkten har en stark kärna, men en kommersiell SaaS behöver även de delar som användaren bara märker när de saknas."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {completeSaasItems.map((item) => {
              const Icon = item.icon
              return (
                <article
                  key={item.title}
                  className="rounded-[1.75rem] border border-border/80 bg-background/85 p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="grid gap-10 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Trust Layer"
            title="Många SaaS-produkter tappar affären här."
            description="Säkerhet, support och transparens bör synas redan på startsidan om du vill att större kunder ska ta produkten på allvar."
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <TrustCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Säker drift"
              description="Webhook-secrets, rollback-rutiner, felhantering och kontrollerad retention."
            />
            <TrustCard
              icon={<FileText className="h-5 w-5" />}
              title="Tydliga policies"
              description="Privacy, terms, billingflöden och planregler som går att förstå innan köp."
            />
            <TrustCard
              icon={<BellRing className="h-5 w-5" />}
              title="Aktiv kommunikation"
              description="Status, supportvägar och notiser som gör att kunden känner sig trygg efter signup."
            />
          </div>
        </section>

        <section id="pricing" className="py-6">
          <SectionHeading
            eyebrow="Priser"
            title="Prisstrukturen finns redan. Nu säljer den också bättre."
            description="Planerna nedan är justerade för att spegla det som finns i kodbasens entitlements och ge tydligare uppgraderingslogik."
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
                      Rekommenderad
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
            eyebrow="FAQ"
            title="Korta svar på det viktigaste du behöver besluta nu."
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
                Nästa steg
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
                Vill du, kan jag ta nästa steg och bygga de saknade SaaS-delarna
                också.
              </h2>
              <p className="mt-4 text-sm leading-7 text-background/72 md:text-base">
                Rimlig ordning i den här kodbasen är billing checkout, team och
                roller, onboardingflöde samt verklig notifieringsleverans.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-2 rounded-full bg-chart-1 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Öppna settings
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-white/8"
              >
                Kontakta oss
              </Link>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-5 border-t border-border/80 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold uppercase tracking-[0.24em] text-foreground">
              Vidat
            </p>
            <p className="mt-1">
              Byggd för team som vill upptäcka prestandaproblem tidigt.
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/docs" className="transition-colors hover:text-foreground">
              Docs
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">
              Contact
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
