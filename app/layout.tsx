import "../lib/orpc.server"
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { svSE, enGB } from "@clerk/localizations"
import Providers from "./providers"
import { Toaster } from "@/components/ui/sonner"
import { shadcn } from "@clerk/themes"

import { I18nProvider } from "next-i18next/client"
import {
  generateI18nStaticParams,
  getResources,
  getT,
  initServerI18next,
} from "next-i18next/server"
import i18nConfig from "@/i18n.config"
import { getCurrentWorkspaceLocale } from "@/lib/workspace-locale"
import { useTranslation } from "react-i18next"
import { DEFAULT_LOCALE } from "@/lib/i18n"

initServerI18next(i18nConfig)

export async function generateStaticParams() {
  return generateI18nStaticParams()
}

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getCurrentWorkspaceLocale().catch((e) => {
    console.log("locale fallback:", e)
    return DEFAULT_LOCALE
  })
  const { i18n } = await getT("common", { lng: locale })
  const resources = getResources(i18n, ["common"])
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      // className={cn(
      //   "antialiased",
      //   fontSans.variable,
      //   "font-mono",
      //   jetbrainsMono.variable
      // )}
    >
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        <ClerkProvider
          localization={locale === "sv" ? svSE : enGB}
          appearance={{
            baseTheme: shadcn,
          }}
        >
          <I18nProvider
            language={locale}
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
              </ThemeProvider>
            </Providers>
          </I18nProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
