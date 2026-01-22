import { Page } from "@/components/ui/page";
import { getSkus } from "@/src/app/data/catalog-queries";

import ItemInput from "./_components/form";
import { SkuList } from "./_components/sku-list";


const CatalogPage = async () => {
  const skus = await getSkus();

  return (
    <Page>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Catálogo
        </h1>
        <p className="text-muted-foreground">Gerencie seus SKUs aqui.</p>
      </div>

      <div className="max-w-md">
        <ItemInput />
      </div>

      <SkuList skus={skus} />
    </Page>
  );
};

export default CatalogPage;
