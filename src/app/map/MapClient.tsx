"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LiveMapHandle } from "@/components/map/LiveMap";
import { ServerSelector } from "@/components/map/ServerSelector";
import { Launcher } from "@/components/map/Launcher";
import { TrainDetailPanel } from "@/components/map/TrainDetailPanel";
import { StationDetailPanel } from "@/components/map/StationDetailPanel";
import { MapAttribution } from "@/components/map/MapAttribution";
import { useServers } from "@/hooks/sim/useServers";
import { useTrains } from "@/hooks/sim/useTrains";
import { useStations } from "@/hooks/sim/useStations";
import { useMapUrlState } from "@/hooks/sim/useMapUrlState";
import type { SearchResultDTO } from "@/lib/simrail/dto";

const LiveMap = dynamic(() => import("@/components/map/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
      …
    </div>
  ),
});

export default function MapClient() {
  const { state, update } = useMapUrlState();
  const { servers } = useServers();
  const mapRef = useRef<LiveMapHandle>(null);
  const [launcherOpen, setLauncherOpen] = useState(false);

  const activeServer = useMemo(() => {
    if (state.server) return state.server;
    const firstActive = servers.find((s) => s.isActive);
    return firstActive?.code ?? servers[0]?.code ?? null;
  }, [state.server, servers]);

  useEffect(() => {
    if (!state.server && activeServer) {
      update({ server: activeServer });
    }
  }, [state.server, activeServer, update]);

  const { trains } = useTrains(activeServer);
  const { stations } = useStations(activeServer);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setLauncherOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const flyToSelectedTrain = useCallback(() => {
    if (!state.train) return;
    const t = trains.find((x) => x.trainNo === state.train);
    if (t) mapRef.current?.flyTo(t.lon, t.lat);
  }, [state.train, trains]);

  const flyToSelectedStation = useCallback(() => {
    if (!state.station) return;
    const s = stations.find((x) => x.code === state.station);
    if (s) mapRef.current?.flyTo(s.lon, s.lat);
  }, [state.station, stations]);

  useEffect(flyToSelectedTrain, [flyToSelectedTrain]);
  useEffect(flyToSelectedStation, [flyToSelectedStation]);

  const handleSelectTrain = useCallback(
    (trainNo: string) => {
      update({ train: trainNo, station: null });
    },
    [update]
  );

  const handleSelectStation = useCallback(
    (stationCode: string) => {
      update({ station: stationCode, train: null });
    },
    [update]
  );

  const handleServerChange = useCallback(
    (code: string) => {
      update({ server: code, train: null, station: null });
    },
    [update]
  );

  const handleLauncherPick = useCallback(
    (r: SearchResultDTO) => {
      if (r.kind === "server" && r.serverCode) {
        update({ server: r.serverCode, train: null, station: null });
        return;
      }
      if (r.kind === "train" && r.payload.trainNo) {
        const patch: Record<string, string | null> = {
          train: r.payload.trainNo,
          station: null,
        };
        if (r.serverCode) patch.server = r.serverCode;
        update(patch);
        if (r.lat !== null && r.lon !== null) {
          mapRef.current?.flyTo(r.lon, r.lat);
        }
        return;
      }
      if (
        (r.kind === "station" || r.kind === "dispatcher") &&
        r.payload.stationCode
      ) {
        const patch: Record<string, string | null> = {
          station: r.payload.stationCode,
          train: null,
        };
        if (r.serverCode) patch.server = r.serverCode;
        update(patch);
        if (r.lat !== null && r.lon !== null) {
          mapRef.current?.flyTo(r.lon, r.lat);
        }
      }
    },
    [update]
  );

  return (
    <div className="flex flex-col gap-3 p-4 h-[calc(100vh-57px)] box-border">
      <ServerSelector
        servers={servers}
        value={activeServer}
        onChange={handleServerChange}
        onOpenLauncher={() => setLauncherOpen(true)}
        trainCount={trains.length}
      />
      <div className="relative flex-1 min-h-0 rounded-lg overflow-hidden border border-border bg-background">
        <LiveMap
          ref={mapRef}
          trains={trains}
          stations={stations}
          onSelectTrain={handleSelectTrain}
          onSelectStation={handleSelectStation}
        />
        <MapAttribution className="absolute bottom-2 right-2" />
        {state.train && (
          <TrainDetailPanel
            serverCode={activeServer}
            trainNo={state.train}
            onClose={() => update({ train: null })}
          />
        )}
        {!state.train && state.station && (
          <StationDetailPanel
            serverCode={activeServer}
            stationCode={state.station}
            onClose={() => update({ station: null })}
          />
        )}
      </div>
      <Launcher
        open={launcherOpen}
        onOpenChange={setLauncherOpen}
        serverCode={activeServer}
        servers={servers}
        trains={trains}
        stations={stations}
        onPick={handleLauncherPick}
      />
    </div>
  );
}
