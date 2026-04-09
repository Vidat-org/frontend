import Link from "next/link"
import {
  ChevronRight,
  FileText,
  House,
  LifeBuoy,
  Lock,
  Rocket,
} from "lucide-react"
import { ThemeLogo } from "@/components/theme-logo"

export default function NotFound() {
  const quickLinks = [
    {
      href: "/",
      icon: House,
      title: "Startsidan",
      description: "Tillbaka till översikten över produkten.",
    },
    {
      href: "/docs",
      icon: FileText,
      title: "Dokumentation",
      description: "Läs mer om hur Vidat fungerar och vad som ingår.",
    },
    {
      href: "/trust",
      icon: Lock,
      title: "Trustcenter",
      description: "Integritet, villkor, säkerhet och andra förtroendesidor.",
    },
    {
      href: "/contact",
      icon: LifeBuoy,
      title: "Kontakt",
      description: "Hör av dig om du letade efter något specifikt.",
    },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-120 bg-[radial-gradient(circle_at_top_left,_oklch(from_var(--chart-1)_l_c_h_/_0.14),_transparent_45%),radial-gradient(circle_at_top_right,_oklch(from_var(--chart-2)_l_c_h_/_0.12),_transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_0,transparent_calc(100%-1px),rgba(120,113,108,0.08)_calc(100%-1px)),linear-gradient(to_bottom,transparent_0,transparent_calc(100%-1px),rgba(120,113,108,0.08)_calc(100%-1px))] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.35),transparent_88%)] bg-[size:60px_60px] md:bg-[size:80px_80px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-10">
        <header className="flex items-center justify-between rounded-2xl border border-border/80 bg-background/88 px-4 py-3 backdrop-blur">
          <Link href="/" className="flex items-center gap-3">
            <ThemeLogo className="h-8 w-auto shrink-0 md:h-9" />
            <div className="hidden sm:block">
              <p className="text-xs font-bold tracking-[0.24em] text-foreground uppercase">
                Vidat
              </p>
              <p className="text-[10px] text-muted-foreground">
                Övervakning för team som äger webbens resultat
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/70"
          >
            Till startsidan
          </Link>
        </header>

        <section className="flex flex-1 items-center py-10 sm:py-14">
          <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-chart-1/20 bg-chart-1/10 px-3 py-2 text-[11px] font-semibold tracking-[0.2em] text-chart-1 uppercase">
                404 • Sidan finns inte
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl font-serif text-5xl leading-none tracking-tight sm:text-6xl md:text-7xl">
                  Länken leder ingenstans.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base md:text-lg md:leading-8">
                  Sidan du försökte nå finns inte längre, har flyttats eller så
                  blev adressen fel. Gå tillbaka till startsidan eller välj en
                  väg härifrån.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 active:scale-95"
                >
                  Gå till startsidan
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted/70"
                >
                  Starta workspace
                  <Rocket className="h-4 w-4 shrink-0" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted/70"
                >
                  Kontakta oss
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    title: "Ville du läsa mer?",
                    description:
                      "Gå till dokumentationen för att se hur produkten fungerar.",
                  },
                  {
                    title: "Letade du efter trust-sidor?",
                    description:
                      "Integritet, villkor och säkerhet finns samlat i trustcenter.",
                  },
                  {
                    title: "Skulle du logga in?",
                    description:
                      "Du kan gå direkt till inloggning och fortsätta därifrån.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border/70 bg-card/60 p-4"
                  >
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border/80 bg-card/80 p-5 shadow-xl sm:p-7">
              <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-6">
                <p className="text-[10px] font-bold tracking-[0.28em] text-muted-foreground uppercase">
                  Snabbt tillbaka
                </p>
                <div className="mt-5 space-y-3">
                  {quickLinks.map((item) => {
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card/70 p-4 transition-colors hover:bg-muted/40"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-chart-1/12 text-chart-1">
                          <Icon className="h-5 w-5 shrink-0" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <ChevronRight className="mt-0.5 ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                      </Link>
                    )
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-chart-1/20 bg-chart-1/8 p-4">
                  <p className="text-[10px] font-bold tracking-[0.24em] text-chart-1 uppercase">
                    Vanliga vägar
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    {[
                      { href: "/docs", label: "Docs" },
                      { href: "/trust", label: "Trustcenter" },
                      { href: "/privacy", label: "Integritet" },
                      { href: "/contact", label: "Kontakt" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-full border border-border/70 bg-background/80 px-3 py-2 transition-colors hover:bg-muted/70"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
