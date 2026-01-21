"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { protectedActionClient } from "@/lib/action-client";
import { db } from "@/src/db";
import { catalogProduct } from "@/src/db/schema";

const skuSchema = z.object({
  sku: z.string().trim().min(3, { message: "SKU deve ter pelo menos 3 caracteres." }),
});

const updateSkuSchema = skuSchema.extend({
  id: z.string().min(1, { message: "SKU inválido." }),
});

const deleteSkuSchema = z.object({
  id: z.string().min(1, { message: "SKU inválido." }),
});

export const addSku = protectedActionClient
  .schema(skuSchema)
  .action(async ({ parsedInput }) => {
    const sku = parsedInput.sku.trim();
    await db.insert(catalogProduct).values({ sku });
    return { sku };
  });

export const updateSku = protectedActionClient
  .schema(updateSkuSchema)
  .action(async ({ parsedInput }) => {
    const sku = parsedInput.sku.trim();
    await db
      .update(catalogProduct)
      .set({ sku })
      .where(eq(catalogProduct.id, parsedInput.id));
    return { id: parsedInput.id, sku };
  });

export const deleteSku = protectedActionClient
  .schema(deleteSkuSchema)
  .action(async ({ parsedInput }) => {
    await db.delete(catalogProduct).where(eq(catalogProduct.id, parsedInput.id));
    return { id: parsedInput.id };
  });
