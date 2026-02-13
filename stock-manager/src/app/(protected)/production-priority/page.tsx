import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getSkus } from "@/src/app/data/catalog-queries";
import { getProductionPriority } from "@/src/app/data/prioridade-producao";

import ProductionPriorityTable from "./_components/production-priority-table";

export const dynamic = "force-dynamic";

const ProductionPriorityPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.emailVerified) {
    redirect("/auth");
  }

  const [productionPriority, catalogSkus] = await Promise.all([
    getProductionPriority(),
    getSkus(),
  ]);

  return (
    <ProductionPriorityTable
      data={productionPriority}
      catalogSkus={catalogSkus.map((item) => item.sku)}
      initialUpdatedAt={new Date().toISOString()}
    />
  );
};

export default ProductionPriorityPage;
