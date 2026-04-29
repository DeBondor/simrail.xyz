import { TIMETABLE_BASE } from "./config";

export interface RawEDRTimetableStop {
  indexOfPoint: number;
  nameForPerson: string;
  pointId: string;
  displayedTrainNumber: string;
  arrivalTime: string | null;
  actualArrivalTime: string | null;
  departureTime: string | null;
  actualDepartureTime: string | null;
  isStoped: boolean;
  stopDuration: number;
  isActive: boolean;
  isConfirmed: boolean;
  confirmedBy: 0 | 1 | 2 | 3;
  plannedStop: number;
  timetableType: number;
  stopTypeNumber: 0 | 1 | 2;
  leftTrack: boolean;
  line: number;
  platform: string | null;
  track: string | null;
  trainType: string;
  mileage: string;
  maxSpeed: number;
}

export interface RawEDRTrain {
  trainNoLocal: string;
  trainName: string;
  startStation: string;
  endStation: string;
  usageNotes: string | null;
  ownNotes: string | null;
  isQualityTracked: boolean;
  isOverGauge: boolean;
  isOverWeight: boolean | null;
  isOtherExceptional: boolean;
  isHighRiskCargo: boolean;
  isDangerousCargo: boolean;
  carrierName: string | null;
  timetable: RawEDRTimetableStop[];
}

export async function fetchEDRTimetable(
  serverCode: string
): Promise<RawEDRTrain[]> {
  const res = await fetch(
    `${TIMETABLE_BASE}/getEDRTimetables?serverCode=${encodeURIComponent(serverCode)}`
  );
  if (!res.ok) throw new Error(`SimRail API error: ${res.status}`);
  return res.json() as Promise<RawEDRTrain[]>;
}
