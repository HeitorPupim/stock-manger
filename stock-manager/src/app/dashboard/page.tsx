import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getMinimumStockProducts } from "@/src/app/data/produtos-estoque-minimo";

import DashboardHeader from "./components/dashboard-header";
import DataTable from "./components/data-table";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.emailVerified) {
    redirect("/auth");
  }

  const minimumStockResult = await getMinimumStockProducts();

  return (
    <div>
      <DashboardHeader
        user={{
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
        }}
      />
      <DataTable data={minimumStockResult} />
    </div>
  );
};

export default DashboardPage;
