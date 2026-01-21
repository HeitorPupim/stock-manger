import { asc } from "drizzle-orm";

import { db } from "@/src/db";
import { catalogProduct } from "@/src/db/schema";

export const getSkus = async () => {
  return db
    .select({
      id: catalogProduct.id,
      sku: catalogProduct.sku,
    })
    .from(catalogProduct)
    .orderBy(asc(catalogProduct.createdAt));
};
