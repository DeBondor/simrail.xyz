import { NextResponse } from "next/server";
import { getActiveServers, getActiveTrains, getActiveStations } from "@/lib/simrail/client";
import { toServerDTO, toStationDTO, toTrainDTO } from "@/lib/simrail/dto";
import { buildSearchResults } from "@/lib/simrail/search";

export const revalidate = 5;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const server = url.searchParams.get("server");
  try {
    const servers = (await getActiveServers()).map(toServerDTO);
    let trains: ReturnType<typeof toTrainDTO>[] = [];
    let stations: ReturnType<typeof toStationDTO>[] = [];
    if (server) {
      const [t, s] = await Promise.all([
        getActiveTrains(server).catch(() => []),
        getActiveStations(server).catch(() => []),
      ]);
      trains = t.map(toTrainDTO);
      stations = s.map(toStationDTO);
    }
    const results = buildSearchResults(q, servers, trains, stations, server);
    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
        },
      }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "upstream", message: (e as Error).message },
      { status: 502 }
    );
  }
}
