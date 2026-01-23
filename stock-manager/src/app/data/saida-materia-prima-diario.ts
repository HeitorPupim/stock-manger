import { asc, desc, eq, sql } from "drizzle-orm";
import z from "zod";

import { readonlyDb } from "@/src/db/readonly";
import {
  produto,
  produtoEstoque,
  saidaMateriaPrimaDiaria,
} from "@/src/db/views-schema";

export type SalesRankingRow = {
  idProduto: string | null;
  skuProduto: string | null;
  nomeProduto: string | null;
  produtoEstoqueMinimo: string | number | null;
  totalVendido: string | number | null;
};

export const DEFAULT_MATERIA_PRIMA_INTERVAL_DAYS = 30;

const intervalDaysSchema = z.coerce.number().int().positive();

export const resolveMateriaPrimaIntervalDays = (
  value?: string | number | null
) => {
  if (value === null || value === undefined || value === "") {
    return DEFAULT_MATERIA_PRIMA_INTERVAL_DAYS;
  }
  const parsed = intervalDaysSchema.safeParse(value);
  return parsed.success
    ? parsed.data
    : DEFAULT_MATERIA_PRIMA_INTERVAL_DAYS;
};

export const getSalesRankingByInterval = async (
  intervalDays: number = DEFAULT_MATERIA_PRIMA_INTERVAL_DAYS
) => {
  const safeIntervalDays = resolveMateriaPrimaIntervalDays(intervalDays);
  const saidaMateriaPrimaInterval = readonlyDb
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

  const totalVendido = sql<string>`coalesce(sum(${saidaMateriaPrimaInterval.qtdSaida}), 0)`
    .as("total_vendido");

  return readonlyDb
    .select({
      idProduto: produto.idProduto,
      skuProduto: produto.skuProduto,
      nomeProduto: produto.nomeProduto,
      produtoEstoqueMinimo: produtoEstoque.produtoEstoqueMinimo,
      produtoEstoqueDisponivel: produtoEstoque.produtoSaldoDisponivel,
      totalVendido,
    })
    .from(produto)
    .leftJoin(produtoEstoque, eq(produtoEstoque.idProduto, produto.idProduto))
    .leftJoin(
      saidaMateriaPrimaInterval,
      eq(saidaMateriaPrimaInterval.skuMateriaPrima, produto.skuProduto)
    )
    .groupBy(
      produto.idProduto,
      produto.skuProduto,
      produto.nomeProduto,
      produtoEstoque.produtoEstoqueMinimo,
      produtoEstoque.produtoSaldoDisponivel
    )
    .orderBy(desc(totalVendido), asc(produtoEstoque.produtoEstoqueMinimo));
};
