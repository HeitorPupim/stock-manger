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

import { columns,  MinimumStockRow } from "./columns";

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

const getRowKey = (row: MinimumStockRow, index: number) =>
  row.idProduto ?? row.skuProduto ?? `row-${index}`;

const DataTable = ({ data }: { data: MinimumStockRow[] }) => {
  const [activeFilter, setActiveFilter] = React.useState<FilterPreset["id"]>(
    "all"
  );
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-foreground text-lg font-semibold">
            Produtos em estoque minimo
          </h2>
          <p className="text-muted-foreground text-sm">
            Filtro por tipo de produto usando o menu abaixo.
          </p>
        </div>
        <span className="text-muted-foreground text-sm">
          {filteredCount} item(ns)
        </span>
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={getRowKey(row.original, index)}
                  className="odd:bg-muted/20"
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default DataTable;
