"use client";

import useSWR from "swr";
import { fetcher } from "./fetcher";
import type { StationDTO } from "@/lib/simrail/dto";

export function useStationDetail(
  serverCode: string | null,
  stationCode: string | null
) {
  const key =
    serverCode && stationCode
      ? `/api/sim/servers/${encodeURIComponent(serverCode)}/stations/${encodeURIComponent(stationCode)}`
      : null;
  const { data, error, isLoading } = useSWR<{ station: StationDTO }>(
    key,
    fetcher,
    { refreshInterval: 30_000 }
  );
  return {
    station: data?.station ?? null,
    isLoading,
    error,
  };
}
