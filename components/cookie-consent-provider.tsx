"use client"

import * as React from "react"
import {
  clearNonEssentialStorage,
  emitCookieConsentChanged,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentStatus,
} from "@/lib/cookie-consent"

type CookieConsentContextValue = {
  status: CookieConsentStatus
  isReady: boolean
  setStatus: (status: Exclude<CookieConsentStatus, "unknown">) => void
}

const CookieConsentContext =
  React.createContext<CookieConsentContextValue | null>(null)

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [status, setStatus] = React.useState<CookieConsentStatus>("unknown")
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    const nextStatus = readCookieConsent()

    if (nextStatus !== "accepted") {
      clearNonEssentialStorage()
    }

    setStatus(nextStatus)
    setIsReady(true)
  }, [])

  function updateStatus(nextStatus: Exclude<CookieConsentStatus, "unknown">) {
    writeCookieConsent(nextStatus)

    if (nextStatus === "rejected") {
      clearNonEssentialStorage()
    }

    setStatus(nextStatus)
    emitCookieConsentChanged(nextStatus)
  }

  return (
    <CookieConsentContext.Provider
      value={{
        status,
        isReady,
        setStatus: updateStatus,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = React.useContext(CookieConsentContext)

  if (!context) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider."
    )
  }

  return context
}
