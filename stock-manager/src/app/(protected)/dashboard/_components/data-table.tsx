"use client";

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SalesRankingRow } from "@/src/app/data/saida-produto-diario";

import { createColumns, type MinimumStockRow } from "./columns";

type FilterPreset = {
  id: "all" | "rede" | "pano";
  label: string;
  value: string | null;
};

const filterPresets: FilterPreset[] = [
  { id: "all", label: "Todos", value: null },
  { id: "rede", label: "Rede de Pesca", value: "rede" },
  { id: "pano", label: "Panagem", value: "pano" },
];

const filterRules: Record<FilterPreset["id"], ColumnFiltersState> = {
  all: [],
  rede: [{ id: "nomeProduto", value: "rede" }],
  pano: [{ id: "nomeProduto", value: "pano" }],
};

const getRowKey = (row: MinimumStockRow, index: number) =>
  row.idProduto ?? row.skuProduto ?? `row-${index}`;

const normalizeText = (value: string | number | null) =>
  value === null || value === undefined ? "" : String(value).trim().toLowerCase();

const getSkuKey = (value: string | number | null) => {
  const normalized = normalizeText(value);
  return normalized ? `sku:${normalized}` : "";
};

const getNameKey = (value: string | number | null) => {
  const normalized = normalizeText(value);
  return normalized ? `nome:${normalized}` : "";
};

const getRankingKey = (sku: string | null, name: string | null) => {
  const skuKey = getSkuKey(sku);
  if (skuKey) {
    return skuKey;
  }
  const nameKey = getNameKey(name);
  return nameKey;
};

const buildRankingMap = (
  salesRanking: SalesRankingRow[],
  matchValues: string[]
) => {
  const normalizedMatches = matchValues
    .map((value) => normalizeText(value))
    .filter(Boolean);
  const map = new Map<string, number>();
  let rank = 0;

  for (const row of salesRanking) {
    const name = normalizeText(row.nomeProduto);
    if (!name) {
      continue;
    }
    const matchesFilter = normalizedMatches.some((value) =>
      name.includes(value)
    );
    if (!matchesFilter) {
      continue;
    }
    const key = getRankingKey(row.skuProduto, row.nomeProduto);
    if (!key || map.has(key)) {
      continue;
    }
    map.set(key, rank);
    rank += 1;
  }

  return map;
};

const buildSalesTotalMap = (salesRanking: SalesRankingRow[]) => {
  const map = new Map<string, string | number | null>();

  for (const row of salesRanking) {
    const total = row.totalVendido ?? null;
    const skuKey = getSkuKey(row.skuProduto);
    const nameKey = getNameKey(row.nomeProduto);

    if (skuKey && !map.has(skuKey)) {
      map.set(skuKey, total);
    }
    if (nameKey && !map.has(nameKey)) {
      map.set(nameKey, total);
    }
  }

  return map;
};

const toNumber = (value: string | number | null) => {
  if (value === null || value === undefined || value === "") {
    return Number.POSITIVE_INFINITY;
  }
  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? Number.POSITIVE_INFINITY : numericValue;
};

const toNumberOrNull = (value: string | number | null) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? null : numericValue;
};

const DataTable = ({
  data: initialData,
  catalogSkus,
  salesRanking,
}: {
  data: MinimumStockRow[];
  catalogSkus: string[];
  salesRanking: SalesRankingRow[];
}) => {
  const [activeFilter, setActiveFilter] = React.useState<FilterPreset["id"]>(
    "all"
  );
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [data, setData] = React.useState<MinimumStockRow[]>(initialData);
  const [lastUpdatedAt, setLastUpdatedAt] = React.useState<Date | null>(null);
  const [refreshError, setRefreshError] = React.useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const catalogSkuSet = React.useMemo(
    () =>
      new Set(
        catalogSkus
          .map((sku) => sku.trim().toLowerCase())
          .filter((sku) => sku.length)
      ),
    [catalogSkus]
  );
  const rankingMaps = React.useMemo(
    () => ({
      rede: buildRankingMap(salesRanking, ["rede"]),
      pano: buildRankingMap(salesRanking, ["pano", "panagem"]),
    }),
    [salesRanking]
  );
  const salesTotalsMap = React.useMemo(
    () => buildSalesTotalMap(salesRanking),
    [salesRanking]
  );
  const getSalesRank = React.useCallback(
    (row: MinimumStockRow) => {
      const skuKey = getSkuKey(row.skuProduto);
      const nameKey = getNameKey(row.nomeProduto);
      const getRank = (map: Map<string, number>) => {
        if (skuKey && map.has(skuKey)) {
          return map.get(skuKey) ?? null;
        }
        if (nameKey && map.has(nameKey)) {
          return map.get(nameKey) ?? null;
        }
        return null;
      };
      if (activeFilter === "rede") {
        return getRank(rankingMaps.rede);
      }
      if (activeFilter === "pano") {
        return getRank(rankingMaps.pano);
      }
      return getRank(rankingMaps.rede) ?? getRank(rankingMaps.pano);
    },
    [activeFilter, rankingMaps]
  );
  const getSalesTotal = React.useCallback(
    (row: MinimumStockRow) => {
      const skuKey = getSkuKey(row.skuProduto);
      if (skuKey && salesTotalsMap.has(skuKey)) {
        return salesTotalsMap.get(skuKey) ?? null;
      }
      const nameKey = getNameKey(row.nomeProduto);
      if (nameKey && salesTotalsMap.has(nameKey)) {
        return salesTotalsMap.get(nameKey) ?? null;
      }
      return null;
    },
    [salesTotalsMap]
  );
  const columns = React.useMemo(
    () => createColumns(catalogSkuSet, getSalesRank, getSalesTotal),
    [catalogSkuSet, getSalesRank, getSalesTotal]
  );

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  React.useEffect(() => {
    if (initialData.length) {
      setLastUpdatedAt(new Date());
    }
  }, [initialData.length]);

  const sortedData = React.useMemo(() => {
    return data
      .map((row, index) => ({ row, index }))
      .sort((a, b) => {
        const aValue = toNumber(a.row.estoqueAtual);
        const bValue = toNumber(b.row.estoqueAtual);

        if (aValue !== bValue) {
          return aValue - bValue;
        }

        if (activeFilter === "rede" || activeFilter === "pano") {
          const aSales = toNumberOrNull(getSalesTotal(a.row));
          const bSales = toNumberOrNull(getSalesTotal(b.row));

          if (aSales !== null && bSales !== null && aSales !== bSales) {
            return bSales - aSales;
          }
          if (aSales !== null && bSales === null) {
            return -1;
          }
          if (aSales === null && bSales !== null) {
            return 1;
          }
        }

        return a.index - b.index;
      })
      .map((item) => item.row);
  }, [activeFilter, data, getSalesTotal]);

  const fetchData = React.useCallback(async () => {
    setIsRefreshing(true);
    setRefreshError(null);
    try {
      const response = await fetch("/api/produtos-estoque-minimo", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const payload = (await response.json()) as { data?: MinimumStockRow[] };
      setData(payload.data ?? []);
      setLastUpdatedAt(new Date());
    } catch (error) {
      console.error("Failed to refresh table data", error);
      setRefreshError("Falha ao atualizar.");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      fetchData();
      intervalId = setInterval(fetchData, 300_000);
    };

    const stop = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      stop();
      if (document.visibilityState === "visible") {
        start();
      }
    };

    if (document.visibilityState === "visible") {
      start();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchData]);

   
  const table = useReactTable({
    data: sortedData,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filteredCount = table.getFilteredRowModel().rows.length;
  const lastUpdatedLabel = lastUpdatedAt
    ? lastUpdatedAt.toLocaleTimeString("pt-BR")
    : "--:--";

  const handleFilterChange = (preset: FilterPreset) => {
    setActiveFilter(preset.id);
    setColumnFilters(filterRules[preset.id]);
  };

  return (
    <section className="space-y-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-foreground text-lg font-semibold">
            Produtos em estoque minimo
          </h2>
          <p className="text-muted-foreground text-sm">
            Filtro por tipo de produto usando o menu abaixo.
          </p>
        </div>
        <div className="text-muted-foreground text-sm">
          <span>{filteredCount} item(ns)</span>
          <span className="ml-3">
            {isRefreshing ? "Atualizando..." : `Atualizado em ${lastUpdatedLabel}`}
          </span>
          {refreshError ? (
            <span className="ml-3 text-red-500">{refreshError}</span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filterPresets.map((preset) => (
          <Button
            key={preset.id}
            type="button"
            size="sm"
            variant={activeFilter === preset.id ? "default" : "outline"}
            onClick={() => handleFilterChange(preset)}
            aria-pressed={activeFilter === preset.id}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground py-10 text-center"
                >
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row, index) => {
                const sku = row.original.skuProduto ?? "";
                const isGrayRow = sku.toLowerCase().endsWith("ee");

                return (
                  <TableRow
                    key={getRowKey(row.original, index)}
                    className={
                      isGrayRow
                        ? "bg-muted-foreground/20 "
                        : "odd:bg-muted/20"
                    }
                  >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default DataTable;
