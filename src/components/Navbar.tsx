"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLang } from "@/providers/LangProvider";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { lang, t, toggleLang } = useLang();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="flex items-center gap-3.5 px-10 py-4.5 border-b border-border bg-card sticky top-0 z-10">
      <div className="w-8.5 h-8.5 bg-red-500 rounded-lg flex items-center justify-center text-base font-bold text-white shrink-0">
        SR
      </div>
      <div className="text-[0.95rem] font-bold tracking-widest uppercase text-foreground">
        <span className="text-red-500">SimRail</span> XYZ{" "}
        <small className="font-normal text-muted-foreground text-[0.75em] tracking-wider">
          / {t.navTools}
        </small>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {mounted ? (theme === "dark" ? t.themeLight : t.themeDark) : t.themeLight}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-auto px-2.5 gap-1.5"
              onClick={toggleLang}
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="text-xs font-bold tracking-wider">
                {lang.toUpperCase()}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t.switchLangTitle}</TooltipContent>
        </Tooltip>
      </div>
    </nav>
  );
}

