import { create } from "zustand";

import type { CellKey } from "@/features/spreadsheet/types";

import { getCellKey } from "../utils/cellAddress";

export type EditingTarget = "cell" | "formulaBar";

interface SelectionState {
  activeCellKey: CellKey | null;

  editingCellKey: CellKey | null;
  editingTarget: EditingTarget | null;

  selectCell: (cellKey: CellKey) => void;

  startEditing: (cellKey: CellKey, target?: EditingTarget) => void;

  moveCell: (
    rowIndex: number,
    columnIndex: number,
    rowDelta: number,
    columnDelta: number,
    totalRows: number,
    totalCols: number,
  ) => void;

  clearEditingCell: () => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  activeCellKey: null,

  editingCellKey: null,
  editingTarget: null,

  selectCell: (cellKey) => {
    set({
      activeCellKey: cellKey,
      editingCellKey: null,
      editingTarget: null,
    });
  },

  startEditing: (cellKey, target = "cell") => {
    set({
      activeCellKey: cellKey,
      editingCellKey: cellKey,
      editingTarget: target,
    });
  },

  moveCell: (
    rowIndex,
    columnIndex,
    rowDelta,
    columnDelta,
    totalRows,
    totalCols,
  ) => {
    const nextRowIndex = Math.min(
      totalRows - 1,
      Math.max(0, rowIndex + rowDelta),
    );

    const nextColumnIndex = Math.min(
      totalCols - 1,
      Math.max(0, columnIndex + columnDelta),
    );

    set({
      activeCellKey: getCellKey(nextRowIndex, nextColumnIndex),

      editingCellKey: null,
      editingTarget: null,
    });
  },

  clearEditingCell: () => {
    set({
      editingCellKey: null,
      editingTarget: null,
    });
  },

  clearSelection: () => {
    set({
      activeCellKey: null,
      editingCellKey: null,
      editingTarget: null,
    });
  },
}));
