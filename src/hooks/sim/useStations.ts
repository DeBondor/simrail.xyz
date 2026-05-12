"use client";

import useSWR from "swr";
import { fetcher } from "./fetcher";
import type { StationDTO } from "@/lib/simrail/dto";

export function useStations(serverCode: string | null) {
  const key = serverCode
    ? `/api/sim/servers/${encodeURIComponent(serverCode)}/stations`
    : null;
  const { data, error, isLoading } = useSWR<{ stations: StationDTO[] }>(
    key,
    fetcher,
    { refreshInterval: 30_000 }
  );
  return {
    stations: data?.stations ?? [],
    isLoading,
    error,
  };
}
