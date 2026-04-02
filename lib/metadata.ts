import type { Metadata } from "next"
import { getT } from "next-i18next/server"
import { getCurrentWorkspaceLocale } from "@/lib/workspace-locale"
import type { Locale } from "@/lib/i18n"

const SITE_NAME = "Vidat"
const DEFAULT_DESCRIPTION =
  "Vidat helps teams monitor website performance, SEO, reports, and release quality from one place."
const FALLBACK_SITE_URL = "https://vidat.app"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  FALLBACK_SITE_URL

function buildAbsoluteTitle(title?: string) {
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME
}

export async function getMetadataLocale(): Promise<Locale> {
  return await getCurrentWorkspaceLocale()
}

export async function getMetadataT() {
  const locale = await getMetadataLocale()
  return await getT("common", { lng: locale })
}

export async function getSiteMetadata(): Promise<Metadata> {
  const { t } = await getMetadataT()
  const description = t("home.hero.description", {
    defaultValue: DEFAULT_DESCRIPTION,
  })

  return {
    metadataBase: new URL(siteUrl),
    applicationName: SITE_NAME,
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: SITE_NAME,
      description,
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description,
    },
  }
}

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title?: string
  description: string
  path: string
  noIndex?: boolean
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: buildAbsoluteTitle(title),
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: buildAbsoluteTitle(title),
      description,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  }
}
