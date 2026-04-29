import type {
  ServerDTO,
  StationDTO,
  TrainDTO,
  SearchResultDTO,
} from "./dto";

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

interface ScoredResult extends SearchResultDTO {
  _score: number;
}

function score(haystack: string, q: string): number {
  if (!q) return 0;
  const h = norm(haystack);
  const idx = h.indexOf(q);
  if (idx < 0) return -1;
  if (idx === 0) return 100 - h.length;
  return 50 - idx;
}

export function buildSearchResults(
  q: string,
  servers: ServerDTO[],
  trains: TrainDTO[],
  stations: StationDTO[],
  activeServer: string | null
): SearchResultDTO[] {
  const nq = norm(q.trim());
  const out: ScoredResult[] = [];

  for (const s of servers) {
    const sc = nq ? Math.max(score(s.code, nq), score(s.name, nq)) : 0;
    if (nq && sc < 0) continue;
    out.push({
      _score: sc + (s.isActive ? 5 : 0),
      id: `server:${s.code}`,
      kind: "server",
      label: s.name,
      sublabel: `${s.code.toUpperCase()} · ${s.region}`,
      serverCode: s.code,
      lat: null,
      lon: null,
      payload: {},
    });
  }

  for (const t of trains) {
    const sc = nq
      ? Math.max(
          score(t.trainNo, nq),
          score(t.trainName, nq),
          score(t.startStation, nq),
          score(t.endStation, nq)
        )
      : 0;
    if (nq && sc < 0) continue;
    out.push({
      _score: sc + (t.type === "user" ? 3 : 0),
      id: `train:${activeServer ?? "?"}:${t.trainNo}`,
      kind: "train",
      label: `${t.trainName} ${t.trainNo}`,
      sublabel: `${t.startStation} → ${t.endStation}`,
      serverCode: activeServer,
      lat: t.lat,
      lon: t.lon,
      payload: { trainNo: t.trainNo },
    });
  }

  for (const s of stations) {
    const sc = nq
      ? Math.max(score(s.name, nq), score(s.prefix, nq), score(s.code, nq))
      : 0;
    if (nq && sc < 0) continue;
    out.push({
      _score: sc + (s.dispatchers.length > 0 ? 3 : 0),
      id: `station:${activeServer ?? "?"}:${s.code}`,
      kind: "station",
      label: s.name,
      sublabel: `${s.prefix} · ${s.dispatchers.length > 0 ? "manned" : "auto"}`,
      serverCode: activeServer,
      lat: s.lat,
      lon: s.lon,
      payload: { stationCode: s.code },
    });
  }

  for (const s of stations) {
    for (const d of s.dispatchers) {
      const sc = nq ? score(d.steamId, nq) : 0;
      if (nq && sc < 0) continue;
      out.push({
        _score: sc,
        id: `dispatcher:${activeServer ?? "?"}:${s.code}:${d.steamId}`,
        kind: "dispatcher",
        label: d.steamId,
        sublabel: s.name,
        serverCode: activeServer,
        lat: s.lat,
        lon: s.lon,
        payload: { stationCode: s.code, steamId: d.steamId },
      });
    }
  }

  out.sort((a, b) => b._score - a._score);
  return out.slice(0, 50).map(({ _score, ...r }) => {
    void _score;
    return r;
  });
}
