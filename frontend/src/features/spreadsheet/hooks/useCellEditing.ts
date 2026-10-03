import { useCallback, useEffect, useRef } from "react";

import type { JSONContent } from "@tiptap/core";

import { DEFAULT_CELL_CONTENT } from "@/features/spreadsheet/types";

import { useDataStore } from "@/features/spreadsheet/stores/dataStore";
import { useSelectionStore } from "@/features/spreadsheet/stores/selectionStore";

import type { CellKey } from "@/features/spreadsheet/types";

interface EditingSession {
  cellKey: CellKey;
  content: JSONContent;
}

export function useCellEditing() {
  const editingCellKey = useSelectionStore((state) => state.editingCellKey);

  const setCellContent = useDataStore((state) => state.setCellContent);

  const sessionRef = useRef<EditingSession | null>(null);

  const updateContent = useCallback((content: JSONContent) => {
    const session = sessionRef.current;

    if (!session) {
      return;
    }

    sessionRef.current = {
      ...session,
      content,
    };
  }, []);

  useEffect(() => {
    const previousSession = sessionRef.current;

    if (previousSession && previousSession.cellKey !== editingCellKey) {
      setCellContent(previousSession.cellKey, previousSession.content);

      sessionRef.current = null;
    }

    if (!editingCellKey) {
      return;
    }

    const cell = useDataStore.getState().cells[editingCellKey];

    sessionRef.current = {
      cellKey: editingCellKey,
      content: cell?.content ?? DEFAULT_CELL_CONTENT,
    };
  }, [editingCellKey, setCellContent]);

  return {
    updateContent,
  };
}
