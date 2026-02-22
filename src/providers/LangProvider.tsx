"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { LANGS, LANG_LABELS, type Lang, type Translations } from "@/lib/i18n";

const DEFAULT_LANG: Lang = "pl";
const VALID_LANGS = Object.keys(LANGS) as Lang[];

interface LangContextValue {
  lang: Lang;
  t: Translations;
  switchLang: (next: Lang) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const stored = localStorage.getItem("simrailxyz-lang");
    if (stored && VALID_LANGS.includes(stored as Lang)) {
      setLangState(stored as Lang);
    }
  }, []);

  const switchLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem("simrailxyz-lang", next);
  }, []);

  const value = useMemo(() => ({ lang, t: LANGS[lang], switchLang }), [lang, switchLang]);

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
