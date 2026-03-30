import { defineConfig } from "next-i18next/proxy"

const i18nConfig = defineConfig({
  supportedLngs: ["sv", "en"],
  fallbackLng: "sv",
  defaultNS: "common",
  ns: ["common"],
  localeInPath: false,
  resourceLoader: (language, namespace) =>
    import(`./app/i18n/locales/${language}/${namespace}.json`),
  i18nextOptions: {
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      prefix: "{",
      suffix: "}",
    },
    returnNull: false,
  },
})

export default i18nConfig
