"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    const controller = new AbortController()

    void fetch("/api/client-errors" as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: error.name,
        message: error.message,
        digest: error.digest,
        stack: error.stack,
        pathname:
          typeof window !== "undefined" ? window.location.pathname : undefined,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      }),
      signal: controller.signal,
    }).catch(() => {})

    return () => {
      controller.abort()
    }
  }, [error])

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 px-6">
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Unexpected error
          </p>
          <h1 className="text-3xl font-semibold">Something broke.</h1>
          <p className="max-w-prose text-sm text-muted-foreground">
            The error was recorded. Retry once, and if it happens again, treat
            it as a real bug.
          </p>
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            onClick={() => reset()}
            type="button"
          >
            Retry
          </button>
        </main>
      </body>
    </html>
  )
}
