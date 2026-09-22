import { create } from "zustand";

import { DEFAULT_COLUMN_WIDTH, DEFAULT_ROW_HEIGHT } from "../model/defaults";

const MIN_COLUMN_WIDTH = 40;
const MIN_ROW_HEIGHT = 20;

interface SizeState {
  rowHeights: Record<number, number>;
  columnWidths: Record<number, number>;

  initializeSizes: (params: {
    rowHeights?: Record<number, number>;
    columnWidths?: Record<number, number>;
  }) => void;

  getRowHeight: (rowIndex: number) => number;
  getColumnWidth: (columnIndex: number) => number;

  getTotalWidth: (totalCols: number) => number;
  getTotalHeight: (totalRows: number) => number;

  setRowHeight: (rowIndex: number, height: number) => void;

  setColumnWidth: (columnIndex: number, width: number) => void;
}

export const useSizeStore = create<SizeState>((set, get) => ({
  rowHeights: {},
  columnWidths: {},

  initializeSizes: ({ rowHeights = {}, columnWidths = {} }) => {
    set({
      rowHeights,
      columnWidths,
    });
  },

  getRowHeight: (rowIndex) => {
    return get().rowHeights[rowIndex] ?? DEFAULT_ROW_HEIGHT;
  },

  getColumnWidth: (columnIndex) => {
    return get().columnWidths[columnIndex] ?? DEFAULT_COLUMN_WIDTH;
  },

  getTotalWidth: (totalCols) => {
    const columnWidths = get().columnWidths;

    let totalWidth = totalCols * DEFAULT_COLUMN_WIDTH;

    for (const [columnIndex, width] of Object.entries(columnWidths)) {
      if (Number(columnIndex) >= totalCols) {
        continue;
      }

      totalWidth += width - DEFAULT_COLUMN_WIDTH;
    }

    return totalWidth;
  },

  getTotalHeight: (totalRows) => {
    const rowHeights = get().rowHeights;

    let totalHeight = totalRows * DEFAULT_ROW_HEIGHT;

    for (const [rowIndex, height] of Object.entries(rowHeights)) {
      if (Number(rowIndex) >= totalRows) {
        continue;
      }

      totalHeight += height - DEFAULT_ROW_HEIGHT;
    }

    return totalHeight;
  },

  setRowHeight: (rowIndex, height) => {
    set((state) => ({
      rowHeights: {
        ...state.rowHeights,
        [rowIndex]: Math.max(MIN_ROW_HEIGHT, height),
      },
    }));
  },

  setColumnWidth: (columnIndex, width) => {
    set((state) => ({
      columnWidths: {
        ...state.columnWidths,
        [columnIndex]: Math.max(MIN_COLUMN_WIDTH, width),
      },
    }));
  },
}));
