import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getSkus } from "@/src/app/data/catalog-queries";
import {
  DEFAULT_STUCK_PRODUCTS_INTERVAL_DAYS,
  getStuckProducts,
} from "@/src/app/data/materia-prima-sem-saida";

import StuckProductsTable from "./_components/stuck-products-table";

export const dynamic = "force-dynamic";

const ProductsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.emailVerified) {
    redirect("/auth");
  }

  const [salesRanking, catalogSkus] = await Promise.all([
    getStuckProducts(DEFAULT_STUCK_PRODUCTS_INTERVAL_DAYS),
    getSkus(),
  ]);

  return (
    <StuckProductsTable
      data={salesRanking}
      catalogSkus={catalogSkus.map((item) => item.sku)}
      initialIntervalDays={DEFAULT_STUCK_PRODUCTS_INTERVAL_DAYS}
    />
  );
};

export default ProductsPage;
