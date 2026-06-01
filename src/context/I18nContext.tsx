"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, DEFAULT_LOCALE, UIStrings, translations, LANGUAGES } from "@/data/i18n";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: UIStrings;
  lang: typeof LANGUAGES[0];
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: translations[DEFAULT_LOCALE],
  lang: LANGUAGES[0],
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Persist language preference
  useEffect(() => {
    const saved = localStorage.getItem("hh-locale") as Locale | null;
    if (saved && translations[saved]) setLocaleState(saved);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("hh-locale", l);
    // Update <html lang> for accessibility
    document.documentElement.lang = l === "zh" ? "zh-CN" : l;
  }

  const lang = LANGUAGES.find(l => l.code === locale) ?? LANGUAGES[0];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale], lang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
