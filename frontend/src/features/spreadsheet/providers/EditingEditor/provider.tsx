import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";

import type { JSONContent } from "@tiptap/core";
import type { Editor } from "@tiptap/react";

import type { CellKey, TextStyle } from "@/features/spreadsheet/types";

import { useDataStore } from "@/features/spreadsheet/stores/dataStore";

import { applyTextStylePatch } from "./textStyle/applyTextStylePatch";

import { transformContentTextStyle } from "./textStyle/transformContentTextStyle";

import {
  EditingEditorContext,
  type EditingEditorContextValue,
} from "./context";

interface EditingEditorProviderProps {
  children: ReactNode;
}

interface EditingEditorState {
  editor: Editor | null;

  cellKey: CellKey | null;

  editorReady: boolean;

  draftContent: JSONContent | null;
}

export default function EditingEditorProvider({
  children,
}: EditingEditorProviderProps) {
  const [state, setState] = useState<EditingEditorState>({
    editor: null,

    cellKey: null,

    editorReady: false,

    draftContent: null,
  });

  const editorRef = useRef<Editor | null>(null);

  const cellKeyRef = useRef<CellKey | null>(null);

  const setCellContent = useDataStore((store) => store.setCellContent);

  /*
   * Register editor.
   *
   * draftContent được khởi tạo từ content hiện tại
   * của editor.
   */
  const setEditor = useCallback((editor: Editor | null, cellKey?: CellKey) => {
    const nextCellKey = editor ? (cellKey ?? null) : null;

    editorRef.current = editor;

    cellKeyRef.current = nextCellKey;

    setState({
      editor,

      cellKey: nextCellKey,

      editorReady: false,

      draftContent: editor ? editor.getJSON() : null,
    });
  }, []);

  /*
   * Editor ready.
   */
  const setEditorReady = useCallback((ready: boolean) => {
    setState((current) => {
      if (current.editorReady === ready) {
        return current;
      }

      return {
        ...current,
        editorReady: ready,
      };
    });
  }, []);

  /*
   * Cell Editor / Formula Bar Editor
   * cập nhật draft tại đây.
   *
   * Draft KHÔNG đi vào dataStore.
   */
  const setDraftContent = useCallback((content: JSONContent) => {
    setState((current) => ({
      ...current,
      draftContent: content,
    }));
  }, []);

  /*
   * Commit draft hiện tại vào dataStore.
   *
   * Chỉ được gọi khi kết thúc editing.
   */
  const commitEditorContent = useCallback(() => {
    const editor = editorRef.current;

    const cellKey = cellKeyRef.current;

    if (!editor || !cellKey) {
      return;
    }

    setCellContent(cellKey, editor.getJSON());
  }, [setCellContent]);

  /*
   * Toolbar → active editor.
   */
  const updateEditorTextStyle = useCallback((patch: Partial<TextStyle>) => {
    const editor = editorRef.current;

    const cellKey = cellKeyRef.current;

    if (!editor || !cellKey) {
      return;
    }

    applyTextStylePatch(editor, patch, {
      focus: true,
      selectAll: false,
    });

    /*
     * Text style command có thể tạo transaction.
     *
     * Cập nhật draft sau khi command chạy.
     */
    setState((current) => ({
      ...current,
      draftContent: editor.getJSON(),
    }));
  }, []);

  const transformContentTextStyleCallback = useCallback(
    (content: JSONContent, patch: Partial<TextStyle>) =>
      transformContentTextStyle(content, patch),
    [],
  );

  const value = useMemo<EditingEditorContextValue>(
    () => ({
      editor: state.editor,

      editingCellKey: state.cellKey,

      editorReady: state.editorReady,

      draftContent: state.draftContent,

      setEditor,

      setEditorReady,

      setDraftContent,

      commitEditorContent,

      updateEditorTextStyle,

      transformContentTextStyle: transformContentTextStyleCallback,
    }),
    [
      state.editor,
      state.cellKey,
      state.editorReady,
      state.draftContent,

      setEditor,
      setEditorReady,
      setDraftContent,

      commitEditorContent,

      updateEditorTextStyle,

      transformContentTextStyleCallback,
    ],
  );

  return (
    <EditingEditorContext.Provider value={value}>
      {children}
    </EditingEditorContext.Provider>
  );
}
