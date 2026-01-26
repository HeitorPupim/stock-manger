import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getSkus } from "@/src/app/data/catalog-queries";
import { getMinimumStockProducts } from "@/src/app/data/produtos-estoque-minimo";
import { getSalesRankingLast30Days } from "@/src/app/data/saida-produto-diario";

import DataTable from "./_components/data-table";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.emailVerified) {
    redirect("/auth");
  }

  const minimumStockResult = await getMinimumStockProducts();
  const salesRanking = await getSalesRankingLast30Days();
  const catalogSkus = await getSkus();

  return (
    <div>
      <DataTable
        data={minimumStockResult}
        catalogSkus={catalogSkus.map((item) => item.sku)}
        salesRanking={salesRanking}
      />
    </div>
  );
};

export default DashboardPage;
