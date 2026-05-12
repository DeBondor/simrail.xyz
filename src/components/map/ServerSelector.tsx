"use client";

import { Globe2, Search, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLang } from "@/providers/LangProvider";
import type { ServerDTO } from "@/lib/simrail/dto";

interface Props {
  servers: ServerDTO[];
  value: string | null;
  onChange: (code: string) => void;
  onOpenLauncher: () => void;
  trainCount: number;
}

export function ServerSelector({
  servers,
  value,
  onChange,
  onOpenLauncher,
  trainCount,
}: Props) {
  const { t } = useLang();

  const sorted = [...servers].sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    return a.code.localeCompare(b.code);
  });

  return (
    <div className="bg-card border border-border rounded-lg px-2 py-1.5 flex items-center gap-2 shrink-0">
      <Globe2 className="h-3.5 w-3.5 text-muted-foreground ml-1" />
      <span className="text-[0.65rem] font-bold tracking-widest uppercase text-muted-foreground">
        {t.mapServerLabel}
      </span>
      <Select value={value ?? undefined} onValueChange={onChange}>
        <SelectTrigger size="sm" className="h-7 w-44 text-xs">
          <SelectValue placeholder="—" />
        </SelectTrigger>
        <SelectContent>
          {sorted.map((s) => (
            <SelectItem key={s.code} value={s.code}>
              <span className="font-mono text-xs uppercase">{s.code}</span>
              <span className="text-muted-foreground"> · {s.region}</span>
              {!s.isActive && (
                <span className="text-destructive ml-1">
                  {t.mapServerOffline}
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground ml-1">
        <Users className="h-3 w-3" />
        <span className="tabular-nums">{trainCount}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-7 ml-auto gap-1.5 text-xs"
        onClick={onOpenLauncher}
      >
        <Search className="h-3 w-3" />
        <span className="hidden sm:inline">{t.mapSearchHint}</span>
        <span className="sm:hidden">⌘K</span>
      </Button>
    </div>
  );
}
