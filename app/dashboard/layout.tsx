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
import { getCurrentWorkspaceLocale } from "@/lib/workspace-locale"
import { I18nProvider } from "next-i18next/client"
import {
  getResources,
  getT,
  initServerI18next,
} from "next-i18next/server"
import i18nConfig from "@/i18n.config"

initServerI18next(i18nConfig)

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

  const locale = await getCurrentWorkspaceLocale()
  const { i18n } = await getT("common", { lng: locale })
  const resources = getResources(i18n, ["common"])

  return (
    <I18nProvider
      language={locale}
      resources={resources}
      defaultNS="common"
      supportedLngs={i18nConfig.supportedLngs}
      fallbackLng={i18nConfig.fallbackLng}
      i18nextOptions={i18nConfig.i18nextOptions}
    >
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
    </I18nProvider>
  )
}
