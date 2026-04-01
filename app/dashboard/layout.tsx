import NoOrganizationState from "@/components/no-organization-state"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
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
    return <NoOrganizationState />
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
