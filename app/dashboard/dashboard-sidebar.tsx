"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import {
  FileChartColumn,
  LucideIcon,
  PanelsTopLeft,
  Settings,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type NavItem = {
  title: string
  url: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { title: "Mina sajter", url: "/dashboard", icon: PanelsTopLeft },
  { title: "Rapporter", url: "/dashboard/reports", icon: FileChartColumn },
  { title: "Inställningar", url: "/dashboard/settings", icon: Settings },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  const { state } = useSidebar()

  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true

    const saved = localStorage.getItem("sidebar_open")
    return saved === null ? true : saved === "true"
  })

  useEffect(() => {
    localStorage.setItem("sidebar_open", JSON.stringify(open))
  }, [open])

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Zap className="size-4" />
                </div>
                {state === "expanded" && (
                  <span className="text-base font-bold tracking-tight">
                    VIDAT
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.url === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.url)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserButton
          appearance={{
            elements: {},
          }}
          showName={state === "expanded"}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
