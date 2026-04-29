import { LIVE_DATA_BASE } from "./config";

export interface RawServer {
  ServerCode: string;
  ServerName: string;
  ServerRegion: string;
  IsActive: boolean;
  id: string;
}

interface ServersResponse {
  result: boolean;
  data: RawServer[];
  count: number;
  description: string;
}

export async function fetchServers(): Promise<RawServer[]> {
  const res = await fetch(`${LIVE_DATA_BASE}/servers-open`);
  if (!res.ok) throw new Error(`SimRail API error: ${res.status}`);
  const json: ServersResponse = await res.json();
  if (!json.result) throw new Error(`SimRail API error: ${json.description}`);
  return json.data;
}
