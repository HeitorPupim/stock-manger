import { NextResponse, type NextRequest } from "next/server";

import {
  getSalesRankingByInterval,
  resolveMateriaPrimaIntervalDays,
} from "@/src/app/data/saida-materia-prima-diario";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const daysParam = request.nextUrl.searchParams.get("days");
  const intervalDays = resolveMateriaPrimaIntervalDays(daysParam);

  try {
    const data = await getSalesRankingByInterval(intervalDays);
    return NextResponse.json(
      { data, intervalDays },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Failed to load raw material sales ranking", error);
    return NextResponse.json(
      { error: "Failed to load raw material sales ranking" },
      { status: 500 }
    );
  }
}
