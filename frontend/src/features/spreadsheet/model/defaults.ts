import type { JSONContent } from "@tiptap/core";

import type { CellStyle } from "@/types/cell-style";

import type { CellData } from "./cell";

export const DEFAULT_CELL_STYLE: CellStyle = {
  bold: false,
  italic: false,
  strike: false,

  fontFamily: null,
  fontSize: 14,
  color: "black",

  fillColor: null,

  horizontalAlign: "left",
  verticalAlign: "middle",

  textWrapping: "overflow",
};

export const DEFAULT_CELL_CONTENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

export const DEFAULT_CELL_DATA: CellData = {
  content: DEFAULT_CELL_CONTENT,
  style: DEFAULT_CELL_STYLE,
};

export const DEFAULT_COLUMN_WIDTH = 100;
export const DEFAULT_ROW_HEIGHT = 24;

export const HEADER_ROW_HEIGHT = 24;
export const HEADER_COL_WIDTH = 46;
export const SCROLLBAR_SIZE = 12;

export const TOTAL_ROWS = 1000;
export const TOTAL_COLS = 26;
