import { useEffect, useRef } from "react";

import type { Editor } from "@tiptap/react";

import type { CellStyle } from "@/types/cell-style";

import { applyCellStyle } from "./applyCellStyle";
import { isFullSelection, readCellStyle } from "./readCellStyle";

import type { SyncStyle } from "./styleSyncConfig";

interface UseCellStyleSyncOptions {
  editor: Editor | null;
  editing: boolean;
  cellKey: string | null;
  cellStyle: CellStyle;
  onCellStyleChange: (patch: Partial<SyncStyle>) => void;
}

const getSyncStyle = (style: CellStyle): SyncStyle => ({
  bold: style.bold,
  italic: style.italic,
  strike: style.strike,
  fontFamily: style.fontFamily,
  fontSize: style.fontSize,
  color: style.color,
});

const getChangedPatch = (
  current: SyncStyle,
  next: Partial<SyncStyle>,
): Partial<SyncStyle> => {
  const changed: Partial<SyncStyle> = {};

  if (next.bold !== undefined && next.bold !== current.bold) {
    changed.bold = next.bold;
  }

  if (next.italic !== undefined && next.italic !== current.italic) {
    changed.italic = next.italic;
  }

  if (next.strike !== undefined && next.strike !== current.strike) {
    changed.strike = next.strike;
  }

  if (next.fontFamily !== undefined && next.fontFamily !== current.fontFamily) {
    changed.fontFamily = next.fontFamily;
  }

  if (next.fontSize !== undefined && next.fontSize !== current.fontSize) {
    changed.fontSize = next.fontSize;
  }

  if (next.color !== undefined && next.color !== current.color) {
    changed.color = next.color;
  }

  return changed;
};

export const useCellStyleSync = ({
  editor,
  editing,
  cellKey,
  cellStyle,
  onCellStyleChange,
}: UseCellStyleSyncOptions) => {
  const cellStyleRef = useRef<CellStyle>(cellStyle);

  const callbackRef = useRef(onCellStyleChange);

  const applyingCellStyleRef = useRef(false);

  useEffect(() => {
    cellStyleRef.current = cellStyle;
  }, [cellStyle]);

  useEffect(() => {
    callbackRef.current = onCellStyleChange;
  }, [onCellStyleChange]);

  /*
   * ==================================================
   * Cell Style → Rich Text
   * ==================================================
   *
   * Chỉ thực hiện khi KHÔNG ở rich-text editing.
   *
   * Ví dụ:
   *
   * selected cell
   *      ↓
   * đổi Cell Style fontSize = 20
   *      ↓
   * toàn bộ RichText = 20px
   */
  useEffect(() => {
    if (!editor || !cellKey || editing) {
      return;
    }

    const previousStyle = cellStyleRef.current;

    const currentStyle = getSyncStyle(cellStyle);

    const changedStyle = getChangedPatch(previousStyle, currentStyle);

    cellStyleRef.current = cellStyle;

    if (Object.keys(changedStyle).length === 0) {
      return;
    }

    applyingCellStyleRef.current = true;

    applyCellStyle(editor, changedStyle);

    applyingCellStyleRef.current = false;
  }, [editor, editing, cellKey, cellStyle]);

  /*
   * ==================================================
   * Rich Text → Cell Style
   * ==================================================
   *
   * Chỉ sync ngược khi:
   *
   * 1. đang editing RichText
   * 2. Select All toàn bộ text
   */
  useEffect(() => {
    if (!editor || !cellKey || !editing) {
      return;
    }

    const handleSync = () => {
      if (applyingCellStyleRef.current) {
        return;
      }

      if (!isFullSelection(editor)) {
        return;
      }

      const nextStyle = readCellStyle(editor);

      if (Object.keys(nextStyle).length === 0) {
        return;
      }

      const currentStyle = getSyncStyle(cellStyleRef.current);

      const changed = getChangedPatch(currentStyle, nextStyle);

      if (Object.keys(changed).length === 0) {
        return;
      }

      cellStyleRef.current = {
        ...cellStyleRef.current,
        ...changed,
      };

      callbackRef.current(changed);
    };

    editor.on("update", handleSync);

    editor.on("selectionUpdate", handleSync);

    return () => {
      editor.off("update", handleSync);

      editor.off("selectionUpdate", handleSync);
    };
  }, [editor, editing, cellKey]);
};
