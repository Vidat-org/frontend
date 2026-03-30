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
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    redirect("/sign-in")
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
        </header>
        <main className="px-4 pt-4 pb-12 sm:px-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
