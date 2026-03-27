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
  useSidebar,
} from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import {
  BadgeDollarSign,
  FileChartColumn,
  History,
  KeyRound,
  LifeBuoy,
  type LucideIcon,
  PanelsTopLeft,
  Settings,
  Users,
  Webhook,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { t } from "@/lib/i18n"

type NavItem = {
  title: string
  url: string
  icon: LucideIcon
}

const productNav: NavItem[] = [
  { title: t("sidebar.mySites"), url: "/dashboard", icon: PanelsTopLeft },
  { title: t("sidebar.reports"), url: "/dashboard/reports", icon: FileChartColumn },
]

const settingsNav: NavItem[] = [
  { title: t("sidebar.settings"), url: "/dashboard/settings", icon: Settings },
  { title: t("sidebar.billing"), url: "/dashboard/settings/billing", icon: BadgeDollarSign },
  { title: t("sidebar.team"), url: "/dashboard/settings/team", icon: Users },
  { title: t("sidebar.integrations"), url: "/dashboard/settings/integrations", icon: Webhook },
  { title: t("sidebar.api"), url: "/dashboard/settings/api", icon: KeyRound },
  { title: t("sidebar.support"), url: "/dashboard/settings/support", icon: LifeBuoy },
  { title: t("sidebar.logs"), url: "/dashboard/settings/logs", icon: History },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

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
                  <span className="text-base font-bold tracking-tight">VIDAT</span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavSection title={t("sidebar.product")} items={productNav} pathname={pathname} />
        <NavSection title={t("sidebar.settingsSection")} items={settingsNav} pathname={pathname} />
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

function NavSection({
  title,
  items,
  pathname,
}: {
  title: string
  items: NavItem[]
  pathname: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              item.url === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.url)

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
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
  )
}
