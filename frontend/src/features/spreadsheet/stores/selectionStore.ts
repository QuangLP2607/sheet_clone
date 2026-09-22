import { create } from "zustand";

export interface CellPosition {
  rowIndex: number;
  columnIndex: number;
}

interface SelectionState {
  activeCell: CellPosition | null;
  editingCell: CellPosition | null;

  selectCell: (rowIndex: number, columnIndex: number) => void;
  startEditing: (rowIndex: number, columnIndex: number) => void;
  clearEditingCell: () => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  activeCell: null,
  editingCell: null,

  selectCell: (rowIndex, columnIndex) => {
    set({
      activeCell: {
        rowIndex,
        columnIndex,
      },
      editingCell: null,
    });
  },

  startEditing: (rowIndex, columnIndex) => {
    const cell = {
      rowIndex,
      columnIndex,
    };

    set({
      activeCell: cell,
      editingCell: cell,
    });
  },

  clearEditingCell: () => {
    set({
      editingCell: null,
    });
  },

  clearSelection: () => {
    set({
      activeCell: null,
      editingCell: null,
    });
  },
}));
