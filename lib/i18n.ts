// import { createInstance, type Resource } from "i18next"
// import { initReactI18next } from "react-i18next"
// export { useTranslation } from "react-i18next"

// export type Locale = "sv" | "en"

// type Dictionary = Record<string, string>

// export const dictionaries: Record<Locale, Dictionary> = {
//   sv: {},
//   en: {},
// }

export const DEFAULT_LOCALE: Locale =
  (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale | undefined) ?? "sv"

// const resources = Object.fromEntries(
//   Object.entries(dictionaries).map(([locale, translation]) => [
//     locale,
//     { translation },
//   ])
// ) as Resource

// export const i18n = createInstance()

// void i18n.use(initReactI18next).init({
//   resources,
//   lng: DEFAULT_LOCALE,
//   fallbackLng: DEFAULT_LOCALE,
//   supportedLngs: Object.keys(dictionaries),
//   defaultNS: "translation",
//   ns: ["translation"],
//   keySeparator: false,
//   interpolation: {
//     escapeValue: false,
//     prefix: "{",
//     suffix: "}",
//   },
//   initAsync: false,
//   returnNull: false,
// })

// export function t(
//   key: string,
//   params?: Record<string, string | number>,
//   locale: Locale = DEFAULT_LOCALE
// ) {
//   return i18n.getFixedT(locale, "translation")(key, params)
// }

// export function registerTranslations(locale: Locale, entries: Dictionary) {
//   dictionaries[locale] = {
//     ...dictionaries[locale],
//     ...entries,
//   }

//   Object.entries(entries).forEach(([key, value]) => {
//     i18n.addResource(locale, "translation", key, value)
//   })
// }

// export function setLocale(locale: Locale) {
//   void i18n.changeLanguage(locale)

//   if (typeof document !== "undefined") {
//     document.cookie = `i18next=${locale}; path=/; max-age=31536000; samesite=lax`
//   }
// }

import { createInstance, type Resource } from "i18next"

export type Locale = "sv" | "en"

export async function createI18n(resources: Resource, locale: Locale) {
  const i18n = createInstance()

  await i18n.init({
    lng: locale,
    fallbackLng: "en",
    resources,
  })

  return i18n
}
