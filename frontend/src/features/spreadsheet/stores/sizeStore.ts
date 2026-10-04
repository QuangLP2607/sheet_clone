import { create } from "zustand";

import {
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_ROW_HEIGHT,
} from "@/features/spreadsheet/types";

const MIN_COLUMN_WIDTH = 40;
const MIN_ROW_HEIGHT = 20;

interface SizeState {
  totalRows: number;
  totalCols: number;

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

  getColumnsWidth: (startIndex: number, endIndex: number) => number;
  getRowsHeight: (startIndex: number, endIndex: number) => number;

  setRowHeight: (rowIndex: number, height: number) => void;
  setColumnWidth: (columnIndex: number, width: number) => void;
}

export const useSizeStore = create<SizeState>((set, get) => ({
  totalRows: 0,
  totalCols: 0,

  rowHeights: {},
  columnWidths: {},

  totalWidth: 0,
  totalHeight: 0,

  initializeSizes: ({
    totalRows,
    totalCols,
    rowHeights = {},
    columnWidths = {},
  }) => {
    const normalizedRowHeights: Record<number, number> = {};
    const normalizedColumnWidths: Record<number, number> = {};

    let totalWidth = totalCols * DEFAULT_COLUMN_WIDTH;
    let totalHeight = totalRows * DEFAULT_ROW_HEIGHT;

    for (const [key, width] of Object.entries(columnWidths)) {
      const columnIndex = Number(key);

      if (
        !Number.isInteger(columnIndex) ||
        columnIndex < 0 ||
        columnIndex >= totalCols
      ) {
        continue;
      }

      const nextWidth = Math.max(MIN_COLUMN_WIDTH, width);

      normalizedColumnWidths[columnIndex] = nextWidth;
      totalWidth += nextWidth - DEFAULT_COLUMN_WIDTH;
    }

    for (const [key, height] of Object.entries(rowHeights)) {
      const rowIndex = Number(key);

      if (
        !Number.isInteger(rowIndex) ||
        rowIndex < 0 ||
        rowIndex >= totalRows
      ) {
        continue;
      }

      const nextHeight = Math.max(MIN_ROW_HEIGHT, height);

      normalizedRowHeights[rowIndex] = nextHeight;
      totalHeight += nextHeight - DEFAULT_ROW_HEIGHT;
    }

    set({
      totalRows,
      totalCols,
      rowHeights: normalizedRowHeights,
      columnWidths: normalizedColumnWidths,
      totalWidth,
      totalHeight,
    });
  },

  getRowHeight: (rowIndex) => {
    return get().rowHeights[rowIndex] ?? DEFAULT_ROW_HEIGHT;
  },

  getColumnWidth: (columnIndex) => {
    return get().columnWidths[columnIndex] ?? DEFAULT_COLUMN_WIDTH;
  },

  getColumnsWidth: (startIndex, endIndex) => {
    const { totalCols, getColumnWidth } = get();

    const start = Math.max(0, startIndex);
    const end = Math.min(totalCols - 1, endIndex);

    if (start > end) {
      return 0;
    }

    let width = 0;

    for (let index = start; index <= end; index += 1) {
      width += getColumnWidth(index);
    }

    return width;
  },

  getRowsHeight: (startIndex, endIndex) => {
    const { totalRows, getRowHeight } = get();

    const start = Math.max(0, startIndex);
    const end = Math.min(totalRows - 1, endIndex);

    if (start > end) {
      return 0;
    }

    let height = 0;

    for (let index = start; index <= end; index += 1) {
      height += getRowHeight(index);
    }

    return height;
  },

  setRowHeight: (rowIndex, height) => {
    set((state) => {
      if (
        !Number.isInteger(rowIndex) ||
        rowIndex < 0 ||
        rowIndex >= state.totalRows
      ) {
        return state;
      }

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

  setColumnWidth: (columnIndex, width) => {
    set((state) => {
      if (
        !Number.isInteger(columnIndex) ||
        columnIndex < 0 ||
        columnIndex >= state.totalCols
      ) {
        return state;
      }

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
