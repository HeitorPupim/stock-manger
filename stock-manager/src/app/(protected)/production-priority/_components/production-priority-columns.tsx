import { type ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

import type { ProductionPriorityRow } from "@/src/app/data/prioridade-producao";

const formatValue = (value: string | number | null) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
};

const formatIndex = (value: string | number | null) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return String(value);
  }
  return numericValue.toFixed(2);
};

export const createProductionPriorityColumns = (
  catalogSkuSet: Set<string>
): ColumnDef<ProductionPriorityRow>[] => [
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
        <div className="flex flex-wrap items-center gap-2">
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
      const normalized = raw.toLowerCase();
      const filterValue = String(value).toLowerCase();
      if (filterValue === "pano") {
        return normalized.includes("pano") || normalized.includes("panagem");
      }
      return normalized.includes(filterValue);
    },
  },
  // {
  //   accessorKey: "estoqueMinimo",
  //   header: () => <div className="w-full text-right">Estoque minimo</div>,
  //   cell: ({ row }) => (
  //     <div className="text-center tabular-nums">
  //       {formatValue(row.original.estoqueMinimo)}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "estoqueDisponivel",
    header: () => <div className="w-full text-center">Estoque disponível</div>,
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {formatValue(row.original.estoqueDisponivel)}
      </div>
    ),
  },
  {
    accessorKey: "totalVendido30d",
    header: () => <div className="w-full text-center">Qtd (30d)</div>,
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {formatValue(row.original.totalVendido30d)}
      </div>
    ),
  },
  {
    accessorKey: "indiceImportancia",
    header: () => <div className="w-full text-center">Índice</div>,
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {formatIndex(row.original.indiceImportancia)}
      </div>
    ),
  },
];
