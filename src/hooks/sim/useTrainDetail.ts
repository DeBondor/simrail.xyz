"use client";

import useSWR from "swr";
import { fetcher } from "./fetcher";
import type { TrainDTO, TrainTimetableDTO } from "@/lib/simrail/dto";

export function useTrainDetail(
  serverCode: string | null,
  trainNo: string | null
) {
  const key =
    serverCode && trainNo
      ? `/api/sim/servers/${encodeURIComponent(serverCode)}/trains/${encodeURIComponent(trainNo)}`
      : null;
  const { data, error, isLoading } = useSWR<{
    train: TrainDTO;
    timetable: TrainTimetableDTO | null;
  }>(key, fetcher, { refreshInterval: 5_000 });
  return {
    train: data?.train ?? null,
    timetable: data?.timetable ?? null,
    isLoading,
    error,
  };
}
