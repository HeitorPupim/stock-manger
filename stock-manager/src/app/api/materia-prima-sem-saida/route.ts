import { type NextRequest,NextResponse } from "next/server";

import {
  getStuckProducts,
  resolveStuckProductsIntervalDays,
} from "@/src/app/data/materia-prima-sem-saida";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const daysParam = request.nextUrl.searchParams.get("days");
  const intervalDays = resolveStuckProductsIntervalDays(daysParam);

  try {
    const data = await getStuckProducts(intervalDays);
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
