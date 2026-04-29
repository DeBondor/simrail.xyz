import { LIVE_DATA_BASE } from "./config";

export interface RawTrainPosition {
  id: string;
  Latitude: number;
  Longitude: number;
  Velocity: number;
}

interface TrainPositionsResponse {
  result: boolean;
  data: RawTrainPosition[];
}

export async function fetchTrainPositions(
  serverCode: string
): Promise<RawTrainPosition[]> {
  const res = await fetch(
    `${LIVE_DATA_BASE}/train-positions-open?serverCode=${encodeURIComponent(serverCode)}`
  );
  if (!res.ok) throw new Error(`SimRail API error: ${res.status}`);
  const json: TrainPositionsResponse = await res.json();
  if (json.result === false) throw new Error("SimRail API error: train-positions");
  return json.data;
}
