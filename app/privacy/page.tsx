import { getT } from "next-i18next/server"
import { TrustPage } from "@/components/trust-page"
import { trustPageContent } from "@/lib/trust-content"

export default async function Page() {
  const { i18n } = await getT("common")
  const locale = i18n.resolvedLanguage === "en" ? "en" : "sv"

  return <TrustPage content={trustPageContent.privacy[locale]} />
}
