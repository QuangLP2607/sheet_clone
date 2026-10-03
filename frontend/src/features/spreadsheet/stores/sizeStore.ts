import { create } from "zustand";

import {
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_ROW_HEIGHT,
} from "@/features/spreadsheet/types";

const MIN_COLUMN_WIDTH = 40;
const MIN_ROW_HEIGHT = 20;

interface SizeState {
  rowHeights: Record<number, number>;
  columnWidths: Record<number, number>;

  totalWidth: number;
  totalHeight: number;

  initializeSizes: (params: {
    totalRows: number;
    totalCols: number;
    rowHeights?: Record<number, number>;
    columnWidths?: Record<number, number>;
  }) => void;

  getRowHeight: (rowIndex: number) => number;
  getColumnWidth: (columnIndex: number) => number;

  setRowHeight: (rowIndex: number, height: number) => void;

  setColumnWidth: (columnIndex: number, width: number) => void;
}

export const useSizeStore = create<SizeState>((set, get) => ({
  rowHeights: {},
  columnWidths: {},

  totalWidth: 0,
  totalHeight: 0,

  /* ==================================================
   * Initialize
   * ================================================== */

  initializeSizes: ({
    totalRows,
    totalCols,
    rowHeights = {},
    columnWidths = {},
  }) => {
    let totalWidth = totalCols * DEFAULT_COLUMN_WIDTH;

    for (const [columnIndex, width] of Object.entries(columnWidths)) {
      const index = Number(columnIndex);

      if (index < 0 || index >= totalCols) {
        continue;
      }

      totalWidth += width - DEFAULT_COLUMN_WIDTH;
    }

    let totalHeight = totalRows * DEFAULT_ROW_HEIGHT;

    for (const [rowIndex, height] of Object.entries(rowHeights)) {
      const index = Number(rowIndex);

      if (index < 0 || index >= totalRows) {
        continue;
      }

      totalHeight += height - DEFAULT_ROW_HEIGHT;
    }

    set({
      rowHeights,
      columnWidths,
      totalWidth,
      totalHeight,
    });
  },

  /* ==================================================
   * Get row height
   * ================================================== */

  getRowHeight: (rowIndex) => {
    return get().rowHeights[rowIndex] ?? DEFAULT_ROW_HEIGHT;
  },

  /* ==================================================
   * Get column width
   * ================================================== */

  getColumnWidth: (columnIndex) => {
    return get().columnWidths[columnIndex] ?? DEFAULT_COLUMN_WIDTH;
  },

  /* ==================================================
   * Set row height
   * ================================================== */

  setRowHeight: (rowIndex, height) => {
    set((state) => {
      const nextHeight = Math.max(MIN_ROW_HEIGHT, height);

      const previousHeight = state.rowHeights[rowIndex] ?? DEFAULT_ROW_HEIGHT;

      if (previousHeight === nextHeight) {
        return state;
      }

      return {
        rowHeights: {
          ...state.rowHeights,
          [rowIndex]: nextHeight,
        },

        totalHeight: state.totalHeight + nextHeight - previousHeight,
      };
    });
  },

  /* ==================================================
   * Set column width
   * ================================================== */

  setColumnWidth: (columnIndex, width) => {
    set((state) => {
      const nextWidth = Math.max(MIN_COLUMN_WIDTH, width);

      const previousWidth =
        state.columnWidths[columnIndex] ?? DEFAULT_COLUMN_WIDTH;

      if (previousWidth === nextWidth) {
        return state;
      }

      return {
        columnWidths: {
          ...state.columnWidths,
          [columnIndex]: nextWidth,
        },

        totalWidth: state.totalWidth + nextWidth - previousWidth,
      };
    });
  },
}));
