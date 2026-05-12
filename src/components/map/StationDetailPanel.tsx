"use client";

import { X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/providers/LangProvider";
import { useStationDetail } from "@/hooks/sim/useStationDetail";
import { SteamLink } from "./SteamLink";
import { cn } from "@/lib/utils";

interface Props {
  serverCode: string | null;
  stationCode: string | null;
  onClose: () => void;
}

export function StationDetailPanel({
  serverCode,
  stationCode,
  onClose,
}: Props) {
  const { t } = useLang();
  const { station, isLoading, error } = useStationDetail(
    serverCode,
    stationCode
  );

  if (!stationCode) return null;

  return (
    <div className="absolute right-3 top-3 bottom-3 w-[22rem] max-w-[calc(100%-1.5rem)] bg-card border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden z-10">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
        <span className="font-mono text-xs font-bold uppercase text-primary">
          {station?.prefix ?? stationCode}
        </span>
        <span className="text-sm font-bold truncate">
          {station?.name ?? "—"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 ml-auto"
          onClick={onClose}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto text-sm">
        {isLoading && !station && (
          <div className="px-4 py-3 text-muted-foreground text-xs">…</div>
        )}
        {error && !station && (
          <div className="px-4 py-3 text-destructive text-xs">
            {t.mapLoadError}
          </div>
        )}
        {station?.imageUrl && (
          <div className="relative w-full aspect-video bg-secondary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={station.imageUrl}
              alt={station.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
        {station && (
          <div className="px-4 py-3 space-y-3">
            <div>
              <div className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-1">
                {t.mapStationDetailDifficulty}
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < station.difficulty
                        ? "text-primary fill-current"
                        : "text-muted-foreground/40"
                    )}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-1">
                {t.mapStationDetailDispatchers}
              </div>
              {station.dispatchers.length === 0 ? (
                <div className="text-xs text-muted-foreground">
                  {t.mapStationNoDispatcher}
                </div>
              ) : (
                <ul className="space-y-1">
                  {station.dispatchers.map((d) => (
                    <li key={d.steamId} className="flex items-center gap-2">
                      <SteamLink steamId={d.steamId} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
