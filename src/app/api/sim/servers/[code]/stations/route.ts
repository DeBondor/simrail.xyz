import { NextResponse } from "next/server";
import { getActiveStations } from "@/lib/simrail/client";
import { toStationDTO } from "@/lib/simrail/dto";

export const revalidate = 30;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> }
) {
  const { code } = await ctx.params;
  try {
    const raw = await getActiveStations(code);
    const stations = raw.map(toStationDTO);
    return NextResponse.json(
      { stations },
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
