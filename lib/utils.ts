import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DEFAULT_LOCALE, type Locale } from "./i18n"
export { planToWebsiteCount } from "./plans"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  date: string | Date,
  locale: Locale = DEFAULT_LOCALE
) {
  return new Date(date).toLocaleString(locale === "en" ? "en-US" : "sv-SE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}
