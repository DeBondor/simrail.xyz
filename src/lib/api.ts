import stationsData from "@/data/stations.json";

export interface StationGroup {
  label: string;
  stations: string[];
}

export interface StationsData {
  groups: StationGroup[];
}

// for backend soon
export function fetchStations(): StationsData {
  return stationsData as StationsData;
}

