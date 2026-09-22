import { memo, useCallback } from "react";

import type { JSONContent } from "@tiptap/core";
import type { Editor } from "@tiptap/react";

import { useShallow } from "zustand/shallow";

import Cell from "@/features/spreadsheet/components/Cell";

import {
  DEFAULT_CELL_CONTENT,
  DEFAULT_CELL_STYLE,
} from "@/features/spreadsheet/model/defaults";

import { useDataStore } from "@/features/spreadsheet/stores/dataStore";
import { useSelectionStore } from "@/features/spreadsheet/stores/selectionStore";

import CellEditor from "./CellEditor";
import CellValue from "./CellValue";

import styles from "./CellContainer.module.scss";

interface CellContainerProps {
  rowIndex: number;
  columnIndex: number;

  onCellSelect: (rowIndex: number, columnIndex: number) => void;

  onCellDoubleClick: (rowIndex: number, columnIndex: number) => void;

  onEditorReady: (editor: Editor) => void;

  onEditorFocus: (editor: Editor) => void;

  onFinishEditing: () => void;
}

function CellContainer({
  rowIndex,
  columnIndex,
  onCellSelect,
  onCellDoubleClick,
  onEditorReady,
  onEditorFocus,
  onFinishEditing,
}: CellContainerProps) {
  const cellKey = `${rowIndex}:${columnIndex}` as `${number}:${number}`;

  const { selected, editing } = useSelectionStore(
    useShallow((state) => ({
      selected:
        state.activeCell?.rowIndex === rowIndex &&
        state.activeCell?.columnIndex === columnIndex,

      editing:
        state.editingCell?.rowIndex === rowIndex &&
        state.editingCell?.columnIndex === columnIndex,
    })),
  );

  const cell = useDataStore((state) => state.cells[cellKey]);

  const setCellContent = useDataStore((state) => state.setCellContent);

  const style = cell?.style ?? DEFAULT_CELL_STYLE;

  const content = cell?.content ?? DEFAULT_CELL_CONTENT;

  const handleSelect = useCallback(() => {
    onCellSelect(rowIndex, columnIndex);
  }, [rowIndex, columnIndex, onCellSelect]);

  const handleDoubleClick = useCallback(() => {
    onCellDoubleClick(rowIndex, columnIndex);
  }, [rowIndex, columnIndex, onCellDoubleClick]);

  const handleEditorReady = useCallback(
    (editor: Editor) => {
      onEditorReady(editor);
    },
    [onEditorReady],
  );

  const handleEditorFocus = useCallback(
    (editor: Editor) => {
      onEditorFocus(editor);
    },
    [onEditorFocus],
  );

  const handleCommit = useCallback(
    (nextContent: JSONContent) => {
      setCellContent(rowIndex, columnIndex, nextContent);
    },
    [rowIndex, columnIndex, setCellContent],
  );

  return (
    <Cell
      className={styles.cell}
      style={style}
      selected={selected}
      editing={editing}
      onSelect={handleSelect}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <div
          className={styles.editor}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
        >
          <CellEditor
            content={content}
            shouldFocus
            onCommit={handleCommit}
            onEditorReady={handleEditorReady}
            onEditorFocus={handleEditorFocus}
            onFinish={onFinishEditing}
          />
        </div>
      ) : (
        <div className={styles.value}>
          <CellValue content={content} />
        </div>
      )}
    </Cell>
  );
}

export default memo(CellContainer);
