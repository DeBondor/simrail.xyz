"use client";

import useSWR from "swr";
import { fetcher } from "./fetcher";
import type { SearchResultDTO } from "@/lib/simrail/dto";

export function useSearch(serverCode: string | null, query: string) {
  const trimmed = query.trim();
  const key =
    trimmed.length > 0
      ? `/api/sim/search?q=${encodeURIComponent(trimmed)}${
          serverCode ? `&server=${encodeURIComponent(serverCode)}` : ""
        }`
      : null;
  const { data, isLoading } = useSWR<{ results: SearchResultDTO[] }>(
    key,
    fetcher,
    { keepPreviousData: true, dedupingInterval: 200 }
  );
  return {
    results: data?.results ?? [],
    isLoading,
  };
}
