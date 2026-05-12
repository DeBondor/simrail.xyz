"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Server as ServerIcon,
  Train as TrainIcon,
  MapPin,
  Headphones,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useLang } from "@/providers/LangProvider";
import { useSearch } from "@/hooks/sim/useSearch";
import type {
  ServerDTO,
  StationDTO,
  TrainDTO,
  SearchResultDTO,
} from "@/lib/simrail/dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverCode: string | null;
  servers: ServerDTO[];
  trains: TrainDTO[];
  stations: StationDTO[];
  onPick: (result: SearchResultDTO) => void;
}

function buildLocalResults(
  servers: ServerDTO[],
  trains: TrainDTO[],
  stations: StationDTO[],
  serverCode: string | null
): SearchResultDTO[] {
  const out: SearchResultDTO[] = [];
  for (const s of servers) {
    out.push({
      id: `server:${s.code}`,
      kind: "server",
      label: s.name,
      sublabel: `${s.code.toUpperCase()} · ${s.region}`,
      serverCode: s.code,
      lat: null,
      lon: null,
      payload: {},
    });
  }
  for (const t of trains.slice(0, 30)) {
    out.push({
      id: `train:${serverCode ?? "?"}:${t.trainNo}`,
      kind: "train",
      label: `${t.trainName} ${t.trainNo}`,
      sublabel: `${t.startStation} → ${t.endStation}`,
      serverCode,
      lat: t.lat,
      lon: t.lon,
      payload: { trainNo: t.trainNo },
    });
  }
  for (const s of stations.slice(0, 30)) {
    out.push({
      id: `station:${serverCode ?? "?"}:${s.code}`,
      kind: "station",
      label: s.name,
      sublabel: `${s.prefix} · ${s.dispatchers.length > 0 ? "manned" : "auto"}`,
      serverCode,
      lat: s.lat,
      lon: s.lon,
      payload: { stationCode: s.code },
    });
  }
  for (const s of stations) {
    for (const d of s.dispatchers) {
      out.push({
        id: `dispatcher:${serverCode ?? "?"}:${s.code}:${d.steamId}`,
        kind: "dispatcher",
        label: d.steamId,
        sublabel: s.name,
        serverCode,
        lat: s.lat,
        lon: s.lon,
        payload: { stationCode: s.code, steamId: d.steamId },
      });
    }
  }
  return out;
}

export function Launcher({
  open,
  onOpenChange,
  serverCode,
  servers,
  trains,
  stations,
  onPick,
}: Props) {
  const { t } = useLang();
  const [query, setQuery] = useState("");

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) setQuery("");
      onOpenChange(next);
    },
    [onOpenChange]
  );

  const local = useMemo(
    () => buildLocalResults(servers, trains, stations, serverCode),
    [servers, trains, stations, serverCode]
  );

  const { results: remote } = useSearch(serverCode, query);

  const results = query.trim().length > 0 ? remote : local;

  const groups: Record<SearchResultDTO["kind"], SearchResultDTO[]> = {
    server: [],
    train: [],
    station: [],
    dispatcher: [],
  };
  for (const r of results) groups[r.kind].push(r);

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={t.mapTitle}
      description={t.mapSearchPlaceholder}
    >
      <CommandInput
        placeholder={t.mapSearchPlaceholder}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>{t.mapNoResults}</CommandEmpty>

        {groups.server.length > 0 && (
          <CommandGroup heading={t.mapCatServers}>
            {groups.server.slice(0, 10).map((r) => (
              <CommandItem
                key={r.id}
                value={`${r.label} ${r.sublabel} ${r.kind}`}
                onSelect={() => {
                  onPick(r);
                  handleOpenChange(false);
                }}
              >
                <ServerIcon />
                <div className="flex flex-col text-left">
                  <span>{r.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.sublabel}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groups.train.length > 0 && (
          <CommandGroup heading={t.mapCatTrains}>
            {groups.train.slice(0, 20).map((r) => (
              <CommandItem
                key={r.id}
                value={`${r.label} ${r.sublabel} ${r.kind}`}
                onSelect={() => {
                  onPick(r);
                  handleOpenChange(false);
                }}
              >
                <TrainIcon />
                <div className="flex flex-col text-left">
                  <span>{r.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.sublabel}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groups.station.length > 0 && (
          <CommandGroup heading={t.mapCatStations}>
            {groups.station.slice(0, 20).map((r) => (
              <CommandItem
                key={r.id}
                value={`${r.label} ${r.sublabel} ${r.kind}`}
                onSelect={() => {
                  onPick(r);
                  handleOpenChange(false);
                }}
              >
                <MapPin />
                <div className="flex flex-col text-left">
                  <span>{r.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.sublabel}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groups.dispatcher.length > 0 && (
          <CommandGroup heading={t.mapCatDispatchers}>
            {groups.dispatcher.slice(0, 20).map((r) => (
              <CommandItem
                key={r.id}
                value={`${r.label} ${r.sublabel} ${r.kind}`}
                onSelect={() => {
                  onPick(r);
                  handleOpenChange(false);
                }}
              >
                <Headphones />
                <div className="flex flex-col text-left">
                  <span className="font-mono text-xs">{r.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.sublabel}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
