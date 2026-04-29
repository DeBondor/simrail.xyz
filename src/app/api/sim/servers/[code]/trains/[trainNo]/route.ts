import { NextResponse } from "next/server";
import { getActiveTrain, getTrainTimetable } from "@/lib/simrail/client";
import { toTrainDTO, toTrainTimetableDTO } from "@/lib/simrail/dto";

export const revalidate = 5;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string; trainNo: string }> }
) {
  const { code, trainNo } = await ctx.params;
  try {
    const [rawTrain, rawTimetable] = await Promise.all([
      getActiveTrain(code, trainNo).catch(() => null),
      getTrainTimetable(code, trainNo).catch(() => null),
    ]);
    if (!rawTrain) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        train: toTrainDTO(rawTrain),
        timetable: rawTimetable ? toTrainTimetableDTO(rawTimetable) : null,
      },
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
