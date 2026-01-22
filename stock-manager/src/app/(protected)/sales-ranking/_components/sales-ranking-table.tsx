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

import { createSalesRankingColumns } from "./sales-ranking-columns";

type FilterPreset = {
  id: "all" | "rede" | "panagem";
  label: string;
  value: string | null;
};

const filterPresets: FilterPreset[] = [
  { id: "all", label: "Todos", value: null },
  { id: "rede", label: "Rede de Pesca", value: "rede" },
  { id: "panagem", label: "Panagem", value: "pano" },
];

const SalesRankingTable = ({
  data,
  catalogSkus,
}: {
  data: SalesRankingRow[];
  catalogSkus: string[];
}) => {
  const [activeFilter, setActiveFilter] = React.useState<FilterPreset["id"]>(
    "all"
  );
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
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
    () => createSalesRankingColumns(catalogSkuSet),
    [catalogSkuSet]
  );
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

  const handleFilterChange = (preset: FilterPreset) => {
    setActiveFilter(preset.id);
    if (!preset.value) {
      setColumnFilters([]);
      return;
    }
    setColumnFilters([{ id: "nomeProduto", value: preset.value }]);
  };

  return (
    <section className="space-y-4 px-4 lg:px-6">
      <div>
        <h2 className="text-foreground text-lg font-semibold">
          Ranking de saida (30d)
        </h2>
        <p className="text-muted-foreground text-sm">
          Produtos mais vendidos nos ultimos 30 dias.
        </p>
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
                  Nenhuma venda encontrada.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => {
                const sku = row.original.skuProduto ?? "";
                const isGrayRow = sku.toLowerCase().endsWith("ee");

                return (
                  <TableRow
                    key={row.id}
                    className={
                      isGrayRow ? "bg-muted-foreground/20" : "odd:bg-muted/20"
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

export default SalesRankingTable;
