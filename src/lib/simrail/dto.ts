import type { RawServer } from "./servers";
import type { RawStation } from "./stations";
import type { RawTrain } from "./trains";
import type { RawTimetableStop, RawTrainTimetable } from "./timetable";

export const VMAX_VALUE = 32767;

export interface ServerDTO {
  code: string;
  name: string;
  region: string;
  isActive: boolean;
}

export interface SignalAheadDTO {
  name: string;
  speed: number | null;
  distance: number | null;
}

export interface TrainDTO {
  id: string;
  trainNo: string;
  trainName: string;
  category: string;
  type: "user" | "bot";
  driverSteamId: string | null;
  startStation: string;
  endStation: string;
  lat: number;
  lon: number;
  velocity: number;
  signalAhead: SignalAheadDTO | null;
  inBorderArea: boolean;
  vehicles: string[];
}

export interface DispatcherDTO {
  steamId: string;
  serverCode: string;
}

export interface StationDTO {
  id: string;
  code: string;
  name: string;
  prefix: string;
  lat: number;
  lon: number;
  difficulty: number;
  imageUrl: string | null;
  additionalImages: string[];
  dispatchers: DispatcherDTO[];
}

export interface TimetableEntryDTO {
  pointId: string;
  pointName: string;
  displayedTrainNumber: string;
  arrivalTime: string | null;
  departureTime: string;
  platform: string | null;
  track: number | null;
  line: number;
  kilometrage: number;
  maxSpeed: number;
  stopType: string;
  trainType: string;
  supervisedBy: string | null;
}

export interface TrainTimetableDTO {
  trainNo: string;
  trainName: string;
  startStation: string;
  endStation: string;
  startsAt: string;
  endsAt: string;
  trainLength: number;
  trainWeight: number;
  locoType: string;
  continuesAs: string | null;
  entries: TimetableEntryDTO[];
}

export type SearchKind = "server" | "train" | "station" | "dispatcher";

export interface SearchResultDTO {
  id: string;
  kind: SearchKind;
  label: string;
  sublabel: string;
  serverCode: string | null;
  lat: number | null;
  lon: number | null;
  payload: { trainNo?: string; stationCode?: string; steamId?: string };
}

const KNOWN_CATEGORIES = ["EIP", "IC", "TLK", "IR", "R", "TME", "TDE"];

export function deriveCategory(trainName: string): string {
  const upper = (trainName ?? "").toUpperCase().trim();
  for (const cat of KNOWN_CATEGORIES) {
    if (upper.startsWith(cat + " ") || upper === cat) return cat;
  }
  const first = upper.split(/\s+/)[0] ?? "";
  return first || "OTHER";
}

export function toServerDTO(s: RawServer): ServerDTO {
  return {
    code: s.ServerCode,
    name: s.ServerName,
    region: s.ServerRegion,
    isActive: s.IsActive,
  };
}

export function toStationDTO(s: RawStation): StationDTO {
  const dispatchers = (s.DispatchedBy ?? []).map((d) => ({
    steamId: d.SteamId,
    serverCode: d.ServerCode,
  }));
  return {
    id: s.id,
    code: s.Prefix,
    name: s.Name,
    prefix: s.Prefix,
    lat: s.Latititude,
    lon: s.Longitude,
    difficulty: s.DifficultyLevel,
    imageUrl: s.MainImageURL || null,
    additionalImages: [s.AdditionalImage1URL, s.AdditionalImage2URL].filter(
      (u): u is string => typeof u === "string" && u.length > 0
    ),
    dispatchers,
  };
}

export function toTrainDTO(t: RawTrain): TrainDTO {
  const data = t.TrainData;
  const signalSpeedRaw = data.SignalInFrontSpeed;
  const signalSpeed = signalSpeedRaw === VMAX_VALUE ? null : signalSpeedRaw;
  const signalRaw = data.SignalInFront;
  const signalAhead = signalRaw
    ? {
        name: signalRaw.split("@")[0] ?? signalRaw,
        speed: signalSpeed,
        distance:
          typeof data.DistanceToSignalInFront === "number"
            ? data.DistanceToSignalInFront
            : null,
      }
    : null;
  const vehicles = Array.isArray(t.Vehicles)
    ? (t.Vehicles as unknown[]).filter(
        (v): v is string => typeof v === "string"
      )
    : [];
  return {
    id: t.id,
    trainNo: t.TrainNoLocal,
    trainName: t.TrainName,
    category: deriveCategory(t.TrainName),
    type: t.Type,
    driverSteamId: data.ControlledBySteamID ?? null,
    startStation: t.StartStation,
    endStation: t.EndStation,
    lat: data.Latititute,
    lon: data.Longitute,
    velocity: data.Velocity,
    signalAhead,
    inBorderArea: data.InBorderStationArea,
    vehicles,
  };
}

export function toTimetableEntryDTO(e: RawTimetableStop): TimetableEntryDTO {
  return {
    pointId: e.pointId,
    pointName: e.nameOfPoint,
    displayedTrainNumber: e.displayedTrainNumber,
    arrivalTime: e.arrivalTime ?? null,
    departureTime: e.departureTime,
    platform: e.platform ?? null,
    track: e.track ?? null,
    line: e.line,
    kilometrage: e.mileage,
    maxSpeed: e.maxSpeed,
    stopType: e.stopType,
    trainType: e.trainType,
    supervisedBy: e.supervisedBy ?? null,
  };
}

export function toTrainTimetableDTO(d: RawTrainTimetable): TrainTimetableDTO {
  return {
    trainNo: d.trainNoLocal,
    trainName: d.trainName,
    startStation: d.startStation,
    endStation: d.endStation,
    startsAt: d.startsAt,
    endsAt: d.endsAt,
    trainLength: d.trainLength,
    trainWeight: d.trainWeight,
    locoType: d.locoType,
    continuesAs: d.continuesAs || null,
    entries: d.timetable.map(toTimetableEntryDTO),
  };
}
