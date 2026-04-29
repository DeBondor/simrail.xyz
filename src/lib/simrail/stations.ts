import { LIVE_DATA_BASE } from "./config";

export interface RawDispatchedBy {
  ServerCode: string;
  SteamId: string;
}

export interface RawStation {
  Name: string;
  Prefix: string;
  DifficultyLevel: number;
  Latititude: number;   // API typo — intentional, matches wire format
  Longitude: number;
  MainImageURL: string;
  AdditionalImage1URL: string;
  AdditionalImage2URL: string;
  DispatchedBy: RawDispatchedBy[];
  id: string;
}

interface StationsResponse {
  result: boolean;
  data: RawStation[];
  count: number;
  description: string;
}

export async function fetchStations(serverCode: string): Promise<RawStation[]> {
  const res = await fetch(
    `${LIVE_DATA_BASE}/stations-open?serverCode=${encodeURIComponent(serverCode)}`
  );
  if (!res.ok) throw new Error(`SimRail API error: ${res.status}`);
  const json: StationsResponse = await res.json();
  if (!json.result) throw new Error(`SimRail API error: ${json.description}`);
  return json.data;
}
