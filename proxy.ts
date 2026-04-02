import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { createProxy } from "next-i18next/proxy"
import i18nConfig from "@/i18n.config"

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])
const i18nProxy = createProxy(i18nConfig)

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  return i18nProxy(req)
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|rpc)(.*)",
  ],
}
