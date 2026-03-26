"use client"

import { getQueryClient } from "@/lib/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import type * as React from "react"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <TooltipProvider>{children}</TooltipProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  )
}
