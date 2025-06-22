export type Locale = "vi" | "en" | "cn"

export const locales: Locale[] = ["vi", "en", "cn"]

export const defaultLocale: Locale = "vi"

export const localeNames = {
  vi: "Tiếng Việt",
  en: "English",
  cn: "中文",
}

export const localeFlags = {
  vi: "🇻🇳",
  en: "🇺🇸",
  cn: "🇨🇳",
}

// For server components
export function getTranslations(locale: Locale = defaultLocale) {
  const { translations } = require('./translations')
  return translations[locale]
}
