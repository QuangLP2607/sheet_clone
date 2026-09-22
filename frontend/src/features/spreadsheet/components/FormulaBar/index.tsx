import { useCallback, useEffect } from "react";

import type { Editor } from "@tiptap/react";

import RichTextEditor from "@/features/spreadsheet/components/RichTextEditor";
import { useRichTextEditor } from "@/features/spreadsheet/components/RichTextEditor/hooks";

import { DEFAULT_CELL_CONTENT } from "@/features/spreadsheet/model/defaults";

import { useDataStore } from "@/features/spreadsheet/stores/dataStore";
import { useSelectionStore } from "@/features/spreadsheet/stores/selectionStore";

import styles from "./FormulaBar.module.scss";

interface FormulaBarProps {
  onEditorFocus: (editor: Editor) => void;
}

function getColumnName(columnIndex: number): string {
  let column = "";
  let index = columnIndex;

  while (index >= 0) {
    column = String.fromCharCode((index % 26) + 65) + column;

    index = Math.floor(index / 26) - 1;
  }

  return column;
}

export default function FormulaBar({ onEditorFocus }: FormulaBarProps) {
  const activeCell = useSelectionStore((state) => state.activeCell);

  const editingCell = useSelectionStore((state) => state.editingCell);

  const startEditing = useSelectionStore((state) => state.startEditing);

  const cellContent = useDataStore((state) => {
    if (!activeCell) {
      return DEFAULT_CELL_CONTENT;
    }

    const cellKey =
      `${activeCell.rowIndex}:${activeCell.columnIndex}` as `${number}:${number}`;

    return state.cells[cellKey]?.content ?? DEFAULT_CELL_CONTENT;
  });

  const setCellContent = useDataStore((state) => state.setCellContent);

  /*
   * ==================================================
   * FormulaBar editor
   * ==================================================
   *
   * FormulaBar luôn chỉ có một editor.
   */
  const editor = useRichTextEditor(cellContent);

  /*
   * ==================================================
   * FormulaBar click
   * ==================================================
   *
   * Click FormulaBar khi cell chưa editing
   * => active cell chuyển sang editing.
   */
  const handleMouseDown = useCallback(() => {
    if (!activeCell) {
      return;
    }

    const isEditingCurrentCell =
      editingCell?.rowIndex === activeCell.rowIndex &&
      editingCell?.columnIndex === activeCell.columnIndex;

    if (isEditingCurrentCell) {
      return;
    }

    startEditing(activeCell.rowIndex, activeCell.columnIndex);
  }, [activeCell, editingCell, startEditing]);

  /*
   * ==================================================
   * dataStore → FormulaBar
   * ==================================================
   *
   * Khi CellEditor thay đổi content,
   * FormulaBar nhận content mới.
   *
   * emitUpdate = false
   * để không tạo vòng lặp.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    const current = editor.getJSON();

    if (JSON.stringify(current) === JSON.stringify(cellContent)) {
      return;
    }

    editor.commands.setContent(cellContent, {
      emitUpdate: false,
    });
  }, [editor, cellContent]);

  /*
   * ==================================================
   * FormulaBar → dataStore
   * ==================================================
   *
   * Gõ / format trong FormulaBar
   * → dataStore.
   */
  useEffect(() => {
    if (!editor || !activeCell) {
      return;
    }

    const handleUpdate = () => {
      setCellContent(
        activeCell.rowIndex,
        activeCell.columnIndex,
        editor.getJSON(),
      );
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, activeCell, setCellContent]);

  /*
   * ==================================================
   * FormulaBar → Toolbar
   * ==================================================
   *
   * Khi FormulaBar được focus,
   * FormulaBar editor trở thành editor
   * mà Toolbar đang thao tác.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleFocus = () => {
      onEditorFocus(editor);
    };

    editor.on("focus", handleFocus);

    return () => {
      editor.off("focus", handleFocus);
    };
  }, [editor, onEditorFocus]);

  /*
   * ==================================================
   * Cell address
   * ==================================================
   */

  const cellAddress = activeCell
    ? `${getColumnName(activeCell.columnIndex)}${activeCell.rowIndex + 1}`
    : "";

  /*
   * ==================================================
   * Render
   * ==================================================
   */

  return (
    <div className={styles.formulaBar} onMouseDown={handleMouseDown}>
      <div className={styles.nameBox}>{cellAddress}</div>

      <div className={styles.divider} />

      <div className={styles.fx}>fx</div>

      <RichTextEditor editor={editor} className={styles.editor} />
    </div>
  );
}
