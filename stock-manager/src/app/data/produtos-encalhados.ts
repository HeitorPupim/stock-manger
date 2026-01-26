import {asc, eq, sql} from "drizzle-orm";
import z from "zod";

import {readonlyDb} from "@/src/db/readonly";
import {
  produto,
  produtoEstoque,
} from "@/src/db/views-schema";


export type ProductFlopRow = {
  idProduto: string | null;
  skuProduto: string | null;
  nomeProduto: string | null;
  produtoEstoqueMinimo: string | number | null;
  produtoSaldoDisponivel: string | number | null;
  produtoUltimaMovimentacaoData: string | null;
};

export const DEFAULT_PRODUCT_FLOPS_INTERVAL_DAYS = 30;

const intervalDaysSchema = z.coerce.number().int().positive();

export const resolveProductFlopsIntervalDays = (
  value?: string | number | null
) => {
  if (value === null || value === undefined || value === "") {
    return DEFAULT_PRODUCT_FLOPS_INTERVAL_DAYS;
  }
  const parsed = intervalDaysSchema.safeParse(value);
  return parsed.success
    ? parsed.data
    : DEFAULT_PRODUCT_FLOPS_INTERVAL_DAYS;
};

// Produtos Encalhados:

export const getProductFlops = async (
  intervalDays: number = DEFAULT_PRODUCT_FLOPS_INTERVAL_DAYS
) => {
  const safeIntervalDays = resolveProductFlopsIntervalDays(intervalDays);
  const ultimaMovimentacao = sql`to_timestamp(${produtoEstoque.updatedAt}, 'DD-MM-YYYY HH24:MI:SS')`;

  return readonlyDb
    .select({
      idProduto: produtoEstoque.idProduto,
      skuProduto: produto.skuProduto,
      nomeProduto: produto.nomeProduto,
      produtoEstoqueMinimo: produtoEstoque.produtoEstoqueMinimo,
      produtoSaldoDisponivel: produtoEstoque.produtoSaldoDisponivel,
      produtoUltimaMovimentacaoData: produtoEstoque.updatedAt,
    })
    .from(produtoEstoque)
    .leftJoin(
      produto,
      eq(produto.idProduto, produtoEstoque.idProduto)
    )
    .where(
      sql`${ultimaMovimentacao} <= current_date - (${safeIntervalDays} * interval '1 day')
      and ${produtoEstoque.produtoSaldoDisponivel} > 0`
    )
    .orderBy(asc(ultimaMovimentacao));
};
