import Navbar from "@/components/navbar"
import React from "react"
import DashboardSidebar from "./dashboard-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
        </header>
        <main className="px-6 pt-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
