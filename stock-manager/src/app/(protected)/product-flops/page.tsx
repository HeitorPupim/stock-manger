import { headers} from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getSkus } from "@/src/app/data/catalog-queries";
import {
  DEFAULT_PRODUCT_FLOPS_INTERVAL_DAYS,
  getProductFlops,
} from "@/src/app/data/produtos-encalhados";

import ProductFlopsTable from "./_components/product-flops-table";

export const dynamic = "force-dynamic";

const ProductFlopsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user.emailVerified) {
    redirect("/auth");
  }

  const [productFlops, catalogSkus] = await Promise.all([
    getProductFlops(DEFAULT_PRODUCT_FLOPS_INTERVAL_DAYS),
    getSkus(),
  ]);
  
  return (
    <ProductFlopsTable
      data={productFlops}
      catalogSkus={catalogSkus.map((item) => item.sku)}
      initialIntervalDays={DEFAULT_PRODUCT_FLOPS_INTERVAL_DAYS}
    />
  );
}

export default ProductFlopsPage;