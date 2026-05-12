"use client";

import useSWR from "swr";
import { fetcher } from "./fetcher";
import type { TrainDTO } from "@/lib/simrail/dto";

export function useTrains(serverCode: string | null) {
  const key = serverCode
    ? `/api/sim/servers/${encodeURIComponent(serverCode)}/trains`
    : null;
  const { data, error, isLoading } = useSWR<{ trains: TrainDTO[] }>(
    key,
    fetcher,
    { refreshInterval: 5_000, revalidateOnFocus: true }
  );
  return {
    trains: data?.trains ?? [],
    isLoading,
    error,
  };
}
