import { getSkus } from "@/src/app/data/catalog-queries";

import ItemInput from "./_components/form";
import { SkuList } from "./_components/sku-list";


const CatalogPage = async () => {
  const skus = await getSkus();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Catalog Management
        </h1>
        <p className="text-muted-foreground">Manage your product SKUs here.</p>
      </div>

      <div className="max-w-md">
        <ItemInput />
      </div>

      <SkuList skus={skus} />
    </div>
  );
};

export default CatalogPage;
