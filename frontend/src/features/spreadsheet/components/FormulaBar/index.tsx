import { useCallback } from "react";

import {
  DEFAULT_CELL_CONTENT,
  DEFAULT_TEXT_STYLE,
} from "@/features/spreadsheet/types";

import { useDataStore } from "@/features/spreadsheet/stores/dataStore";

import { useSelectionStore } from "@/features/spreadsheet/stores/selectionStore";

import { useEditingEditor } from "@/features/spreadsheet/providers/EditingEditor";

import {
  getCellAddress,
  parseCellKey,
} from "@/features/spreadsheet/utils/cellAddress";

import FormulaBarEditor from "./FormulaBarEditor";

import styles from "./FormulaBar.module.scss";

export default function FormulaBar() {
  const activeCellKey = useSelectionStore((state) => state.activeCellKey);

  const editingCellKey = useSelectionStore((state) => state.editingCellKey);

  const editingTarget = useSelectionStore((state) => state.editingTarget);

  const startEditing = useSelectionStore((state) => state.startEditing);

  const { draftContent, editingCellKey: editorCellKey } = useEditingEditor();

  const content = useDataStore((state) => {
    if (!activeCellKey) {
      return DEFAULT_CELL_CONTENT;
    }

    return state.cells[activeCellKey]?.content ?? DEFAULT_CELL_CONTENT;
  });

  const textStyle = useDataStore((state) => {
    if (!activeCellKey) {
      return DEFAULT_TEXT_STYLE;
    }

    return state.cells[activeCellKey]?.textStyle ?? DEFAULT_TEXT_STYLE;
  });

  const isEditingHere =
    activeCellKey !== null &&
    editingCellKey === activeCellKey &&
    editingTarget === "formulaBar";

  /*
   * Cell Editor đang edit chính active cell.
   *
   * Formula Bar phải hiển thị draft,
   * không phải content đã commit trong dataStore.
   */
  const isCellEditing =
    activeCellKey !== null &&
    editingCellKey === activeCellKey &&
    editingTarget === "cell" &&
    editorCellKey === activeCellKey;

  const displayContent =
    isCellEditing && draftContent !== null ? draftContent : content;

  const handleMouseDown = useCallback(() => {
    if (!activeCellKey) {
      return;
    }

    if (isEditingHere) {
      return;
    }

    startEditing(activeCellKey, "formulaBar");
  }, [activeCellKey, isEditingHere, startEditing]);

  const cellAddress = (() => {
    if (!activeCellKey) {
      return "";
    }

    const { rowIndex, columnIndex } = parseCellKey(activeCellKey);

    return getCellAddress(rowIndex, columnIndex);
  })();

  return (
    <div className={styles.formulaBar} onMouseDown={handleMouseDown}>
      <div className={styles.nameBox}>{cellAddress}</div>

      <div className={styles.divider} />

      <div className={styles.fx}>fx</div>

      <div className={styles.editor}>
        {activeCellKey && (
          <FormulaBarEditor
            cellKey={activeCellKey}
            content={displayContent}
            textStyle={textStyle}
            editable={isEditingHere}
          />
        )}
      </div>
    </div>
  );
}
