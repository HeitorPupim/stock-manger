import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getSkus } from "@/src/app/data/catalog-queries";
import { getMinimumStockProducts } from "@/src/app/data/produtos-estoque-minimo";

import DataTable from "./_components/data-table";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.emailVerified) {
    redirect("/auth");
  }

  const minimumStockResult = await getMinimumStockProducts();
  const catalogSkus = await getSkus();

  return (
    <div>
      <DataTable
        data={minimumStockResult}
        catalogSkus={catalogSkus.map((item) => item.sku)}
      />
    </div>
  );
};

export default DashboardPage;
