import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrganizationList } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import React from "react"
import DashboardSidebar from "./dashboard-sidebar"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, orgId } = await auth()

  if (!isAuthenticated) {
    redirect("/sign-in")
  }

  if (!orgId) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-12">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Välj eller skapa en organization</CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationList
              hidePersonal
              skipInvitationScreen
              afterCreateOrganizationUrl="/dashboard"
              afterSelectOrganizationUrl="/dashboard"
            />
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
        </header>

        <main className="min-w-0 flex-1 px-4 pt-4 pb-12 sm:px-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
