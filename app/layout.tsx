import "../lib/orpc.server"
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import { svSE } from "@clerk/localizations"
import Navbar from "@/components/navbar"
import Providers from "./providers"
import { Toaster } from "@/components/ui/sonner"
import { shadcn } from "@clerk/themes"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "sv") as string
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
          localization={svSE}
          appearance={{
            baseTheme: shadcn,
          }}
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
        </ClerkProvider>
      </body>
    </html>
  )
}
