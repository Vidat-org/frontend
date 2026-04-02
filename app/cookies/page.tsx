import { getT } from "next-i18next/server"
import { TrustPage } from "@/components/trust-page"
import { trustPageContent } from "@/lib/trust-content"
import { createPageMetadata, getMetadataLocale } from "@/lib/metadata"

export async function generateMetadata() {
  const locale = await getMetadataLocale()
  const content = trustPageContent.cookies[locale]

  return createPageMetadata({
    title: content.title,
    description: content.intro,
    path: "/cookies",
  })
}

export default async function CookiesPage() {
  const { i18n } = await getT("common")
  const locale = i18n.resolvedLanguage === "en" ? "en" : "sv"

  return <TrustPage content={trustPageContent.cookies[locale]} />
}
