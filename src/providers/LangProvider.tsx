"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { LANGS, type Lang, type Translations } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pl");

  useEffect(() => {
    const stored = localStorage.getItem("simrailxyz-lang");
    if (stored === "en" || stored === "pl") {
      setLang(stored);
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "pl" ? "en" : "pl";
      localStorage.setItem("simrailxyz-lang", next);
      return next;
    });
  }, []);

  return (
    <LangContext.Provider value={{ lang, t: LANGS[lang], toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

