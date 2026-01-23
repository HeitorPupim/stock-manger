import { desc, eq, sql } from "drizzle-orm";

import { readonlyDb } from "@/src/db/readonly";
import { produto, saidaMateriaPrimaDiaria } from "@/src/db/views-schema";


import z from "zod";

// Valida de se a string é numero inteiro
const dateIntervalSchema = z.string().refine((value) => {
  const parsed = parseInt(value, 10);
  return !isNaN(parsed) && parsed > 0;
}, {
  message: "Numero inválido",
});


export type SalesRankingRow = {
  idProduto: string | null;
  skuProduto: string | null;
  nomeProduto: string | null;
  produtoEstoqueMinimo: string | number | null;
  produtoEstoqueDisponivel: string | number | null;
  totalVendido: string | number | null;
};

export const getSalesRankingLast30Days = async () => {
  const totalVendido = sql<string>`coalesce(sum(${saidaMateriaPrimaDiaria.qtdSaida}), 0)`
    .as("total_vendido");

  return readonlyDb
    .select({
      idProduto: produto.idProduto,
      skuProduto: produto.skuProduto,
      nomeProduto: produto.nomeProduto,
      totalVendido,
    })
    .from(produto)
    .leftJoin(saidaMateriaPrimaDiaria, eq(saidaMateriaPrimaDiaria.skuMateriaPrima, produto.skuProduto))
