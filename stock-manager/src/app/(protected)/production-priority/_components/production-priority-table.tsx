"use client";

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
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
import type { ProductionPriorityRow } from "@/src/app/data/prioridade-producao";

import { createProductionPriorityColumns } from "./production-priority-columns";

const getRowKey = (row: ProductionPriorityRow, index: number) =>
  row.idProduto ?? row.skuProduto ?? `row-${index}`;


const ProductionPriorityTable = ({
  data,
  catalogSkus,
  initialUpdatedAt,
}: {
  data: ProductionPriorityRow[];
  catalogSkus: string[];
  initialUpdatedAt: string;
}) => {
  const router = useRouter();
  const [isRefreshing, startRefreshTransition] = React.useTransition();
  const [lastUpdatedAt, setLastUpdatedAt] = React.useState<Date | null>(() => {
    const parsed = new Date(initialUpdatedAt);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  });
  const [activeFilter, setActiveFilter] = React.useState<TableFilterPresetId>(
    "all"
  );
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(() => getTableFilterRules("all"));
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
    () => createProductionPriorityColumns(catalogSkuSet),
    [catalogSkuSet]
  );

  React.useEffect(() => {
    const parsed = new Date(initialUpdatedAt);
    if (!Number.isNaN(parsed.getTime())) {
      setLastUpdatedAt(parsed);
    }
  }, [initialUpdatedAt]);

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
  const lastUpdatedLabel = lastUpdatedAt
    ? lastUpdatedAt.toLocaleString("pt-BR")
    : "--";

  const handleFilterChange = (preset: TableFilterPreset) => {
    setActiveFilter(preset.id);
    setColumnFilters(getTableFilterRules(preset.id));
  };

  const handleRefresh = () => {
    startRefreshTransition(() => {
      router.refresh();
    });
  };

  return (
    <section className="min-w-0 space-y-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-foreground text-lg font-semibold">
            Prioridade de Produção
          </h2>
          <p className="text-muted-foreground text-sm">
            Itens ordenados por índice de importância em ordem decrescente.
          </p>
          <p className="text-muted-foreground text-sm">
            O índice é calculado por:
            <b className="text-foreground"> qtd vendida (30d) / estoque disponível</b>.
            Valores com estoque disponível 0 ou nulo ficam sem índice.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{filteredCount} item(ns)</span>
          <span className="text-muted-foreground">
            {`Atualizado em ${lastUpdatedLabel}`}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tableFilterPresets.map((preset) => (
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

      <div className="min-w-0 rounded-lg border bg-card">
        <Table
          // className="w-max"
          containerClassName="max-h-[88vh] w-full overflow-x-auto overflow-y-auto"
        >
          <TableHeader className="sticky top-0 z-[1] bg-card">
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

export default ProductionPriorityTable;
