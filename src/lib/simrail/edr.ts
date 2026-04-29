import { EDR_BASE } from "./config";

export async function fetchEDR(
  serverCode: string,
  stationIds: string[],
  lang?: string
): Promise<unknown> {
  const params = new URLSearchParams({ serverCode });
  for (const id of stationIds) params.append("stationId", id);
  if (lang) params.set("lang", lang);
  const res = await fetch(`${EDR_BASE}/?${params.toString()}`);
  if (!res.ok) throw new Error(`SimRail API error: ${res.status}`);
  return res.json();
}
