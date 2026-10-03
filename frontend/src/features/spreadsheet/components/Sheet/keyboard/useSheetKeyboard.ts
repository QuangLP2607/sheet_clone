import { useEffect } from "react";

import { useSelectionStore } from "../../../stores/selectionStore";

import { handleKeyDown } from "./handlers/handleKeyDown";

interface UseSheetKeyboardOptions {
  totalRows: number;
  totalCols: number;
}

export function useSheetKeyboard({
  totalRows,
  totalCols,
}: UseSheetKeyboardOptions) {
  const activeCellKey = useSelectionStore((state) => state.activeCellKey);

  const editingCellKey = useSelectionStore((state) => state.editingCellKey);

  const moveCell = useSelectionStore((state) => state.moveCell);

  const startEditing = useSelectionStore((state) => state.startEditing);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!activeCellKey) {
        return;
      }

      /*
       * Khi đang edit, keyboard thuộc về Tiptap.
       */
      if (editingCellKey) {
        return;
      }

      /*
       * Không can thiệp vào các element nhập liệu khác.
       */
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target.isContentEditable
      ) {
        return;
      }

      const handled = handleKeyDown({
        event,
        activeCellKey,
        totalRows,
        totalCols,
        moveCell,
        startEditing,
      });

      if (handled) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    activeCellKey,
    editingCellKey,
    moveCell,
    startEditing,
    totalRows,
    totalCols,
  ]);
}
