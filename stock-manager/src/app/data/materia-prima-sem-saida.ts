import { desc, eq, sql } from "drizzle-orm";
import z from "zod";

import { readonlyDb } from "@/src/db/readonly";
import {
  produto,
  produtoEstoque,
  saidaMateriaPrimaDiaria,
} from "@/src/db/views-schema";

export type StuckProductRow = {
  idProduto: string | null;
  skuProduto: string | null;
  nomeProduto: string | null;
  produtoEstoqueMinimo: string | number | null;
  produtoEstoqueDisponivel: string | number | null;
  totalVendido: string | number | null;
};

export const DEFAULT_STUCK_PRODUCTS_INTERVAL_DAYS = 30;

const intervalDaysSchema = z.coerce.number().int().positive();

export const resolveStuckProductsIntervalDays = (
  value?: string | number | null
) => {
  if (value === null || value === undefined || value === "") {
    return DEFAULT_STUCK_PRODUCTS_INTERVAL_DAYS;
  }
  const parsed = intervalDaysSchema.safeParse(value);
  return parsed.success
    ? parsed.data
    : DEFAULT_STUCK_PRODUCTS_INTERVAL_DAYS;
};

// Saída de matéria prima
export const getStuckProducts = async (
  intervalDays: number = DEFAULT_STUCK_PRODUCTS_INTERVAL_DAYS
) => {
  const safeIntervalDays = resolveStuckProductsIntervalDays(intervalDays);
  const stuckProductsInterval = readonlyDb
    .select({
      data: saidaMateriaPrimaDiaria.data,
      skuMateriaPrima: saidaMateriaPrimaDiaria.skuMateriaPrima,
      nomeMateriaPrima: saidaMateriaPrimaDiaria.nomeMateriaPrima,
      qtdSaida: saidaMateriaPrimaDiaria.qtdSaida,
    })
    .from(saidaMateriaPrimaDiaria)
    .where(
      sql`${saidaMateriaPrimaDiaria.data} >= current_date - (${safeIntervalDays} * interval '1 day')`
    )
    .as("smp");

  const totalVendido = sql<string>`coalesce(sum(${stuckProductsInterval.qtdSaida}), 0)`
    .as("total_vendido");
  const produtoEstoqueMinimoValue = sql<string | number | null>`coalesce(${produtoEstoque.produtoEstoqueMinimo}, 0)`
    .as("produto_estoque_minimo");
  const produtoEstoqueDisponivelValue = sql<string | number | null>`coalesce(${produtoEstoque.produtoSaldoDisponivel}, 0)`
    .as("produto_estoque_disponivel");

  return readonlyDb
    .select({
      idProduto: produto.idProduto,
      skuProduto: produto.skuProduto,
      nomeProduto: produto.nomeProduto,
      produtoEstoqueMinimo: produtoEstoqueMinimoValue,
      produtoEstoqueDisponivel: produtoEstoqueDisponivelValue,
      totalVendido,
    })
    .from(produto)
    .leftJoin(produtoEstoque, eq(produtoEstoque.idProduto, produto.idProduto))
    .leftJoin(
      stuckProductsInterval,
      eq(stuckProductsInterval.skuMateriaPrima, produto.skuProduto)
    )
    .groupBy(
      produto.idProduto,
      produto.skuProduto,
      produto.nomeProduto,
      produtoEstoque.produtoEstoqueMinimo,
      produtoEstoque.produtoSaldoDisponivel
    )
    .having(
      sql`coalesce(sum(${stuckProductsInterval.qtdSaida}), 0) = 0`
    )
    .orderBy(desc(totalVendido), desc(produtoEstoqueDisponivelValue));
};
