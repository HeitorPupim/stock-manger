import { getSkus } from "@/src/app/data/catalog-queries";
import { getSalesRankingLast30Days } from "@/src/app/data/saida-produto-diario";

import SalesRankingTable from "./_components/sales-ranking-table";

export const dynamic = "force-dynamic";

const SalesRankingPage = async () => {
  const salesRanking = await getSalesRankingLast30Days();
  const catalogSkus = await getSkus();

  return (
    <SalesRankingTable
      data={salesRanking}
      catalogSkus={catalogSkus.map((item) => item.sku)}
    />
  );
};

export default SalesRankingPage;
