import { create } from "zustand";

import type { JSONContent } from "@tiptap/core";

import type { CellStyle } from "@/types/cell-style";

import type { CellData, CellKey, InitialCellData } from "../model/cell";

import {
  DEFAULT_CELL_CONTENT,
  DEFAULT_CELL_DATA,
  DEFAULT_CELL_STYLE,
} from "../model/defaults";

import { getCellKey } from "../utils/cellAddress";

interface DataState {
  /*
   * Chỉ lưu những cell thực sự có data.
   *
   * Không tạo sẵn 1000 x 100 cell.
   */
  cells: Record<CellKey, CellData>;

  initializeCells: (cells: Record<CellKey, InitialCellData>) => void;

  getCell: (rowIndex: number, columnIndex: number) => CellData | undefined;

  setCellContent: (
    rowIndex: number,
    columnIndex: number,
    content: JSONContent,
  ) => void;

  setCellStyle: (
    rowIndex: number,
    columnIndex: number,
    style: Partial<CellStyle>,
  ) => void;

  clearCell: (rowIndex: number, columnIndex: number) => void;

  clearAllCells: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  cells: {},

  /*
   * Backend / mock data
   * → Zustand
   */
  initializeCells: (cells) => {
    const initializedCells = Object.fromEntries(
      Object.entries(cells).map(([key, cell]) => [
        key,

        {
          ...DEFAULT_CELL_DATA,

          content: cell.content ?? DEFAULT_CELL_CONTENT,

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

  /*
   * Lấy cell.
   *
   * undefined nghĩa là cell chưa có data.
   */
  getCell: (rowIndex, columnIndex) => {
    const key = getCellKey(rowIndex, columnIndex);

    return get().cells[key];
  },

  /*
   * Cập nhật content.
   */
  setCellContent: (rowIndex, columnIndex, content) => {
    const key = getCellKey(rowIndex, columnIndex);

    set((state) => {
      const currentCell = state.cells[key] ?? DEFAULT_CELL_DATA;

      return {
        cells: {
          ...state.cells,

          [key]: {
            ...currentCell,
            content,
          },
        },
      };
    });
  },

  /*
   * Cập nhật style.
   *
   * Chỉ patch những property cần thay đổi.
   */
  setCellStyle: (rowIndex, columnIndex, style) => {
    const key = getCellKey(rowIndex, columnIndex);

    set((state) => {
      const currentCell = state.cells[key] ?? DEFAULT_CELL_DATA;

      return {
        cells: {
          ...state.cells,

          [key]: {
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

  /*
   * Xóa cell khỏi store.
   *
   * Sau khi xóa:
   *
   * cells[key] === undefined
   *
   * UI sẽ dùng DEFAULT_CELL_DATA khi cần.
   */
  clearCell: (rowIndex, columnIndex) => {
    const key = getCellKey(rowIndex, columnIndex);

    set((state) => {
      const cells = {
        ...state.cells,
      };

      delete cells[key];

      return {
        cells,
      };
    });
  },

  /*
   * Dùng khi load workbook mới.
   */
  clearAllCells: () => {
    set({
      cells: {},
    });
  },
}));
