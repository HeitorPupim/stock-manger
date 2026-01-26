import { type NextRequest,NextResponse } from "next/server";

import {
  getProductFlops,
  resolveProductFlopsIntervalDays,
} from "@/src/app/data/produtos-encalhados";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const daysParam = request.nextUrl.searchParams.get("days");
  const intervalDays = resolveProductFlopsIntervalDays(daysParam);

  try {
    const data = await getProductFlops(intervalDays);
    return NextResponse.json(
      { data, intervalDays },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Failed to load stuck products", error);
    return NextResponse.json(
      { error: "Failed to load stuck products" },
      { status: 500 }
    );
  }
}
