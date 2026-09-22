import type { CellStyle } from "./cell-style";

export interface CellPosition {
  row: number;
  column: number;
}

export type CellKey = `${number}:${number}`;

export interface CellData {
  content: string;
  style: CellStyle;
}
