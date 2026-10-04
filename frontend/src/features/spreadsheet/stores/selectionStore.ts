import { create } from "zustand";

import type { CellKey } from "@/features/spreadsheet/types";

import { getCellKey } from "../utils/cellAddress";

export type EditingTarget = "cell" | "formulaBar";

export interface EditingRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface SelectionState {
  activeCellKey: CellKey | null;

  editingCellKey: CellKey | null;
  editingTarget: EditingTarget | null;
  editingRect: EditingRect | null;

  selectCell: (cellKey: CellKey) => void;

  startEditing: (
    cellKey: CellKey,
    target?: EditingTarget,
    editingRect?: EditingRect,
  ) => void;

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
  editingRect: null,

  selectCell: (cellKey) => {
    set({
      activeCellKey: cellKey,

      editingCellKey: null,
      editingTarget: null,
      editingRect: null,
    });
  },

  startEditing: (cellKey, target = "cell", editingRect = undefined) => {
    set({
      activeCellKey: cellKey,

      editingCellKey: cellKey,
      editingTarget: target,

      editingRect: target === "cell" ? (editingRect ?? null) : null,
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
      editingRect: null,
    });
  },

  clearEditingCell: () => {
    set({
      editingCellKey: null,
      editingTarget: null,
      editingRect: null,
    });
  },

  clearSelection: () => {
    set({
      activeCellKey: null,

      editingCellKey: null,
      editingTarget: null,
      editingRect: null,
    });
  },
}));
