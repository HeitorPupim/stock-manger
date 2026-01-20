import { NextResponse } from "next/server";

import { getMinimumStockProducts } from "@/src/app/data/produtos-estoque-minimo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getMinimumStockProducts();
    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Failed to load minimum stock products", error);
    return NextResponse.json(
      { error: "Failed to load minimum stock products" },
      { status: 500 },
    );
  }
}
