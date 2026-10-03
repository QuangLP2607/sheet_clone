import type { CellKey } from "@/features/spreadsheet/types";

import { SHORTCUTS } from "../keyboardShortcuts";

import { moveCell } from "../commands/moveCell";
import { startEditing } from "../commands/startEditing";

import { getKeyboardShortcut } from "../utils/getKeyboardShortcut";
import { matchesShortcut } from "../utils/matchesShortcut";

interface HandleKeyDownParams {
  event: KeyboardEvent;

  activeCellKey: CellKey;

  totalRows: number;
  totalCols: number;

  moveCell: (
    rowIndex: number,
    columnIndex: number,
    rowDelta: number,
    columnDelta: number,
    totalRows: number,
    totalCols: number,
  ) => void;

  startEditing: (cellKey: CellKey) => void;
}

export function handleKeyDown({
  event,
  activeCellKey,
  totalRows,
  totalCols,
  moveCell: moveCellStore,
  startEditing: startEditingStore,
}: HandleKeyDownParams): boolean {
  const shortcut = getKeyboardShortcut(event);

  if (!shortcut) {
    return false;
  }

  if (matchesShortcut(shortcut, SHORTCUTS.MOVE_UP)) {
    moveCell({
      activeCellKey,
      rowDelta: -1,
      columnDelta: 0,
      totalRows,
      totalCols,
      moveCell: moveCellStore,
    });

    return true;
  }

  if (matchesShortcut(shortcut, SHORTCUTS.MOVE_DOWN)) {
    moveCell({
      activeCellKey,
      rowDelta: 1,
      columnDelta: 0,
      totalRows,
      totalCols,
      moveCell: moveCellStore,
    });

    return true;
  }

  if (matchesShortcut(shortcut, SHORTCUTS.MOVE_LEFT)) {
    moveCell({
      activeCellKey,
      rowDelta: 0,
      columnDelta: -1,
      totalRows,
      totalCols,
      moveCell: moveCellStore,
    });

    return true;
  }

  if (matchesShortcut(shortcut, SHORTCUTS.MOVE_RIGHT)) {
    moveCell({
      activeCellKey,
      rowDelta: 0,
      columnDelta: 1,
      totalRows,
      totalCols,
      moveCell: moveCellStore,
    });

    return true;
  }

  if (matchesShortcut(shortcut, SHORTCUTS.ENTER)) {
    startEditing({
      activeCellKey,
      startEditing: startEditingStore,
    });

    return true;
  }

  return false;
}
