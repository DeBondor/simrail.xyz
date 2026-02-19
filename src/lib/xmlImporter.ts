export interface ImportedStation {
  name: string;
  bold: boolean;
}

export interface ImportedRoute {
  trainName: string;
  trainNumber: string;
  startStation: string;
  endStation: string;
  intermediateStations: ImportedStation[];
}

export function parseSimRailXML(xmlString: string): ImportedRoute {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) {
    throw new Error("Failed to parse XML file.");
  }

  const getText = (tag: string): string =>
    doc.querySelector(tag)?.textContent?.trim() || "";

  const trainName = getText("TrainName");
  const trainNumber = getText("TrainNumber");

  const waypoints = Array.from(doc.querySelectorAll("WayPointFromXml"));
  const stops = waypoints.filter(
    (wp) =>
      wp.querySelector("StopType")?.textContent?.trim() === "commercialStop"
  );

  if (stops.length < 2) {
    throw new Error("Not enough commercial stops in the file.");
  }

  const getName = (wp: Element): string =>
    wp.querySelector("DisplayName")?.textContent?.trim() ||
    wp.querySelector("NameOfPoint")?.textContent?.trim() ||
    "";

  const startStation = getName(stops[0]);
  const endStation = getName(stops[stops.length - 1]);
  const intermediateStations: ImportedStation[] = stops
    .slice(1, -1)
    .map((wp) => ({
      name: getName(wp),
      bold: false,
    }));

  return {
    trainName,
    trainNumber,
    startStation,
    endStation,
    intermediateStations,
  };
}

