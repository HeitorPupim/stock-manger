import { desc, eq, sql } from "drizzle-orm";

import { readonlyDb } from "@/src/db/readonly";
import { produto, produtoEstoque, saidaProdutoDiario } from "@/src/db/views-schema";

export type SalesRankingRow = {
  idProduto: string | null;
  skuProduto: string | null;
  nomeProduto: string | null;
  produtoEstoqueMinimo: string | number | null;
  produtoEstoqueDisponivel: string | number | null;
  totalVendido: string | number | null;
};

export const getSalesRankingLast30Days = async () => {
  const totalVendido = sql<string>`coalesce(sum(${saidaProdutoDiario.somaQtdVenda}), 0)`
    .as("total_vendido");

  return readonlyDb
    .select({
      idProduto: produtoEstoque.idProduto,
      skuProduto: saidaProdutoDiario.skuProduto,
      nomeProduto: saidaProdutoDiario.nomeProduto,
      produtoEstoqueMinimo: produtoEstoque.produtoEstoqueMinimo,
      produtoEstoqueDisponivel: produtoEstoque.produtoSaldoDisponivel,
      totalVendido,
    })
    .from(saidaProdutoDiario)
    .leftJoin(produto, eq(saidaProdutoDiario.skuProduto, produto.skuProduto))
    .leftJoin(produtoEstoque, eq(produtoEstoque.idProduto, produto.idProduto))
    .where(
      sql`${saidaProdutoDiario.data} >= current_date - interval '30 days'`
    )
    .groupBy(
      saidaProdutoDiario.skuProduto,
      saidaProdutoDiario.nomeProduto,
      produtoEstoque.idProduto,
      produtoEstoque.produtoEstoqueMinimo,
      produtoEstoque.produtoSaldoDisponivel
    )
    .orderBy(desc(totalVendido));
};
