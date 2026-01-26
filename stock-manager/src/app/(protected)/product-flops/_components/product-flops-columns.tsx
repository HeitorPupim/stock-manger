import { type ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

import type { ProductFlopRow} from "@/src/app/data/produtos-encalhados";

const formatValue = (value: string | number | null) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
}

const formatDateBr = (value: string | null) => {
  if (!value) {
    return "-";
  }
  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})/);
  if (match) {
    return `${match[1]}/${match[2]}/${match[3]}`;
  }
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("pt-BR");
  }
  return value;
};

const parseDateFromValue = (value: string | null) => {
  if (!value) {
    return null;
  }
  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})/);
  if (match) {
    const day = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    const year = Number(match[3]);
    const parsed = new Date(year, monthIndex, day);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDaysSince = (value: string | null) => {
  const date = parseDateFromValue(value);
  if (!date) {
    return "-";
  }
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const dateStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const diffMs = todayStart.getTime() - dateStart.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays < 0 ? "0" : String(diffDays);
};


export const createProductsColumns = (
  catalogSkuSet: Set<string>,
  salesIntervalDays: number = 30
): ColumnDef<ProductFlopRow>[] => [
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
      const normalized = raw.toLowerCase();
      const filterValue = String(value).toLowerCase();
      if (filterValue === "pano") {
        return normalized.includes("pano") && normalized.includes("(cr)");
      }
      return normalized.includes(filterValue);
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
    accessorKey: "produtoSaldoDisponivel",
    header: () => <div className="w-full text-right">Estoque disponível</div>,
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {formatValue(row.original.produtoSaldoDisponivel)}
      </div>
    ),
  },
  {
    id: "dias-ultima-movimentacao",
    header: () => (
      <div className="w-full text-right">Dias da ultima movimentação</div>
    ),
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {formatDaysSince(row.original.produtoUltimaMovimentacaoData)}
      </div>
    ),
  },
  {
    accessorKey: "produtoUltimaMovimentacaoData",
    header: () => (
      <div className="w-full text-right">
        {`Ultima movimentação(${salesIntervalDays}d)`}
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {formatDateBr(row.original.produtoUltimaMovimentacaoData)}
      </div>
    ),
  },
];
