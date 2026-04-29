import "server-only";
import { fetchServers } from "./servers";
import { fetchTrains } from "./trains";
import { fetchStations } from "./stations";
import { fetchTimetable } from "./timetable";
import type { RawServer } from "./servers";
import type { RawTrain } from "./trains";
import type { RawStation } from "./stations";
import type { RawTrainTimetable } from "./timetable";

type CacheEntry<T> = { value: T; expiresAt: number };
type InflightMap<T> = Map<string, Promise<T>>;

const g = globalThis as unknown as {
  __simrailTtlCache?: Map<string, CacheEntry<unknown>>;
  __simrailInflight?: InflightMap<unknown>;
};

const ttlCache: Map<string, CacheEntry<unknown>> =
  g.__simrailTtlCache ?? (g.__simrailTtlCache = new Map());
const inflight: InflightMap<unknown> =
  g.__simrailInflight ?? (g.__simrailInflight = new Map());

export async function withTtl<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const hit = ttlCache.get(key) as CacheEntry<T> | undefined;
  if (hit && hit.expiresAt > now) return hit.value;

  const existing = inflight.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const p = (async () => {
    try {
      const value = await loader();
      ttlCache.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    } finally {
      inflight.delete(key);
    }
  })();
  inflight.set(key, p);
  return p;
}

export function getActiveServers(): Promise<RawServer[]> {
  return fetchServers();
}

export function getActiveTrains(serverCode: string): Promise<RawTrain[]> {
  return fetchTrains(serverCode);
}

export async function getActiveTrain(
  serverCode: string,
  trainNo: string
): Promise<RawTrain | null> {
  const trains = await fetchTrains(serverCode);
  return trains.find((t) => t.TrainNoLocal === trainNo) ?? null;
}

export function getActiveStations(serverCode: string): Promise<RawStation[]> {
  return fetchStations(serverCode);
}

export async function getActiveStation(
  serverCode: string,
  stationCode: string
): Promise<RawStation | null> {
  const stations = await fetchStations(serverCode);
  return stations.find((s) => s.Prefix === stationCode) ?? null;
}

export function getAllTimetables(
  serverCode: string
): Promise<RawTrainTimetable[]> {
  return fetchTimetable(serverCode);
}

export async function getTrainTimetable(
  serverCode: string,
  trainNo: string
): Promise<RawTrainTimetable | null> {
  const results = await fetchTimetable(serverCode, trainNo);
  return results[0] ?? null;
}
