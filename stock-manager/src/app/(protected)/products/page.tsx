import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getSkus } from "@/src/app/data/catalog-queries";
import {
  DEFAULT_MATERIA_PRIMA_INTERVAL_DAYS,
  getSalesRankingByInterval,
} from "@/src/app/data/saida-materia-prima-diario";

import ProductsTable from "./_components/products-table";

export const dynamic = "force-dynamic";

const ProductsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.emailVerified) {
    redirect("/auth");
  }

  const [salesRanking, catalogSkus] = await Promise.all([
    getSalesRankingByInterval(DEFAULT_MATERIA_PRIMA_INTERVAL_DAYS),
    getSkus(),
  ]);

  return (
    <ProductsTable
      data={salesRanking}
      catalogSkus={catalogSkus.map((item) => item.sku)}
      initialIntervalDays={DEFAULT_MATERIA_PRIMA_INTERVAL_DAYS}
    />
  );
};

export default ProductsPage;
