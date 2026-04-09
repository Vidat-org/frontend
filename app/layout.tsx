import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { ClerkProvider } from "@clerk/nextjs"
import { shadcn } from "@clerk/themes"
import { Geist_Mono, JetBrains_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"
import Providers from "./providers"

import i18nConfig from "@/i18n.config"
import { swedishLng } from "@/lib/languages"
import { getSiteMetadata } from "@/lib/metadata"
import type { Metadata } from "next"
import { I18nProvider } from "next-i18next/client"
import {
  generateI18nStaticParams,
  getResources,
  getT,
  initServerI18next,
} from "next-i18next/server"
import Head from "next/head"
import { CookieConsent } from "@/components/cookie-consent"

initServerI18next(i18nConfig)

export async function generateMetadata(): Promise<Metadata> {
  return await getSiteMetadata()
}

export async function generateStaticParams() {
  return generateI18nStaticParams()
}

const fontSans = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist",
})

const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = "sv"
  const { i18n } = await getT("common", { lng: locale })
  const resources = getResources(i18n, ["common"])
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
    >
      <Head>
        <link rel="apple-touch-icon" href="/apple-icon.png" type="image/" />
      </Head>
      <body>
        <ClerkProvider
          // localization={locale === "sv" ? svSE : enGB}
          localization={swedishLng}
          appearance={{
            theme: shadcn,
            elements: {
              organizationSwitcherPopoverRootBox: {
                width: "100%",
                pointerEvents: "auto",
              },
              userButtonPopoverRootBox: {
                width: "100%",
                pointerEvents: "auto",
              },
            },
          }}
        >
          <I18nProvider
            language={"sv"}
            resources={resources}
            defaultNS="common"
            supportedLngs={i18nConfig.supportedLngs}
            fallbackLng={i18nConfig.fallbackLng}
            i18nextOptions={i18nConfig.i18nextOptions}
          >
            <Providers>
              <ThemeProvider>
                {/*<Navbar />*/}
                {/*<main className="container mx-auto min-h-screen px-8 pt-16">*/}
                {children}
                {/*</main>*/}
                <Toaster richColors />
                <CookieConsent variant="small" />
              </ThemeProvider>
            </Providers>
          </I18nProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
