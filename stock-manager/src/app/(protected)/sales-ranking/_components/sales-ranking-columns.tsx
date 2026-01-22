import { type ColumnDef } from "@tanstack/react-table";

import type { SalesRankingRow } from "@/src/app/data/saida-produto-diario";

const formatValue = (value: string | number | null) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
};

export const salesRankingColumns: ColumnDef<SalesRankingRow>[] = [
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
    cell: ({ row }) => (
      <span className="font-medium">
        {formatValue(row.original.nomeProduto)}
      </span>
    ),
    filterFn: (row, id, value) => {
      const raw = row.getValue(id);
      if (typeof raw !== "string") {
        return false;
      }
      return raw.toLowerCase().includes(String(value).toLowerCase());
    },
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
