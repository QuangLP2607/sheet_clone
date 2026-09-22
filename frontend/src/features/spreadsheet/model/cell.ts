import type { JSONContent } from "@tiptap/core";

import type { CellStyle } from "@/types/cell-style";

export type CellKey = `${number}:${number}`;

export interface CellData {
  content: JSONContent;
  style: CellStyle;
}

export interface InitialCellData {
  content?: JSONContent;
  style?: Partial<CellStyle>;
}
