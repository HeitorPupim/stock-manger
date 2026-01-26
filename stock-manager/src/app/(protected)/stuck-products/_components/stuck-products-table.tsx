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
import {
  getTableFilterRules,
  type TableFilterPreset,
  type TableFilterPresetId,
  tableFilterPresets,
} from "@/lib/table-filter";
import type { StuckProductRow } from "@/src/app/data/materia-prima-sem-saida";

import { createProductsColumns } from "./stuck-products-columns";

type IntervalPreset = {
  id: string;
  label: string;
  value: number;
};

const intervalPresets: IntervalPreset[] = [
  { id: "7", label: "7 dias", value: 7 },
  { id: "15", label: "15 dias", value: 15 },
  { id: "30", label: "30 dias", value: 30 },
  { id: "60", label: "60 dias", value: 60 },
  { id: "90", label: "90 dias", value: 90 },
];

const DEFAULT_INTERVAL_DAYS = 30;

const ProductsTable = ({
  data: initialData,
  catalogSkus,
  initialIntervalDays = DEFAULT_INTERVAL_DAYS,
}: {
  data: StuckProductRow[];
  catalogSkus: string[];
  initialIntervalDays?: number;
}) => {
  const [activeFilter, setActiveFilter] = React.useState<TableFilterPresetId>(
    "pano"
  );
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(() => getTableFilterRules("pano"));
  const [data, setData] = React.useState<StuckProductRow[]>(initialData);
  const [intervalDays, setIntervalDays] =
    React.useState<number>(initialIntervalDays);
  const [isIntervalLoading, setIsIntervalLoading] = React.useState(false);
  const [intervalError, setIntervalError] = React.useState<string | null>(null);
  const catalogSkuSet = React.useMemo(
    () =>
      new Set(
        catalogSkus
          .map((sku) => sku.trim().toLowerCase())
          .filter((sku) => sku.length)
      ),
    [catalogSkus]
  );
  const columns = React.useMemo(
    () => createProductsColumns(catalogSkuSet, intervalDays),
    [catalogSkuSet, intervalDays]
  );

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleIntervalChange = async (preset: IntervalPreset) => {
    const nextInterval = preset.value;
    if (preset.value === intervalDays) {
      return;
    }
    setIsIntervalLoading(true);
    setIntervalError(null);

    try {
      const response = await fetch(
        `/api/materia-prima-sem-saida?days=${nextInterval}`,
        {
          cache: "no-store",
        }
      );
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const payload = (await response.json()) as {
        data?: StuckProductRow[];
      };
      setData(payload.data ?? []);
      setIntervalDays(nextInterval);
    } catch (error) {
      console.error("Failed to refresh sales ranking interval", error);
      setIntervalError("Falha ao atualizar intervalo.");
    } finally {
      setIsIntervalLoading(false);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filteredCount = table.getFilteredRowModel().rows.length;

  const handleFilterChange = (preset: TableFilterPreset) => {
    setActiveFilter(preset.id);
    setColumnFilters(getTableFilterRules(preset.id));
  };

  return (
    <section className="space-y-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-foreground text-lg font-semibold">
            Produtos sem saída
          </h2>
          <p className="text-muted-foreground text-sm">
            Itens sem venda nos últimos {intervalDays} dias.
          </p>
        </div>
        <div className="text-muted-foreground text-sm">
          <span>{filteredCount} item(ns)</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tableFilterPresets.map((preset) => {
          if (preset.id === "all" || preset.id === "rede") return null;
          
          return (
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
        );
        })}

        <div className="flex flex-wrap items-center gap-2 pl-2">
          <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
            Tempo sem saída:
          </span>
          {intervalPresets.map((preset) => (
            <Button
              key={preset.id}
              type="button"
              size="sm"
              variant={intervalDays === preset.value ? "default" : "outline"}
              onClick={() => handleIntervalChange(preset)}
              aria-pressed={intervalDays === preset.value}
              disabled={isIntervalLoading}
            >
              {preset.label}
            </Button>
          ))}
          {isIntervalLoading ? (
            <span className="text-muted-foreground text-xs">Atualizando...</span>
          ) : null}
          {intervalError ? (
            <span className="text-xs text-red-500">{intervalError}</span>
          ) : null}
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table containerClassName="max-h-[88vh] overflow-auto">
          <TableHeader className="sticky top-0 z-10 bg-card">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="bg-foreground/10"
                  >
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
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="odd:bg-muted/20">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default ProductsTable;
