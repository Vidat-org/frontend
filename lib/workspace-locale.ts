import "../lib/orpc.server"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import { cookies } from "next/headers"

export async function getCurrentWorkspaceLocale(): Promise<Locale> {
  try {
    const client = globalThis.$client
    if (!client) {
      throw new Error("missing client")
    }

    const account = await client.getAccountSummary()
    return account.workspace.preferredLocale ?? DEFAULT_LOCALE
  } catch {
    const cookieStore = await cookies()
    const cookieLocale = cookieStore.get("i18next")?.value
    if (cookieLocale === "sv" || cookieLocale === "en") {
      return cookieLocale
    }

    return DEFAULT_LOCALE
  }
}
