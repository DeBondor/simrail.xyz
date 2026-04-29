import { NextResponse } from "next/server";
import { getActiveTrains, withTtl } from "@/lib/simrail/client";
import { toTrainDTO } from "@/lib/simrail/dto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> }
) {
  const { code } = await ctx.params;
  try {
    const raw = await withTtl(`trains:${code}`, 2_000, () =>
      getActiveTrains(code)
    );
    const trains = raw.map(toTrainDTO);
    return NextResponse.json(
      { trains },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
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
