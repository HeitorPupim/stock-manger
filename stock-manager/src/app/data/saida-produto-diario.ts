import { desc, sql } from "drizzle-orm";

import { readonlyDb } from "@/src/db/readonly";
import { saidaProdutoDiario } from "@/src/db/views-schema";

export type SalesRankingRow = {
  skuProduto: string | null;
  nomeProduto: string | null;
  totalVendido: string | number | null;
};

export const getSalesRankingLast30Days = async () => {
  const totalVendido = sql<string>`coalesce(sum(${saidaProdutoDiario.somaQtdVenda}), 0)`
    .as("total_vendido");

  return readonlyDb
    .select({
      skuProduto: saidaProdutoDiario.skuProduto,
      nomeProduto: saidaProdutoDiario.nomeProduto,
      totalVendido,
    })
    .from(saidaProdutoDiario)
    .where(
      sql`${saidaProdutoDiario.data} >= current_date - interval '30 days'`
    )
    .groupBy(saidaProdutoDiario.skuProduto, saidaProdutoDiario.nomeProduto)
    .orderBy(desc(totalVendido));
};
