import { useCallback } from "react";
import type { TextStyle } from "@/features/spreadsheet/types";
import { DEFAULT_TEXT_STYLE } from "@/features/spreadsheet/types";
import { useTextStyle } from "@/features/spreadsheet/components/RichTextEditor/hooks";
import { hasTextContent } from "@/features/spreadsheet/components/RichTextEditor/utils/hasTextContent";
import { useDataStore } from "@/features/spreadsheet/stores/dataStore";
import { useSelectionStore } from "@/features/spreadsheet/stores/selectionStore";
import { useEditingEditor } from "@/features/spreadsheet/providers/EditingEditor";

export function useActiveTextStyle() {
  const activeCellKey = useSelectionStore((state) => state.activeCellKey);

  const activeCell = useDataStore((state) =>
    activeCellKey ? state.cells[activeCellKey] : undefined,
  );

  const setCellContent = useDataStore((state) => state.setCellContent);

  const updateCellTextStyle = useDataStore(
    (state) => state.updateCellTextStyle,
  );

  const {
    editor,
    editorReady,
    updateEditorTextStyle,
    transformContentTextStyle,
  } = useEditingEditor();

  const editorTextStyle = useTextStyle(editor);

  const cellTextStyle = activeCell?.textStyle ?? DEFAULT_TEXT_STYLE;

  const textStyle = editor && editorReady ? editorTextStyle : cellTextStyle;

  const updateTextStyle = useCallback(
    (patch: Partial<TextStyle>) => {
      if (!activeCellKey) {
        return;
      }

      if (editor && editorReady) {
        updateEditorTextStyle(patch);
        return;
      }

      if (!activeCell) {
        updateCellTextStyle(activeCellKey, patch);

        return;
      }

      if (!hasTextContent(activeCell.content)) {
        updateCellTextStyle(activeCellKey, patch);

        return;
      }

      const nextContent = transformContentTextStyle(activeCell.content, patch);

      setCellContent(activeCellKey, nextContent);

      updateCellTextStyle(activeCellKey, patch);
    },
    [
      activeCellKey,
      activeCell,
      editor,
      editorReady,
      updateEditorTextStyle,
      transformContentTextStyle,
      setCellContent,
      updateCellTextStyle,
    ],
  );

  return {
    textStyle,
    updateTextStyle,
  };
}
