"use client"

import { useState } from "react"
import { CookieIcon } from "lucide-react"
import { useCookieConsent } from "@/components/cookie-consent-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const copy = {
  title: "Vi använder cookies",
  description:
    "Vi använder nödvändiga cookies för att webbplatsen ska fungera. Valfria cookies för preferenser används bara om du godkänner det.",
  accepted:
    "Du har godkänt valfria cookies. Du kan ändra ditt val när som helst.",
  rejected:
    "Du har tackat nej till valfria cookies. Bara nödvändiga cookies används.",
  learnMore: "Läs mer",
  accept: "Godkänn",
  decline: "Avböj",
  notice: "Cookieinformation",
  minimal: "Vi använder bara nödvändiga cookies tills du gör ett val.",
  manage: "Cookieinställningar",
}

export function CookieConsent({
  variant = "default",
  onAcceptCallback = () => {},
  onDeclineCallback = () => {},
}: {
  variant?: "default" | "small" | "minimal"
  onAcceptCallback?: () => void
  onDeclineCallback?: () => void
}) {
  const { isReady, setStatus, status } = useCookieConsent()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const isOpen = isReady && (status === "unknown" || isSettingsOpen)

  function accept() {
    setStatus("accepted")
    setIsSettingsOpen(false)
    onAcceptCallback()
  }

  function decline() {
    setStatus("rejected")
    setIsSettingsOpen(false)
    onDeclineCallback()
  }

  if (!isReady) {
    return null
  }

  const statusMessage =
    status === "accepted"
      ? copy.accepted
      : status === "rejected"
        ? copy.rejected
        : variant === "minimal"
          ? copy.minimal
          : copy.description

  const manageButton =
    status !== "unknown" && !isOpen ? (
      <Button
        type="button"
        variant="outline"
        className="fixed right-4 bottom-4 z-200 h-10 rounded-full border-border bg-background/95 shadow-lg backdrop-blur sm:right-6 sm:bottom-6 dark:bg-background/95"
        onClick={() => setIsSettingsOpen(true)}
      >
        {/* <CookieIcon className="mr-2 h-4 w-4" /> */}
        <CookieIcon className="h-4 w-4" />
        {/* {copy.manage} */}
      </Button>
    ) : null

  const panel = (
    <div
      className={cn(
        "fixed right-0 bottom-0 left-0 z-200 w-full p-4 duration-200 sm:left-4 sm:max-w-md sm:p-0",
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      )}
    >
      <div className="rounded-lg border border-border bg-background shadow-lg sm:rounded-md dark:bg-card">
        <div className="grid gap-2">
          <div className="flex h-12 items-center justify-between border-b border-border p-3 sm:h-14 sm:p-4">
            <h1 className="text-base font-medium sm:text-lg">{copy.title}</h1>
            <CookieIcon className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]" />
          </div>
          <div className="p-3 sm:p-4">
            <p className="text-start text-xs font-normal text-muted-foreground sm:text-sm">
              {statusMessage}
            </p>
            <a href="/cookies" className="mt-3 inline-flex text-xs underline">
              {copy.learnMore}
            </a>
          </div>
          <div className="grid grid-cols-2 items-center gap-2 border-t border-border p-3 sm:p-4 dark:bg-background/20">
            <Button onClick={accept} variant="default" className="w-full">
              {copy.accept}
            </Button>
            <Button onClick={decline} variant="outline" className="w-full">
              {copy.decline}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  if (variant === "minimal") {
    return (
      <>
        {manageButton}
        {isOpen ? (
          <div
            className={cn(
              "fixed right-0 bottom-0 left-0 z-200 w-full p-4 duration-200 sm:left-4 sm:max-w-75 sm:p-0",
              isOpen
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-6 opacity-0"
            )}
          >
            <div className="m-0 rounded-lg border border-border bg-background shadow-lg sm:m-3 dark:bg-card">
              <div className="flex items-center justify-between border-b border-border p-3">
                <div className="flex items-center gap-2">
                  <CookieIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs font-medium sm:text-sm">
                    {copy.notice}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[11px] text-muted-foreground sm:text-xs">
                  {statusMessage}
                </p>
                <div className="mt-3 grid grid-cols-2 items-center gap-2">
                  <Button onClick={accept} variant="default" className="w-full">
                    {copy.accept}
                  </Button>
                  <Button onClick={decline} variant="ghost" className="w-full">
                    {copy.decline}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>
    )
  }

  return (
    <>
      {manageButton}
      {(variant === "default" || variant === "small") && panel}
    </>
  )
}
