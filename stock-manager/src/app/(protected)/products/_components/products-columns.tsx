import { type ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

import type { SalesRankingRow } from "@/src/app/data/saida-materia-prima-diario";

const formatValue = (value: string | number | null) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
};

export const createProductsColumns = (
  catalogSkuSet: Set<string>,
  salesIntervalDays: number = 30
): ColumnDef<SalesRankingRow>[] => [
  {
    accessorKey: "skuProduto",
    header: "SKU",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {formatValue(row.original.skuProduto)}
      </span>
    ),
  },
  {
    accessorKey: "nomeProduto",
    header: "Produto",
    cell: ({ row }) => {
      const sku = row.original.skuProduto?.trim().toLowerCase() ?? "";
      const isCatalog = sku ? catalogSkuSet.has(sku) : false;

      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {formatValue(row.original.nomeProduto)}
          </span>
          {isCatalog ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-900">
              <Star className="h-3 w-3" />
              Catalogo
            </span>
          ) : null}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const raw = row.getValue(id);
      if (typeof raw !== "string") {
        return false;
      }
      return raw.toLowerCase().includes(String(value).toLowerCase());
    },
  },
  {
    accessorKey: "produtoEstoqueMinimo",
    header: () => <div className="w-full text-right">Estoque minimo</div>,
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {formatValue(row.original.produtoEstoqueMinimo)}
      </div>
    ),
  },
  {
    accessorKey: "totalVendido",
    header: () => (
      <div className="w-full text-right">
        {`Qtd saida (${salesIntervalDays}d)`}
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {formatValue(row.original.totalVendido)}
      </div>
    ),
  },
];
