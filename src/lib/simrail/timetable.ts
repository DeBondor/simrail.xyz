import { TIMETABLE_BASE } from "./config";

export interface RawTimetableStop {
  nameOfPoint: string;
  nameForPerson: string;
  pointId: string;
  supervisedBy: string | null;
  radioChanels: string;
  displayedTrainNumber: string;
  arrivalTime: string | null;
  departureTime: string;
  stopType: "NoStopOver" | "CommercialStop" | "NoncommercialStop";
  line: number;
  platform: string | null;
  track: number | null;
  trainType: string;
  mileage: number;
  maxSpeed: number;
  stationCategory: string | null;
}

export interface RawTrainTimetable {
  trainNoLocal: string;
  trainNoInternational: string;
  trainName: string;
  startStation: string;
  startsAt: string;
  endStation: string;
  endsAt: string;
  locoType: string;
  trainLength: number;
  trainWeight: number;
  continuesAs: string;
  timetable: RawTimetableStop[];
}

export async function fetchTimetable(
  serverCode: string,
  trainNo?: string
): Promise<RawTrainTimetable[]> {
  let url = `${TIMETABLE_BASE}/getAllTimetables?serverCode=${encodeURIComponent(serverCode)}`;
  if (trainNo) url += `&train=${encodeURIComponent(trainNo)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SimRail API error: ${res.status}`);
  return res.json() as Promise<RawTrainTimetable[]>;
}
