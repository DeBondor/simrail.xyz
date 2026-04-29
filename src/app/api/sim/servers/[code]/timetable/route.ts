import { NextResponse } from "next/server";
import { getAllTimetables } from "@/lib/simrail/client";
import { toTrainTimetableDTO } from "@/lib/simrail/dto";

export const revalidate = 86400;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> }
) {
  const { code } = await ctx.params;
  try {
    const raw = await getAllTimetables(code);
    const entries = raw.map(toTrainTimetableDTO);
    return NextResponse.json(
      { entries },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=172800",
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
