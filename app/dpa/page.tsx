import { getT } from "next-i18next/server"
import { TrustPage } from "@/components/trust-page"
import { trustPageContent } from "@/lib/trust-content"
import { createPageMetadata, getMetadataLocale } from "@/lib/metadata"

export async function generateMetadata() {
  const locale = await getMetadataLocale()
  const content = trustPageContent.dpa[locale]

  return createPageMetadata({
    title: content.title,
    description: content.intro,
    path: "/dpa",
  })
}

export default async function DpaPage() {
  const { i18n } = await getT("common")
  const locale = i18n.resolvedLanguage === "en" ? "en" : "sv"

  return <TrustPage content={trustPageContent.dpa[locale]} />
}
