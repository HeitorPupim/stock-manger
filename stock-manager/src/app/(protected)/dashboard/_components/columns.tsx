import { type ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

export type MinimumStockRow = {
  idProduto: string | null;
  skuProduto: string | null;
  nomeProduto: string | null;
  estoqueMinimo: string | number | null;
  produtoSaldo: string | number | null;
  estoqueAtual: string | number | null;
  dataSaida: string | null;
};

const formatValue = (value: string | number | null) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
};

export const createColumns = (
  catalogSkuSet: Set<string>
): ColumnDef<MinimumStockRow>[] => [
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
    accessorKey: "estoqueMinimo",
    header: () => <div className="w-full text-right">Estoque minimo</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatValue(row.original.estoqueMinimo)}
      </div>
    ),
  },
  {
    accessorKey: "produtoSaldo",
    header: () => <div className="w-full text-right">Saldo</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatValue(row.original.produtoSaldo)}
      </div>
    ),
  },
  {
    accessorKey: "estoqueAtual",
    header: () => <div className="w-full text-right">Estoque atual</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatValue(row.original.estoqueAtual)}
      </div>
    ),
  },
  {
    accessorKey: "dataSaida",
    header: "Data saida",
    cell: ({ row }) => formatValue(row.original.dataSaida),
  },
];
