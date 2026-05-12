"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface MapUrlState {
  server: string | null;
  train: string | null;
  station: string | null;
}

export function useMapUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const state: MapUrlState = useMemo(
    () => ({
      server: params.get("server"),
      train: params.get("train"),
      station: params.get("station"),
    }),
    [params]
  );

  const update = useCallback(
    (patch: Partial<MapUrlState>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === undefined || v === "") next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  return { state, update };
}
