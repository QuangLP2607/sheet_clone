import type { CellKey } from "@/features/spreadsheet/types";

export function getCellKey(rowIndex: number, columnIndex: number): CellKey {
  return `${rowIndex}:${columnIndex}`;
}

export function parseCellKey(cellKey: CellKey): {
  rowIndex: number;
  columnIndex: number;
} {
  const [rowIndex, columnIndex] = cellKey.split(":").map(Number);

  return {
    rowIndex,
    columnIndex,
  };
}

export function getColumnLabel(columnIndex: number): string {
  let label = "";
  let index = columnIndex;

  while (index >= 0) {
    label = String.fromCharCode((index % 26) + 65) + label;

    index = Math.floor(index / 26) - 1;
  }

  return label;
}

export function getCellAddress(rowIndex: number, columnIndex: number): string {
  return `${getColumnLabel(columnIndex)}${rowIndex + 1}`;
}
