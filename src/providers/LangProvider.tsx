"use client";

import {
  createContext,
  useContext,
  useState,
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
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "pl";
    const stored = localStorage.getItem("simrailxyz-lang");
    return stored === "en" || stored === "pl" ? stored : "pl";
  });

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
