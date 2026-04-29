import { NextResponse } from "next/server";
import { getActiveStation } from "@/lib/simrail/client";
import { toStationDTO } from "@/lib/simrail/dto";

export const revalidate = 30;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string; stationCode: string }> }
) {
  const { code, stationCode } = await ctx.params;
  try {
    const raw = await getActiveStation(code, stationCode);
    if (!raw) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json(
      { station: toStationDTO(raw) },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
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
