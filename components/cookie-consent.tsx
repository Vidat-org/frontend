"use client"

import { CookieIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const copy = {
  title: "Vi använder cookies",
  description:
    "Vi använder cookies för att webbplatsen ska fungera korrekt och för att förbättra upplevelsen. Läs mer i vår cookiepolicy.",
  consentPrefix: "Genom att klicka på ",
  consentSuffix: " samtycker du till användningen av cookies.",
  learnMore: "Läs mer",
  accept: "Godkänn",
  decline: "Avböj",
  notice: "Cookieinformation",
  minimal: "Vi använder cookies för att förbättra din upplevelse.",
}

export function CookieConsent({
  variant = "default",
  mode = false,
  onAcceptCallback = () => {},
  onDeclineCallback = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [hide, setHide] = useState(false)

  const accept = () => {
    setIsOpen(false)
    document.cookie =
      "cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT"
    setTimeout(() => {
      setHide(true)
    }, 700)
    onAcceptCallback()
  }

  const decline = () => {
    setIsOpen(false)
    setTimeout(() => {
      setHide(true)
    }, 700)
    onDeclineCallback()
  }

  useEffect(() => {
    try {
      if (document.cookie.includes("cookieConsent=true")) {
        if (!mode) {
          setTimeout(() => setHide(true), 700)
        } else {
          setTimeout(() => setIsOpen(true), 0)
        }
      } else {
        setTimeout(() => setIsOpen(true), 0)
      }
    } catch (error) {
      console.error("Error checking cookie consent:", error)
    }
  }, [mode])

  return variant === "default" ? (
    <div
      className={cn(
        "fixed right-0 bottom-0 left-0 z-200 w-full p-4 duration-700 sm:bottom-4 sm:left-4 sm:max-w-md sm:p-0",
        !isOpen
          ? "translate-y-8 opacity-0 transition-[opacity,transform]"
          : "translate-y-0 opacity-100 transition-[opacity,transform]",
        hide && "hidden"
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
              {copy.description}
              <br />
              <br />
              <span className="text-xs">
                {copy.consentPrefix}
                <span className="font-medium text-black dark:text-white">
                  {copy.accept}
                </span>
                {copy.consentSuffix}
              </span>
              <br />
              <a href="/cookies" className="text-xs underline">
                {copy.learnMore}
              </a>
            </p>
          </div>
          <div className="grid grid-cols-2 items-center gap-2 border-t border-border p-3 sm:p-4 sm:py-5 dark:bg-background/20">
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
  ) : variant === "small" ? (
    <div
      className={cn(
        "fixed right-0 bottom-0 left-0 z-200 w-full p-4 duration-700 sm:bottom-4 sm:left-4 sm:max-w-md sm:p-0",
        !isOpen
          ? "translate-y-8 opacity-0 transition-[opacity,transform]"
          : "translate-y-0 opacity-100 transition-[opacity,transform]",
        hide && "hidden"
      )}
    >
      <div className="m-0 rounded-lg border border-border bg-background shadow-lg sm:m-3 dark:bg-card">
        <div className="flex items-center justify-between p-3">
          <h1 className="text-base font-medium sm:text-lg">{copy.title}</h1>
          <CookieIcon className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]" />
        </div>
        <div className="-mt-2 p-3">
          <p className="text-left text-xs text-muted-foreground sm:text-sm">
            {copy.description}
          </p>
        </div>
        <div className="mt-2 grid grid-cols-2 items-center gap-2 border-t p-3">
          <Button onClick={accept} className="w-full">
            {copy.accept}
          </Button>
          <Button onClick={decline} className="w-full" variant="outline">
            {copy.decline}
          </Button>
        </div>
      </div>
    </div>
  ) : (
    variant === "minimal" && (
      <div
        className={cn(
          "fixed right-0 bottom-0 left-0 z-200 w-full p-4 duration-700 sm:bottom-4 sm:left-4 sm:max-w-75 sm:p-0",
          !isOpen
            ? "translate-y-8 opacity-0 transition-[opacity,transform]"
            : "translate-y-0 opacity-100 transition-[opacity,transform]",
          hide && "hidden"
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
              {copy.minimal}
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
    )
  )
}
