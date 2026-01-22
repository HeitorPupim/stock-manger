import { getSalesRankingLast30Days } from "@/src/app/data/saida-produto-diario";

import SalesRankingTable from "./_components/sales-ranking-table";

export const dynamic = "force-dynamic";

const SalesRankingPage = async () => {
  const salesRanking = await getSalesRankingLast30Days();

  return <SalesRankingTable data={salesRanking} />;
};

export default SalesRankingPage;
