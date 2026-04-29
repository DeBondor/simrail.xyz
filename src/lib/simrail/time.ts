import { TIMETABLE_BASE } from "./config";

export async function fetchTime(serverCode: string): Promise<number> {
  const res = await fetch(
    `${TIMETABLE_BASE}/getTime?serverCode=${encodeURIComponent(serverCode)}`
  );
  if (!res.ok) throw new Error(`SimRail API error: ${res.status}`);
  return res.json() as Promise<number>;
}
