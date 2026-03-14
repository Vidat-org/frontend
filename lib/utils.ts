import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

export function planToWebsiteCount(plan: string) {
  switch (plan) {
    case "free_user":
      return 1
    case "starter":
      return 5
    case "pro":
      return 25
    default:
      return 1
  }
}
