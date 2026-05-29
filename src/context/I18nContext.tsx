"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Locale, translations, UIStrings, LANGUAGES } from "@/data/i18n";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: UIStrings;
  lang: typeof LANGUAGES[number];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  }, []);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: translations[locale],
    lang: LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0],
  }), [locale, setLocale]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
