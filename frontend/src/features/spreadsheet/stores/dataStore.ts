import { create } from "zustand";

import type { JSONContent } from "@tiptap/core";

import type {
  CellData,
  CellKey,
  InitialCellData,
  CellStyle,
  TextStyle,
} from "@/features/spreadsheet/types";

import {
  DEFAULT_CELL_CONTENT,
  DEFAULT_CELL_DATA,
  DEFAULT_CELL_STYLE,
  DEFAULT_TEXT_STYLE,
} from "@/features/spreadsheet/types";

interface DataState {
  cells: Record<CellKey, CellData>;

  initializeCells: (cells: Record<CellKey, InitialCellData>) => void;

  getCell: (cellKey: CellKey) => CellData | undefined;

  setCellContent: (cellKey: CellKey, content: JSONContent) => void;

  updateCellTextStyle: (
    cellKey: CellKey,
    textStyle: Partial<TextStyle>,
  ) => void;

  setCellStyle: (cellKey: CellKey, style: Partial<CellStyle>) => void;

  clearCell: (cellKey: CellKey) => void;

  clearAllCells: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  cells: {},

  initializeCells: (cells) => {
    const initializedCells = Object.fromEntries(
      Object.entries(cells).map(([cellKey, cell]) => [
        cellKey,
        {
          ...DEFAULT_CELL_DATA,

          content: cell.content ?? DEFAULT_CELL_CONTENT,

          textStyle: {
            ...DEFAULT_TEXT_STYLE,
            ...cell.textStyle,
          },

          style: {
            ...DEFAULT_CELL_STYLE,
            ...cell.style,
          },
        },
      ]),
    ) as Record<CellKey, CellData>;

    set({
      cells: initializedCells,
    });
  },

  getCell: (cellKey) => {
    return get().cells[cellKey];
  },

  setCellContent: (cellKey, content) => {
    set((state) => {
      const currentCell = state.cells[cellKey] ?? DEFAULT_CELL_DATA;

      return {
        cells: {
          ...state.cells,

          [cellKey]: {
            ...currentCell,
            content,
          },
        },
      };
    });
  },

  updateCellTextStyle: (cellKey, textStyle) => {
    set((state) => {
      const currentCell = state.cells[cellKey] ?? DEFAULT_CELL_DATA;

      return {
        cells: {
          ...state.cells,

          [cellKey]: {
            ...currentCell,

            textStyle: {
              ...DEFAULT_TEXT_STYLE,
              ...currentCell.textStyle,
              ...textStyle,
            },
          },
        },
      };
    });
  },

  setCellStyle: (cellKey, style) => {
    set((state) => {
      const currentCell = state.cells[cellKey] ?? DEFAULT_CELL_DATA;

      return {
        cells: {
          ...state.cells,

          [cellKey]: {
            ...currentCell,

            style: {
              ...DEFAULT_CELL_STYLE,
              ...currentCell.style,
              ...style,
            },
          },
        },
      };
    });
  },

  clearCell: (cellKey) => {
    set((state) => {
      const cells = {
        ...state.cells,
      };

      delete cells[cellKey];

      return {
        cells,
      };
    });
  },

  clearAllCells: () => {
    set({
      cells: {},
    });
  },
}));
