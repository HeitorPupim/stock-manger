import { type ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

import type { SalesRankingRow } from "@/src/app/data/saida-produto-diario";

const formatValue = (value: string | number | null) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
};

export const createSalesRankingColumns = (
  catalogSkuSet: Set<string>
): ColumnDef<SalesRankingRow>[] => [
  {
    id: "rank",
    header: "#",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.index + 1}</span>
    ),
  },
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
    header: () => <div className="w-full text-right">Estoque mínimo</div>,
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {formatValue(row.original.produtoEstoqueMinimo)}
      </div>
    ),
  },
  {
    accessorKey: "produtoEstoqueDisponivel",
    header: () => <div className="w-full text-right">Estoque Disponível</div>,
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {formatValue(row.original.produtoEstoqueDisponivel)}
      </div>
    ),
  },
  {
    accessorKey: "totalVendido",
    header: () => <div className="w-full text-right">Qtd vendida (30d)</div>,
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {formatValue(row.original.totalVendido)}
      </div>
    ),
  },
];
