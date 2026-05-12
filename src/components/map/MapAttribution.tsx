"use client";

import { useLang } from "@/providers/LangProvider";
import { cn } from "@/lib/utils";

export function MapAttribution({ className }: { className?: string }) {
  const { t } = useLang();
  return (
    <div
      className={cn(
        "pointer-events-auto bg-card/80 backdrop-blur-sm border border-border rounded px-2 py-1 text-[0.6rem] text-muted-foreground tracking-wide",
        className
      )}
    >
      {t.mapAttribution}
    </div>
  );
}
