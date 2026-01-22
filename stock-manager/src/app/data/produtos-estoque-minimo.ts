import { asc, desc } from "drizzle-orm";

import { readonlyDb } from "@/src/db/readonly";
import { produtoEmEstoqueMinimo } from "@/src/db/views-schema";

export const getMinimumStockProducts = async () => {
 
  const productRows = await readonlyDb
    .select()
    .from(produtoEmEstoqueMinimo)
    .orderBy(
      asc(produtoEmEstoqueMinimo.estoqueAtual)
    );
  return productRows;
}
