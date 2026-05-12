"use client";

import useSWR from "swr";
import { fetcher } from "./fetcher";
import type { ServerDTO } from "@/lib/simrail/dto";

export function useServers() {
  const { data, error, isLoading } = useSWR<{ servers: ServerDTO[] }>(
    "/api/sim/servers",
    fetcher,
    { refreshInterval: 60_000 }
  );
  return {
    servers: data?.servers ?? [],
    isLoading,
    error,
  };
}
