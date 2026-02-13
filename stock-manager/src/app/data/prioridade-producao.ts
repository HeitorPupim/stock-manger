import { asc, eq, sql } from "drizzle-orm";

import { readonlyDb } from "@/src/db/readonly";
import {
  produto,
  produtoEstoque,
  saidaProdutoDiario,
} from "@/src/db/views-schema";

export type ProductionPriorityRow = {
  idProduto: string | null;
  skuProduto: string | null;
  nomeProduto: string | null;
  estoqueMinimo: string | number | null;
  estoqueDisponivel: string | number | null;
  totalVendido30d: string | number | null;
  indiceImportancia: string | number | null;
};

export const getProductionPriority = async () => {
  const salesLast30d = readonlyDb
    .select({
      skuProduto: saidaProdutoDiario.skuProduto,
      totalVendido30d: sql<string>`coalesce(sum(${saidaProdutoDiario.somaQtdVenda}), 0)`.as(
        "total_vendido_30d"
      ),
    })
    .from(saidaProdutoDiario)
    .where(sql`${saidaProdutoDiario.data} >= current_date - interval '30 days'`)
    .groupBy(saidaProdutoDiario.skuProduto)
    .as("sales_last_30d");

  const totalVendido30dExpr = sql<string>`coalesce(${salesLast30d.totalVendido30d}, 0)`;
  const indiceImportanciaExpr = sql<string>`case
    when ${produtoEstoque.produtoSaldoDisponivel}::numeric > 0
      then round(${totalVendido30dExpr}::numeric / ${produtoEstoque.produtoSaldoDisponivel}::numeric, 2)
    else null
  end`;

  return readonlyDb
    .select({
      idProduto: produto.idProduto,
      skuProduto: produto.skuProduto,
      nomeProduto: produto.nomeProduto,
      estoqueMinimo: produtoEstoque.produtoEstoqueMinimo,
      estoqueDisponivel: produtoEstoque.produtoSaldoDisponivel,
      totalVendido30d: totalVendido30dExpr.as("total_vendido_30d"),
      indiceImportancia: indiceImportanciaExpr.as("indice_importancia"),
    })
    .from(produto)
    .leftJoin(produtoEstoque, eq(produto.idProduto, produtoEstoque.idProduto))
    .leftJoin(salesLast30d, eq(salesLast30d.skuProduto, produto.skuProduto))
    .orderBy(sql`${indiceImportanciaExpr} desc nulls last`, asc(produto.skuProduto));
};
