import { LIVE_DATA_BASE } from "./config";

export interface RawTrainData {
  ControlledBySteamID: string | null;
  InBorderStationArea: boolean;
  Latititute: number;   // API typo — intentional, matches wire format
  Longitute: number;    // API typo — intentional, matches wire format
  Velocity: number;
  SignalInFront: string | null;
  DistanceToSignalInFront: number | null;
  SignalInFrontSpeed: number;  // 32767 = Vmax
  VDDelayedTimetableIndex: number;
}

export interface RawTrain {
  TrainNoLocal: string;
  TrainName: string;
  StartStation: string;
  EndStation: string;
  Vehicles: string[];
  ServerCode: string;
  TrainData: RawTrainData;
  id: string;
  Type: "bot" | "user";
}

interface TrainsResponse {
  result: boolean;
  data: RawTrain[];
  count: number;
  description: string;
}

export async function fetchTrains(serverCode: string): Promise<RawTrain[]> {
  const res = await fetch(
    `${LIVE_DATA_BASE}/trains-open?serverCode=${encodeURIComponent(serverCode)}`
  );
  if (!res.ok) throw new Error(`SimRail API error: ${res.status}`);
  const json: TrainsResponse = await res.json();
  if (!json.result) throw new Error(`SimRail API error: ${json.description}`);
  return json.data;
}
