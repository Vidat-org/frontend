import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export { planToWebsiteCount } from "./plans"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return date.toLocaleString("sv-SE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}
