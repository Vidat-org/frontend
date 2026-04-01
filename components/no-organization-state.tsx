"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrganizationList, SignOutButton } from "@clerk/nextjs"
import { Building2, LogOut, Sparkles } from "lucide-react"

export default function NoOrganizationState() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-primary/15 bg-gradient-to-br from-primary/8 via-background to-background">
          <CardHeader className="space-y-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Kom igang
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl tracking-tight">
                Skapa eller välj en organisation for att fortsätta
              </CardTitle>
              <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                Forst skapar du en organisation for ditt team eller valjer en
                befintlig. Nar det ar klart kommer du direkt in i dashboarden.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoTile
                icon={<Building2 className="h-4 w-4" />}
                title="1. Skapa organisation"
                text="Ge workspacet ett namn som teamet kanner igen."
              />
              <InfoTile
                icon={<Sparkles className="h-4 w-4" />}
                title="2. Oppna dashboarden"
                text="Lagg till forsta webbplatsen och starta onboarding."
              />
              <InfoTile
                icon={<LogOut className="h-4 w-4" />}
                title="Fel konto?"
                text="Logga ut om du vill skapa konto eller byta anvandare."
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <SignOutButton>
                <Button variant="outline">
                  <LogOut className="h-4 w-4" />
                  Logga ut
                </Button>
              </SignOutButton>
            </div>
          </CardContent>
        </Card>

        <div className="w-full space-y-4 bg-background">
          <CardTitle>Välj eller skapa organisation</CardTitle>

          <OrganizationList
            hidePersonal
            skipInvitationScreen
            appearance={{
              variables: {
                colorShadow: "transparent",
              },
            }}
            afterCreateOrganizationUrl="/dashboard"
            afterSelectOrganizationUrl="/dashboard"
          />
        </div>
      </div>
    </main>
  )
}

function InfoTile({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-xl border bg-background/80 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
