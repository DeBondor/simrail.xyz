import { NextResponse } from "next/server";
import { getActiveServers } from "@/lib/simrail/client";
import { toServerDTO } from "@/lib/simrail/dto";

export const revalidate = 30;

export async function GET() {
  try {
    const raw = await getActiveServers();
    const servers = raw.map(toServerDTO);
    return NextResponse.json(
      { servers },
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
