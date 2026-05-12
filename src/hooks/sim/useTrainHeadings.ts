"use client";

import { useEffect, useRef, useState } from "react";
import type { TrainDTO } from "@/lib/simrail/dto";
import { bearingDeg, distanceMeters } from "@/lib/simrail/heading";

interface Sample {
  lat: number;
  lon: number;
  heading: number | null;
}

const MIN_MOVE_M = 5;
const MIN_VELOCITY = 1;

export function useTrainHeadings(trains: TrainDTO[]): Record<string, number | null> {
  const store = useRef<Map<string, Sample>>(new Map());
  const [headings, setHeadings] = useState<Record<string, number | null>>({});

  useEffect(() => {
    const next: Record<string, number | null> = {};
    const seen = new Set<string>();

    for (const t of trains) {
      if (!Number.isFinite(t.lat) || !Number.isFinite(t.lon)) continue;
      seen.add(t.id);
      const prev = store.current.get(t.id);
      const curr = { lat: t.lat, lon: t.lon };

      let heading = prev?.heading ?? null;
      if (prev) {
        const moved = distanceMeters(prev, curr);
        if (moved >= MIN_MOVE_M && t.velocity >= MIN_VELOCITY) {
          heading = bearingDeg(prev, curr);
        }
      }

      store.current.set(t.id, { ...curr, heading });
      next[t.id] = heading;
    }

    for (const id of Array.from(store.current.keys())) {
      if (!seen.has(id)) store.current.delete(id);
    }

    setHeadings(next);
  }, [trains]);

  return headings;
}
