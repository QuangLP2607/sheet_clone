import type { JSONContent } from "@tiptap/core";

import type { CellStyle } from "./cell-style";
import type { TextStyle } from "./text-style";

export interface CellPosition {
  row: number;
  column: number;
}

export type CellKey = `${number}:${number}`;

export interface CellData {
  content: JSONContent;
  textStyle: TextStyle;
  style: CellStyle;
}

export interface InitialCellData {
  content?: JSONContent;
  textStyle?: Partial<TextStyle>;
  style?: Partial<CellStyle>;
}
