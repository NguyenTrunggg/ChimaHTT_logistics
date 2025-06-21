"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Locale, defaultLocale } from "@/lib/i18n"
import { translations, type TranslationKey } from "@/lib/translations"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && ["vi", "en", "cn"].includes(savedLocale)) {
      setLocale(savedLocale)
    }
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || translations[defaultLocale][key] || key
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
