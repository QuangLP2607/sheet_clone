import type { JSONContent } from "@tiptap/core";

import type { CellData } from "./cell";
import type { CellStyle } from "./cell-style";
import type { TextStyle } from "./text-style";

export const DEFAULT_TEXT_STYLE: TextStyle = {
  bold: true,
  italic: false,
  strike: false,
  fontFamily: "Arial",
  fontSize: 14,
  color: "black",
  textAlign: "left",
};

export const DEFAULT_CELL_STYLE: CellStyle = {
  fillColor: "white",
  horizontalAlign: "left",
  verticalAlign: "bottom",
  textWrapping: "overflow",
  textRotation: "none",
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
  textStyle: DEFAULT_TEXT_STYLE,
  style: DEFAULT_CELL_STYLE,
};

export const DEFAULT_COLUMN_WIDTH = 100;
export const DEFAULT_ROW_HEIGHT = 24;

export const HEADER_ROW_HEIGHT = 24;
export const HEADER_COL_WIDTH = 46;
export const SCROLLBAR_SIZE = 12;

export const TOTAL_ROWS = 1000;
export const TOTAL_COLS = 26;
