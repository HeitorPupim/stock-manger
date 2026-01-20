import { type ColumnDef } from "@tanstack/react-table";

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

export const columns: ColumnDef<MinimumStockRow>[] = [
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


