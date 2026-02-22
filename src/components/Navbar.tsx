"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sun, Moon, Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLang } from "@/providers/LangProvider";
import { useHydrated } from "@/hooks/useHydrated";
import { LANG_LABELS, type Lang } from "@/lib/i18n";

const getCurrentTheme = (
  theme: string | undefined,
  resolvedTheme: string | undefined
) => resolvedTheme ?? (theme === "system" || !theme ? "light" : theme);



const LANG_ORDER: Lang[] = ["pl", "en", "de", "cz", "fr"];

export function Navbar() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { lang, t, switchLang } = useLang();
  const hydrated = useHydrated();
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);

  const currentTheme = getCurrentTheme(theme, resolvedTheme);
  const isDark = hydrated && currentTheme === "dark";

  const subtitle = pathname === "/route" ? t.heroRouteGen : null;

  return (
    <nav className="flex items-center gap-3.5 px-10 py-4.5 border-b border-border bg-card sticky top-0 z-10">
      <Link href="/" className="flex items-center gap-3.5 no-underline">
        <div className="w-8.5 h-8.5 bg-primary rounded-lg flex items-center justify-center text-base font-bold text-primary-foreground shrink-0">
          SR
        </div>
        <div className="text-[0.95rem] font-bold tracking-widest uppercase text-foreground">
          <span className="text-primary">SimRail</span> XYZ{" "}
          {subtitle && (
            <small className="font-normal text-muted-foreground text-[0.75em] tracking-wider">
              / {subtitle}
            </small>
          )}
        </div>
      </Link>
      <div className="ml-auto flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isDark ? t.themeLight : t.themeDark}
          </TooltipContent>
        </Tooltip>
        <Popover open={langOpen} onOpenChange={setLangOpen}>
          <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 w-auto px-2.5 gap-1.5"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold tracking-wider">
                    {lang.toUpperCase()}
                  </span>
                </Button>
              </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-44 p-1"
          >
            {LANG_ORDER.map((code) => (
              <button
                key={code}
                onClick={() => {
                  switchLang(code);
                  setLangOpen(false);
                }}
                className={`flex items-center gap-2.5 w-full rounded-sm px-2.5 py-1.5 text-sm cursor-pointer transition-colors
                  ${code === lang
                    ? "bg-accent text-accent-foreground font-medium"
                    : "hover:bg-accent/50 text-foreground"
                  }`}
              >

                <span className="flex-1 text-left">{LANG_LABELS[code]}</span>
                {code === lang && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}

