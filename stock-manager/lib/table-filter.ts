import type { ColumnFiltersState } from "@tanstack/react-table";

export type TableFilterPresetId = "all" | "rede" | "pano";

export type TableFilterPreset = {
  id: TableFilterPresetId;
  label: string;
  value: string | null;
};

export const tableFilterPresets: TableFilterPreset[] = [
  { id: "all", label: "Todos", value: null },
  { id: "rede", label: "Rede de Pesca", value: "rede" },
  { id: "pano", label: "Panagem", value: "pano" },
];

export const tableFilterRules: Record<TableFilterPresetId, ColumnFiltersState> =
  {
  all: [],
  rede: [{ id: "nomeProduto", value: "rede" }],
  pano: [{ id: "nomeProduto", value: "pano" }],
};

export const getTableFilterRules = (presetId: TableFilterPresetId) =>
  tableFilterRules[presetId];
